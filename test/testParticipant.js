import dotenv from "dotenv";
import mongoose from "mongoose";
import { Participant } from "../models/quiz/participants.js"; // adjust path
import DB from "../db/db.js";

dotenv.config();

const runTest = async () => {
  try {
 
    await DB.connect();
    console.log(" Connected to MongoDB");

    const newParticipant = new Participant({
      teamID: "T003", // optional
      name: "Ravi Kumar",
      email: "ravi@example.com",
      phone: "9876543210",
      dob: new Date("2005-05-12"),
      class: "10th",
      school: "Sunrise Public School",
      homeTown: "Pune",
      fatherName: "Rajesh Kumar",
      type: "individual",
    });


    const savedParticipant = await newParticipant.save();
    console.log(" Saved Participant:", savedParticipant);

   
    const participants = await Participant.find();
    console.log(`📋 All Participants (${participants.length}):`, participants);
  } catch (err) {
    console.error(" Error occurred:", err.message);
  } finally {
   
    await mongoose.connection.close();
    console.log(" MongoDB connection closed.");
  }
};

runTest();
