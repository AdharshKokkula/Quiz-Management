# Quiz Management System API

A comprehensive Node.js/Express.js REST API for managing quiz participants, users, schools, and results with role-based authentication and authorization.

## 🚀 Features

- **Complete CRUD Operations** for all entities (Users, Participants, Schools, Results, Visitors, Logs)
- **Role-Based Access Control** (Admin, Moderator, Coordinator, User)
- **JWT Authentication** with secure token management
- **Input Validation** and sanitization
- **Rate Limiting** and security middleware
- **Comprehensive Logging** system with Winston
- **Search and Filtering** capabilities
- **Bulk Operations** support
- **Statistics and Analytics** endpoints
- **Clean Architecture** with services, controllers, and routes separation

## 📋 Quick Start

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

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

## 🛠 Configuration

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

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Participants
- `POST /api/participants` - Register participant (Public)
- `GET /api/participants` - Get all participants (Coordinator+)
- `PUT /api/participants/:id/verify` - Verify participant

#### Results
- `GET /api/results/round/:round/leaderboard` - Get leaderboard
- `POST /api/results` - Create result (Moderator+)

For complete API documentation, visit `/api` when the server is running.

## 🔐 Authentication & Authorization

### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, role changes |
| **Moderator** | User verification, participant management, bulk operations |
| **Coordinator** | Participant management, verification |
| **User** | Basic access, profile management |

### JWT Authentication

Include the token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

## 🗃 Database Models

### User
- Email, phone, name, password (hashed)
- Role (admin/moderator/coordinator/user)
- Status (verified/pending/deleted)

### Participant
- Name, email, phone, school, class
- Type (individual/school)
- Status (verified/pending/deleted)
- Team ID (optional)

### Result
- Round (screeningTest/preliminary/semiFinals/finals)
- Team ID, position (1st/2nd/3rd/qualified/disqualified)

### School
- Name, moderator email, coordinator email
- City, status (verified/pending/deleted)

## 📁 Project Structure

```
quiz-management-system/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js          # Express app setup
├── tests/              # Test files
├── docs/               # Documentation
├── scripts/            # Build/deployment scripts
├── server.js           # Entry point
└── package.json
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure proper CORS origins
4. Set up MongoDB connection
5. Configure logging level

### Scripts

```bash
# Database migration
node scripts/migrate.js

# Seed initial data
node scripts/seed.js
```

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** (100 requests per 15 minutes)
- **Input validation** and sanitization
- **Password hashing** with bcryptjs
- **JWT token** authentication
- **Role-based authorization**

## 📊 Monitoring & Logging

- **Winston** logger with multiple transports
- **Request logging** with IP, method, and path
- **Error tracking** with stack traces
- **Performance monitoring** ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the API endpoints at `/api`

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete CRUD operations
- Role-based authentication
- JWT token management
- Comprehensive API documentation