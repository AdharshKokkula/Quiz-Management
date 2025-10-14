import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
  },
  moderatorEmail: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  coordinatorEmail: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now, 
  },
  status: {
    type: String,
    enum: ["verified", "pending", "deleted"],
    default: "pending",
  },
});

export const School = mongoose.model("School", schoolSchema);
