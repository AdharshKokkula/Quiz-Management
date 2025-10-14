import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to routes.json in project root
const dataPath = path.join(__dirname, "../../routes.json");

router.get("/", async (req, res) => {
  try {
    const fileData = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(fileData);

    res.json({
      status: data.length > 0 ? "200" : "500",
      message: data.length > 0 ? "Success" : "No Routes",
      data: data.reverse(),
    });
  } catch (err) {
    console.error("Error reading routes.json:", err);
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
      data: [],
    });
  }
});

export default router;
