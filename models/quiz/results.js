import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  round: {
    type: String,
    enum: ["screeningTest", "preliminary", "semiFinals", "finals"],
  },
  teamId: {
    type: String,
  },
  position: {
    type: String,
    enum: ["1st", "2nd", "3rd", "qualified", "disqualified"],
  },
});

export const Result = mongoose.model("Result", resultSchema);
