/**
 * Authentication Controller
 * Handles user authentication, registration, and session management
 */

import UserService from "../../services/auth/userService.js";
import LogService from "../../services/auth/logService.js";
import AuthMiddleware from "../../middleware/auth.js";

class AuthController {
  /**
   * User registration
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { email, phone, name, password, role } = req.body;

      // Create user
      const result = await UserService.createUser({
        email,
        phone,
        name,
        password,
        role: role || "user", // Default to 'user' role
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Generate token for the new user
      const token = AuthMiddleware.generateToken(result.data);

      // Log the registration/login
      await LogService.createLoginLog({
        loginId: result.data._id,
        email: result.data.email,
        ip: AuthController.getClientIP(req),
        os: AuthController.getClientOS(req),
        browser: AuthController.getClientBrowser(req),
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.data,
          token,
        },
      });
    } catch (error) {
      console.error("AuthController.register Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during registration",
      });
    }
  }

  /**
   * User login
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Authenticate user
      const result = await UserService.authenticateUser(email, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      // Generate token
      const token = AuthMiddleware.generateToken(result.data);

      // Log the login
      await LogService.createLoginLog({
        loginId: result.data._id,
        email: result.data.email,
        ip: AuthController.getClientIP(req),
        os: AuthController.getClientOS(req),
        browser: AuthController.getClientBrowser(req),
      });

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: result.data,
          token,
        },
      });
    } catch (error) {
      console.error("AuthController.login Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during login",
      });
    }
  }

  /**
   * User logout
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      // Note: In a stateless JWT system, logout is typically handled client-side
      // by removing the token. However, we can log the logout event.

      if (req.user) {
        // Find the most recent login log for this user and update logout time
        const lastLoginResult = await LogService.getLastLogin(req.user.id);

        if (lastLoginResult.success) {
          await LogService.updateLogoutTime(lastLoginResult.data._id);
        }
      }

      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("AuthController.logout Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during logout",
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const result = await UserService.getUserById(userId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error("AuthController.getProfile Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching profile",
      });
    }
  }

  /**
   * Update current user profile
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updateData.password;
      delete updateData.role;
      delete updateData.status;

      const result = await UserService.updateUser(userId, updateData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("AuthController.updateProfile Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while updating profile",
      });
    }
  }

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      // Verify current password
      const user = await UserService.getUserByEmail(req.user.email);
      if (!user.success) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const authResult = await UserService.authenticateUser(
        req.user.email,
        currentPassword
      );
      if (!authResult.success) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      const result = await UserService.updateUser(userId, {
        password: newPassword,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("AuthController.changePassword Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while changing password",
      });
    }
  }

  /**
   * Refresh token
   * POST /api/auth/refresh
   */
  static async refreshToken(req, res) {
    try {
      // In this implementation, we'll generate a new token with the current user data
      const userId = req.user.id;

      const result = await UserService.getUserById(userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate new token
      const token = AuthMiddleware.generateToken(result.data);

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          token,
          user: result.data,
        },
      });
    } catch (error) {
      console.error("AuthController.refreshToken Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while refreshing token",
      });
    }
  }

  /**
   * Verify token (check if token is valid)
   * GET /api/auth/verify
   */
  static async verifyToken(req, res) {
    try {
      // If we reach this point, the token is valid (middleware verified it)
      res.json({
        success: true,
        message: "Token is valid",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      console.error("AuthController.verifyToken Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during token verification",
      });
    }
  }

  /**
   * Get user's login history
   * GET /api/auth/login-history
   */
  static async getLoginHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10, page = 1 } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { loggedInAt: -1 },
      };

      const result = await LogService.getLogsByUserId(userId, options);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error("AuthController.getLoginHistory Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching login history",
      });
    }
  }

  // Helper methods for extracting client information

  /**
   * Get client IP address
   * @param {Object} req - Express request object
   * @returns {string} Client IP address
   */
  static getClientIP(req) {
    return (
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown"
    );
  }

  /**
   * Get client operating system
   * @param {Object} req - Express request object
   * @returns {string} Client OS
   */
  static getClientOS(req) {
    const userAgent = req.headers["user-agent"] || "";

    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac OS")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iOS")) return "iOS";

    return "Unknown";
  }

  /**
   * Get client browser
   * @param {Object} req - Express request object
   * @returns {string} Client browser
   */
  static getClientBrowser(req) {
    const userAgent = req.headers["user-agent"] || "";

    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("Opera")) return "Opera";

    return "Unknown";
  }
}

export default AuthController;
