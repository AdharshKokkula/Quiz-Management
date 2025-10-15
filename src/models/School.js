/**
 * School Model
 */

import mongoose from 'mongoose';
import { USER_STATUS } from '../utils/constants.js';

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200
  },
  moderatorEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  coordinatorEmail: {
    type: String,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.PENDING
  }
}, {
  timestamps: true
});

// Indexes for better query performance
schoolSchema.index({ name: 1 });
schoolSchema.index({ moderatorEmail: 1 });
schoolSchema.index({ coordinatorEmail: 1 });
schoolSchema.index({ status: 1 });
schoolSchema.index({ city: 1 });

const School = mongoose.model('School', schoolSchema);

export default School;