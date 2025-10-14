/**
 * Result Service - Handles all quiz result-related database operations
 * Manages quiz results across different rounds and positions
 */

import { Result } from "../../models/quiz/results.js";
import DB from "../../db/db.js";
import Validator from "../../models/validator.js";

class ResultService {
  /**
   * Create a new result
   * @param {Object} resultData - Result data object
   * @param {string} resultData.round - Quiz round (screeningTest, preliminary, semiFinals, finals)
   * @param {string} resultData.teamId - Team ID
   * @param {string} resultData.position - Position (1st, 2nd, 3rd, qualified, disqualified)
   * @returns {Promise<Object>} Created result object or error
   */
  static async createResult(resultData) {
    try {
      // Validate input data
      const validation = this.validateResultData(resultData, true);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Check if result already exists for this team and round
      const existingResult = await this.getResultByTeamAndRound(
        resultData.teamId,
        resultData.round
      );
      if (existingResult.success) {
        return {
          success: false,
          message: "Result already exists for this team and round",
        };
      }

      // Create result using DB service
      const newResult = await DB.insert("Result", resultData);

      return {
        success: true,
        message: "Result created successfully",
        data: newResult,
      };
    } catch (error) {
      console.error("ResultService.createResult Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get result by ID
   * @param {string} resultId - Result ID
   * @returns {Promise<Object>} Result object or error
   */
  static async getResultById(resultId) {
    try {
      const results = await DB.select("Result", { _id: resultId });

      if (results.length === 0) {
        return {
          success: false,
          message: "Result not found",
        };
      }

      return {
        success: true,
        data: results[0],
      };
    } catch (error) {
      console.error("ResultService.getResultById Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get result by team ID and round
   * @param {string} teamId - Team ID
   * @param {string} round - Quiz round
   * @returns {Promise<Object>} Result object or error
   */
  static async getResultByTeamAndRound(teamId, round) {
    try {
      const results = await DB.select("Result", { teamId, round });

      if (results.length === 0) {
        return {
          success: false,
          message: "Result not found",
        };
      }

      return {
        success: true,
        data: results[0],
      };
    } catch (error) {
      console.error("ResultService.getResultByTeamAndRound Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all results with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Query options (limit, sort, etc.)
   * @returns {Promise<Object>} Array of results or error
   */
  static async getAllResults(filters = {}, options = {}) {
    try {
      const results = await DB.select("Result", filters, options);

      return {
        success: true,
        data: results,
        count: results.length,
      };
    } catch (error) {
      console.error("ResultService.getAllResults Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update result by ID
   * @param {string} resultId - Result ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated result object or error
   */
  static async updateResult(resultId, updateData) {
    try {
      // Validate update data
      const validation = this.validateResultData(updateData, false);
      if (validation.error) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errorMsgs,
        };
      }

      // Update result
      const modifiedCount = await DB.update("Result", updateData, {
        _id: resultId,
      });

      if (modifiedCount === 0) {
        return {
          success: false,
          message: "Result not found or no changes made",
        };
      }

      // Get updated result
      const updatedResult = await this.getResultById(resultId);

      return {
        success: true,
        message: "Result updated successfully",
        data: updatedResult.data,
      };
    } catch (error) {
      console.error("ResultService.updateResult Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete result by ID
   * @param {string} resultId - Result ID
   * @returns {Promise<Object>} Success message or error
   */
  static async deleteResult(resultId) {
    try {
      // Since there's no soft delete for results, we'll use direct deletion
      const Result = (await import("../../models/quiz/results.js")).Result;
      const deleteResult = await Result.findByIdAndDelete(resultId);

      if (!deleteResult) {
        return {
          success: false,
          message: "Result not found",
        };
      }

      return {
        success: true,
        message: "Result deleted successfully",
      };
    } catch (error) {
      console.error("ResultService.deleteResult Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get results by round
   * @param {string} round - Quiz round
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of results or error
   */
  static async getResultsByRound(round, options = {}) {
    try {
      return await this.getAllResults({ round }, options);
    } catch (error) {
      console.error("ResultService.getResultsByRound Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get results by team ID
   * @param {string} teamId - Team ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of results or error
   */
  static async getResultsByTeam(teamId, options = {}) {
    try {
      return await this.getAllResults({ teamId }, options);
    } catch (error) {
      console.error("ResultService.getResultsByTeam Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get results by position
   * @param {string} position - Position
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Array of results or error
   */
  static async getResultsByPosition(position, options = {}) {
    try {
      return await this.getAllResults({ position }, options);
    } catch (error) {
      console.error("ResultService.getResultsByPosition Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get qualified teams for next round
   * @param {string} currentRound - Current round
   * @returns {Promise<Object>} Array of qualified teams or error
   */
  static async getQualifiedTeams(currentRound) {
    try {
      const qualifiedResults = await this.getAllResults({
        round: currentRound,
        position: { $in: ["1st", "2nd", "3rd", "qualified"] },
      });

      if (!qualifiedResults.success) {
        return qualifiedResults;
      }

      const qualifiedTeams = qualifiedResults.data.map((result) => ({
        teamId: result.teamId,
        position: result.position,
        round: result.round,
      }));

      return {
        success: true,
        data: qualifiedTeams,
        count: qualifiedTeams.length,
      };
    } catch (error) {
      console.error("ResultService.getQualifiedTeams Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get leaderboard for a round
   * @param {string} round - Quiz round
   * @returns {Promise<Object>} Sorted leaderboard or error
   */
  static async getLeaderboard(round) {
    try {
      const options = {
        sort: { position: 1 }, // Sort by position (1st, 2nd, 3rd, etc.)
      };

      const results = await this.getResultsByRound(round, options);

      if (!results.success) {
        return results;
      }

      // Custom sort to ensure proper order
      const positionOrder = ["1st", "2nd", "3rd", "qualified", "disqualified"];
      const sortedResults = results.data.sort((a, b) => {
        return (
          positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
        );
      });

      return {
        success: true,
        data: sortedResults,
        count: sortedResults.length,
      };
    } catch (error) {
      console.error("ResultService.getLeaderboard Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get result statistics
   * @returns {Promise<Object>} Result statistics or error
   */
  static async getResultStats() {
    try {
      const totalResults = await DB.count("Result");
      const screeningResults = await DB.count("Result", {
        round: "screeningTest",
      });
      const preliminaryResults = await DB.count("Result", {
        round: "preliminary",
      });
      const semiFinalResults = await DB.count("Result", {
        round: "semiFinals",
      });
      const finalResults = await DB.count("Result", { round: "finals" });

      return {
        success: true,
        data: {
          total: totalResults,
          screeningTest: screeningResults,
          preliminary: preliminaryResults,
          semiFinals: semiFinalResults,
          finals: finalResults,
        },
      };
    } catch (error) {
      console.error("ResultService.getResultStats Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Validate result data
   * @param {Object} resultData - Result data to validate
   * @param {boolean} isCreate - Whether this is for create operation
   * @returns {Object} Validation result
   */
  static validateResultData(resultData, isCreate = false) {
    const fields = {};

    if (resultData.round !== undefined) {
      fields.round = {
        value: resultData.round,
        rules: [
          {
            type: "custom",
            validate: (value) =>
              ["screeningTest", "preliminary", "semiFinals", "finals"].includes(
                value
              ),
            message:
              "Round must be screeningTest, preliminary, semiFinals, or finals",
          },
        ],
      };
    }

    if (resultData.teamId !== undefined) {
      fields.teamId = {
        value: resultData.teamId,
        rules: [{ type: "required", message: "Team ID is required" }],
      };
    }

    if (resultData.position !== undefined) {
      fields.position = {
        value: resultData.position,
        rules: [
          {
            type: "custom",
            validate: (value) =>
              ["1st", "2nd", "3rd", "qualified", "disqualified"].includes(
                value
              ),
            message:
              "Position must be 1st, 2nd, 3rd, qualified, or disqualified",
          },
        ],
      };
    }

    return Validator.validate(fields);
  }
}

export default ResultService;
