/**
 * Authentication Controller
 */

import AuthService from '../../services/auth.service.js';
import UserService from '../../services/user.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { HTTP_STATUS } from '../../utils/constants.js';

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      // Log the registration
      await AuthService.createLoginLog({
        loginId: result.data.user._id,
        email: result.data.user.email,
        ip: AuthController.getClientIP(req),
        os: AuthController.getClientOS(req),
        browser: AuthController.getClientBrowser(req)
      });

      return successResponse(res, result.data, result.message, HTTP_STATUS.CREATED);
    } catch (error) {
      return errorResponse(res, 'Registration failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, 'Email and password are required', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await AuthService.login(email, password);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.UNAUTHORIZED);
      }

      // Log the login
      await AuthService.createLoginLog({
        loginId: result.data.user._id,
        email: result.data.user.email,
        ip: AuthController.getClientIP(req),
        os: AuthController.getClientOS(req),
        browser: AuthController.getClientBrowser(req)
      });

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Login failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async logout(req, res) {
    try {
      if (req.user) {
        const lastLoginResult = await AuthService.getLastLogin(req.user.id);
        if (lastLoginResult.success) {
          await AuthService.updateLogoutTime(lastLoginResult.data._id);
        }
      }

      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      return errorResponse(res, 'Logout failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getProfile(req, res) {
    try {
      const result = await UserService.getUserById(req.user.id);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.NOT_FOUND);
      }

      return successResponse(res, result.data, 'Profile retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get profile', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updateProfile(req, res) {
    try {
      const updateData = { ...req.body };
      
      // Remove sensitive fields
      delete updateData.password;
      delete updateData.role;
      delete updateData.status;

      const result = await UserService.updateUser(req.user.id, updateData);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to update profile', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return errorResponse(res, 'Current password and new password are required', HTTP_STATUS.BAD_REQUEST);
      }

      // Verify current password
      const loginResult = await AuthService.login(req.user.email, currentPassword);
      if (!loginResult.success) {
        return errorResponse(res, 'Current password is incorrect', HTTP_STATUS.UNAUTHORIZED);
      }

      // Update password
      const result = await UserService.updateUser(req.user.id, { password: newPassword });

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to change password', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async refreshToken(req, res) {
    try {
      const result = await UserService.getUserById(req.user.id);

      if (!result.success) {
        return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
      }

      const token = AuthService.generateToken(result.data);

      return successResponse(res, { token, user: result.data }, 'Token refreshed successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to refresh token', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async verifyToken(req, res) {
    if (!req.user) {
      return errorResponse(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
    }
    
    return successResponse(res, { user: req.user }, 'Token is valid');
  }

  // Helper methods
  static getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.ip ||
           'unknown';
  }

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

export default AuthController;