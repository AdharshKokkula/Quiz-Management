/**
 * User Service - Handles all user-related database operations
 * Provides CRUD operations for User model with proper validation and error handling
 */

import bcrypt from "bcryptjs";
import User from "../../models/auth/users.js";
import DB from "../../db/db.js";
import Validator from "../../models/validator.js";

class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @param {string} userData.email - User email (required, unique)
   * @param {string} userData.phone - User phone (required, 10 digits)
   * @param {string} userData.name - User name (required)
   * @param {string} userData.password - User password (required)
   * @param {string} userData.role - User role (admin, moderator, coordinator, user)
   * @param {string} userData.status - User status (verified, pending, deleted)
   * @returns {Promise<Object>} Created user object or error
   */
  static async createUser(userData) {
    try {
      // Validate input data
      const validation = this.validateUserData(userData, true);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser.success) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Prepare user data
      const userToCreate = {
        ...userData,
        password: hashedPassword,
        role: userData.role || "user",
        status: userData.status || "pending",
      };

      // Create user using DB service
      const newUser = await DB.insert("User", userToCreate);

      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: "User created successfully",
        data: userResponse,
      };
    } catch (error) {
      console.error("UserService.createUser Error:", error);
      return {
        success: false,
        message: error.code === 11000 ? "Email already exists" : error.message,
      };
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object or error
   */
  static async getUserById(userId) {
    try {
      const users = await DB.select("User", { _id: userId });

      if (users.length === 0) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const user = users[0].toObject();
      delete user.password; // Remove password from response

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error("UserService.getUserById Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object or error
   */
  static async getUserByEmail(email) {
    try {
      const users = await DB.select("User", { email });

      if (users.length === 0) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        data: users[0],
      };
    } catch (error) {
      console.error("UserService.getUserByEmail Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all users with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (limit, sort, etc.)
   * @returns {Promise<Object>} Array of users or error
   */
  static async getAllUsers(filters = {}, options = {}) {
    try {
      const users = await DB.select("User", filters, options);

      // Remove passwords from all users
      const usersResponse = users.map((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
      });

      return {
        success: true,
        data: usersResponse,
        count: usersResponse.length,
      };
    } catch (error) {
      console.error("UserService.getAllUsers Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update user by ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object or error
   */
  static async updateUser(userId, updateData) {
    try {
      // Validate update data
      const validation = this.validateUserData(updateData, false);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Hash password if provided
      if (updateData.password) {
        const saltRounds = 12;
        updateData.password = await bcrypt.hash(
          updateData.password,
          saltRounds
        );
      }

      // Update user
      const modifiedCount = await DB.update("User", updateData, {
        _id: userId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "User not found or no changes made",
        };
      }

      // Get updated user
      const updatedUser = await this.getUserById(userId);

      return {
        success: true,
        message: "User updated successfully",
        data: updatedUser.data,
      };
    } catch (error) {
      console.error("UserService.updateUser Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete user by ID (soft delete - sets status to 'deleted')
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message or error
   */
  static async deleteUser(userId) {
    try {
      const modifiedCount = await DB.update(
        "User",
        { status: "deleted" },
        { _id: userId }
      );

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      console.error("UserService.deleteUser Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Authenticate user (login)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object or error
   */
  static async authenticateUser(email, password) {
    try {
      const userResult = await this.getUserByEmail(email);

      if (!userResult.success) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const user = userResult.data;

      // Check if user is active
      if (user.status === "deleted") {
        return {
          success: false,
          message: "Account has been deactivated",
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return {
        success: true,
        message: "Authentication successful",
        data: userResponse,
      };
    } catch (error) {
      console.error("UserService.authenticateUser Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get users by role
   * @param {string} role - User role
   * @returns {Promise<Object>} Array of users or error
   */
  static async getUsersByRole(role) {
    try {
      return await this.getAllUsers({ role, status: { $ne: "deleted" } });
    } catch (error) {
      console.error("UserService.getUsersByRole Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Validate user data
   * @param {Object} userData - User data to validate
   * @param {boolean} isCreate - Whether this is for create operation
   * @returns {Object} Validation result
   */
  static validateUserData(userData, isCreate = false) {
    const fields = {};

    if (userData.email !== undefined) {
      fields.email = {
        value: userData.email,
        rules: [
          { type: "required", message: "Email is required" },
          { type: "email", message: "Invalid email format" },
        ],
      };
    }

    if (userData.phone !== undefined) {
      fields.phone = {
        value: userData.phone,
        rules: [
          { type: "required", message: "Phone is required" },
          { type: "phone", message: "Phone must be a valid 10-digit number" },
        ],
      };
    }

    if (userData.name !== undefined) {
      fields.name = {
        value: userData.name,
        rules: [
          { type: "required", message: "Name is required" },
          {
            type: "minLength",
            minLength: 2,
            message: "Name must be at least 2 characters",
          },
        ],
      };
    }

    if (userData.password !== undefined) {
      fields.password = {
        value: userData.password,
        rules: [
          { type: "required", message: "Password is required" },
          {
            type: "minLength",
            minLength: 6,
            message: "Password must be at least 6 characters",
          },
        ],
      };
    }

    if (userData.role !== undefined) {
      fields.role = {
        value: userData.role,
        rules: [
          {
            type: "custom",
            validate: (value) =>
              ["admin", "moderator", "coordinator", "user"].includes(value),
            message: "Role must be admin, moderator, coordinator, or user",
          },
        ],
      };
    }

    if (userData.status !== undefined) {
      fields.status = {
        value: userData.status,
        rules: [
          {
            type: "custom",
            validate: (value) =>
              ["verified", "pending", "deleted"].includes(value),
            message: "Status must be verified, pending, or deleted",
          },
        ],
      };
    }

    return Validator.validate(fields);
  }
}

export default UserService;
