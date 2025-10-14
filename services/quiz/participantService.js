/**
 * Participant Service - Handles all participant-related database operations
 * Manages quiz participants with individual and school-based registrations
 */

import { Participant } from "../../models/quiz/participants.js";
import DB from "../../db/db.js";
import Validator from "../../models/validator.js";

class ParticipantService {
  /**
   * Create a new participant
   * @param {Object} participantData - Participant data object
   * @param {string} participantData.name - Participant name (required)
   * @param {string} participantData.email - Participant email (required, unique)
   * @param {string} participantData.phone - Participant phone (10 digits)
   * @param {Date} participantData.dob - Date of birth
   * @param {string} participantData.class - Class/Grade
   * @param {string} participantData.school - School name
   * @param {string} participantData.homeTown - Home town
   * @param {string} participantData.fatherName - Father's name
   * @param {string} participantData.type - Type (individual/school)
   * @param {string} participantData.teamID - Team ID (optional)
   * @returns {Promise<Object>} Created participant object or error
   */
  static async createParticipant(participantData) {
    try {
      // Validate input data
      const validation = this.validateParticipantData(participantData, true);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Check if participant already exists
      const existingParticipant = await this.getParticipantByEmail(
        participantData.email
      );
      if (existingParticipant.success) {
        return {
          success: false,
          message: "Participant with this email already exists",
        };
      }

      // Prepare participant data
      const participantToCreate = {
        ...participantData,
        status: participantData.status || "pending",
        registeredAt: new Date(),
      };

      // Create participant using DB service
      const newParticipant = await DB.insert(
        "Participant",
        participantToCreate
      );

      return {
        success: true,
        message: "Participant registered successfully",
        data: newParticipant,
      };
    } catch (error) {
      console.error("ParticipantService.createParticipant Error:", error);
      return {
        success: false,
        message: error.code === 11000 ? "Email already exists" : error.message,
      };
    }
  }

  /**
   * Get participant by ID
   * @param {string} participantId - Participant ID
   * @returns {Promise<Object>} Participant object or error
   */
  static async getParticipantById(participantId) {
    try {
      const participants = await DB.select("Participant", {
        _id: participantId,
      });

      if (participants.length === 0) {
        return {
          success: false,
          message: "Participant not found",
        };
      }

      return {
        success: true,
        data: participants[0],
      };
    } catch (error) {
      console.error("ParticipantService.getParticipantById Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get participant by email
   * @param {string} email - Participant email
   * @returns {Promise<Object>} Participant object or error
   */
  static async getParticipantByEmail(email) {
    try {
      const participants = await DB.select("Participant", { email });

      if (participants.length === 0) {
        return {
          success: false,
          message: "Participant not found",
        };
      }

      return {
        success: true,
        data: participants[0],
      };
    } catch (error) {
      console.error("ParticipantService.getParticipantByEmail Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all participants with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (limit, sort, etc.)
   * @returns {Promise<Object>} Array of participants or error
   */
  static async getAllParticipants(filters = {}, options = {}) {
    try {
      const participants = await DB.select("Participant", filters, options);

      return {
        success: true,
        data: participants,
        count: participants.length,
      };
    } catch (error) {
      console.error("ParticipantService.getAllParticipants Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update participant by ID
   * @param {string} participantId - Participant ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated participant object or error
   */
  static async updateParticipant(participantId, updateData) {
    try {
      // Validate update data
      const validation = this.validateParticipantData(updateData, false);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Update participant
      const modifiedCount = await DB.update("Participant", updateData, {
        _id: participantId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "Participant not found or no changes made",
        };
      }

      // Get updated participant
      const updatedParticipant = await this.getParticipantById(participantId);

      return {
        success: true,
        message: "Participant updated successfully",
        data: updatedParticipant.data,
      };
    } catch (error) {
      console.error("ParticipantService.updateParticipant Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete participant by ID (soft delete - sets status to 'deleted')
   * @param {string} participantId - Participant ID
   * @returns {Promise<Object>} Success message or error
   */
  static async deleteParticipant(participantId) {
    try {
      const modifiedCount = await DB.update(
        "Participant",
        { status: "deleted" },
        { _id: participantId }
      );

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "Participant not found",
        };
      }

      return {
        success: true,
        message: "Participant deleted successfully",
      };
    } catch (error) {
      console.error("ParticipantService.deleteParticipant Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Verify participant (change status to verified)
   * @param {string} participantId - Participant ID
   * @param {string} verifiedBy - Who verified the participant
   * @returns {Promise<Object>} Success message or error
   */
  static async verifyParticipant(participantId, verifiedBy) {
    try {
      const updateData = {
        status: "verified",
        verifiedAt: new Date(),
        verifiedBy,
      };

      const modifiedCount = await DB.update("Participant", updateData, {
        _id: participantId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "Participant not found",
        };
      }

      return {
        success: true,
        message: "Participant verified successfully",
      };
    } catch (error) {
      console.error("ParticipantService.verifyParticipant Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get participants by status
   * @param {string} status - Participant status
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of participants or error
   */
  static async getParticipantsByStatus(status, options = {}) {
    try {
      return await this.getAllParticipants({ status }, options);
    } catch (error) {
      console.error("ParticipantService.getParticipantsByStatus Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get participants by type (individual/school)
   * @param {string} type - Participant type
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of participants or error
   */
  static async getParticipantsByType(type, options = {}) {
    try {
      return await this.getAllParticipants({ type }, options);
    } catch (error) {
      console.error("ParticipantService.getParticipantsByType Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get participants by school
   * @param {string} school - School name
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of participants or error
   */
  static async getParticipantsBySchool(school, options = {}) {
    try {
      return await this.getAllParticipants({ school }, options);
    } catch (error) {
      console.error("ParticipantService.getParticipantsBySchool Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get participants by team ID
   * @param {string} teamID - Team ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of participants or error
   */
  static async getParticipantsByTeam(teamID, options = {}) {
    try {
      return await this.getAllParticipants({ teamID }, options);
    } catch (error) {
      console.error("ParticipantService.getParticipantsByTeam Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get participant statistics
   * @returns {Promise<Object>} Participant statistics or error
   */
  static async getParticipantStats() {
    try {
      const totalParticipants = await DB.count("Participant", {
        status: { $ne: "deleted" },
      });
      const verifiedParticipants = await DB.count("Participant", {
        status: "verified",
      });
      const pendingParticipants = await DB.count("Participant", {
        status: "pending",
      });
      const individualParticipants = await DB.count("Participant", {
        type: "individual",
        status: { $ne: "deleted" },
      });
      const schoolParticipants = await DB.count("Participant", {
        type: "school",
        status: { $ne: "deleted" },
      });

      return {
        success: true,
        data: {
          total: totalParticipants,
          verified: verifiedParticipants,
          pending: pendingParticipants,
          individual: individualParticipants,
          school: schoolParticipants,
        },
      };
    } catch (error) {
      console.error("ParticipantService.getParticipantStats Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Validate participant data
   * @param {Object} participantData - Participant data to validate
   * @param {boolean} isCreate - Whether this is for create operation
   * @returns {Object} Validation result
   */
  static validateParticipantData(participantData, isCreate = false) {
    const fields = {};

    if (participantData.name !== undefined) {
      fields.name = {
        value: participantData.name,
        rules: [
          { type: "required", message: "Name is required" },
          {
            type: "minLength",
            minLength: 2,
            message: "Name must be at least 2 characters",
          },
        ],
      };
    }

    if (participantData.email !== undefined) {
      fields.email = {
        value: participantData.email,
        rules: [
          { type: "required", message: "Email is required" },
          { type: "email", message: "Invalid email format" },
        ],
      };
    }

    if (participantData.phone !== undefined) {
      fields.phone = {
        value: participantData.phone,
        rules: [
          { type: "phone", message: "Phone must be a valid 10-digit number" },
        ],
      };
    }

    if (participantData.type !== undefined) {
      fields.type = {
        value: participantData.type,
        rules: [
          {
            type: "custom",
            validate: (value) => ["individual", "school"].includes(value),
            message: "Type must be individual or school",
          },
        ],
      };
    }

    if (participantData.status !== undefined) {
      fields.status = {
        value: participantData.status,
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

export default ParticipantService;
