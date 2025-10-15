/**
 * Participant Service
 */

import Participant from '../models/Participant.js';
import logger from '../utils/logger.js';

class ParticipantService {
  static async createParticipant(participantData) {
    try {
      const existingParticipant = await Participant.findOne({ email: participantData.email });
      if (existingParticipant) {
        return {
          success: false,
          message: 'Participant with this email already exists'
        };
      }

      const participant = new Participant(participantData);
      await participant.save();

      return {
        success: true,
        message: 'Participant registered successfully',
        data: participant
      };
    } catch (error) {
      logger.error('ParticipantService.createParticipant error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getParticipantById(participantId) {
    try {
      const participant = await Participant.findById(participantId);
      if (!participant) {
        return {
          success: false,
          message: 'Participant not found'
        };
      }

      return {
        success: true,
        data: participant
      };
    } catch (error) {
      logger.error('ParticipantService.getParticipantById error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAllParticipants(filters = {}, options = {}) {
    try {
      const query = Participant.find(filters);
      
      if (options.limit) query.limit(options.limit);
      if (options.sort) query.sort(options.sort);
      if (options.skip) query.skip(options.skip);

      const participants = await query.exec();
      const total = await Participant.countDocuments(filters);

      return {
        success: true,
        data: participants,
        total
      };
    } catch (error) {
      logger.error('ParticipantService.getAllParticipants error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateParticipant(participantId, updateData) {
    try {
      const participant = await Participant.findByIdAndUpdate(
        participantId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!participant) {
        return {
          success: false,
          message: 'Participant not found'
        };
      }

      return {
        success: true,
        message: 'Participant updated successfully',
        data: participant
      };
    } catch (error) {
      logger.error('ParticipantService.updateParticipant error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteParticipant(participantId) {
    try {
      const participant = await Participant.findByIdAndUpdate(
        participantId,
        { status: 'deleted' },
        { new: true }
      );

      if (!participant) {
        return {
          success: false,
          message: 'Participant not found'
        };
      }

      return {
        success: true,
        message: 'Participant deleted successfully'
      };
    } catch (error) {
      logger.error('ParticipantService.deleteParticipant error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async verifyParticipant(participantId, verifiedBy) {
    try {
      const participant = await Participant.findByIdAndUpdate(
        participantId,
        {
          status: 'verified',
          verifiedAt: new Date(),
          verifiedBy
        },
        { new: true }
      );

      if (!participant) {
        return {
          success: false,
          message: 'Participant not found'
        };
      }

      return {
        success: true,
        message: 'Participant verified successfully',
        data: participant
      };
    } catch (error) {
      logger.error('ParticipantService.verifyParticipant error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getParticipantsByStatus(status, options = {}) {
    try {
      return await this.getAllParticipants({ status }, options);
    } catch (error) {
      logger.error('ParticipantService.getParticipantsByStatus error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getParticipantsByType(type, options = {}) {
    try {
      return await this.getAllParticipants({ type }, options);
    } catch (error) {
      logger.error('ParticipantService.getParticipantsByType error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getParticipantsBySchool(school, options = {}) {
    try {
      return await this.getAllParticipants({ school }, options);
    } catch (error) {
      logger.error('ParticipantService.getParticipantsBySchool error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async searchParticipants(query, options = {}) {
    try {
      const searchRegex = new RegExp(query, 'i');
      const filters = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { school: searchRegex },
          { teamID: searchRegex }
        ],
        status: { $ne: 'deleted' }
      };

      return await this.getAllParticipants(filters, options);
    } catch (error) {
      logger.error('ParticipantService.searchParticipants error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getParticipantStats() {
    try {
      const total = await Participant.countDocuments({ status: { $ne: 'deleted' } });
      const verified = await Participant.countDocuments({ status: 'verified' });
      const pending = await Participant.countDocuments({ status: 'pending' });
      const individual = await Participant.countDocuments({ type: 'individual', status: { $ne: 'deleted' } });
      const school = await Participant.countDocuments({ type: 'school', status: { $ne: 'deleted' } });

      return {
        success: true,
        data: {
          total,
          verified,
          pending,
          individual,
          school
        }
      };
    } catch (error) {
      logger.error('ParticipantService.getParticipantStats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default ParticipantService;