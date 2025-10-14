/**
 * Authentication Routes
 * Defines all authentication-related API endpoints
 */

import express from "express";
import AuthController from "../../controllers/auth/authController.js";
import AuthMiddleware from "../../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", AuthController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (logs the logout event)
 * @access  Private
 */
router.post("/logout", AuthMiddleware.authenticate, AuthController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", AuthMiddleware.authenticate, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  "/profile",
  AuthMiddleware.authenticate,
  AuthController.updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  "/change-password",
  AuthMiddleware.authenticate,
  AuthController.changePassword
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post(
  "/refresh",
  AuthMiddleware.authenticate,
  AuthController.refreshToken
);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token
 * @access  Private
 */
router.get("/verify", AuthMiddleware.authenticate, AuthController.verifyToken);

/**
 * @route   GET /api/auth/login-history
 * @desc    Get user's login history
 * @access  Private
 */
router.get(
  "/login-history",
  AuthMiddleware.authenticate,
  AuthController.getLoginHistory
);

export default router;
