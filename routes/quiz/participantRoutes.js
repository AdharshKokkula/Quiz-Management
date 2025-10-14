/**
 * Participant Routes
 * Defines all participant-related API endpoints
 */

import express from "express";
import ParticipantController from "../../controllers/quiz/participantController.js";
import AuthMiddleware from "../../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/participants
 * @desc    Register a new participant
 * @access  Public (but rate limited)
 */
router.post(
  "/",
  AuthMiddleware.rateLimit(10, 15 * 60 * 1000), // 10 registrations per 15 minutes
  ParticipantController.createParticipant
);

/**
 * @route   GET /api/participants/stats
 * @desc    Get participant statistics
 * @access  Private (Coordinator and above)
 */
router.get(
  "/stats",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.getParticipantStats
);

/**
 * @route   GET /api/participants/search
 * @desc    Search participants
 * @access  Private (Coordinator and above)
 */
router.get(
  "/search",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.searchParticipants
);

/**
 * @route   PUT /api/participants/bulk-verify
 * @desc    Bulk verify participants
 * @access  Private (Moderator and above)
 */
router.put(
  "/bulk-verify",
  AuthMiddleware.authenticate,
  AuthMiddleware.moderatorAndAbove,
  ParticipantController.bulkVerifyParticipants
);

/**
 * @route   GET /api/participants/status/:status
 * @desc    Get participants by status
 * @access  Private (Coordinator and above)
 */
router.get(
  "/status/:status",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.getParticipantsByStatus
);

/**
 * @route   GET /api/participants/type/:type
 * @desc    Get participants by type (individual/school)
 * @access  Private (Coordinator and above)
 */
router.get(
  "/type/:type",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.getParticipantsByType
);

/**
 * @route   GET /api/participants/school/:school
 * @desc    Get participants by school
 * @access  Private (Coordinator and above)
 */
router.get(
  "/school/:school",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.getParticipantsBySchool
);

/**
 * @route   GET /api/participants/team/:teamID
 * @desc    Get participants by team
 * @access  Private (Coordinator and above)
 */
router.get(
  "/team/:teamID",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.getParticipantsByTeam
);

/**
 * @route   GET /api/participants
 * @desc    Get all participants
 * @access  Private (Coordinator and above)
 */
router.get(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.getAllParticipants
);

/**
 * @route   GET /api/participants/:participantId
 * @desc    Get participant by ID
 * @access  Private (Coordinator and above)
 */
router.get(
  "/:participantId",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.getParticipantById
);

/**
 * @route   PUT /api/participants/:participantId
 * @desc    Update participant by ID
 * @access  Private (Coordinator and above)
 */
router.put(
  "/:participantId",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.updateParticipant
);

/**
 * @route   DELETE /api/participants/:participantId
 * @desc    Delete participant by ID (soft delete)
 * @access  Private (Moderator and above)
 */
router.delete(
  "/:participantId",
  AuthMiddleware.authenticate,
  AuthMiddleware.moderatorAndAbove,
  ParticipantController.deleteParticipant
);

/**
 * @route   PUT /api/participants/:participantId/verify
 * @desc    Verify participant
 * @access  Private (Coordinator and above)
 */
router.put(
  "/:participantId/verify",
  AuthMiddleware.authenticate,
  AuthMiddleware.coordinatorAndAbove,
  ParticipantController.verifyParticipant
);

export default router;
