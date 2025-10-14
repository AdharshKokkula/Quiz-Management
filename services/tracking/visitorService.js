/**
 * Visitor Service - Handles all visitor tracking database operations
 * Tracks website visitors with IP, OS, browser, and page visit information
 */

import Visitor from "../../models/auth/visitors.js";
import DB from "../../db/db.js";
import Validator from "../../models/validator.js";

class VisitorService {
  /**
   * Create a new visitor record
   * @param {Object} visitorData - Visitor data object
   * @param {string} visitorData.visitorId - Unique visitor ID (required)
   * @param {string} visitorData.ip - Visitor IP address (required)
   * @param {string} visitorData.os - Operating system
   * @param {string} visitorData.browser - Browser information
   * @param {string} visitorData.url - Visited URL
   * @returns {Promise<Object>} Created visitor object or error
   */
  static async createVisitor(visitorData) {
    try {
      // Validate input data
      const validation = this.validateVisitorData(visitorData, true);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Check if visitor already exists
      const existingVisitor = await this.getVisitorById(visitorData.visitorId);
      if (existingVisitor.success) {
        return {
          success: false,
          message: "Visitor with this ID already exists",
        };
      }

      // Prepare visitor data
      const visitorToCreate = {
        ...visitorData,
        visitedAt: new Date(),
      };

      // Create visitor using DB service
      const newVisitor = await DB.insert("Visitor", visitorToCreate);

      return {
        success: true,
        message: "Visitor record created successfully",
        data: newVisitor,
      };
    } catch (error) {
      console.error("VisitorService.createVisitor Error:", error);
      return {
        success: false,
        message:
          error.code === 11000 ? "Visitor ID already exists" : error.message,
      };
    }
  }

  /**
   * Get visitor by visitor ID
   * @param {string} visitorId - Visitor ID
   * @returns {Promise<Object>} Visitor object or error
   */
  static async getVisitorById(visitorId) {
    try {
      const visitors = await DB.select("Visitor", { visitorId });

      if (visitors.length === 0) {
        return {
          success: false,
          message: "Visitor not found",
        };
      }

      return {
        success: true,
        data: visitors[0],
      };
    } catch (error) {
      console.error("VisitorService.getVisitorById Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get visitor by database ID
   * @param {string} id - Database ID
   * @returns {Promise<Object>} Visitor object or error
   */
  static async getVisitorByDbId(id) {
    try {
      const visitors = await DB.select("Visitor", { _id: id });

      if (visitors.length === 0) {
        return {
          success: false,
          message: "Visitor not found",
        };
      }

      return {
        success: true,
        data: visitors[0],
      };
    } catch (error) {
      console.error("VisitorService.getVisitorByDbId Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all visitors with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (limit, sort, etc.)
   * @returns {Promise<Object>} Array of visitors or error
   */
  static async getAllVisitors(filters = {}, options = {}) {
    try {
      // Default options for better performance
      const queryOptions = {
        limit: options.limit || 100,
        sort: options.sort || { visitedAt: -1 }, // Most recent first
        ...options,
      };

      const visitors = await DB.select("Visitor", filters, queryOptions);

      return {
        success: true,
        data: visitors,
        count: visitors.length,
      };
    } catch (error) {
      console.error("VisitorService.getAllVisitors Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update visitor by visitor ID
   * @param {string} visitorId - Visitor ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated visitor object or error
   */
  static async updateVisitor(visitorId, updateData) {
    try {
      // Validate update data
      const validation = this.validateVisitorData(updateData, false);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Update visitor
      const modifiedCount = await DB.update("Visitor", updateData, {
        visitorId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "Visitor not found or no changes made",
        };
      }

      // Get updated visitor
      const updatedVisitor = await this.getVisitorById(visitorId);

      return {
        success: true,
        message: "Visitor updated successfully",
        data: updatedVisitor.data,
      };
    } catch (error) {
      console.error("VisitorService.updateVisitor Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete visitor by visitor ID
   * @param {string} visitorId - Visitor ID
   * @returns {Promise<Object>} Success message or error
   */
  static async deleteVisitor(visitorId) {
    try {
      // Direct deletion for visitor records
      const Visitor = (await import("../../models/auth/visitors.js")).default;
      const deleteResult = await Visitor.findOneAndDelete({ visitorId });

      if (!deleteResult) {
        return {
          success: false,
          message: "Visitor not found",
        };
      }

      return {
        success: true,
        message: "Visitor deleted successfully",
      };
    } catch (error) {
      console.error("VisitorService.deleteVisitor Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get visitors by IP address
   * @param {string} ip - IP address
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of visitors or error
   */
  static async getVisitorsByIP(ip, options = {}) {
    try {
      return await this.getAllVisitors({ ip }, options);
    } catch (error) {
      console.error("VisitorService.getVisitorsByIP Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get visitors by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of visitors or error
   */
  static async getVisitorsByDateRange(startDate, endDate, options = {}) {
    try {
      const filters = {
        visitedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      return await this.getAllVisitors(filters, options);
    } catch (error) {
      console.error("VisitorService.getVisitorsByDateRange Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get visitors by URL
   * @param {string} url - Visited URL
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of visitors or error
   */
  static async getVisitorsByURL(url, options = {}) {
    try {
      return await this.getAllVisitors({ url }, options);
    } catch (error) {
      console.error("VisitorService.getVisitorsByURL Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get visitors by OS
   * @param {string} os - Operating system
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of visitors or error
   */
  static async getVisitorsByOS(os, options = {}) {
    try {
      return await this.getAllVisitors({ os }, options);
    } catch (error) {
      console.error("VisitorService.getVisitorsByOS Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get visitors by browser
   * @param {string} browser - Browser information
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of visitors or error
   */
  static async getVisitorsByBrowser(browser, options = {}) {
    try {
      return await this.getAllVisitors({ browser }, options);
    } catch (error) {
      console.error("VisitorService.getVisitorsByBrowser Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get visitor statistics
   * @returns {Promise<Object>} Visitor statistics or error
   */
  static async getVisitorStats() {
    try {
      const totalVisitors = await DB.count("Visitor");

      // Get today's visitors
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayVisitorsResult = await this.getVisitorsByDateRange(
        today,
        tomorrow
      );
      const todayVisitors = todayVisitorsResult.success
        ? todayVisitorsResult.count
        : 0;

      // Get unique IPs
      const uniqueIPsResult = await this.getUniqueIPs();
      const uniqueIPs = uniqueIPsResult.success ? uniqueIPsResult.count : 0;

      return {
        success: true,
        data: {
          totalVisitors,
          todayVisitors,
          uniqueIPs,
        },
      };
    } catch (error) {
      console.error("VisitorService.getVisitorStats Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get unique IP addresses
   * @returns {Promise<Object>} Array of unique IPs or error
   */
  static async getUniqueIPs() {
    try {
      // Use mongoose aggregation for unique IPs
      const Visitor = (await import("../../models/auth/visitors.js")).default;
      const uniqueIPs = await Visitor.distinct("ip");

      return {
        success: true,
        data: uniqueIPs,
        count: uniqueIPs.length,
      };
    } catch (error) {
      console.error("VisitorService.getUniqueIPs Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Track a page visit (create or update visitor record)
   * @param {Object} visitData - Visit data
   * @returns {Promise<Object>} Visitor record or error
   */
  static async trackVisit(visitData) {
    try {
      // Try to get existing visitor
      const existingVisitor = await this.getVisitorById(visitData.visitorId);

      if (existingVisitor.success) {
        // Update existing visitor with new visit
        const updateData = {
          visitedAt: new Date(),
          url: visitData.url,
        };

        return await this.updateVisitor(visitData.visitorId, updateData);
      } else {
        // Create new visitor record
        return await this.createVisitor(visitData);
      }
    } catch (error) {
      console.error("VisitorService.trackVisit Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete old visitor records (cleanup)
   * @param {number} daysOld - Delete records older than this many days
   * @returns {Promise<Object>} Deletion result or error
   */
  static async deleteOldVisitors(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const Visitor = (await import("../../models/auth/visitors.js")).default;
      const deleteResult = await Visitor.deleteMany({
        visitedAt: { $lt: cutoffDate },
      });

      return {
        success: true,
        message: `Deleted ${deleteResult.deletedCount} old visitor records`,
        deletedCount: deleteResult.deletedCount,
      };
    } catch (error) {
      console.error("VisitorService.deleteOldVisitors Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Validate visitor data
   * @param {Object} visitorData - Visitor data to validate
   * @param {boolean} isCreate - Whether this is for create operation
   * @returns {Object} Validation result
   */
  static validateVisitorData(visitorData, isCreate = false) {
    const fields = {};

    if (visitorData.visitorId !== undefined) {
      fields.visitorId = {
        value: visitorData.visitorId,
        rules: [{ type: "required", message: "Visitor ID is required" }],
      };
    }

    if (visitorData.ip !== undefined) {
      fields.ip = {
        value: visitorData.ip,
        rules: [{ type: "required", message: "IP address is required" }],
      };
    }

    if (visitorData.url !== undefined && visitorData.url !== "") {
      fields.url = {
        value: visitorData.url,
        rules: [{ type: "url", message: "Invalid URL format" }],
      };
    }

    return Validator.validate(fields);
  }
}

export default VisitorService;
