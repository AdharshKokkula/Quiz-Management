import dotenv from "dotenv";
import mongoose from "mongoose";
import DB from "../db/db.js"; 
import { School } from "../models/quiz/schools.js"; 

dotenv.config();

const runTest = async () => {
  try {
   
    await DB.connect();
    console.log(" Connected to MongoDB");

    
    const newSchool = new School({
      name: "Sunrise Public School",
      moderatorEmail: "moderator1@sunrise.com",
      city: "Pune",
      coordinatorEmail: "coordinator@sunrise.com",
    });

    const savedSchool = await newSchool.save();
    console.log(" Saved School:", savedSchool);

    
    const schools = await School.find();
    console.log(`All Schools (${schools.length}):`);
    console.dir(schools, { depth: null });
  } catch (err) {
    console.error(" Error occurred:", err.message);
  } finally {
    
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed.");
  }
};

runTest();
