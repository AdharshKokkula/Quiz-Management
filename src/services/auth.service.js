/**
 * Authentication Service
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Log from '../models/Log.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

class AuthService {
  static generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    return jwt.sign(payload, config.jwt.secret, { 
      expiresIn: config.jwt.expiresIn 
    });
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async register(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      const hashedPassword = await this.hashPassword(userData.password);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      const token = this.generateToken(user);

      return {
        success: true,
        message: 'User registered successfully',
        data: { user: userResponse, token }
      };
    } catch (error) {
      logger.error('AuthService.register error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      if (user.status === 'deleted') {
        return {
          success: false,
          message: 'Account has been deactivated'
        };
      }

      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      const userResponse = user.toObject();
      delete userResponse.password;

      const token = this.generateToken(user);

      return {
        success: true,
        message: 'Login successful',
        data: { user: userResponse, token }
      };
    } catch (error) {
      logger.error('AuthService.login error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async createLoginLog(logData) {
    try {
      const log = new Log(logData);
      await log.save();
      return {
        success: true,
        data: log
      };
    } catch (error) {
      logger.error('AuthService.createLoginLog error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateLogoutTime(logId) {
    try {
      await Log.findByIdAndUpdate(logId, { loggedOutAt: new Date() });
      return {
        success: true,
        message: 'Logout time updated'
      };
    } catch (error) {
      logger.error('AuthService.updateLogoutTime error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getLastLogin(userId) {
    try {
      const log = await Log.findOne({ loginId: userId })
        .sort({ loggedInAt: -1 })
        .limit(1);
      
      if (!log) {
        return {
          success: false,
          message: 'No login history found'
        };
      }

      return {
        success: true,
        data: log
      };
    } catch (error) {
      logger.error('AuthService.getLastLogin error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default AuthService;