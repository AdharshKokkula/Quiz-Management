# Quiz Management System - API Endpoints Reference

## Complete API Endpoints Table

| Route / URL | HTTP Method | Description / Purpose | Access Level | Required Role | Request Body | Query Parameters | Response Type |
|-------------|-------------|----------------------|--------------|---------------|--------------|------------------|---------------|
| **AUTHENTICATION ENDPOINTS** |
| `/api/auth/register` | POST | Register new user account | Public | None | `{name, email, phone, password}` | None | User object + JWT token |
| `/api/auth/login` | POST | User login authentication | Public | None | `{email, password}` | None | User object + JWT token |
| `/api/auth/logout` | POST | User logout (invalidate token) | Protected | Any authenticated | None | None | Success message |
| `/api/auth/profile` | GET | Get current user profile | Protected | Any authenticated | None | None | User profile object |
| `/api/auth/profile` | PUT | Update current user profile | Protected | Any authenticated | `{name?, phone?}` | None | Updated user object |
| `/api/auth/change-password` | PUT | Change user password | Protected | Any authenticated | `{currentPassword, newPassword}` | None | Success message |
| `/api/auth/refresh` | POST | Refresh JWT token | Protected | Any authenticated | None | None | New JWT token |
| `/api/auth/verify` | GET | Verify token validity | Protected | Any authenticated | None | None | Token status |
| **USER MANAGEMENT ENDPOINTS** |
| `/api/users` | GET | Get all users with pagination | Protected | Moderator+ | None | `page, limit, role, status, search` | Users array + pagination |
| `/api/users/:userId` | GET | Get specific user by ID | Protected | Self or Admin | None | None | User object |
| `/api/users` | POST | Create new user account | Protected | Admin | `{name, email, phone, password, role}` | None | Created user object |
| `/api/users/:userId` | PUT | Update user information | Protected | Self or Admin | `{name?, email?, phone?}` | None | Updated user object |
| `/api/users/:userId` | DELETE | Delete user (soft delete) | Protected | Admin | None | None | Success message |
| `/api/users/:userId/verify` | PUT | Verify user account status | Protected | Moderator+ | None | None | Success message |
| `/api/users/:userId/role` | PUT | Change user role | Protected | Admin | `{role}` | None | Updated user object |
| `/api/users/:userId/reset-password` | PUT | Reset user password | Protected | Admin | `{newPassword}` | None | Success message |
| `/api/users/role/:role` | GET | Get users by specific role | Protected | Moderator+ | None | `page, limit` | Users array |
| `/api/users/search` | GET | Search users by query | Protected | Moderator+ | None | `q, role, page, limit` | Users array |
| `/api/users/stats` | GET | Get user statistics | Protected | Moderator+ | None | None | Statistics object |
| **PARTICIPANT MANAGEMENT ENDPOINTS** |
| `/api/participants` | POST | Register new participant | Public | None | `{name, email, phone, school, class, type}` | None | Participant object |
| `/api/participants` | GET | Get all participants | Protected | Coordinator+ | None | `page, limit, status, type, school, search` | Participants array + pagination |
| `/api/participants/:participantId` | GET | Get specific participant | Protected | Coordinator+ | None | None | Participant object |
| `/api/participants/:participantId` | PUT | Update participant info | Protected | Coordinator+ | `{name?, email?, phone?, school?, class?}` | None | Updated participant |
| `/api/participants/:participantId` | DELETE | Delete participant | Protected | Moderator+ | None | None | Success message |
| `/api/participants/:participantId/verify` | PUT | Verify participant | Protected | Coordinator+ | None | None | Success message |
| `/api/participants/bulk-verify` | PUT | Bulk verify participants | Protected | Moderator+ | `{participantIds: []}` | None | Success message |
| `/api/participants/status/:status` | GET | Get participants by status | Protected | Coordinator+ | None | `page, limit` | Participants array |
| `/api/participants/type/:type` | GET | Get participants by type | Protected | Coordinator+ | None | `page, limit` | Participants array |
| `/api/participants/school/:school` | GET | Get participants by school | Protected | Coordinator+ | None | `page, limit` | Participants array |
| `/api/participants/search` | GET | Search participants | Protected | Coordinator+ | None | `q, status, type, school` | Participants array |
| `/api/participants/stats` | GET | Get participant statistics | Protected | Coordinator+ | None | None | Statistics object |
| **SCHOOL MANAGEMENT ENDPOINTS** |
| `/api/schools` | GET | Get all schools | Protected | Coordinator+ | None | `page, limit, status, city` | Schools array + pagination |
| `/api/schools/:schoolId` | GET | Get specific school | Protected | Coordinator+ | None | None | School object |
| `/api/schools` | POST | Create new school | Protected | Moderator+ | `{name, moderatorEmail, coordinatorEmail?, city}` | None | Created school object |
| `/api/schools/:schoolId` | PUT | Update school information | Protected | Moderator+ | `{name?, moderatorEmail?, coordinatorEmail?, city?}` | None | Updated school object |
| `/api/schools/:schoolId` | DELETE | Delete school | Protected | Admin | None | None | Success message |
| `/api/schools/:schoolId/verify` | PUT | Verify school status | Protected | Moderator+ | None | None | Success message |
| `/api/schools/:schoolId/coordinator` | PUT | Assign coordinator to school | Protected | Moderator+ | `{coordinatorEmail}` | None | Updated school object |
| `/api/schools/status/:status` | GET | Get schools by status | Protected | Coordinator+ | None | `page, limit` | Schools array |
| `/api/schools/city/:city` | GET | Get schools by city | Protected | Coordinator+ | None | `page, limit` | Schools array |
| `/api/schools/stats` | GET | Get school statistics | Protected | Coordinator+ | None | None | Statistics object |
| **RESULT MANAGEMENT ENDPOINTS** |
| `/api/results` | GET | Get all results | Protected | Coordinator+ | None | `page, limit, round, teamId` | Results array + pagination |
| `/api/results/:resultId` | GET | Get specific result | Protected | Coordinator+ | None | None | Result object |
| `/api/results` | POST | Create new result | Protected | Moderator+ | `{round, teamId, position, score?, notes?}` | None | Created result object |
| `/api/results/:resultId` | PUT | Update result information | Protected | Moderator+ | `{position?, score?, notes?}` | None | Updated result object |
| `/api/results/:resultId` | DELETE | Delete result | Protected | Moderator+ | None | None | Success message |
| `/api/results/round/:round` | GET | Get results by round | Protected | Coordinator+ | None | `page, limit` | Results array |
| `/api/results/team/:teamId` | GET | Get results by team | Protected | Coordinator+ | None | None | Results array |
| `/api/results/round/:round/leaderboard` | GET | Get leaderboard for round | Protected | Coordinator+ | None | `limit` | Leaderboard array |
| `/api/results/round/:round/qualified` | GET | Get qualified teams | Protected | Coordinator+ | None | None | Qualified teams array |
| `/api/results/stats` | GET | Get result statistics | Protected | Coordinator+ | None | None | Statistics object |
| **TRACKING ENDPOINTS** |
| `/api/tracking/visit` | POST | Track visitor activity | Public | None | `{page, userAgent?, ipAddress?}` | None | Success message |
| `/api/tracking/visitors` | GET | Get visitor logs | Protected | Moderator+ | None | `page, limit, startDate, endDate` | Visitors array |
| `/api/tracking/visitors/stats` | GET | Get visitor statistics | Protected | Moderator+ | None | `period` | Visitor statistics |
| `/api/tracking/logs` | GET | Get system logs | Protected | Moderator+ | None | `page, limit, level, startDate, endDate` | Logs array |
| `/api/tracking/logs/stats` | GET | Get log statistics | Protected | Moderator+ | None | `period` | Log statistics |
| `/api/tracking/sessions/active` | GET | Get active user sessions | Protected | Moderator+ | None | None | Active sessions array |
| **UTILITY ENDPOINTS** |
| `/api/health` | GET | API health check | Public | None | None | None | Health status object |
| `/api` | GET | API documentation | Public | None | None | None | API documentation object |

## Access Level Definitions

| Access Level | Description | Authentication Required |
|--------------|-------------|------------------------|
| **Public** | No authentication required | ❌ |
| **Protected** | JWT token required | ✅ |

## Role Hierarchy

| Role | Level | Access Permissions |
|------|-------|-------------------|
| **Admin** | 4 | Full system access, user management, role changes |
| **Moderator** | 3 | User verification, participant management, bulk operations |
| **Coordinator** | 2 | Participant management, verification |
| **User** | 1 | Basic access, profile management |

## Common Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number for pagination | 1 |
| `limit` | number | Items per page | 10 |
| `search` | string | Search query for filtering | - |
| `status` | string | Filter by status (verified/pending/deleted) | - |
| `startDate` | date | Start date for date range filtering | - |
| `endDate` | date | End date for date range filtering | - |

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* Response data */ },
  "pagination": { /* Pagination info (if applicable) */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Authentication Header Format

```http
Authorization: Bearer <jwt-token>
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per 15 minutes
- **Public endpoints**: 50 requests per 15 minutes

---

*Total Endpoints: 47*  
*Last Updated: [Current Date]*  
*API Version: 1.0.0*