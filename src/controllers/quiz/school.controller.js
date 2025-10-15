/**
 * School Controller
 */

import SchoolService from '../../services/school.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.js';
import { HTTP_STATUS } from '../../utils/constants.js';

class SchoolController {
  static async getAllSchools(req, res) {
    try {
      const {
        status,
        city,
        moderatorEmail,
        coordinatorEmail,
        limit = 50,
        page = 1,
        sort = 'createdAt',
        order = 'desc'
      } = req.query;

      const filters = { status: { $ne: 'deleted' } };
      if (status) filters.status = status;
      if (city) filters.city = { $regex: city, $options: 'i' };
      if (moderatorEmail) filters.moderatorEmail = moderatorEmail;
      if (coordinatorEmail) filters.coordinatorEmail = coordinatorEmail;

      const options = {
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await SchoolService.getAllSchools(filters, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.total,
        pages: Math.ceil(result.total / parseInt(limit))
      };

      return paginatedResponse(res, result.data, pagination, 'Schools retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get schools', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getSchoolById(req, res) {
    try {
      const { schoolId } = req.params;
      const result = await SchoolService.getSchoolById(schoolId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.NOT_FOUND);
      }

      return successResponse(res, result.data, 'School retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get school', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async createSchool(req, res) {
    try {
      const result = await SchoolService.createSchool(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message, HTTP_STATUS.CREATED);
    } catch (error) {
      return errorResponse(res, 'Failed to register school', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async updateSchool(req, res) {
    try {
      const { schoolId } = req.params;
      const result = await SchoolService.updateSchool(schoolId, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to update school', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async deleteSchool(req, res) {
    try {
      const { schoolId } = req.params;
      const result = await SchoolService.deleteSchool(schoolId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to delete school', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async verifySchool(req, res) {
    try {
      const { schoolId } = req.params;
      const result = await SchoolService.verifySchool(schoolId);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to verify school', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getSchoolsByStatus(req, res) {
    try {
      const { status } = req.params;
      const { limit = 50, sort = 'createdAt', order = 'desc' } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await SchoolService.getSchoolsByStatus(status, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Schools retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get schools by status', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getSchoolsByCity(req, res) {
    try {
      const { city } = req.params;
      const { limit = 50, sort = 'name', order = 'asc' } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      const result = await SchoolService.getSchoolsByCity(city, options);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'Schools retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get schools by city', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async assignCoordinator(req, res) {
    try {
      const { schoolId } = req.params;
      const { coordinatorEmail } = req.body;

      if (!coordinatorEmail) {
        return errorResponse(res, 'Coordinator email is required', HTTP_STATUS.BAD_REQUEST);
      }

      const result = await SchoolService.assignCoordinator(schoolId, coordinatorEmail);

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, result.message);
    } catch (error) {
      return errorResponse(res, 'Failed to assign coordinator', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  static async getSchoolStats(req, res) {
    try {
      const result = await SchoolService.getSchoolStats();

      if (!result.success) {
        return errorResponse(res, result.message, HTTP_STATUS.BAD_REQUEST);
      }

      return successResponse(res, result.data, 'School statistics retrieved successfully');
    } catch (error) {
      return errorResponse(res, 'Failed to get school statistics', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
}

export default SchoolController;