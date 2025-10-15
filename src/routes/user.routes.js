/**
 * User Routes
 */

import express from 'express';
import UserController from '../controllers/auth/user.controller.js';
import { authenticate, adminOnly, moderatorAndAbove, selfOrAdmin } from '../middleware/auth.middleware.js';
import { validateUser } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.post('/', adminOnly, validateUser, UserController.createUser);
router.delete('/:userId', adminOnly, UserController.deleteUser);
router.put('/:userId/role', adminOnly, UserController.changeUserRole);
router.put('/:userId/reset-password', adminOnly, UserController.resetUserPassword);

// Moderator and above routes
router.get('/', moderatorAndAbove, UserController.getAllUsers);
router.put('/:userId/verify', moderatorAndAbove, UserController.verifyUser);
router.get('/role/:role', moderatorAndAbove, UserController.getUsersByRole);
router.get('/search', moderatorAndAbove, UserController.searchUsers);
router.get('/stats', moderatorAndAbove, UserController.getUserStats);

// Self or admin routes
router.get('/:userId', selfOrAdmin(), UserController.getUserById);
router.put('/:userId', selfOrAdmin(), validateUser, UserController.updateUser);

export default router;