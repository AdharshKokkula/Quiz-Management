/**
 * Log Service - Handles all log-related database operations
 * Tracks user login/logout activities with IP, OS, and browser information
 */

import Log from "../../models/auth/logs.js";
import DB from "../../db/db.js";

class LogService {
  /**
   * Create a new login log entry
   * @param {Object} logData - Log data object
   * @param {string} logData.loginId - User ID (ObjectId)
   * @param {string} logData.email - User email
   * @param {string} logData.ip - User IP address
   * @param {string} logData.os - User operating system
   * @param {string} logData.browser - User browser
   * @returns {Promise<Object>} Created log object or error
   */
  static async createLoginLog(logData) {
    try {
      const logToCreate = {
        loginId: logData.loginId,
        email: logData.email,
        loggedInAt: new Date(),
        ip: logData.ip,
        os: logData.os,
        browser: logData.browser,
      };

      const newLog = await DB.insert("Log", logToCreate);

      return {
        success: true,
        message: "Login log created successfully",
        data: newLog,
      };
    } catch (error) {
      console.error("LogService.createLoginLog Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update logout time for a log entry
   * @param {string} logId - Log ID
   * @returns {Promise<Object>} Updated log object or error
   */
  static async updateLogoutTime(logId) {
    try {
      const modifiedCount = await DB.update(
        "Log",
        { loggedOutAt: new Date() },
        { _id: logId }
      );

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "Log entry not found",
        };
      }

      return {
        success: true,
        message: "Logout time updated successfully",
      };
    } catch (error) {
      console.error("LogService.updateLogoutTime Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all logs with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (limit, sort, populate)
   * @returns {Promise<Object>} Array of logs or error
   */
  static async getAllLogs(filters = {}, options = {}) {
    try {
      // Default options for better performance
      const queryOptions = {
        limit: options.limit || 100,
        sort: options.sort || { loggedInAt: -1 }, // Most recent first
        populate: options.populate || "loginId",
        ...options,
      };

      const logs = await DB.select("Log", filters, queryOptions);

      return {
        success: true,
        data: logs,
        count: logs.length,
      };
    } catch (error) {
      console.error("LogService.getAllLogs Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get logs by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of user logs or error
   */
  static async getLogsByUserId(userId, options = {}) {
    try {
      return await this.getAllLogs({ loginId: userId }, options);
    } catch (error) {
      console.error("LogService.getLogsByUserId Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get logs by email
   * @param {string} email - User email
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of user logs or error
   */
  static async getLogsByEmail(email, options = {}) {
    try {
      return await this.getAllLogs({ email }, options);
    } catch (error) {
      console.error("LogService.getLogsByEmail Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get logs by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of logs or error
   */
  static async getLogsByDateRange(startDate, endDate, options = {}) {
    try {
      const filters = {
        loggedInAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      return await this.getAllLogs(filters, options);
    } catch (error) {
      console.error("LogService.getLogsByDateRange Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get active sessions (logged in but not logged out)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of active sessions or error
   */
  static async getActiveSessions(options = {}) {
    try {
      const filters = {
        loggedOutAt: { $exists: false },
      };

      return await this.getAllLogs(filters, options);
    } catch (error) {
      console.error("LogService.getActiveSessions Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get login statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Login statistics or error
   */
  static async getLoginStats(filters = {}) {
    try {
      const totalLogs = await DB.count("Log", filters);

      const activeSessionsResult = await this.getActiveSessions();
      const activeSessions = activeSessionsResult.success
        ? activeSessionsResult.count
        : 0;

      // Get today's logins
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayLoginsResult = await this.getLogsByDateRange(today, tomorrow);
      const todayLogins = todayLoginsResult.success
        ? todayLoginsResult.count
        : 0;

      return {
        success: true,
        data: {
          totalLogins: totalLogs,
          activeSessions,
          todayLogins,
        },
      };
    } catch (error) {
      console.error("LogService.getLoginStats Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete old logs (cleanup)
   * @param {number} daysOld - Delete logs older than this many days
   * @returns {Promise<Object>} Deletion result or error
   */
  static async deleteOldLogs(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      // Note: This would need a delete method in DB class
      // For now, we'll mark them as deleted or implement custom deletion
      const filters = {
        loggedInAt: { $lt: cutoffDate },
      };

      // Get count before deletion
      const countToDelete = await DB.count("Log", filters);

      // Since we don't have a delete method, we could implement it
      // or use mongoose directly for this operation
      const Log = (await import("../../models/auth/logs.js")).default;
      const deleteResult = await Log.deleteMany(filters);

      return {
        success: true,
        message: `Deleted ${deleteResult.deletedCount} old log entries`,
        deletedCount: deleteResult.deletedCount,
      };
    } catch (error) {
      console.error("LogService.deleteOldLogs Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get log by ID
   * @param {string} logId - Log ID
   * @returns {Promise<Object>} Log object or error
   */
  static async getLogById(logId) {
    try {
      const logs = await DB.select(
        "Log",
        { _id: logId },
        { populate: "loginId" }
      );

      if (logs.length === 0) {
        return {
          success: false,
          message: "Log not found",
        };
      }

      return {
        success: true,
        data: logs[0],
      };
    } catch (error) {
      console.error("LogService.getLogById Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get user's last login
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Last login log or error
   */
  static async getLastLogin(userId) {
    try {
      const options = {
        limit: 1,
        sort: { loggedInAt: -1 },
      };

      const logsResult = await this.getLogsByUserId(userId, options);

      if (!logsResult.success || logsResult.count === 0) {
        return {
          success: false,
          message: "No login history found",
        };
      }

      return {
        success: true,
        data: logsResult.data[0],
      };
    } catch (error) {
      console.error("LogService.getLastLogin Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default LogService;
