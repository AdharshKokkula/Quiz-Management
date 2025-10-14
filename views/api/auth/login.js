import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import DB from "../../../db/db.js"; // Correct path

// MongoDB User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Auth Controller
class Auth {
  async login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) return { status: 404, message: "User not found" };

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return { status: 401, message: "Invalid password" };

      return { status: 200, message: "Login successful", user };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  }
}

// Express Setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const auth = new Auth();
  const result = await auth.login(email, password);
  res.status(result.status).json(result);
});

// Connect DB and Start Server
const startServer = async () => {
  await DB.connect(); 
  console.log("✅ Connected to MongoDB");

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
