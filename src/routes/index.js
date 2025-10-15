/**
 * Main Routes Index
 */

import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import participantRoutes from './participant.routes.js';
import resultRoutes from './result.routes.js';
import schoolRoutes from './school.routes.js';
import trackingRoutes from './tracking.routes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Quiz Management API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/participants', participantRoutes);
router.use('/results', resultRoutes);
router.use('/schools', schoolRoutes);
router.use('/tracking', trackingRoutes);

// API documentation
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Quiz Management System API',
    version: '1.0.0',
    documentation: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password',
        refresh: 'POST /api/auth/refresh',
        verify: 'GET /api/auth/verify'
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:userId',
        create: 'POST /api/users',
        update: 'PUT /api/users/:userId',
        delete: 'DELETE /api/users/:userId',
        verify: 'PUT /api/users/:userId/verify',
        changeRole: 'PUT /api/users/:userId/role',
        resetPassword: 'PUT /api/users/:userId/reset-password',
        getByRole: 'GET /api/users/role/:role',
        search: 'GET /api/users/search',
        stats: 'GET /api/users/stats'
      },
      participants: {
        register: 'POST /api/participants',
        getAll: 'GET /api/participants',
        getById: 'GET /api/participants/:participantId',
        update: 'PUT /api/participants/:participantId',
        delete: 'DELETE /api/participants/:participantId',
        verify: 'PUT /api/participants/:participantId/verify',
        bulkVerify: 'PUT /api/participants/bulk-verify',
        getByStatus: 'GET /api/participants/status/:status',
        getByType: 'GET /api/participants/type/:type',
        getBySchool: 'GET /api/participants/school/:school',
        search: 'GET /api/participants/search',
        stats: 'GET /api/participants/stats'
      },
      results: {
        getAll: 'GET /api/results',
        getById: 'GET /api/results/:resultId',
        create: 'POST /api/results',
        update: 'PUT /api/results/:resultId',
        delete: 'DELETE /api/results/:resultId',
        getByRound: 'GET /api/results/round/:round',
        getByTeam: 'GET /api/results/team/:teamId',
        leaderboard: 'GET /api/results/round/:round/leaderboard',
        qualified: 'GET /api/results/round/:round/qualified',
        stats: 'GET /api/results/stats'
      },
      schools: {
        getAll: 'GET /api/schools',
        getById: 'GET /api/schools/:schoolId',
        create: 'POST /api/schools',
        update: 'PUT /api/schools/:schoolId',
        delete: 'DELETE /api/schools/:schoolId',
        verify: 'PUT /api/schools/:schoolId/verify',
        assignCoordinator: 'PUT /api/schools/:schoolId/coordinator',
        getByStatus: 'GET /api/schools/status/:status',
        getByCity: 'GET /api/schools/city/:city',
        stats: 'GET /api/schools/stats'
      },
      tracking: {
        trackVisit: 'POST /api/tracking/visit',
        getVisitors: 'GET /api/tracking/visitors',
        visitorStats: 'GET /api/tracking/visitors/stats',
        getLogs: 'GET /api/tracking/logs',
        loginStats: 'GET /api/tracking/logs/stats',
        activeSessions: 'GET /api/tracking/sessions/active'
      }
    },
    roles: {
      admin: 'Full system access',
      moderator: 'User and participant management',
      coordinator: 'Participant management',
      user: 'Limited access'
    }
  });
});

export default router;