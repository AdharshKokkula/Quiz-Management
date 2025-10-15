/**
 * Participant Model
 */

import mongoose from 'mongoose';
import { PARTICIPANT_STATUS, PARTICIPANT_TYPES } from '../utils/constants.js';

const participantSchema = new mongoose.Schema({
  teamID: {
    type: String,
    sparse: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => !v || /^[6-9][0-9]{9}$/.test(v),
      message: 'Phone number must be a valid 10-digit Indian number'
    }
  },
  dob: {
    type: Date
  },
  class: {
    type: String,
    trim: true
  },
  school: {
    type: String,
    trim: true
  },
  homeTown: {
    type: String,
    trim: true
  },
  fatherName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: Object.values(PARTICIPANT_STATUS),
    default: PARTICIPANT_STATUS.PENDING
  },
  type: {
    type: String,
    enum: Object.values(PARTICIPANT_TYPES),
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date
  },
  verifiedBy: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
participantSchema.index({ email: 1 });
participantSchema.index({ status: 1 });
participantSchema.index({ type: 1 });
participantSchema.index({ school: 1 });
participantSchema.index({ teamID: 1 });

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;