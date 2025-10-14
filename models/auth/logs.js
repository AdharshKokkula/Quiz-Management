import mongoose from "mongoose";
import User from "./users.js";

const logSchema = new mongoose.Schema(
  {
    loginId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: String,
    loggedInAt: { type: Date, default: Date.now },
    ip: String,
    os: String,
    browser: String,
    loggedOutAt: Date,
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logSchema);
export default Log;
