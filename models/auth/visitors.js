import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true, 
    },
    ip: {
      type: String,
      required: true,
    },
    os: {
      type: String,
    },
    browser: {
      type: String,
    },
    visitedAt: {
      type: Date, 
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
