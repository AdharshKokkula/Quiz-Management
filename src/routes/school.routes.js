/**
 * School Routes
 */

import express from 'express';
import SchoolController from '../controllers/quiz/school.controller.js';
import { authenticate, coordinatorAndAbove, moderatorAndAbove, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Coordinator and above routes (read access)
router.get('/', coordinatorAndAbove, SchoolController.getAllSchools);
router.get('/stats', coordinatorAndAbove, SchoolController.getSchoolStats);
router.get('/status/:status', coordinatorAndAbove, SchoolController.getSchoolsByStatus);
router.get('/city/:city', coordinatorAndAbove, SchoolController.getSchoolsByCity);
router.get('/:schoolId', coordinatorAndAbove, SchoolController.getSchoolById);

// Moderator and above routes
router.post('/', moderatorAndAbove, SchoolController.createSchool);
router.put('/:schoolId', moderatorAndAbove, SchoolController.updateSchool);
router.put('/:schoolId/verify', moderatorAndAbove, SchoolController.verifySchool);
router.put('/:schoolId/coordinator', moderatorAndAbove, SchoolController.assignCoordinator);

// Admin only routes
router.delete('/:schoolId', adminOnly, SchoolController.deleteSchool);

export default router;