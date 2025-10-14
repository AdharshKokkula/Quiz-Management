import express from "express";
import DB from "../../db/db.js";
import Log from "../../models/auth/logs.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check if already connected, if not connect
    if (!DB.isConnected()) {
      await DB.connect();
    }

    const data = await DB.select("Log");

    const result = {
      data: data.reverse(), // reverse directly
      status: "200",
      message: data.length > 0 ? "Success" : "No logs found",
      count: data.length,
    };

    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(result);
  } catch (err) {
    console.error("Logs API Error:", err);
    res.status(500).json({
      status: "500",
      message: err.message,
      data: [],
    });
  }
});

export default router;
