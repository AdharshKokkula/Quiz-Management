# Quiz Management System API Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Architecture & Directory Structure](#architecture--directory-structure)
4. [Authentication & Middleware](#authentication--middleware)
5. [API Endpoints](#api-endpoints)
6. [Database Models](#database-models)
7. [Environment Setup](#environment-setup)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

The Quiz Management System is a comprehensive Node.js/Express.js REST API designed for managing quiz participants, users, schools, and results with role-based authentication and authorization.

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
- **Runtime**: Node.js (v18.0.0+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet.js, CORS, Rate Limiting
- **Logging**: Winston
- **Testing**: Jest, Supertest

---

## Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd quiz-management-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev  # Development
npm start    # Production
```

### Base URL
```
http://localhost:3000/api
```

### Health Check
```http
GET /api/health
```

---

## Architecture & Directory Structure

### Clean Architecture Pattern
The project follows clean architecture principles with clear separation of concerns:

```
quiz-management-system/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers (Presentation Layer)
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database schemas (Data Layer)
│   ├── routes/          # API routes (Presentation Layer)
│   ├── services/        # Business logic (Business Layer)
│   ├── utils/           # Utility functions
│   └── app.js          # Express app setup
├── tests/              # Test files
├── docs/               # Documentation
├── scripts/            # Build/deployment scripts
├── logs/               # Application logs
├── server.js           # Entry point
└── package.json
```

### Directory Explanations

#### `/src/config/`
- **Purpose**: Centralized configuration management
- **Files**:
  - `index.js` - Main config aggregator with environment validation
  - `database.js` - MongoDB connection configuration
  - `jwt.js` - JWT token configuration
  - `cors.js` - CORS policy configuration

#### `/src/controllers/`
- **Purpose**: Handle HTTP requests and responses (Presentation Layer)
- **Structure**:
  - `auth/` - Authentication controllers (login, register, profile)
  - `quiz/` - Quiz-related controllers (participants, results, schools)
  - `tracking/` - Visitor tracking and logging controllers
- **Responsibilities**: Request validation, calling services, response formatting

#### `/src/services/`
- **Purpose**: Business logic implementation (Business Layer)
- **Files**: Mirror controller structure with business logic
- **Responsibilities**: Data processing, business rules, database operations

#### `/src/models/`
- **Purpose**: Database schema definitions (Data Layer)
- **Files**: Mongoose models for User, Participant, Result, School, Log, Visitor
- **Features**: Validation, indexing, middleware hooks

#### `/src/routes/`
- **Purpose**: API route definitions with middleware application
- **Features**: Route grouping, middleware chaining, parameter validation

#### `/src/middleware/`
- **Purpose**: Custom middleware functions
- **Files**:
  - `auth.middleware.js` - Authentication and authorization
  - `validation.middleware.js` - Input validation
  - `error.middleware.js` - Error handling
  - `rate-limit.middleware.js` - Rate limiting

#### `/src/utils/`
- **Purpose**: Utility functions and constants
- **Files**:
  - `constants.js` - Application constants
  - `logger.js` - Winston logger configuration
  - `response.js` - Standardized response formatting
  - `validator.js` - Custom validation functions

---

## Authentication & Middleware

### Authentication Flow
1. **User Registration/Login** → JWT token issued
2. **Token Storage** → Client stores token (localStorage/cookies)
3. **Request Authentication** → Token sent in Authorization header
4. **Token Verification** → Middleware validates token
5. **Role Authorization** → Check user permissions for endpoint

### User Roles & Permissions

| Role | Level | Permissions |
|------|-------|-------------|
| **Admin** | 4 | Full system access, user management, role changes |
| **Moderator** | 3 | User verification, participant management, bulk operations |
| **Coordinator** | 2 | Participant management, verification |
| **User** | 1 | Basic access, profile management |

### Middleware Chain
```javascript
// Example middleware application
router.get('/participants', 
  authenticate,                    // Verify JWT token
  coordinatorAndAbove,            // Check role permissions
  validateQuery,                  // Validate query parameters
  participantController.getAll    // Execute controller
);
```

### Authentication Middleware Types
- `authenticate` - Verifies JWT token
- `adminOnly` - Admin role required
- `moderatorAndAbove` - Moderator or Admin required
- `coordinatorAndAbove` - Coordinator, Moderator, or Admin required
- `selfOrAdmin` - User can access own data or Admin can access any

### Token Format
```http
Authorization: Bearer <jwt-token>
```

### Protected vs Public Endpoints
- **Public**: Registration, Login, Health Check
- **Protected**: All other endpoints require authentication
- **Role-based**: Different endpoints require different role levels

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
**Purpose**: Register a new user  
**Access**: Public  
**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securePassword123"
}
```
**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "pending"
    },
    "token": "jwt-token-here"
  }
}
```

#### POST /api/auth/login
**Purpose**: User login  
**Access**: Public  
**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt-token-here"
  }
}
```

#### GET /api/auth/profile
**Purpose**: Get current user profile  
**Access**: Authenticated users  
**Headers**: `Authorization: Bearer <token>`  
**Response**:
```json
{
  "success": true,
  "data": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "status": "verified"
  }
}
```

#### PUT /api/auth/profile
**Purpose**: Update user profile  
**Access**: Authenticated users  
**Request Body**:
```json
{
  "name": "John Updated",
  "phone": "0987654321"
}
```

#### PUT /api/auth/change-password
**Purpose**: Change user password  
**Access**: Authenticated users  
**Request Body**:
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newSecurePassword123"
}
```

#### POST /api/auth/logout
**Purpose**: User logout  
**Access**: Authenticated users  

#### POST /api/auth/refresh
**Purpose**: Refresh JWT token  
**Access**: Authenticated users  

#### GET /api/auth/verify
**Purpose**: Verify token validity  
**Access**: Authenticated users  

---

### User Management Endpoints

#### GET /api/users
**Purpose**: Get all users  
**Access**: Moderator and above  
**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `role` (string): Filter by role
- `status` (string): Filter by status
- `search` (string): Search by name or email

**Response**:
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET /api/users/:userId
**Purpose**: Get user by ID  
**Access**: Self or Admin  

#### POST /api/users
**Purpose**: Create new user  
**Access**: Admin only  
**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "coordinator"
}
```

#### PUT /api/users/:userId
**Purpose**: Update user  
**Access**: Self or Admin  

#### DELETE /api/users/:userId
**Purpose**: Delete user (soft delete)  
**Access**: Admin only  

#### PUT /api/users/:userId/verify
**Purpose**: Verify user account  
**Access**: Moderator and above  

#### PUT /api/users/:userId/role
**Purpose**: Change user role  
**Access**: Admin only  
**Request Body**:
```json
{
  "role": "moderator"
}
```

#### PUT /api/users/:userId/reset-password
**Purpose**: Reset user password  
**Access**: Admin only  

#### GET /api/users/role/:role
**Purpose**: Get users by role  
**Access**: Moderator and above  

#### GET /api/users/search
**Purpose**: Search users  
**Access**: Moderator and above  
**Query Parameters**:
- `q` (string): Search query
- `role` (string): Filter by role

#### GET /api/users/stats
**Purpose**: Get user statistics  
**Access**: Moderator and above  
**Response**:
```json
{
  "success": true,
  "data": {
    "total": 100,
    "byRole": {
      "admin": 2,
      "moderator": 5,
      "coordinator": 10,
      "user": 83
    },
    "byStatus": {
      "verified": 85,
      "pending": 15,
      "deleted": 0
    }
  }
}
```

---

### Participant Management Endpoints

#### POST /api/participants
**Purpose**: Register new participant  
**Access**: Public  
**Request Body**:
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "1234567890",
  "school": "School Name",
  "class": "10th Grade",
  "type": "individual"
}
```

#### GET /api/participants
**Purpose**: Get all participants  
**Access**: Coordinator and above  
**Query Parameters**:
- `page`, `limit`: Pagination
- `status`: Filter by status
- `type`: Filter by type
- `school`: Filter by school
- `search`: Search query

#### GET /api/participants/:participantId
**Purpose**: Get participant by ID  
**Access**: Coordinator and above  

#### PUT /api/participants/:participantId
**Purpose**: Update participant  
**Access**: Coordinator and above  

#### DELETE /api/participants/:participantId
**Purpose**: Delete participant  
**Access**: Moderator and above  

#### PUT /api/participants/:participantId/verify
**Purpose**: Verify participant  
**Access**: Coordinator and above  

#### PUT /api/participants/bulk-verify
**Purpose**: Bulk verify participants  
**Access**: Moderator and above  
**Request Body**:
```json
{
  "participantIds": ["id1", "id2", "id3"]
}
```

#### GET /api/participants/status/:status
**Purpose**: Get participants by status  
**Access**: Coordinator and above  

#### GET /api/participants/type/:type
**Purpose**: Get participants by type  
**Access**: Coordinator and above  

#### GET /api/participants/school/:school
**Purpose**: Get participants by school  
**Access**: Coordinator and above  

#### GET /api/participants/search
**Purpose**: Search participants  
**Access**: Coordinator and above  

#### GET /api/participants/stats
**Purpose**: Get participant statistics  
**Access**: Coordinator and above  

---

### School Management Endpoints

#### GET /api/schools
**Purpose**: Get all schools  
**Access**: Coordinator and above  

#### GET /api/schools/:schoolId
**Purpose**: Get school by ID  
**Access**: Coordinator and above  

#### POST /api/schools
**Purpose**: Create new school  
**Access**: Moderator and above  
**Request Body**:
```json
{
  "name": "ABC High School",
  "moderatorEmail": "moderator@school.com",
  "coordinatorEmail": "coordinator@school.com",
  "city": "New York"
}
```

#### PUT /api/schools/:schoolId
**Purpose**: Update school  
**Access**: Moderator and above  

#### DELETE /api/schools/:schoolId
**Purpose**: Delete school  
**Access**: Admin only  

#### PUT /api/schools/:schoolId/verify
**Purpose**: Verify school  
**Access**: Moderator and above  

#### PUT /api/schools/:schoolId/coordinator
**Purpose**: Assign coordinator to school  
**Access**: Moderator and above  
**Request Body**:
```json
{
  "coordinatorEmail": "newcoordinator@school.com"
}
```

#### GET /api/schools/status/:status
**Purpose**: Get schools by status  
**Access**: Coordinator and above  

#### GET /api/schools/city/:city
**Purpose**: Get schools by city  
**Access**: Coordinator and above  

#### GET /api/schools/stats
**Purpose**: Get school statistics  
**Access**: Coordinator and above  

---

### Result Management Endpoints

#### GET /api/results
**Purpose**: Get all results  
**Access**: Coordinator and above  

#### GET /api/results/:resultId
**Purpose**: Get result by ID  
**Access**: Coordinator and above  

#### POST /api/results
**Purpose**: Create new result  
**Access**: Moderator and above  
**Request Body**:
```json
{
  "round": "preliminary",
  "teamId": "team123",
  "position": "1st",
  "score": 95,
  "notes": "Excellent performance"
}
```

#### PUT /api/results/:resultId
**Purpose**: Update result  
**Access**: Moderator and above  

#### DELETE /api/results/:resultId
**Purpose**: Delete result  
**Access**: Admin only  

#### GET /api/results/round/:round
**Purpose**: Get results by round  
**Access**: Coordinator and above  

#### GET /api/results/team/:teamId
**Purpose**: Get results by team  
**Access**: Coordinator and above  

#### GET /api/results/round/:round/leaderboard
**Purpose**: Get leaderboard for specific round  
**Access**: Public  
**Response**:
```json
{
  "success": true,
  "data": {
    "round": "preliminary",
    "leaderboard": [
      {
        "position": 1,
        "teamId": "team123",
        "score": 95,
        "participants": [...]
      }
    ]
  }
}
```

#### GET /api/results/round/:round/qualified
**Purpose**: Get qualified teams for round  
**Access**: Coordinator and above  

#### GET /api/results/stats
**Purpose**: Get result statistics  
**Access**: Coordinator and above  

---

### Tracking Endpoints

#### POST /api/tracking/visit
**Purpose**: Track visitor  
**Access**: Public  
**Request Body**:
```json
{
  "page": "/home",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

#### GET /api/tracking/visitors
**Purpose**: Get visitor logs  
**Access**: Admin only  

#### GET /api/tracking/visitors/stats
**Purpose**: Get visitor statistics  
**Access**: Admin only  

#### GET /api/tracking/logs
**Purpose**: Get system logs  
**Access**: Admin only  

#### GET /api/tracking/logs/stats
**Purpose**: Get log statistics  
**Access**: Admin only  

#### GET /api/tracking/sessions/active
**Purpose**: Get active sessions  
**Access**: Admin only  

---

## Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  password: String (required, hashed),
  role: String (enum: admin/moderator/coordinator/user),
  status: String (enum: verified/pending/deleted),
  createdAt: Date,
  updatedAt: Date
}
```

### Participant Model
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  school: String (required),
  class: String (required),
  type: String (enum: individual/school),
  teamId: String (optional),
  status: String (enum: verified/pending/deleted),
  createdAt: Date,
  updatedAt: Date
}
```

### Result Model
```javascript
{
  round: String (enum: screeningTest/preliminary/semiFinals/finals),
  teamId: String (required),
  position: String (enum: 1st/2nd/3rd/qualified/disqualified),
  score: Number (optional),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### School Model
```javascript
{
  name: String (required),
  moderatorEmail: String (required),
  coordinatorEmail: String (optional),
  city: String (required),
  status: String (enum: verified/pending/deleted),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

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

### Development Setup
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### Production Setup
```bash
# Set environment
NODE_ENV=production

# Use strong JWT secret
JWT_SECRET=<generate-strong-secret>

# Start production server
npm start
```

---

## Testing

### Available Test Scripts
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Test API endpoints
npm run test:endpoints
```

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data
```

### Example Test
```javascript
describe('Auth Controller', () => {
  test('should register user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

---

## Deployment

### Environment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB connection
- [ ] Configure logging level
- [ ] Set up SSL/HTTPS
- [ ] Configure reverse proxy (nginx)

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Database Migration
```bash
# Run migration script
npm run migrate

# Seed initial data
npm run seed
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoNetworkError: failed to connect to server
```
**Solution**: Check MONGO_URI in .env file and ensure MongoDB is running

#### 2. JWT Token Error
```
Error: JsonWebTokenError: invalid token
```
**Solution**: Ensure JWT_SECRET is set and token is properly formatted

#### 3. CORS Error
```
Error: Access to fetch blocked by CORS policy
```
**Solution**: Add frontend URL to ALLOWED_ORIGINS in .env

#### 4. Rate Limit Exceeded
```
Error: Too many requests from this IP
```
**Solution**: Wait for rate limit to reset or adjust rate limit settings

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev
```

### Health Check
```bash
# Check API health
curl http://localhost:3000/api/health
```

---

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api`
- Review the logs in `/logs` directory
- Use the Postman collection for testing

---

*Last updated: [Current Date]*
*Version: 1.0.0*