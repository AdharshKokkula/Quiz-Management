/**
 * Authentication Middleware
 */

import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { USER_ROLES } from '../utils/constants.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret);

    if (decoded.status === 'deleted') {
      return errorResponse(res, 'Account has been deactivated.', 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 401);
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    if (roles.length === 0) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions.', 403);
    }

    next();
  };
};

export const adminOnly = authorize([USER_ROLES.ADMIN]);
export const moderatorAndAbove = authorize([USER_ROLES.ADMIN, USER_ROLES.MODERATOR]);
export const coordinatorAndAbove = authorize([USER_ROLES.ADMIN, USER_ROLES.MODERATOR, USER_ROLES.COORDINATOR]);

export const selfOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }

    const targetUserId = req.params[userIdParam];
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    if (userRole === USER_ROLES.ADMIN || targetUserId === currentUserId) {
      return next();
    }

    return errorResponse(res, 'Access denied. You can only access your own data.', 403);
  };
};