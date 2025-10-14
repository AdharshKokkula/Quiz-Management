/**
 * Main API Routes Index
 * Combines all route modules into a single router
 */

import express from "express";
import authRoutes from "./auth/authRoutes.js";
import userRoutes from "./auth/userRoutes.js";
import participantRoutes from "./quiz/participantRoutes.js";

const router = express.Router();

// API Health Check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Quiz Management API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Authentication routes
router.use("/auth", authRoutes);

// User management routes
router.use("/users", userRoutes);

// Quiz participant routes
router.use("/participants", participantRoutes);

// API Documentation endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Quiz Management System API",
    version: "1.0.0",
    documentation: {
      authentication: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        logout: "POST /api/auth/logout",
        profile: "GET /api/auth/profile",
        updateProfile: "PUT /api/auth/profile",
        changePassword: "PUT /api/auth/change-password",
        refresh: "POST /api/auth/refresh",
        verify: "GET /api/auth/verify",
        loginHistory: "GET /api/auth/login-history",
      },
      users: {
        getAll: "GET /api/users",
        getById: "GET /api/users/:userId",
        create: "POST /api/users",
        update: "PUT /api/users/:userId",
        delete: "DELETE /api/users/:userId",
        verify: "PUT /api/users/:userId/verify",
        changeRole: "PUT /api/users/:userId/role",
        resetPassword: "PUT /api/users/:userId/reset-password",
        getByRole: "GET /api/users/role/:role",
        search: "GET /api/users/search",
        stats: "GET /api/users/stats",
      },
      participants: {
        register: "POST /api/participants",
        getAll: "GET /api/participants",
        getById: "GET /api/participants/:participantId",
        update: "PUT /api/participants/:participantId",
        delete: "DELETE /api/participants/:participantId",
        verify: "PUT /api/participants/:participantId/verify",
        bulkVerify: "PUT /api/participants/bulk-verify",
        getByStatus: "GET /api/participants/status/:status",
        getByType: "GET /api/participants/type/:type",
        getBySchool: "GET /api/participants/school/:school",
        getByTeam: "GET /api/participants/team/:teamID",
        search: "GET /api/participants/search",
        stats: "GET /api/participants/stats",
      },
    },
    roles: {
      admin: "Full system access",
      moderator: "User and participant management",
      coordinator: "Participant management",
      user: "Limited access",
    },
  });
});

// 404 handler for undefined API routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

export default router;
