/**
 * Authentication Middleware
 * Handles JWT token verification and role-based access control
 */

import jwt from "jsonwebtoken";
import UserService from "../services/auth/userService.js";

// JWT Secret (in production, this should be in environment variables)
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

class AuthMiddleware {
  /**
   * Generate JWT token for user
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  static generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload or null
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return null;
    }
  }

  /**
   * Extract token from request headers
   * @param {Object} req - Express request object
   * @returns {string|null} Token or null
   */
  static extractToken(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return null;
    }

    // Support both "Bearer token" and "token" formats
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    return authHeader;
  }

  /**
   * Authentication middleware - verifies JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  static authenticate(req, res, next) {
    try {
      const token = AuthMiddleware.extractToken(req);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access denied. No token provided.",
        });
      }

      const decoded = AuthMiddleware.verifyToken(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }

      // Check if user is active
      if (decoded.status === "deleted") {
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated.",
        });
      }

      // Attach user info to request
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Authentication middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication.",
      });
    }
  }

  /**
   * Optional authentication middleware - doesn't fail if no token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  static optionalAuth(req, res, next) {
    try {
      const token = AuthMiddleware.extractToken(req);

      if (token) {
        const decoded = AuthMiddleware.verifyToken(token);
        if (decoded && decoded.status !== "deleted") {
          req.user = decoded;
        }
      }

      next();
    } catch (error) {
      console.error("Optional authentication middleware error:", error);
      next(); // Continue even if there's an error
    }
  }

  /**
   * Role-based authorization middleware
   * @param {Array<string>} allowedRoles - Array of allowed roles
   * @returns {Function} Middleware function
   */
  static authorize(allowedRoles = []) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "Authentication required.",
          });
        }

        if (allowedRoles.length === 0) {
          // No specific roles required, just need to be authenticated
          return next();
        }

        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: "Access denied. Insufficient permissions.",
            requiredRoles: allowedRoles,
            userRole: req.user.role,
          });
        }

        next();
      } catch (error) {
        console.error("Authorization middleware error:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error during authorization.",
        });
      }
    };
  }

  /**
   * Admin only middleware
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  static adminOnly(req, res, next) {
    return AuthMiddleware.authorize(["admin"])(req, res, next);
  }

  /**
   * Moderator and above middleware
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  static moderatorAndAbove(req, res, next) {
    return AuthMiddleware.authorize(["admin", "moderator"])(req, res, next);
  }

  /**
   * Coordinator and above middleware
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  static coordinatorAndAbove(req, res, next) {
    return AuthMiddleware.authorize(["admin", "moderator", "coordinator"])(
      req,
      res,
      next
    );
  }

  /**
   * Self or admin access middleware (user can access their own data or admin can access any)
   * @param {string} userIdParam - Parameter name containing user ID (default: 'userId')
   * @returns {Function} Middleware function
   */
  static selfOrAdmin(userIdParam = "userId") {
    return (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "Authentication required.",
          });
        }

        const targetUserId = req.params[userIdParam];
        const currentUserId = req.user.id;
        const userRole = req.user.role;

        // Admin can access any user's data
        if (userRole === "admin") {
          return next();
        }

        // User can access their own data
        if (targetUserId === currentUserId) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message: "Access denied. You can only access your own data.",
        });
      } catch (error) {
        console.error("Self or admin middleware error:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error during authorization.",
        });
      }
    };
  }

  /**
   * Verified users only middleware
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  static verifiedOnly(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (req.user.status !== "verified") {
        return res.status(403).json({
          success: false,
          message: "Account verification required.",
          userStatus: req.user.status,
        });
      }

      next();
    } catch (error) {
      console.error("Verified only middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during verification check.",
      });
    }
  }

  /**
   * Rate limiting middleware (basic implementation)
   * @param {number} maxRequests - Maximum requests per window
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Function} Middleware function
   */
  static rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    const requests = new Map();

    return (req, res, next) => {
      try {
        const identifier = req.user ? req.user.id : req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;

        // Clean old entries
        if (requests.has(identifier)) {
          const userRequests = requests.get(identifier);
          const validRequests = userRequests.filter(
            (time) => time > windowStart
          );
          requests.set(identifier, validRequests);
        }

        // Check current requests
        const currentRequests = requests.get(identifier) || [];

        if (currentRequests.length >= maxRequests) {
          return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
            retryAfter: Math.ceil(windowMs / 1000),
          });
        }

        // Add current request
        currentRequests.push(now);
        requests.set(identifier, currentRequests);

        next();
      } catch (error) {
        console.error("Rate limit middleware error:", error);
        next(); // Continue on error to avoid blocking legitimate requests
      }
    };
  }
}

export default AuthMiddleware;
