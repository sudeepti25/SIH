# MVP Auth Backend

A comprehensive authentication system for MVP applications with offline-first capabilities and family member PIN-based authentication.

## Features

- 🔐 Mobile OTP verification
- 👥 Family member PIN-based authentication
- 📱 Offline registration with sync capability
- 🔄 JWT-based authentication with refresh tokens
- 🛡️ Rate limiting and security features
- 🗄️ PostgreSQL database with Redis for OTP management
- 📊 Proper MVC architecture

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with Sequelize ORM)
- **Cache**: Redis
- **Authentication**: JWT
- **SMS**: Twilio
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Redis
- Twilio account (for SMS)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd mvp-auth-backend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations
```bash
npm run migrate
```

5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mvp_auth
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# OTP Configuration
OTP_EXPIRY_MINUTES=5
MAX_OTP_ATTEMPTS=3
```

## API Endpoints

### Authentication Flow

#### 1. Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "mobile_number": "9876543210"
}
```

#### 2. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "mobile_number": "9876543210",
  "otp": "123456"
}
```

#### 3. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "mobile_number": "9876543210",
  "pin": "1234",
  "name": "John Doe",
  "dob": "1990-01-01",
  "gender": "M",
  "aadhaar_id": "123456789012", // optional
  "device_id": "device123"
}
```

#### 4. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "mobile_number": "9876543210",
  "pin": "1234",
  "device_id": "device123"
}
```

#### 5. Offline Registration (Fallback)
```http
POST /api/auth/register-offline
Content-Type: application/json

{
  "mobile_number": "9876543210",
  "pin": "1234",
  "name": "John Doe",
  "dob": "1990-01-01",
  "gender": "M",
  "aadhaar_id": "123456789012",
  "device_id": "device123"
}
```

### Sync Operations

#### Sync Users from Local DB
```http
POST /api/auth/sync-users
Content-Type: application/json

{
  "users": [
    {
      "local_id": "local-uuid-1",
      "mobile_number": "9876543210",
      "pin": "1234",
      "name": "John Doe",
      "dob": "1990-01-01",
      "gender": "M",
      "aadhaar_id": "123456789012",
      "device_id": "device123"
    }
  ]
}
```

### Protected Routes

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### Health Check

```http
GET /api/auth/health
GET /health
```

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| server_id | UUID | Primary key (auto-generated) |
| mobile_number | VARCHAR(15) | Mobile number (shared across family) |
| pin | VARCHAR | Hashed 4-digit PIN |
| aadhaar_id | VARCHAR(12) | Optional Aadhaar ID |
| name | TEXT | User's name |
| dob | DATE | Date of birth |
| gender | VARCHAR(10) | M/F/Other |
| device_id | VARCHAR | Device identifier |
| is_mobile_verified | BOOLEAN | Mobile verification status |
| created_at | TIMESTAMP | Registration timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| synced_at | TIMESTAMP | Last sync timestamp |

## Security Features

- **Rate Limiting**: Different limits for OTP, auth, and general requests
- **PIN Hashing**: BCrypt with 10 rounds
- **JWT Security**: Short-lived access tokens with refresh tokens
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers
- **Redis OTP Storage**: Temporary OTP storage with expiration

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors array
}
```

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **OTP Endpoints**: 3 requests per minute
- **Auth Endpoints**: 10 requests per 15 minutes

## Development Notes

### Project Structure
```
├── config/
│   ├── database.js      # Database configuration
│   └── redis.js         # Redis configuration
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   ├── auth.js          # JWT middleware
│   ├── validation.js    # Input validation
│   ├── rateLimiter.js   # Rate limiting
│   └── errorHandler.js  # Error handling
├── models/
│   └── User.js          # User model
├── routes/
│   └── auth.js          # Authentication routes
├── services/
│   ├── otpService.js    # OTP handling
│   └── jwtService.js    # JWT utilities
├── scripts/
│   └── migrate.js       # Database migration
├── server.js            # Main server file
└── package.json
```

### Testing in Development

The API includes development-friendly features:
- OTP is returned in response (development only)
- Detailed error messages
- Console logging

### Production Considerations

- Set `NODE_ENV=production`
- Configure proper CORS origins
- Set up SSL/TLS
- Configure proper database connection pooling
- Set up monitoring and logging
- Configure backup strategies

## License

MIT License