/**
 * Tracking Service
 */

import Visitor from '../models/Visitor.js';
import Log from '../models/Log.js';
import logger from '../utils/logger.js';

class TrackingService {
  static async createVisitor(visitorData) {
    try {
      const existingVisitor = await Visitor.findOne({ visitorId: visitorData.visitorId });
      if (existingVisitor) {
        // Update existing visitor with new visit
        return await this.updateVisitor(visitorData.visitorId, {
          visitedAt: new Date(),
          url: visitorData.url
        });
      }

      const visitor = new Visitor(visitorData);
      await visitor.save();

      return {
        success: true,
        message: 'Visitor tracked successfully',
        data: visitor
      };
    } catch (error) {
      logger.error('TrackingService.createVisitor error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateVisitor(visitorId, updateData) {
    try {
      const visitor = await Visitor.findOneAndUpdate(
        { visitorId },
        updateData,
        { new: true }
      );

      if (!visitor) {
        return {
          success: false,
          message: 'Visitor not found'
        };
      }

      return {
        success: true,
        message: 'Visitor updated successfully',
        data: visitor
      };
    } catch (error) {
      logger.error('TrackingService.updateVisitor error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAllVisitors(filters = {}, options = {}) {
    try {
      const query = Visitor.find(filters);
      
      if (options.limit) query.limit(options.limit);
      if (options.sort) query.sort(options.sort);
      if (options.skip) query.skip(options.skip);

      const visitors = await query.exec();
      const total = await Visitor.countDocuments(filters);

      return {
        success: true,
        data: visitors,
        total
      };
    } catch (error) {
      logger.error('TrackingService.getAllVisitors error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getVisitorsByDateRange(startDate, endDate, options = {}) {
    try {
      const filters = {
        visitedAt: {
          $gte: startDate,
          $lte: endDate
        }
      };

      return await this.getAllVisitors(filters, options);
    } catch (error) {
      logger.error('TrackingService.getVisitorsByDateRange error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getVisitorStats() {
    try {
      const total = await Visitor.countDocuments();
      
      // Today's visitors
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayVisitors = await Visitor.countDocuments({
        visitedAt: { $gte: today, $lt: tomorrow }
      });

      // Unique IPs
      const uniqueIPs = await Visitor.distinct('ip');

      return {
        success: true,
        data: {
          total,
          todayVisitors,
          uniqueIPs: uniqueIPs.length
        }
      };
    } catch (error) {
      logger.error('TrackingService.getVisitorStats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAllLogs(filters = {}, options = {}) {
    try {
      const query = Log.find(filters).populate('loginId', 'name email');
      
      if (options.limit) query.limit(options.limit);
      if (options.sort) query.sort(options.sort);
      if (options.skip) query.skip(options.skip);

      const logs = await query.exec();
      const total = await Log.countDocuments(filters);

      return {
        success: true,
        data: logs,
        total
      };
    } catch (error) {
      logger.error('TrackingService.getAllLogs error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getLogsByUserId(userId, options = {}) {
    try {
      return await this.getAllLogs({ loginId: userId }, options);
    } catch (error) {
      logger.error('TrackingService.getLogsByUserId error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getActiveSessions() {
    try {
      const activeLogs = await Log.find({
        loggedOutAt: { $exists: false }
      }).populate('loginId', 'name email');

      return {
        success: true,
        data: activeLogs
      };
    } catch (error) {
      logger.error('TrackingService.getActiveSessions error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getLoginStats() {
    try {
      const totalLogins = await Log.countDocuments();
      const activeSessionsResult = await this.getActiveSessions();
      const activeSessions = activeSessionsResult.success ? activeSessionsResult.data.length : 0;

      // Today's logins
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayLogins = await Log.countDocuments({
        loggedInAt: { $gte: today, $lt: tomorrow }
      });

      return {
        success: true,
        data: {
          totalLogins,
          activeSessions,
          todayLogins
        }
      };
    } catch (error) {
      logger.error('TrackingService.getLoginStats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default TrackingService;