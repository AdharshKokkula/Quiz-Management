/**
 * School Service
 */

import School from '../models/School.js';
import logger from '../utils/logger.js';

class SchoolService {
  static async createSchool(schoolData) {
    try {
      const existingSchool = await School.findOne({ name: schoolData.name });
      if (existingSchool) {
        return {
          success: false,
          message: 'School with this name already exists'
        };
      }

      const school = new School(schoolData);
      await school.save();

      return {
        success: true,
        message: 'School registered successfully',
        data: school
      };
    } catch (error) {
      logger.error('SchoolService.createSchool error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSchoolById(schoolId) {
    try {
      const school = await School.findById(schoolId);
      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        data: school
      };
    } catch (error) {
      logger.error('SchoolService.getSchoolById error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAllSchools(filters = {}, options = {}) {
    try {
      const query = School.find(filters);
      
      if (options.limit) query.limit(options.limit);
      if (options.sort) query.sort(options.sort);
      if (options.skip) query.skip(options.skip);

      const schools = await query.exec();
      const total = await School.countDocuments(filters);

      return {
        success: true,
        data: schools,
        total
      };
    } catch (error) {
      logger.error('SchoolService.getAllSchools error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateSchool(schoolId, updateData) {
    try {
      const school = await School.findByIdAndUpdate(
        schoolId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'School updated successfully',
        data: school
      };
    } catch (error) {
      logger.error('SchoolService.updateSchool error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteSchool(schoolId) {
    try {
      const school = await School.findByIdAndUpdate(
        schoolId,
        { status: 'deleted' },
        { new: true }
      );

      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'School deleted successfully'
      };
    } catch (error) {
      logger.error('SchoolService.deleteSchool error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async verifySchool(schoolId) {
    try {
      const school = await School.findByIdAndUpdate(
        schoolId,
        { status: 'verified' },
        { new: true }
      );

      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'School verified successfully',
        data: school
      };
    } catch (error) {
      logger.error('SchoolService.verifySchool error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSchoolsByStatus(status, options = {}) {
    try {
      return await this.getAllSchools({ status }, options);
    } catch (error) {
      logger.error('SchoolService.getSchoolsByStatus error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSchoolsByCity(city, options = {}) {
    try {
      return await this.getAllSchools({ city }, options);
    } catch (error) {
      logger.error('SchoolService.getSchoolsByCity error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async assignCoordinator(schoolId, coordinatorEmail) {
    try {
      const school = await School.findByIdAndUpdate(
        schoolId,
        { coordinatorEmail },
        { new: true }
      );

      if (!school) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'Coordinator assigned successfully',
        data: school
      };
    } catch (error) {
      logger.error('SchoolService.assignCoordinator error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getSchoolStats() {
    try {
      const total = await School.countDocuments({ status: { $ne: 'deleted' } });
      const verified = await School.countDocuments({ status: 'verified' });
      const pending = await School.countDocuments({ status: 'pending' });
      const withCoordinators = await School.countDocuments({
        coordinatorEmail: { $exists: true, $ne: null },
        status: { $ne: 'deleted' }
      });

      return {
        success: true,
        data: {
          total,
          verified,
          pending,
          withCoordinators
        }
      };
    } catch (error) {
      logger.error('SchoolService.getSchoolStats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default SchoolService;