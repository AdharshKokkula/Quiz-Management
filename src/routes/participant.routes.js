/**
 * Participant Routes
 */

import express from 'express';
import ParticipantController from '../controllers/quiz/participant.controller.js';
import { authenticate, coordinatorAndAbove, moderatorAndAbove } from '../middleware/auth.middleware.js';
import { validateParticipant } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.post('/', validateParticipant, ParticipantController.createParticipant);

// Protected routes
router.use(authenticate);

// Coordinator and above routes (specific routes first)
router.get('/stats', coordinatorAndAbove, ParticipantController.getParticipantStats);
router.get('/search', coordinatorAndAbove, ParticipantController.searchParticipants);
router.get('/status/:status', coordinatorAndAbove, ParticipantController.getParticipantsByStatus);
router.get('/type/:type', coordinatorAndAbove, ParticipantController.getParticipantsByType);
router.get('/school/:school', coordinatorAndAbove, ParticipantController.getParticipantsBySchool);
router.get('/', coordinatorAndAbove, ParticipantController.getAllParticipants);
router.get('/:participantId', coordinatorAndAbove, ParticipantController.getParticipantById);
router.put('/:participantId/verify', coordinatorAndAbove, ParticipantController.verifyParticipant);
router.put('/:participantId', coordinatorAndAbove, validateParticipant, ParticipantController.updateParticipant);

// Moderator and above routes
router.delete('/:participantId', moderatorAndAbove, ParticipantController.deleteParticipant);

// Bulk operations (must be before parameterized routes)
router.put('/bulk-verify', moderatorAndAbove, ParticipantController.bulkVerifyParticipants);

export default router;