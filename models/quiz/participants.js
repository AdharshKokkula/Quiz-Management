import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  teamID: {
    type: String, // optional
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => /^\d{10}$/.test(v), // ensure 10-digit phone number
      message: "Phone number must be 10 digits",
    },
  },
  dob: {
    type: Date,
  },
  class: {
    type: String,
  },
  school: {
    type: String,
  },
  homeTown: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  status: {
    type: String,
    enum: ["verified", "pending", "deleted"],
    default: "pending",
  },
  type: {
    type: String,
    enum: ["individual", "school"],
  },
  registeredAt: {
    type: Date,
    default: Date.now, 
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: String,
  },
});

export const Participant = mongoose.model("Participant", participantSchema);
