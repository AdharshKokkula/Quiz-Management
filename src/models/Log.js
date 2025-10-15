/**
 * Log Model
 */

import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  loginId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  loggedInAt: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
    required: true
  },
  os: {
    type: String
  },
  browser: {
    type: String
  },
  loggedOutAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
logSchema.index({ loginId: 1 });
logSchema.index({ email: 1 });
logSchema.index({ loggedInAt: -1 });
logSchema.index({ ip: 1 });

const Log = mongoose.model('Log', logSchema);

export default Log;