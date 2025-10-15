/**
 * Result Controller
 */

import ResultService from '../../services/result.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.js';
import { HTTP_STATUS } from '../../utils/constants.js';

class ResultController {
  static async getAllResults(req, res) {
    try {
      const {
        round,
        teamId,
        position,
        limit = 50,
        page = 1,
        sort = 'createdAt',
        order = 'desc'
      } = req.query;

      const filters = {};
      if (round) filters.round = round;
      if (teamId) filters.teamId = teamId;
      if (position) filters.position = position;

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await ResultService.getAllResults(filters, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / parseInt(limit))
      };

      return paginatedResponse(res, result.data, pagination, 'Results retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get results', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getResultById(req, res) {
    try {
      const { resultId } = req.params;
      const result = await ResultService.getResultById(resultId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.NOT_FOUND);
      }

      return successResponse(res, result.data, 'Result retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get result', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async createResult(req, res) {
    try {
      const result = await ResultService.createResult(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message, HTTP_STATUS.CREATED);
    } catch (error) {
      return errorResponse(res, 'Failed to create result', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updateResult(req, res) {
    try {
      const { resultId } = req.params;
      const result = await ResultService.updateResult(resultId, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to update result', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async deleteResult(req, res) {
    try {
      const { resultId } = req.params;
      const result = await ResultService.deleteResult(resultId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to delete result', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getResultsByRound(req, res) {
    try {
      const { round } = req.params;
      const { limit = 50, sort = 'createdAt', order = 'desc' } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await ResultService.getResultsByRound(round, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Results retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get results by round', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getResultsByTeam(req, res) {
    try {
      const { teamId } = req.params;
      const { limit = 50, sort = 'createdAt', order = 'desc' } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await ResultService.getResultsByTeam(teamId, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Results retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get results by team', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getLeaderboard(req, res) {
    try {
      const { round } = req.params;
      const result = await ResultService.getLeaderboard(round);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Leaderboard retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get leaderboard', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getQualifiedTeams(req, res) {
    try {
      const { round } = req.params;
      const result = await ResultService.getQualifiedTeams(round);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Qualified teams retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get qualified teams', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getResultStats(req, res) {
    try {
      const result = await ResultService.getResultStats();

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Result statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get result statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export default ResultController;