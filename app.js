/**
 * Quiz Management System - Main Application
 * A comprehensive CRUD system for managing quiz participants, users, and results
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Import database and routes
import DB from "./db/db.js";
import apiRoutes from "./routes/index.js";

// Import existing API routes for backward compatibility
import logsRouter from "./views/api/logs.js";
import routesRouter from "./views/api/routes.js";
import testRouter from "./views/api/test.js";
import basicAuthRouter from "./views/api/auth/logout.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quiz Management System API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      api: "/api",
      health: "/api/health",
      docs: "/api",
    },
  });
});

// New comprehensive API routes
app.use("/api", apiRoutes);

// Legacy API routes (for backward compatibility)
app.use("/api/logs", logsRouter);
app.use("/api/routes", routesRouter);
app.use("/api/test", testRouter);
app.use("/basic-auth", basicAuthRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Graceful shutdown handler
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await DB.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await DB.close();
  process.exit(0);
});

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Connect to database once on startup
    await DB.connect();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(
        `✅ Quiz Management System running on http://localhost:${PORT}`
      );
      console.log(
        `📚 API Documentation available at http://localhost:${PORT}/api`
      );
      console.log(
        `🏥 Health Check available at http://localhost:${PORT}/api/health`
      );

      if (process.env.NODE_ENV !== "production") {
        console.log("🔧 Development mode - detailed logging enabled");
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
