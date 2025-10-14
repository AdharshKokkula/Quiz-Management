/**
 * User Management Routes
 * Defines all user management API endpoints (admin/moderator functions)
 */

import express from "express";
import UserController from "../../controllers/auth/userController.js";
import AuthMiddleware from "../../middleware/auth.js";

const router = express.Router();

// Apply authentication to all routes
router.use(AuthMiddleware.authenticate);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private (Moderator and above)
 */
router.get(
  "/stats",
  AuthMiddleware.moderatorAndAbove,
  UserController.getUserStats
);

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private (Moderator and above)
 */
router.get(
  "/search",
  AuthMiddleware.moderatorAndAbove,
  UserController.searchUsers
);

/**
 * @route   GET /api/users/role/:role
 * @desc    Get users by role
 * @access  Private (Moderator and above)
 */
router.get(
  "/role/:role",
  AuthMiddleware.moderatorAndAbove,
  UserController.getUsersByRole
);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Moderator and above)
 */
router.get("/", AuthMiddleware.moderatorAndAbove, UserController.getAllUsers);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post("/", AuthMiddleware.adminOnly, UserController.createUser);

/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID
 * @access  Private (Self or Moderator and above)
 */
router.get(
  "/:userId",
  AuthMiddleware.selfOrAdmin(),
  UserController.getUserById
);

/**
 * @route   PUT /api/users/:userId
 * @desc    Update user by ID
 * @access  Private (Self or Admin)
 */
router.put("/:userId", AuthMiddleware.selfOrAdmin(), UserController.updateUser);

/**
 * @route   DELETE /api/users/:userId
 * @desc    Delete user by ID (soft delete)
 * @access  Private (Admin only)
 */
router.delete("/:userId", AuthMiddleware.adminOnly, UserController.deleteUser);

/**
 * @route   PUT /api/users/:userId/verify
 * @desc    Verify user account
 * @access  Private (Moderator and above)
 */
router.put(
  "/:userId/verify",
  AuthMiddleware.moderatorAndAbove,
  UserController.verifyUser
);

/**
 * @route   PUT /api/users/:userId/role
 * @desc    Change user role
 * @access  Private (Admin only)
 */
router.put(
  "/:userId/role",
  AuthMiddleware.adminOnly,
  UserController.changeUserRole
);

/**
 * @route   PUT /api/users/:userId/reset-password
 * @desc    Reset user password
 * @access  Private (Admin only)
 */
router.put(
  "/:userId/reset-password",
  AuthMiddleware.adminOnly,
  UserController.resetUserPassword
);

export default router;
