# Quiz Management System - Comprehensive Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Directory Structure](#architecture--directory-structure)
3. [Environment Setup](#environment-setup)
4. [Authentication & Middleware](#authentication--middleware)
5. [API Endpoints Documentation](#api-endpoints-documentation)
6. [Database Models](#database-models)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Deployment](#deployment)

---

## Project Overview

The Quiz Management System is a comprehensive Node.js/Express.js REST API designed to manage quiz participants, users, schools, and results with robust role-based authentication and authorization.

### Key Features
- **Complete CRUD Operations** for all entities
- **Role-Based Access Control** (Admin, Moderator, Coordinator, User)
- **JWT Authentication** with secure token management
- **Input Validation** and sanitization
- **Rate Limiting** and security middleware
- **Comprehensive Logging** with Winston
- **Search and Filtering** capabilities
- **Bulk Operations** support
- **Statistics and Analytics** endpoints

### Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Custom validation middleware
- **Testing**: Jest, Supertest

---

## Architecture & Directory Structure

```
quiz-management-system/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   ├── database.js          # MongoDB connection setup
│   │   ├── jwt.js               # JWT configuration
│   │   ├── cors.js              # CORS settings
│   │   └── index.js             # Main config aggregator
│   ├── controllers/              # Request handlers
│   │   ├── auth/                # Authentication controllers
│   │   │   ├── auth.controller.js    # Login, register, profile
│   │   │   └── user.controller.js    # User management
│   │   ├── quiz/                # Quiz-related controllers
│   │   │   ├── participant.controller.js  # Participant management
│   │   │   ├── result.controller.js       # Quiz results
│   │   │   └── school.controller.js       # School management
│   │   └── tracking/            # Analytics controllers
│   │       └── visitor.controller.js     # Visitor tracking
│   ├── middleware/              # Custom middleware
│   │   ├── auth.middleware.js   # Authentication & authorization
│   │   ├── validation.middleware.js  # Input validation
│   │   ├── error.middleware.js  # Error handling
│   │   └── rate-limit.middleware.js  # Rate limiting
│   ├── models/                  # Database schemas
│   │   ├── User.js              # User model
│   │   ├── Participant.js       # Participant model
│   │   ├── Result.js            # Quiz result model
│   │   ├── School.js            # School model
│   │   ├── Log.js               # Login log model
│   │   └── Visitor.js           # Visitor tracking model
│   ├── routes/                  # API route definitions
│   │   ├── auth.routes.js       # Authentication routes
│   │   ├── user.routes.js       # User management routes
│   │   ├── participant.routes.js # Participant routes
│   │   ├── result.routes.js     # Result routes
│   │   ├── school.routes.js     # School routes
│   │   ├── tracking.routes.js   # Tracking routes
│   │   └── index.js             # Route aggregator
│   ├── services/                # Business logic layer
│   │   ├── auth.service.js      # Authentication logic
│   │   ├── user.service.js      # User operations
│   │   ├── participant.service.js # Participant operations
│   │   ├── result.service.js    # Result operations
│   │   ├── school.service.js    # School operations
│   │   └── tracking.service.js  # Tracking operations
│   ├── utils/                   # Utility functions
│   │   ├── logger.js            # Winston logger setup
│   │   ├── validator.js         # Custom validation functions
│   │   ├── response.js          # Response formatting
│   │   └── constants.js         # Application constants
│   └── app.js                   # Express app configuration
├── tests/                       # Test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── fixtures/                # Test data
├── docs/                        # Documentation
├── scripts/                     # Utility scripts
│   ├── migrate.js               # Database migration
│   ├── seed.js                  # Database seeding
│   └── test-endpoints.js        # Endpoint testing
├── logs/                        # Log files
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
└── README.md                    # Project README
```

### Directory Purpose Explanation

#### `/src/config/`
Contains all configuration files for database, JWT, CORS, and other settings. Centralizes environment-specific configurations.

#### `/src/controllers/`
Houses request handlers that process HTTP requests, validate input, call services, and return responses. Organized by feature domains.

#### `/src/middleware/`
Custom middleware functions for authentication, validation, error handling, and rate limiting. Applied across routes as needed.

#### `/src/models/`
Mongoose schemas defining database structure and validation rules. Each model represents a collection in MongoDB.

#### `/src/routes/`
Express route definitions that map HTTP endpoints to controller methods. Includes middleware application and route organization.

#### `/src/services/`
Business logic layer containing core application functionality. Controllers call services to perform operations.

#### `/src/utils/`
Utility functions and helpers used across the application. Includes logging, validation, response formatting, and constants.

---

## Environment Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation Steps

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd quiz-management-system
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required Environment Variables**
   ```env
   # Database
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz_db
   
   # Server
   PORT=3000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Database Setup**
   ```bash
   # Run migrations (if any)
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

5. **Start the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run Jest tests
- `npm run test:endpoints` - Test all API endpoints
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data

---

## Authentication & Middleware

### Authentication Flow

1. **User Registration/Login**
   - User provides credentials
   - Server validates and creates JWT token
   - Token contains user ID, email, role, and status

2. **Token Usage**
   - Client includes token in Authorization header: `Bearer <token>`
   - Middleware validates token and extracts user info
   - User info attached to `req.user` for controllers

3. **Token Refresh**
   - Clients can refresh tokens before expiration
   - New token generated with updated user data

### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, role changes |
| **Moderator** | User verification, participant management, bulk operations |
| **Coordinator** | Participant management, verification |
| **User** | Basic access, profile management |

### Middleware Stack

#### Authentication Middleware
```javascript
// Applied to protected routes
authenticate(req, res, next)

// Role-based authorization
authorize(['admin', 'moderator'])
adminOnly(req, res, next)
moderatorAndAbove(req, res, next)
coordinatorAndAbove(req, res, next)
```

#### Validation Middleware
```javascript
// Input validation for users
validateUser(req, res, next)

// Input validation for participants
validateParticipant(req, res, next)
```

#### Security Middleware
```javascript
// Rate limiting
rateLimitMiddleware
authRateLimit  // Stricter for auth endpoints
strictRateLimit  // For sensitive operations

// Error handling
errorHandler(err, req, res, next)
```

### Protected Endpoints

- **Public**: Health check, participant registration, visitor tracking
- **Authenticated**: Profile management, basic data access
- **Coordinator+**: Participant management, result viewing
- **Moderator+**: User management, bulk operations, result creation
- **Admin Only**: User role changes, system-wide deletions

---

## API Endpoints Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "message": "Description of operation",
  "data": {}, // Response data (if applicable)
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Pagination Format
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
**Description**: Register a new user  
**Access**: Public  
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password123",
  "role": "user"
}
```
**Response**: User object with JWT token

### POST /auth/login
**Description**: Authenticate user  
**Access**: Public  
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
**Response**: User object with JWT token

### POST /auth/logout
**Description**: Logout user (logs the event)  
**Access**: Authenticated  
**Headers**: `Authorization: Bearer <token>`  
**Response**: Success message

### GET /auth/profile
**Description**: Get current user profile  
**Access**: Authenticated  
**Headers**: `Authorization: Bearer <token>`  
**Response**: User profile data

### PUT /auth/profile
**Description**: Update current user profile  
**Access**: Authenticated  
**Headers**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "name": "John Doe Updated",
  "phone": "9876543211"
}
```
**Response**: Updated user profile

### PUT /auth/change-password
**Description**: Change user password  
**Access**: Authenticated  
**Headers**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```
**Response**: Success message

### POST /auth/refresh
**Description**: Refresh JWT token  
**Access**: Authenticated  
**Headers**: `Authorization: Bearer <token>`  
**Response**: New token and user data

### GET /auth/verify
**Description**: Verify JWT token validity  
**Access**: Authenticated  
**Headers**: `Authorization: Bearer <token>`  
**Response**: Token validation status

---

## 👥 User Management Endpoints

### GET /users
**Description**: Get all users with pagination  
**Access**: Moderator+  
**Query Parameters**:
- `limit` (default: 50) - Number of results per page
- `page` (default: 1) - Page number
- `sort` (default: createdAt) - Sort field
- `order` (default: desc) - Sort order (asc/desc)
- `role` - Filter by role
- `status` - Filter by status

**Response**: Paginated list of users

### GET /users/:userId
**Description**: Get user by ID  
**Access**: Self or Admin  
**Response**: User details

### POST /users
**Description**: Create new user  
**Access**: Admin only  
**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543212",
  "password": "Password123",
  "role": "coordinator"
}
```
**Response**: Created user object

### PUT /users/:userId
**Description**: Update user  
**Access**: Self or Admin  
**Request Body**:
```json
{
  "name": "Jane Smith Updated",
  "phone": "9876543213"
}
```
**Response**: Updated user object

### DELETE /users/:userId
**Description**: Delete user (soft delete)  
**Access**: Admin only  
**Response**: Success message

### PUT /users/:userId/verify
**Description**: Verify user account  
**Access**: Moderator+  
**Response**: Success message

### PUT /users/:userId/role
**Description**: Change user role  
**Access**: Admin only  
**Request Body**:
```json
{
  "role": "moderator"
}
```
**Response**: Updated user object

### PUT /users/:userId/reset-password
**Description**: Reset user password  
**Access**: Admin only  
**Request Body**:
```json
{
  "newPassword": "ResetPassword123"
}
```
**Response**: Success message

### GET /users/role/:role
**Description**: Get users by role  
**Access**: Moderator+  
**Response**: List of users with specified role

### GET /users/search
**Description**: Search users  
**Access**: Moderator+  
**Query Parameters**:
- `q` (required) - Search query
- `limit` (default: 20) - Number of results

**Response**: List of matching users

### GET /users/stats
**Description**: Get user statistics  
**Access**: Moderator+  
**Response**: User statistics object

---

## 🎓 Participant Management Endpoints

### POST /participants
**Description**: Register new participant  
**Access**: Public  
**Request Body**:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "9876543214",
  "school": "ABC High School",
  "class": "12th Grade",
  "type": "school",
  "teamID": "TEAM001",
  "dob": "2005-05-15",
  "homeTown": "Mumbai",
  "fatherName": "Robert Johnson"
}
```
**Response**: Created participant object

### GET /participants
**Description**: Get all participants with pagination  
**Access**: Coordinator+  
**Query Parameters**:
- `limit` (default: 50) - Number of results per page
- `page` (default: 1) - Page number
- `sort` (default: registeredAt) - Sort field
- `order` (default: desc) - Sort order
- `status` - Filter by status
- `type` - Filter by type
- `school` - Filter by school
- `teamID` - Filter by team ID

**Response**: Paginated list of participants

### GET /participants/:participantId
**Description**: Get participant by ID  
**Access**: Coordinator+  
**Response**: Participant details

### PUT /participants/:participantId
**Description**: Update participant  
**Access**: Coordinator+  
**Request Body**:
```json
{
  "name": "Alice Johnson Updated",
  "phone": "9876543215",
  "class": "12th Grade A"
}
```
**Response**: Updated participant object

### DELETE /participants/:participantId
**Description**: Delete participant (soft delete)  
**Access**: Moderator+  
**Response**: Success message

### PUT /participants/:participantId/verify
**Description**: Verify participant  
**Access**: Coordinator+  
**Response**: Success message

### GET /participants/stats
**Description**: Get participant statistics  
**Access**: Coordinator+  
**Response**: Participant statistics object

### GET /participants/search
**Description**: Search participants  
**Access**: Coordinator+  
**Query Parameters**:
- `q` (required) - Search query
- `limit` (default: 20) - Number of results

**Response**: List of matching participants

### GET /participants/status/:status
**Description**: Get participants by status  
**Access**: Coordinator+  
**Response**: List of participants with specified status

### GET /participants/type/:type
**Description**: Get participants by type  
**Access**: Coordinator+  
**Response**: List of participants with specified type

### GET /participants/school/:school
**Description**: Get participants by school  
**Access**: Coordinator+  
**Response**: List of participants from specified school

### PUT /participants/bulk-verify
**Description**: Bulk verify participants  
**Access**: Moderator+  
**Request Body**:
```json
{
  "participantIds": ["id1", "id2", "id3"]
}
```
**Response**: Bulk operation results

---

## 🏫 School Management Endpoints

### POST /schools
**Description**: Register new school  
**Access**: Moderator+  
**Request Body**:
```json
{
  "name": "XYZ International School",
  "moderatorEmail": "moderator@xyzschool.com",
  "coordinatorEmail": "coordinator@xyzschool.com",
  "city": "Delhi"
}
```
**Response**: Created school object

### GET /schools
**Description**: Get all schools with pagination  
**Access**: Coordinator+  
**Query Parameters**:
- `limit` (default: 50) - Number of results per page
- `page` (default: 1) - Page number
- `sort` (default: createdAt) - Sort field
- `order` (default: desc) - Sort order
- `status` - Filter by status
- `city` - Filter by city
- `moderatorEmail` - Filter by moderator
- `coordinatorEmail` - Filter by coordinator

**Response**: Paginated list of schools

### GET /schools/:schoolId
**Description**: Get school by ID  
**Access**: Coordinator+  
**Response**: School details

### PUT /schools/:schoolId
**Description**: Update school  
**Access**: Moderator+  
**Request Body**:
```json
{
  "name": "XYZ International School Updated",
  "city": "New Delhi"
}
```
**Response**: Updated school object

### DELETE /schools/:schoolId
**Description**: Delete school (soft delete)  
**Access**: Admin only  
**Response**: Success message

### PUT /schools/:schoolId/verify
**Description**: Verify school  
**Access**: Moderator+  
**Response**: Success message

### PUT /schools/:schoolId/coordinator
**Description**: Assign coordinator to school  
**Access**: Moderator+  
**Request Body**:
```json
{
  "coordinatorEmail": "newcoordinator@xyzschool.com"
}
```
**Response**: Updated school object

### GET /schools/stats
**Description**: Get school statistics  
**Access**: Coordinator+  
**Response**: School statistics object

### GET /schools/status/:status
**Description**: Get schools by status  
**Access**: Coordinator+  
**Response**: List of schools with specified status

### GET /schools/city/:city
**Description**: Get schools by city  
**Access**: Coordinator+  
**Response**: List of schools in specified city

---

## 🏆 Results Management Endpoints

### POST /results
**Description**: Create quiz result  
**Access**: Moderator+  
**Request Body**:
```json
{
  "round": "preliminary",
  "teamId": "TEAM001",
  "position": "1st"
}
```
**Response**: Created result object

### GET /results
**Description**: Get all results with pagination  
**Access**: Coordinator+  
**Query Parameters**:
- `limit` (default: 50) - Number of results per page
- `page` (default: 1) - Page number
- `sort` (default: createdAt) - Sort field
- `order` (default: desc) - Sort order
- `round` - Filter by round
- `teamId` - Filter by team
- `position` - Filter by position

**Response**: Paginated list of results

### GET /results/:resultId
**Description**: Get result by ID  
**Access**: Coordinator+  
**Response**: Result details

### PUT /results/:resultId
**Description**: Update result  
**Access**: Moderator+  
**Request Body**:
```json
{
  "position": "2nd"
}
```
**Response**: Updated result object

### DELETE /results/:resultId
**Description**: Delete result  
**Access**: Moderator+  
**Response**: Success message

### GET /results/stats
**Description**: Get result statistics  
**Access**: Coordinator+  
**Response**: Result statistics object

### GET /results/round/:round
**Description**: Get results by round  
**Access**: Coordinator+  
**Response**: List of results for specified round

### GET /results/round/:round/leaderboard
**Description**: Get leaderboard for round  
**Access**: Coordinator+  
**Response**: Sorted leaderboard for specified round

### GET /results/round/:round/qualified
**Description**: Get qualified teams for round  
**Access**: Coordinator+  
**Response**: List of qualified teams from specified round

### GET /results/team/:teamId
**Description**: Get results by team  
**Access**: Coordinator+  
**Response**: List of results for specified team

---

## 📊 Tracking Endpoints

### POST /tracking/visit
**Description**: Track visitor (public endpoint)  
**Access**: Public  
**Request Body**:
```json
{
  "visitorId": "visitor_123456",
  "url": "/api/participants"
}
```
**Response**: Visitor tracking confirmation

### GET /tracking/visitors
**Description**: Get visitor data  
**Access**: Moderator+  
**Query Parameters**:
- `limit` (default: 50) - Number of results per page
- `page` (default: 1) - Page number
- `sort` (default: visitedAt) - Sort field
- `order` (default: desc) - Sort order
- `ip` - Filter by IP address
- `os` - Filter by operating system
- `browser` - Filter by browser
- `startDate` - Filter by date range start
- `endDate` - Filter by date range end

**Response**: Paginated visitor data

### GET /tracking/visitors/stats
**Description**: Get visitor statistics  
**Access**: Moderator+  
**Response**: Visitor statistics object

### GET /tracking/logs
**Description**: Get login logs  
**Access**: Moderator+  
**Query Parameters**:
- `limit` (default: 50) - Number of results per page
- `page` (default: 1) - Page number
- `sort` (default: loggedInAt) - Sort field
- `order` (default: desc) - Sort order
- `userId` - Filter by user ID
- `email` - Filter by email
- `startDate` - Filter by date range start
- `endDate` - Filter by date range end

**Response**: Paginated login logs

### GET /tracking/logs/stats
**Description**: Get login statistics  
**Access**: Moderator+  
**Response**: Login statistics object

### GET /tracking/sessions/active
**Description**: Get active user sessions  
**Access**: Moderator+  
**Response**: List of active sessions

---

## Database Models

### User Model
```javascript
{
  email: String (required, unique),
  phone: String (required, 10 digits),
  name: String (required),
  password: String (required, hashed),
  role: String (enum: admin, moderator, coordinator, user),
  status: String (enum: verified, pending, deleted),
  createdAt: Date,
  updatedAt: Date
}
```

### Participant Model
```javascript
{
  teamID: String (optional),
  name: String (required),
  email: String (required, unique),
  phone: String (10 digits),
  dob: Date,
  class: String,
  school: String,
  homeTown: String,
  fatherName: String,
  status: String (enum: verified, pending, deleted),
  type: String (enum: individual, school),
  registeredAt: Date,
  verifiedAt: Date,
  verifiedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Result Model
```javascript
{
  round: String (enum: screeningTest, preliminary, semiFinals, finals),
  teamId: String (required),
  position: String (enum: 1st, 2nd, 3rd, qualified, disqualified),
  createdAt: Date,
  updatedAt: Date
}
```

### School Model
```javascript
{
  name: String (required),
  moderatorEmail: String (required),
  city: String,
  coordinatorEmail: String,
  status: String (enum: verified, pending, deleted),
  createdAt: Date,
  updatedAt: Date
}
```

### Log Model
```javascript
{
  loginId: ObjectId (ref: User, required),
  email: String (required),
  loggedInAt: Date,
  ip: String (required),
  os: String,
  browser: String,
  loggedOutAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Visitor Model
```javascript
{
  visitorId: String (required, unique),
  ip: String (required),
  os: String,
  browser: String,
  visitedAt: Date,
  url: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

### HTTP Status Codes
- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Resource already exists)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error (Server error)

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Scenarios
- **Validation Errors**: Invalid input data
- **Authentication Errors**: Missing or invalid tokens
- **Authorization Errors**: Insufficient permissions
- **Not Found Errors**: Resource doesn't exist
- **Conflict Errors**: Duplicate data (email, etc.)
- **Rate Limit Errors**: Too many requests

---

## Testing

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Test coverage
npm run test:coverage

# Test all endpoints
npm run test:endpoints
```

### Test Structure
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database operations
- **Endpoint Tests**: Automated testing of all API endpoints

### Postman Collection
Import `Quiz_Management_System_Complete.postman_collection.json` for comprehensive API testing with:
- Pre-configured requests for all endpoints
- Automatic token management
- Environment variables
- Example responses

---

## Deployment

### Production Environment Setup

1. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGO_URI=<production-mongodb-uri>
   JWT_SECRET=<strong-production-secret>
   ALLOWED_ORIGINS=<production-frontend-urls>
   LOG_LEVEL=warn
   ```

2. **Security Considerations**
   - Use strong JWT secrets
   - Configure proper CORS origins
   - Set up SSL/TLS certificates
   - Configure rate limiting appropriately
   - Set up monitoring and logging

3. **Database Setup**
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Process Management**
   - Use PM2 or similar for process management
   - Set up health checks
   - Configure log rotation

### Monitoring
- **Logs**: Winston logger with file and console transports
- **Health Checks**: `/api/health` endpoint
- **Statistics**: Built-in analytics endpoints
- **Error Tracking**: Comprehensive error logging

---

## Support & Maintenance

### Common Operations
- **Add New User Role**: Update constants and middleware
- **Add New Endpoint**: Create route, controller, service, and tests
- **Database Changes**: Create migration scripts
- **Security Updates**: Regular dependency updates

### Troubleshooting
- Check logs in `/logs` directory
- Verify environment variables
- Test database connectivity
- Check JWT token validity
- Verify middleware configuration

### Performance Optimization
- Database indexing (already implemented)
- Query optimization
- Caching strategies
- Rate limiting tuning
- Connection pooling

---

This documentation provides a comprehensive guide to understanding, using, and maintaining the Quiz Management System API. For additional support, refer to the code comments and test files for implementation details.