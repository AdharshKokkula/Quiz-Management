/**
 * Tracking Routes
 */

import express from 'express';
import VisitorController from '../controllers/tracking/visitor.controller.js';
import { authenticate, moderatorAndAbove } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/visit', VisitorController.trackVisit);

// Protected routes
router.use(authenticate);
router.use(moderatorAndAbove);

// Visitor tracking routes
router.get('/visitors', VisitorController.getAllVisitors);
router.get('/visitors/stats', VisitorController.getVisitorStats);

// Login tracking routes
router.get('/logs', VisitorController.getAllLogs);
router.get('/logs/stats', VisitorController.getLoginStats);
router.get('/sessions/active', VisitorController.getActiveSessions);

export default router;