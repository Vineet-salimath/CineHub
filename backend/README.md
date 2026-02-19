# CineHub Backend API

Production-grade Node.js/Express backend with PostgreSQL integration, JWT authentication, and bcrypt password hashing.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file with:
```
PORT=5000
DATABASE_URL=postgres://your_user:YOUR_DB_PASSWORD@your-aiven-host:PORT/defaultdb?sslmode=require
JWT_SECRET=your_strong_jwt_secret_here
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173
```

### Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server starts on `http://localhost:5000`

## 📡 API Documentation

### Health Check
```
GET /health
Response: { status: 'OK', message: 'CineHub backend is running' }
```

### Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "userId": "user_identifier",
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

Success (201):
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "userId": "user_identifier",
    "username": "john_doe",
    "email": "john@example.com"
  }
}

Error (400/409):
{
  "error": "User already exists"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123"
}

Success (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "userId": "user_identifier",
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}

Error (401):
{
  "error": "Invalid credentials"
}
```

### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer {TOKEN}

Success (200):
{
  "success": true,
  "user": {
    "id": 1,
    "userId": "user_identifier",
    "username": "john_doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2026-02-19T10:00:00.000Z"
  }
}

Error (401):
{
  "error": "No token provided" | "Invalid token"
}
```

## 🔐 Security Implementation

### Password Hashing
- Algorithm: Bcrypt
- Salt rounds: 10
- Secure comparison using bcryptjs

### JWT Authentication
- Payload: { id, userId, username, email }
- Secret: Stored in environment variable
- Validation on protected routes

### Database Security
- Parameterized queries (prevents SQL injection)
- SSL/TLS connection to PostgreSQL
- Input validation on all endpoints

## 📊 Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 🔧 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # PostgreSQL client & initialization
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   └── auth.js          # Authentication endpoints
│   └── server.js            # Express app setup & server start
├── .env                     # Environment variables
├── package.json            
└── README.md
```

## 📦 Dependencies

- **express** (4.18.2) - Web server framework
- **pg** (8.10.0) - PostgreSQL client
- **bcryptjs** (2.4.3) - Password hashing
- **jwt-simple** (0.5.6) - JWT encoding/decoding
- **dotenv** (16.3.1) - Environment variable management
- **cors** (2.8.5) - Cross-origin resource sharing
- **body-parser** (1.20.2) - Request body parsing

## 🧪 Testing Endpoints

Use curl or Postman to test:

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"test1",
    "username":"testuser",
    "email":"test@example.com",
    "phone":"+1234567890",
    "password":"Test1234",
    "confirmPassword":"Test1234"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test1234"}'

# Profile (replace TOKEN with actual JWT)
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## 🚨 Error Handling

All endpoints return appropriate HTTP status codes:
- **200** - Success
- **201** - Resource created
- **400** - Bad request / validation error
- **401** - Unauthorized / invalid credentials
- **409** - Conflict (user already exists)
- **500** - Server error

## 📈 Performance Considerations

- JWT tokens for stateless authentication
- Connection pooling via pg client
- Bcrypt configured with optimal salt rounds (10)
- CORS whitelist for production

## 🔄 Middleware

### Auth Middleware
Validates JWT token from Authorization header.
```javascript
// Usage: app.get('/protected', authMiddleware, handler)
// Token format: "Bearer token_string"
```

## 🚀 Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use environment-specific database URLs
- [ ] Enable HTTPS
- [ ] Configure CORS_ORIGIN for your domain
- [ ] Set NODE_ENV=production
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Enable database backups
- [ ] Monitor error rates

---

**CineHub Backend** - Secure, scalable, production-ready
