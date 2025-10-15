/**
 * Participant Controller
 */

import ParticipantService from '../../services/participant.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.js';
import { HTTP_STATUS } from '../../utils/constants.js';

class ParticipantController {
  static async getAllParticipants(req, res) {
    try {
      const {
        status,
        type,
        school,
        teamID,
        limit = 50,
        page = 1,
        sort = 'registeredAt',
        order = 'desc'
      } = req.query;

      const filters = { status: { $ne: 'deleted' } };
      if (status) filters.status = status;
      if (type) filters.type = type;
      if (school) filters.school = { $regex: school, $options: 'i' };
      if (teamID) filters.teamID = teamID;

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await ParticipantService.getAllParticipants(filters, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / parseInt(limit))
      };

      return paginatedResponse(res, result.data, pagination, 'Participants retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get participants', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getParticipantById(req, res) {
    try {
      const { participantId } = req.params;
      const result = await ParticipantService.getParticipantById(participantId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.NOT_FOUND);
      }

      return successResponse(res, result.data, 'Participant retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get participant', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async createParticipant(req, res) {
    try {
      const result = await ParticipantService.createParticipant(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message, HTTP_STATUS.CREATED);
    } catch (error) {
      return errorResponse(res, 'Failed to register participant', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updateParticipant(req, res) {
    try {
      const { participantId } = req.params;
      const updateData = { ...req.body };

      // Only coordinators and above can change verification status
      if (req.user.role === 'user') {
        delete updateData.status;
        delete updateData.verifiedAt;
        delete updateData.verifiedBy;
      }

      const result = await ParticipantService.updateParticipant(participantId, updateData);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to update participant', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async deleteParticipant(req, res) {
    try {
      const { participantId } = req.params;
      const result = await ParticipantService.deleteParticipant(participantId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to delete participant', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async verifyParticipant(req, res) {
    try {
      const { participantId } = req.params;
      const verifiedBy = req.user.email;

      const result = await ParticipantService.verifyParticipant(participantId, verifiedBy);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to verify participant', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getParticipantsByStatus(req, res) {
    try {
      const { status } = req.params;
      const { limit = 50, sort = 'registeredAt', order = 'desc' } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await ParticipantService.getParticipantsByStatus(status, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Participants retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get participants by status', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getParticipantsByType(req, res) {
    try {
      const { type } = req.params;
      const { limit = 50, sort = 'registeredAt', order = 'desc' } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await ParticipantService.getParticipantsByType(type, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Participants retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get participants by type', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getParticipantsBySchool(req, res) {
    try {
      const { school } = req.params;
      const { limit = 50, sort = 'registeredAt', order = 'desc' } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await ParticipantService.getParticipantsBySchool(school, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Participants retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get participants by school', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async searchParticipants(req, res) {
    try {
      const { q, limit = 20 } = req.query;

      if (!q) {
        return errorResponse(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
      }

      const options = {
        limit: parseInt(limit),
        sort: { name: 1 }
      };

      const result = await ParticipantService.searchParticipants(q, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Search completed successfully');
    } catch (error) {
      return errorResponse(res, 'Search failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getParticipantStats(req, res) {
    try {
      const result = await ParticipantService.getParticipantStats();

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Participant statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get participant statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async bulkVerifyParticipants(req, res) {
    try {
      const { participantIds } = req.body;
      const verifiedBy = req.user.email;

      if (!participantIds || !Array.isArray(participantIds)) {
        return errorResponse(res, 'Participant IDs array is required', HTTP_STATUS.BAD_REQUEST);
      }

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const participantId of participantIds) {
        try {
          const result = await ParticipantService.verifyParticipant(participantId, verifiedBy);
          results.push({
            participantId,
            success: result.success,
            message: result.message
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
            message: error.message
          });
          errorCount++;
        }
      }

      const summary = {
        total: participantIds.length,
        successful: successCount,
        failed: errorCount
      };

      return successResponse(res, { results, summary }, 
        `Bulk verification completed: ${successCount} successful, ${errorCount} failed`);
    } catch (error) {
      return errorResponse(res, 'Bulk verification failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export default ParticipantController;