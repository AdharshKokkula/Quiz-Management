/**
 * Visitor Controller
 */

import TrackingService from '../../services/tracking.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.js';
import { HTTP_STATUS } from '../../utils/constants.js';

class VisitorController {
  static async trackVisit(req, res) {
    try {
      const visitorData = {
        visitorId: req.body.visitorId || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ip: req.ip || req.connection.remoteAddress,
        os: VisitorController.getClientOS(req),
        browser: VisitorController.getClientBrowser(req),
        url: req.body.url || req.originalUrl
      };

      const result = await TrackingService.createVisitor(visitorData);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message, HTTP_STATUS.CREATED);
    } catch (error) {
      return errorResponse(res, 'Failed to track visit', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getAllVisitors(req, res) {
    try {
      const {
        ip,
        os,
        browser,
        startDate,
        endDate,
        limit = 50,
        page = 1,
        sort = 'visitedAt',
        order = 'desc'
      } = req.query;

      const filters = {};
      if (ip) filters.ip = ip;
      if (os) filters.os = os;
      if (browser) filters.browser = browser;
      
      if (startDate && endDate) {
        filters.visitedAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await TrackingService.getAllVisitors(filters, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / parseInt(limit))
      };

      return paginatedResponse(res, result.data, pagination, 'Visitors retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get visitors', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getVisitorStats(req, res) {
    try {
      const result = await TrackingService.getVisitorStats();

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Visitor statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get visitor statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getAllLogs(req, res) {
    try {
      const {
        userId,
        email,
        startDate,
        endDate,
        limit = 50,
        page = 1,
        sort = 'loggedInAt',
        order = 'desc'
      } = req.query;

      const filters = {};
      if (userId) filters.loginId = userId;
      if (email) filters.email = email;
      
      if (startDate && endDate) {
        filters.loggedInAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await TrackingService.getAllLogs(filters, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / parseInt(limit))
      };

      return paginatedResponse(res, result.data, pagination, 'Logs retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get logs', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getActiveSessions(req, res) {
    try {
      const result = await TrackingService.getActiveSessions();

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Active sessions retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get active sessions', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getLoginStats(req, res) {
    try {
      const result = await TrackingService.getLoginStats();

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Login statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get login statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  // Helper methods
  static getClientOS(req) {
    const userAgent = req.headers['user-agent'] || '';
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    
    return 'Unknown';
  }

  static getClientBrowser(req) {
    const userAgent = req.headers['user-agent'] || '';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }
}

export default VisitorController;