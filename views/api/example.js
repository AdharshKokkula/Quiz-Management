import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch"; // install with: npm install node-fetc
import DB from "../../db/db.js";
import logsRouter from "./logs.js"; // Correct relative path
import Routes from "./routes.js";
import Test from "./test.js";
import basicAuthRouter from "./auth/logout.js";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/api/logs", logsRouter);
app.use("/api/routes", Routes);
app.use("/api/test", Test);
app.use("/basic-auth", basicAuthRouter);

app.get("/", async (req, res) => {
  const url = "https://jsonplaceholder.typicode.com/posts";
  let data;
  let responseObj = {};

  try {
    // similar to file_get_contents in PHP
    const response = await fetch(url);
    data = await response.json();

    if (data && data.length > 0) {
      responseObj.status = 200;
      responseObj.message = "Success";
      responseObj.data = data;
    } else {
      responseObj.status = 500;
      responseObj.message = "No Data";
      responseObj.data = data;
    }
  } catch (error) {
    responseObj.status = 500;
    responseObj.message = "Error fetching data";
    responseObj.data = error.message;
  }

  res.status(responseObj.status).json(responseObj);
});

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Connect to database once on startup
    await DB.connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
