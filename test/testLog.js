import dotenv from "dotenv";
import mongoose from "mongoose";
import DB from "../db/db.js";              // Your DB connection helper
import User from "../models/auth/users.js";
import Log from "../models/auth/logs.js";

dotenv.config();

const runTest = async () => {
  try {
    await DB.connect();
    console.log(" Connected to MongoDB");

   
    await Log.deleteMany({});
    console.log(" Old logs deleted");

    
    const uniqueEmail = `user_${Date.now()}@example.com`;
    const testUser = await User.create({
      email: uniqueEmail,
      phone: "9999999999",
      name: "Test User",
      password: "hashedpassword123",
      role: "user",
      status: "verified",
    });
    console.log(" Test user created:", {
      _id: testUser._id,
      email: testUser.email,
    });

    
    const newLog = new Log({
      loginId: testUser._id,   
      email: testUser.email,
      ip: "192.168.1.1",
      os: "Windows 11",
      browser: "Chrome",
    });

    const savedLog = await newLog.save();
    console.log(" Log saved successfully:", {
      _id: savedLog._id,
      loginId: savedLog.loginId,
      loggedInAt: savedLog.loggedInAt,
    });

    
    const logs = await Log.find().populate("loginId", "name email role");
    console.log(` All Logs (${logs.length}):`, logs.map(l => ({
      _id: l._id,
      user: l.loginId,
      loggedInAt: l.loggedInAt,
      loggedOutAt: l.loggedOutAt,
    })));

   
    const updatedLog = await Log.findByIdAndUpdate(
      savedLog._id,
      { loggedOutAt: new Date() },
      { new: true }
    );
    console.log(" Log after logout:", {
      _id: updatedLog._id,
      loggedOutAt: updatedLog.loggedOutAt,
    });

  } catch (err) {
    console.error(" Error occurred:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log(" MongoDB connection closed.");
  }
};

runTest();
