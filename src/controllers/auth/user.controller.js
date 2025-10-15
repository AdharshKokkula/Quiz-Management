/**
 * User Controller
 */

import UserService from '../../services/user.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.js';
import { HTTP_STATUS } from '../../utils/constants.js';

class UserController {
  static async getAllUsers(req, res) {
    try {
      const { 
        role, 
        status, 
        limit = 50, 
        page = 1, 
        sort = 'createdAt', 
        order = 'desc' 
      } = req.query;

      const filters = { status: { $ne: 'deleted' } };
      if (role) filters.role = role;
      if (status) filters.status = status;

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await UserService.getAllUsers(filters, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / parseInt(limit))
      };

      return paginatedResponse(res, result.data, pagination, 'Users retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get users', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const result = await UserService.getUserById(userId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.NOT_FOUND);
      }

      return successResponse(res, result.data, 'User retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async createUser(req, res) {
    try {
      const result = await UserService.createUser(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message, HTTP_STATUS.CREATED);
    } catch (error) {
      return errorResponse(res, 'Failed to create user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await UserService.updateUser(userId, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to update user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await UserService.deleteUser(userId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to delete user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async verifyUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await UserService.verifyUser(userId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to verify user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async changeUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return errorResponse(res, 'Role is required', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await UserService.updateUser(userId, { role });

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'User role updated successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to change user role', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async resetUserPassword(req, res) {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return errorResponse(res, 'New password is required', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await UserService.updateUser(userId, { password: newPassword });

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, null, 'Password reset successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to reset password', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const result = await UserService.getUsersByRole(role);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Users retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get users by role', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async searchUsers(req, res) {
    try {
      const { q, limit = 20 } = req.query;

      if (!q) {
        return errorResponse(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await UserService.searchUsers(q, { limit: parseInt(limit) });

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Search completed successfully');
    } catch (error) {
      return errorResponse(res, 'Search failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getUserStats(req, res) {
    try {
      const result = await UserService.getUserStats();

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'User statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get user statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export default UserController;