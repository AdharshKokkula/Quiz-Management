/**
 * Result Routes
 */

import express from 'express';
import ResultController from '../controllers/quiz/result.controller.js';
import { authenticate, coordinatorAndAbove, moderatorAndAbove } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Coordinator and above routes (read access)
router.get('/', coordinatorAndAbove, ResultController.getAllResults);
router.get('/stats', coordinatorAndAbove, ResultController.getResultStats);
router.get('/round/:round', coordinatorAndAbove, ResultController.getResultsByRound);
router.get('/round/:round/leaderboard', coordinatorAndAbove, ResultController.getLeaderboard);
router.get('/round/:round/qualified', coordinatorAndAbove, ResultController.getQualifiedTeams);
router.get('/team/:teamId', coordinatorAndAbove, ResultController.getResultsByTeam);
router.get('/:resultId', coordinatorAndAbove, ResultController.getResultById);

// Moderator and above routes (write access)
router.post('/', moderatorAndAbove, ResultController.createResult);
router.put('/:resultId', moderatorAndAbove, ResultController.updateResult);
router.delete('/:resultId', moderatorAndAbove, ResultController.deleteResult);

export default router;