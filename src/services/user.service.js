/**
 * User Service
 */

import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import logger from '../utils/logger.js';

class UserService {
  static async createUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: 'User created successfully',
        data: userResponse
      };
    } catch (error) {
      logger.error('UserService.createUser error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      logger.error('UserService.getUserById error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAllUsers(filters = {}, options = {}) {
    try {
      const query = User.find(filters).select('-password');
      
      if (options.limit) query.limit(options.limit);
      if (options.sort) query.sort(options.sort);
      if (options.skip) query.skip(options.skip);

      const users = await query.exec();
      const total = await User.countDocuments(filters);

      return {
        success: true,
        data: users,
        total
      };
    } catch (error) {
      logger.error('UserService.getAllUsers error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateUser(userId, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User updated successfully',
        data: user
      };
    } catch (error) {
      logger.error('UserService.updateUser error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { status: 'deleted' },
        { new: true }
      );

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      logger.error('UserService.deleteUser error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async verifyUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { status: 'verified' },
        { new: true }
      ).select('-password');

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User verified successfully',
        data: user
      };
    } catch (error) {
      logger.error('UserService.verifyUser error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getUsersByRole(role) {
    try {
      const users = await User.find({ role, status: { $ne: 'deleted' } })
        .select('-password');

      return {
        success: true,
        data: users
      };
    } catch (error) {
      logger.error('UserService.getUsersByRole error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async searchUsers(query, options = {}) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filters = {
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ],
        status: { $ne: 'deleted' }
      };

      const users = await User.find(filters)
        .select('-password')
        .limit(options.limit || 20)
        .sort({ name: 1 });

      return {
        success: true,
        data: users
      };
    } catch (error) {
      logger.error('UserService.searchUsers error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getUserStats() {
    try {
      const total = await User.countDocuments({ status: { $ne: 'deleted' } });
      const verified = await User.countDocuments({ status: 'verified' });
      const pending = await User.countDocuments({ status: 'pending' });
      const admins = await User.countDocuments({ role: 'admin', status: { $ne: 'deleted' } });
      const moderators = await User.countDocuments({ role: 'moderator', status: { $ne: 'deleted' } });

      return {
        success: true,
        data: {
          total,
          verified,
          pending,
          admins,
          moderators
        }
      };
    } catch (error) {
      logger.error('UserService.getUserStats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default UserService;