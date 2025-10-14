import dotenv from "dotenv";
import mongoose from "mongoose";
import { Result } from "../models/quiz/results.js"; // adjust path if needed
import DB from "../db/db.js";

dotenv.config();

const runTest = async () => {
  try {
   
     await DB.connect(); 
    console.log("Connected ");
   
    const newResult = new Result({
      round: "preliminary",
      teamId: "T001",
      position: "qualified",
    });

   
    const savedResult = await newResult.save();
    console.log(" Saved Result:", savedResult);

   
    const results = await Result.find();
    console.log(` All Results (${results.length}):`, results);
  } catch (err) {
    console.error(" Error occurred:", err.message);
  } finally {
    // 5️⃣ Close DB connection
    await mongoose.connection.close();
    console.log(" MongoDB connection closed.");
  }
};

runTest();
