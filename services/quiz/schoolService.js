/**
 * School Service - Handles all school-related database operations
 * Manages school registrations with moderator and coordinator assignments
 */

import { School } from "../../models/quiz/schools.js";
import DB from "../../db/db.js";
import Validator from "../../models/validator.js";

class SchoolService {
  /**
   * Create a new school
   * @param {Object} schoolData - School data object
   * @param {string} schoolData.name - School name (required)
   * @param {string} schoolData.moderatorEmail - Moderator email (required)
   * @param {string} schoolData.city - City
   * @param {string} schoolData.coordinatorEmail - Coordinator email
   * @returns {Promise<Object>} Created school object or error
   */
  static async createSchool(schoolData) {
    try {
      // Validate input data
      const validation = this.validateSchoolData(schoolData, true);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Check if school already exists
      const existingSchool = await this.getSchoolByName(schoolData.name);
      if (existingSchool.success) {
        return {
          success: false,
          message: "School with this name already exists",
        };
      }

      // Prepare school data
      const schoolToCreate = {
        ...schoolData,
        status: schoolData.status || "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create school using DB service
      const newSchool = await DB.insert("School", schoolToCreate);

      return {
        success: true,
        message: "School registered successfully",
        data: newSchool,
      };
    } catch (error) {
      console.error("SchoolService.createSchool Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get school by ID
   * @param {string} schoolId - School ID
   * @returns {Promise<Object>} School object or error
   */
  static async getSchoolById(schoolId) {
    try {
      const schools = await DB.select("School", { _id: schoolId });

      if (schools.length === 0) {
        return {
          success: false,
          message: "School not found",
        };
      }

      return {
        success: true,
        data: schools[0],
      };
    } catch (error) {
      console.error("SchoolService.getSchoolById Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get school by name
   * @param {string} name - School name
   * @returns {Promise<Object>} School object or error
   */
  static async getSchoolByName(name) {
    try {
      const schools = await DB.select("School", { name });

      if (schools.length === 0) {
        return {
          success: false,
          message: "School not found",
        };
      }

      return {
        success: true,
        data: schools[0],
      };
    } catch (error) {
      console.error("SchoolService.getSchoolByName Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all schools with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (limit, sort, etc.)
   * @returns {Promise<Object>} Array of schools or error
   */
  static async getAllSchools(filters = {}, options = {}) {
    try {
      const schools = await DB.select("School", filters, options);

      return {
        success: true,
        data: schools,
        count: schools.length,
      };
    } catch (error) {
      console.error("SchoolService.getAllSchools Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update school by ID
   * @param {string} schoolId - School ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated school object or error
   */
  static async updateSchool(schoolId, updateData) {
    try {
      // Validate update data
      const validation = this.validateSchoolData(updateData, false);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Add updated timestamp
      updateData.updatedAt = new Date();

      // Update school
      const modifiedCount = await DB.update("School", updateData, {
        _id: schoolId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "School not found or no changes made",
        };
      }

      // Get updated school
      const updatedSchool = await this.getSchoolById(schoolId);

      return {
        success: true,
        message: "School updated successfully",
        data: updatedSchool.data,
      };
    } catch (error) {
      console.error("SchoolService.updateSchool Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete school by ID (soft delete - sets status to 'deleted')
   * @param {string} schoolId - School ID
   * @returns {Promise<Object>} Success message or error
   */
  static async deleteSchool(schoolId) {
    try {
      const updateData = {
        status: "deleted",
        updatedAt: new Date(),
      };

      const modifiedCount = await DB.update("School", updateData, {
        _id: schoolId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "School not found",
        };
      }

      return {
        success: true,
        message: "School deleted successfully",
      };
    } catch (error) {
      console.error("SchoolService.deleteSchool Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify school (change status to verified)
   * @param {string} schoolId - School ID
   * @returns {Promise<Object>} Success message or error
   */
  static async verifySchool(schoolId) {
    try {
      const updateData = {
        status: "verified",
        updatedAt: new Date(),
      };

      const modifiedCount = await DB.update("School", updateData, {
        _id: schoolId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "School not found",
        };
      }

      return {
        success: true,
        message: "School verified successfully",
      };
    } catch (error) {
      console.error("SchoolService.verifySchool Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get schools by status
   * @param {string} status - School status
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of schools or error
   */
  static async getSchoolsByStatus(status, options = {}) {
    try {
      return await this.getAllSchools({ status }, options);
    } catch (error) {
      console.error("SchoolService.getSchoolsByStatus Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get schools by city
   * @param {string} city - City name
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of schools or error
   */
  static async getSchoolsByCity(city, options = {}) {
    try {
      return await this.getAllSchools({ city }, options);
    } catch (error) {
      console.error("SchoolService.getSchoolsByCity Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get schools by moderator email
   * @param {string} moderatorEmail - Moderator email
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of schools or error
   */
  static async getSchoolsByModerator(moderatorEmail, options = {}) {
    try {
      return await this.getAllSchools({ moderatorEmail }, options);
    } catch (error) {
      console.error("SchoolService.getSchoolsByModerator Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get schools by coordinator email
   * @param {string} coordinatorEmail - Coordinator email
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of schools or error
   */
  static async getSchoolsByCoordinator(coordinatorEmail, options = {}) {
    try {
      return await this.getAllSchools({ coordinatorEmail }, options);
    } catch (error) {
      console.error("SchoolService.getSchoolsByCoordinator Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Assign coordinator to school
   * @param {string} schoolId - School ID
   * @param {string} coordinatorEmail - Coordinator email
   * @returns {Promise<Object>} Success message or error
   */
  static async assignCoordinator(schoolId, coordinatorEmail) {
    try {
      const updateData = {
        coordinatorEmail,
        updatedAt: new Date(),
      };

      const modifiedCount = await DB.update("School", updateData, {
        _id: schoolId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "School not found",
        };
      }

      return {
        success: true,
        message: "Coordinator assigned successfully",
      };
    } catch (error) {
      console.error("SchoolService.assignCoordinator Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get school statistics
   * @returns {Promise<Object>} School statistics or error
   */
  static async getSchoolStats() {
    try {
      const totalSchools = await DB.count("School", {
        status: { $ne: "deleted" },
      });
      const verifiedSchools = await DB.count("School", { status: "verified" });
      const pendingSchools = await DB.count("School", { status: "pending" });
      const schoolsWithCoordinators = await DB.count("School", {
        coordinatorEmail: { $exists: true, $ne: null },
        status: { $ne: "deleted" },
      });

      return {
        success: true,
        data: {
          total: totalSchools,
          verified: verifiedSchools,
          pending: pendingSchools,
          withCoordinators: schoolsWithCoordinators,
        },
      };
    } catch (error) {
      console.error("SchoolService.getSchoolStats Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Validate school data
   * @param {Object} schoolData - School data to validate
   * @param {boolean} isCreate - Whether this is for create operation
   * @returns {Object} Validation result
   */
  static validateSchoolData(schoolData, isCreate = false) {
    const fields = {};

    if (schoolData.name !== undefined) {
      fields.name = {
        value: schoolData.name,
        rules: [
          { type: "required", message: "School name is required" },
          {
            type: "minLength",
            minLength: 2,
            message: "School name must be at least 2 characters",
          },
        ],
      };
    }

    if (schoolData.moderatorEmail !== undefined) {
      fields.moderatorEmail = {
        value: schoolData.moderatorEmail,
        rules: [
          { type: "required", message: "Moderator email is required" },
          { type: "email", message: "Invalid moderator email format" },
        ],
      };
    }

    if (
      schoolData.coordinatorEmail !== undefined &&
      schoolData.coordinatorEmail !== ""
    ) {
      fields.coordinatorEmail = {
        value: schoolData.coordinatorEmail,
        rules: [{ type: "email", message: "Invalid coordinator email format" }],
      };
    }

    if (schoolData.status !== undefined) {
      fields.status = {
        value: schoolData.status,
        rules: [
          {
            type: "custom",
            validate: (value) =>
              ["verified", "pending", "deleted"].includes(value),
            message: "Status must be verified, pending, or deleted",
          },
        ],
      };
    }

    return Validator.validate(fields);
  }
}

export default SchoolService;
