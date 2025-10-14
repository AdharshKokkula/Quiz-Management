# Quiz Management System API

A comprehensive Node.js/Express.js REST API for managing quiz participants, users, schools, and results with role-based authentication and authorization.

## 🚀 Features

- **Complete CRUD Operations** for all entities (Users, Participants, Schools, Results, Visitors, Logs)
- **Role-Based Access Control** (Admin, Moderator, Coordinator, User)
- **JWT Authentication** with refresh tokens
- **Input Validation** and sanitization
- **Rate Limiting** and security middleware
- **Comprehensive Logging** system
- **Search and Filtering** capabilities
- **Bulk Operations** support
- **Statistics and Analytics** endpoints
- **Clean Architecture** with services, controllers, and routes separation

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [User Roles](#user-roles)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Usage Examples](#usage-examples)

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quiz-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## ⚙️ Configuration

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

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Health Check

```http
GET /api/health
```

### Authentication Endpoints

| Method | Endpoint                | Description       | Access  |
| ------ | ----------------------- | ----------------- | ------- |
| POST   | `/auth/register`        | Register new user | Public  |
| POST   | `/auth/login`           | User login        | Public  |
| POST   | `/auth/logout`          | User logout       | Private |
| GET    | `/auth/profile`         | Get user profile  | Private |
| PUT    | `/auth/profile`         | Update profile    | Private |
| PUT    | `/auth/change-password` | Change password   | Private |
| POST   | `/auth/refresh`         | Refresh token     | Private |
| GET    | `/auth/verify`          | Verify token      | Private |
| GET    | `/auth/login-history`   | Get login history | Private |

### User Management Endpoints

| Method | Endpoint            | Description     | Access     |
| ------ | ------------------- | --------------- | ---------- |
| GET    | `/users`            | Get all users   | Moderator+ |
| GET    | `/users/:id`        | Get user by ID  | Self/Admin |
| POST   | `/users`            | Create user     | Admin      |
| PUT    | `/users/:id`        | Update user     | Self/Admin |
| DELETE | `/users/:id`        | Delete user     | Admin      |
| PUT    | `/users/:id/verify` | Verify user     | Moderator+ |
| PUT    | `/users/:id/role`   | Change role     | Admin      |
| GET    | `/users/stats`      | User statistics | Moderator+ |
| GET    | `/users/search`     | Search users    | Moderator+ |

### Participant Endpoints

| Method | Endpoint                    | Description          | Access       |
| ------ | --------------------------- | -------------------- | ------------ |
| POST   | `/participants`             | Register participant | Public       |
| GET    | `/participants`             | Get all participants | Coordinator+ |
| GET    | `/participants/:id`         | Get participant      | Coordinator+ |
| PUT    | `/participants/:id`         | Update participant   | Coordinator+ |
| DELETE | `/participants/:id`         | Delete participant   | Moderator+   |
| PUT    | `/participants/:id/verify`  | Verify participant   | Coordinator+ |
| PUT    | `/participants/bulk-verify` | Bulk verify          | Moderator+   |
| GET    | `/participants/stats`       | Statistics           | Coordinator+ |
| GET    | `/participants/search`      | Search participants  | Coordinator+ |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Registration Example

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "securePassword123",
    role: "user",
  }),
});
```

### Login Example

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john@example.com",
    password: "securePassword123",
  }),
});

const { token, user } = await response.json();
```

## 👥 User Roles

| Role            | Permissions                                                |
| --------------- | ---------------------------------------------------------- |
| **Admin**       | Full system access, user management, role changes          |
| **Moderator**   | User verification, participant management, bulk operations |
| **Coordinator** | Participant management, verification                       |
| **User**        | Basic access, profile management                           |

## 🗃 Database Schema

### User Schema

```javascript
{
  email: String (required, unique),
  phone: String (required, 10 digits),
  name: String (required),
  password: String (required, hashed),
  role: String (admin/moderator/coordinator/user),
  status: String (verified/pending/deleted),
  createdAt: Date,
  updatedAt: Date
}
```

### Participant Schema

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
  status: String (verified/pending/deleted),
  type: String (individual/school),
  registeredAt: Date,
  verifiedAt: Date,
  verifiedBy: String
}
```

### Log Schema

```javascript
{
  loginId: ObjectId (ref: User),
  email: String,
  loggedInAt: Date,
  ip: String,
  os: String,
  browser: String,
  loggedOutAt: Date
}
```

## 📁 Project Structure

```
quiz-management-system/
├── controllers/           # Request handlers
│   ├── auth/
│   │   ├── authController.js
│   │   └── userController.js
│   └── quiz/
│       └── participantController.js
├── services/             # Business logic
│   ├── auth/
│   │   ├── userService.js
│   │   └── logService.js
│   ├── quiz/
│   │   ├── participantService.js
│   │   ├── schoolService.js
│   │   └── resultService.js
│   └── tracking/
│       └── visitorService.js
├── routes/               # API routes
│   ├── auth/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── quiz/
│   │   └── participantRoutes.js
│   └── index.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Database schemas
│   ├── auth/
│   │   ├── users.js
│   │   ├── logs.js
│   │   └── visitors.js
│   ├── quiz/
│   │   ├── participants.js
│   │   ├── schools.js
│   │   └── results.js
│   └── validator.js
├── db/                  # Database utilities
│   └── db.js
├── views/               # Legacy API (backward compatibility)
└── app.js              # Main application file
```

## 💡 Usage Examples

### Create a Participant

```javascript
const participant = await fetch("/api/participants", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Jane Smith",
    email: "jane@school.edu",
    phone: "9876543210",
    school: "ABC High School",
    class: "12th Grade",
    type: "school",
  }),
});
```

### Get Participant Statistics

```javascript
const stats = await fetch("/api/participants/stats", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await stats.json();
// Returns: { total, verified, pending, individual, school }
```

### Search Users

```javascript
const users = await fetch("/api/users/search?q=john", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Bulk Verify Participants

```javascript
const result = await fetch("/api/participants/bulk-verify", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    participantIds: ["id1", "id2", "id3"],
  }),
});
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** (100 requests per 15 minutes)
- **Input validation** and sanitization
- **Password hashing** with bcrypt
- **JWT token** authentication
- **Role-based authorization**
- **SQL injection** protection via Mongoose

## 🚦 Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // For validation errors
}
```

## 📊 Response Format

All API responses follow this format:

```javascript
{
  "success": true,
  "message": "Operation description",
  "data": {}, // Response data
  "count": 10, // For list responses
  "pagination": {} // For paginated responses
}
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Individual model tests:

```bash
npm run test-user
npm run test-participant
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.
