# Quiz Management System API Documentation

## Overview

The Quiz Management System API provides comprehensive endpoints for managing quiz participants, users, schools, and results with role-based authentication and authorization.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Roles

- **Admin**: Full system access
- **Moderator**: User and participant management
- **Coordinator**: Participant management
- **User**: Limited access

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation description",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

Error responses include:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update profile
- `PUT /auth/change-password` - Change password

### Users
- `GET /users` - Get all users (Moderator+)
- `POST /users` - Create user (Admin)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin)

### Participants
- `POST /participants` - Register participant (Public)
- `GET /participants` - Get all participants (Coordinator+)
- `GET /participants/:id` - Get participant by ID
- `PUT /participants/:id` - Update participant
- `DELETE /participants/:id` - Delete participant (Moderator+)

### Results
- `GET /results` - Get all results (Coordinator+)
- `POST /results` - Create result (Moderator+)
- `GET /results/round/:round/leaderboard` - Get leaderboard

### Schools
- `GET /schools` - Get all schools (Coordinator+)
- `POST /schools` - Create school (Moderator+)
- `PUT /schools/:id/verify` - Verify school (Moderator+)

For detailed endpoint documentation, visit `/api` when the server is running.