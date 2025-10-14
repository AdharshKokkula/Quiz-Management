/**
 * User Controller
 * Handles user management operations (admin/moderator functions)
 */

import UserService from "../../services/auth/userService.js";

class UserController {
  /**
   * Get all users (admin/moderator only)
   * GET /api/users
   */
  static async getAllUsers(req, res) {
    try {
      const {
        role,
        status,
        limit = 50,
        page = 1,
        sort = "createdAt",
        order = "desc",
      } = req.query;

      // Build filters
      const filters = {};
      if (role) filters.role = role;
      if (status) filters.status = status;

      // Build options
      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
      };

      const result = await UserService.getAllUsers(filters, options);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.count,
        },
      });
    } catch (error) {
      console.error("UserController.getAllUsers Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching users",
      });
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:userId
   */
  static async getUserById(req, res) {
    try {
      const { userId } = req.params;

      const result = await UserService.getUserById(userId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error("UserController.getUserById Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching user",
      });
    }
  }

  /**
   * Create new user (admin only)
   * POST /api/users
   */
  static async createUser(req, res) {
    try {
      const userData = req.body;

      const result = await UserService.createUser(userData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("UserController.createUser Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while creating user",
      });
    }
  }

  /**
   * Update user by ID
   * PUT /api/users/:userId
   */
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      // Only admins can change roles and status
      if (req.user.role !== "admin") {
        delete updateData.role;
        delete updateData.status;
      }

      const result = await UserService.updateUser(userId, updateData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "User updated successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("UserController.updateUser Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while updating user",
      });
    }
  }

  /**
   * Delete user by ID (soft delete)
   * DELETE /api/users/:userId
   */
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      // Prevent users from deleting themselves
      if (userId === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      const result = await UserService.deleteUser(userId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("UserController.deleteUser Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while deleting user",
      });
    }
  }

  /**
   * Get users by role
   * GET /api/users/role/:role
   */
  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const { limit = 50, sort = "createdAt", order = "desc" } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
      };

      const result = await UserService.getUsersByRole(role);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error("UserController.getUsersByRole Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching users by role",
      });
    }
  }

  /**
   * Verify user account (admin/moderator only)
   * PUT /api/users/:userId/verify
   */
  static async verifyUser(req, res) {
    try {
      const { userId } = req.params;

      const result = await UserService.updateUser(userId, {
        status: "verified",
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "User verified successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("UserController.verifyUser Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while verifying user",
      });
    }
  }

  /**
   * Change user role (admin only)
   * PUT /api/users/:userId/role
   */
  static async changeUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role is required",
        });
      }

      // Prevent changing own role
      if (userId === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot change your own role",
        });
      }

      const result = await UserService.updateUser(userId, { role });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "User role updated successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("UserController.changeUserRole Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while changing user role",
      });
    }
  }

  /**
   * Reset user password (admin only)
   * PUT /api/users/:userId/reset-password
   */
  static async resetUserPassword(req, res) {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password is required",
        });
      }

      const result = await UserService.updateUser(userId, {
        password: newPassword,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("UserController.resetUserPassword Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while resetting password",
      });
    }
  }

  /**
   * Get user statistics (admin/moderator only)
   * GET /api/users/stats
   */
  static async getUserStats(req, res) {
    try {
      // Get counts for different user types
      const [
        totalUsers,
        adminUsers,
        moderatorUsers,
        coordinatorUsers,
        regularUsers,
        verifiedUsers,
        pendingUsers,
      ] = await Promise.all([
        UserService.getAllUsers({ status: { $ne: "deleted" } }),
        UserService.getUsersByRole("admin"),
        UserService.getUsersByRole("moderator"),
        UserService.getUsersByRole("coordinator"),
        UserService.getUsersByRole("user"),
        UserService.getAllUsers({ status: "verified" }),
        UserService.getAllUsers({ status: "pending" }),
      ]);

      const stats = {
        total: totalUsers.success ? totalUsers.count : 0,
        byRole: {
          admin: adminUsers.success ? adminUsers.count : 0,
          moderator: moderatorUsers.success ? moderatorUsers.count : 0,
          coordinator: coordinatorUsers.success ? coordinatorUsers.count : 0,
          user: regularUsers.success ? regularUsers.count : 0,
        },
        byStatus: {
          verified: verifiedUsers.success ? verifiedUsers.count : 0,
          pending: pendingUsers.success ? pendingUsers.count : 0,
        },
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("UserController.getUserStats Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching user statistics",
      });
    }
  }

  /**
   * Search users
   * GET /api/users/search
   */
  static async searchUsers(req, res) {
    try {
      const { q, limit = 20 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      // Build search filters (case-insensitive partial match)
      const filters = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
        status: { $ne: "deleted" },
      };

      const options = {
        limit: parseInt(limit),
        sort: { name: 1 },
      };

      const result = await UserService.getAllUsers(filters, options);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error("UserController.searchUsers Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while searching users",
      });
    }
  }
}

export default UserController;
