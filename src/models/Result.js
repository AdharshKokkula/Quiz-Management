/**
 * Result Model
 */

import mongoose from 'mongoose';
import { QUIZ_ROUNDS, RESULT_POSITIONS } from '../utils/constants.js';

const resultSchema = new mongoose.Schema({
  round: {
    type: String,
    enum: Object.values(QUIZ_ROUNDS),
    required: true
  },
  teamId: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: Object.values(RESULT_POSITIONS),
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique result per team per round
resultSchema.index({ teamId: 1, round: 1 }, { unique: true });
resultSchema.index({ round: 1 });
resultSchema.index({ position: 1 });

const Result = mongoose.model('Result', resultSchema);

export default Result;