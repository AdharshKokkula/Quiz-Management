/**
 * Participant Controller
 * Handles participant management operations for quiz system
 */

import ParticipantService from "../../services/quiz/participantService.js";

class ParticipantController {
  /**
   * Get all participants
   * GET /api/participants
   */
  static async getAllParticipants(req, res) {
    try {
      const {
        status,
        type,
        school,
        teamID,
        limit = 50,
        page = 1,
        sort = "registeredAt",
        order = "desc",
      } = req.query;

      // Build filters
      const filters = {};
      if (status) filters.status = status;
      if (type) filters.type = type;
      if (school) filters.school = { $regex: school, $options: "i" };
      if (teamID) filters.teamID = teamID;

      // Build options
      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
      };

      const result = await ParticipantService.getAllParticipants(
        filters,
        options
      );

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
      console.error("ParticipantController.getAllParticipants Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching participants",
      });
    }
  }

  /**
   * Get participant by ID
   * GET /api/participants/:participantId
   */
  static async getParticipantById(req, res) {
    try {
      const { participantId } = req.params;

      const result = await ParticipantService.getParticipantById(participantId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error("ParticipantController.getParticipantById Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching participant",
      });
    }
  }

  /**
   * Create new participant (registration)
   * POST /api/participants
   */
  static async createParticipant(req, res) {
    try {
      const participantData = req.body;

      const result = await ParticipantService.createParticipant(
        participantData
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json({
        success: true,
        message: "Participant registered successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("ParticipantController.createParticipant Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while registering participant",
      });
    }
  }

  /**
   * Update participant by ID
   * PUT /api/participants/:participantId
   */
  static async updateParticipant(req, res) {
    try {
      const { participantId } = req.params;
      const updateData = req.body;

      // Only coordinators and above can change verification status
      if (req.user.role === "user") {
        delete updateData.status;
        delete updateData.verifiedAt;
        delete updateData.verifiedBy;
      }

      const result = await ParticipantService.updateParticipant(
        participantId,
        updateData
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "Participant updated successfully",
        data: result.data,
      });
    } catch (error) {
      console.error("ParticipantController.updateParticipant Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while updating participant",
      });
    }
  }

  /**
   * Delete participant by ID (soft delete)
   * DELETE /api/participants/:participantId
   */
  static async deleteParticipant(req, res) {
    try {
      const { participantId } = req.params;

      const result = await ParticipantService.deleteParticipant(participantId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "Participant deleted successfully",
      });
    } catch (error) {
      console.error("ParticipantController.deleteParticipant Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while deleting participant",
      });
    }
  }

  /**
   * Verify participant (coordinator/moderator/admin only)
   * PUT /api/participants/:participantId/verify
   */
  static async verifyParticipant(req, res) {
    try {
      const { participantId } = req.params;
      const verifiedBy = req.user.email;

      const result = await ParticipantService.verifyParticipant(
        participantId,
        verifiedBy
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        message: "Participant verified successfully",
      });
    } catch (error) {
      console.error("ParticipantController.verifyParticipant Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while verifying participant",
      });
    }
  }

  /**
   * Get participants by status
   * GET /api/participants/status/:status
   */
  static async getParticipantsByStatus(req, res) {
    try {
      const { status } = req.params;
      const { limit = 50, sort = "registeredAt", order = "desc" } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
      };

      const result = await ParticipantService.getParticipantsByStatus(
        status,
        options
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error(
        "ParticipantController.getParticipantsByStatus Error:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching participants by status",
      });
    }
  }

  /**
   * Get participants by type (individual/school)
   * GET /api/participants/type/:type
   */
  static async getParticipantsByType(req, res) {
    try {
      const { type } = req.params;
      const { limit = 50, sort = "registeredAt", order = "desc" } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
      };

      const result = await ParticipantService.getParticipantsByType(
        type,
        options
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error(
        "ParticipantController.getParticipantsByType Error:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching participants by type",
      });
    }
  }

  /**
   * Get participants by school
   * GET /api/participants/school/:school
   */
  static async getParticipantsBySchool(req, res) {
    try {
      const { school } = req.params;
      const { limit = 50, sort = "registeredAt", order = "desc" } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
      };

      const result = await ParticipantService.getParticipantsBySchool(
        school,
        options
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error(
        "ParticipantController.getParticipantsBySchool Error:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching participants by school",
      });
    }
  }

  /**
   * Get participants by team
   * GET /api/participants/team/:teamID
   */
  static async getParticipantsByTeam(req, res) {
    try {
      const { teamID } = req.params;
      const { limit = 50, sort = "registeredAt", order = "desc" } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
      };

      const result = await ParticipantService.getParticipantsByTeam(
        teamID,
        options
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error(
        "ParticipantController.getParticipantsByTeam Error:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching participants by team",
      });
    }
  }

  /**
   * Get participant statistics
   * GET /api/participants/stats
   */
  static async getParticipantStats(req, res) {
    try {
      const result = await ParticipantService.getParticipantStats();

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      console.error("ParticipantController.getParticipantStats Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching participant statistics",
      });
    }
  }

  /**
   * Search participants
   * GET /api/participants/search
   */
  static async searchParticipants(req, res) {
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
          { school: { $regex: q, $options: "i" } },
          { teamID: { $regex: q, $options: "i" } },
        ],
        status: { $ne: "deleted" },
      };

      const options = {
        limit: parseInt(limit),
        sort: { name: 1 },
      };

      const result = await ParticipantService.getAllParticipants(
        filters,
        options
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        data: result.data,
        count: result.count,
      });
    } catch (error) {
      console.error("ParticipantController.searchParticipants Error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while searching participants",
      });
    }
  }

  /**
   * Bulk verify participants (admin/moderator only)
   * PUT /api/participants/bulk-verify
   */
  static async bulkVerifyParticipants(req, res) {
    try {
      const { participantIds } = req.body;
      const verifiedBy = req.user.email;

      if (!participantIds || !Array.isArray(participantIds)) {
        return res.status(400).json({
          success: false,
          message: "Participant IDs array is required",
        });
      }

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const participantId of participantIds) {
        try {
          const result = await ParticipantService.verifyParticipant(
            participantId,
            verifiedBy
          );
          results.push({
            participantId,
            success: result.success,
            message: result.message,
          });

          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          results.push({
            participantId,
            success: false,
            message: error.message,
          });
          errorCount++;
        }
      }

      res.json({
        success: true,
        message: `Bulk verification completed: ${successCount} successful, ${errorCount} failed`,
        data: {
          results,
          summary: {
            total: participantIds.length,
            successful: successCount,
            failed: errorCount,
          },
        },
      });
    } catch (error) {
      console.error(
        "ParticipantController.bulkVerifyParticipants Error:",
        error
      );
      res.status(500).json({
        success: false,
        message: "Internal server error while bulk verifying participants",
      });
    }
  }
}

export default ParticipantController;
