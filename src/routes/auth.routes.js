/**
 * Authentication Routes
 */

import express from 'express';
import AuthController from '../controllers/auth/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateUser } from '../middleware/validation.middleware.js';
import { authRateLimit } from '../middleware/rate-limit.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', authRateLimit, validateUser, AuthController.register);
router.post('/login', authRateLimit, AuthController.login);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, validateUser, AuthController.updateProfile);
router.put('/change-password', authenticate, AuthController.changePassword);
router.post('/refresh', authenticate, AuthController.refreshToken);
router.get('/verify', authenticate, AuthController.verifyToken);

export default router;