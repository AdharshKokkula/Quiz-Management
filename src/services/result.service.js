/**
 * Result Service
 */

import Result from '../models/Result.js';
import logger from '../utils/logger.js';

class ResultService {
  static async createResult(resultData) {
    try {
      const existingResult = await Result.findOne({
        teamId: resultData.teamId,
        round: resultData.round
      });

      if (existingResult) {
        return {
          success: false,
          message: 'Result already exists for this team and round'
        };
      }

      const result = new Result(resultData);
      await result.save();

      return {
        success: true,
        message: 'Result created successfully',
        data: result
      };
    } catch (error) {
      logger.error('ResultService.createResult error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getResultById(resultId) {
    try {
      const result = await Result.findById(resultId);
      if (!result) {
        return {
          success: false,
          message: 'Result not found'
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      logger.error('ResultService.getResultById error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getAllResults(filters = {}, options = {}) {
    try {
      const query = Result.find(filters);
      
      if (options.limit) query.limit(options.limit);
      if (options.sort) query.sort(options.sort);
      if (options.skip) query.skip(options.skip);

      const results = await query.exec();
      const total = await Result.countDocuments(filters);

      return {
        success: true,
        data: results,
        total
      };
    } catch (error) {
      logger.error('ResultService.getAllResults error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async updateResult(resultId, updateData) {
    try {
      const result = await Result.findByIdAndUpdate(
        resultId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!result) {
        return {
          success: false,
          message: 'Result not found'
        };
      }

      return {
        success: true,
        message: 'Result updated successfully',
        data: result
      };
    } catch (error) {
      logger.error('ResultService.updateResult error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async deleteResult(resultId) {
    try {
      const result = await Result.findByIdAndDelete(resultId);
      if (!result) {
        return {
          success: false,
          message: 'Result not found'
        };
      }

      return {
        success: true,
        message: 'Result deleted successfully'
      };
    } catch (error) {
      logger.error('ResultService.deleteResult error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getResultsByRound(round, options = {}) {
    try {
      return await this.getAllResults({ round }, options);
    } catch (error) {
      logger.error('ResultService.getResultsByRound error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getResultsByTeam(teamId, options = {}) {
    try {
      return await this.getAllResults({ teamId }, options);
    } catch (error) {
      logger.error('ResultService.getResultsByTeam error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getLeaderboard(round) {
    try {
      const positionOrder = ['1st', '2nd', '3rd', 'qualified', 'disqualified'];
      
      const results = await Result.find({ round }).sort({ createdAt: 1 });
      
      const sortedResults = results.sort((a, b) => {
        return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
      });

      return {
        success: true,
        data: sortedResults
      };
    } catch (error) {
      logger.error('ResultService.getLeaderboard error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getQualifiedTeams(round) {
    try {
      const qualifiedPositions = ['1st', '2nd', '3rd', 'qualified'];
      const results = await Result.find({
        round,
        position: { $in: qualifiedPositions }
      });

      return {
        success: true,
        data: results
      };
    } catch (error) {
      logger.error('ResultService.getQualifiedTeams error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  static async getResultStats() {
    try {
      const total = await Result.countDocuments();
      const screeningTest = await Result.countDocuments({ round: 'screeningTest' });
      const preliminary = await Result.countDocuments({ round: 'preliminary' });
      const semiFinals = await Result.countDocuments({ round: 'semiFinals' });
      const finals = await Result.countDocuments({ round: 'finals' });

      return {
        success: true,
        data: {
          total,
          screeningTest,
          preliminary,
          semiFinals,
          finals
        }
      };
    } catch (error) {
      logger.error('ResultService.getResultStats error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default ResultService;