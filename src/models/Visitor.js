/**
 * Visitor Model
 */

import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true
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
  visitedAt: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
visitorSchema.index({ visitorId: 1 });
visitorSchema.index({ ip: 1 });
visitorSchema.index({ visitedAt: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;