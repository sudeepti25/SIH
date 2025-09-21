# MVP Auth Backend with AI Symptom Analysis

A comprehensive authentication system for MVP applications with offline-first capabilities, family member PIN-based authentication, and AI-powered symptom analysis using Google's Gemini API.

## Features

- 🔐 Mobile OTP verification
- 👥 Family member PIN-based authentication
- 📱 Offline registration with sync capability
- 🔄 JWT-based authentication with refresh tokens
- 🛡️ Rate limiting and security features
- 🗄️ PostgreSQL database with Redis for OTP management
- 📊 Proper MVC architecture
- 🤖 **AI Symptom Analysis** - Advanced symptom analysis using Gemini API
- 💊 **Medical Recommendations** - AI-powered medication and treatment suggestions
- 🚨 **Emergency Assessment** - Automatic detection of emergency symptoms

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with Sequelize ORM)
- **Cache**: Redis
- **Authentication**: JWT
- **SMS**: Twilio
- **AI**: Google Gemini API
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

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

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
│   ├── auth.js          # Authentication routes
│   └── symptomRoutes.js # AI symptom analysis routes
├── services/
│   ├── otpService.js    # OTP handling
│   ├── jwtService.js    # JWT utilities
│   └── geminiService.js # AI symptom analysis service
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── symptomController.js # Symptom analysis logic
├── config/
│   ├── db.js           # Database configuration
│   ├── redis.js        # Redis configuration
│   └── gemini.js       # Gemini AI configuration
├── scripts/
│   └── migrate.js      # Database migration
├── server.js           # Main server file
└── package.json
```

## AI Symptom Analysis Feature

### Overview

The AI Symptom Analysis feature uses Google's Gemini AI to provide intelligent medical assessments based on patient symptoms. This feature helps streamline doctor-patient interactions by providing preliminary analysis and recommendations.

### Setup

1. **Get Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/)
   - Create a new project or use existing one
   - Generate an API key
   - Add it to your `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

2. **Install Dependencies**:
   ```bash
   npm install @google/generative-ai
   ```

### API Endpoints

#### 1. Analyze Symptoms
**POST** `/api/symptoms/analyze`

Analyzes patient symptoms using AI and provides medical recommendations.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "symptoms": [
    {
      "name": "Fever",
      "severity": 7,
      "duration": "2 days"
    },
    {
      "name": "Headache", 
      "severity": 6,
      "duration": "1 day"
    },
    {
      "name": "Cough",
      "severity": 8,
      "duration": "3 days"
    }
  ],
  "patientInfo": {
    "age": 35,
    "gender": "M",
    "medicalHistory": ["diabetes"],
    "allergies": ["penicillin"],
    "currentMedications": ["metformin"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Symptom analysis completed successfully",
  "data": {
    "disease": {
      "name": "Upper Respiratory Tract Infection",
      "description": "Common viral infection affecting nose, throat, and airways",
      "probability": "High"
    },
    "severity": {
      "level": 6,
      "description": "Moderate",
      "urgency": "Medium"
    },
    "medications": [
      {
        "name": "Paracetamol",
        "type": "Over-the-counter",
        "purpose": "Fever reduction and pain relief",
        "dosage": "500mg every 6 hours",
        "notes": "Do not exceed 4g in 24 hours"
      },
      {
        "name": "Dextromethorphan",
        "type": "Over-the-counter", 
        "purpose": "Cough suppression",
        "dosage": "15mg every 4 hours",
        "notes": "Take with plenty of water"
      }
    ],
    "recommendations": [
      "Stay hydrated with plenty of fluids",
      "Get adequate rest",
      "Use humidifier or steam inhalation",
      "Monitor temperature regularly"
    ],
    "redFlags": [
      "High fever above 103°F (39.4°C)",
      "Difficulty breathing or shortness of breath",
      "Persistent chest pain",
      "Severe headache with neck stiffness"
    ],
    "emergency": {
      "isEmergency": false,
      "urgencyLevel": "Medium",
      "timeframe": "Within 24 hours",
      "reason": "Moderate symptoms requiring medical attention"
    },
    "analysisId": "analysis_1703123456789_abc123def",
    "timestamp": "2023-12-21T10:30:45.123Z",
    "disclaimer": "This is an AI analysis and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment."
  },
  "metadata": {
    "totalSymptoms": 3,
    "highSeverityCount": 1,
    "averageSeverity": 7.0
  }
}
```

#### 2. Get Symptoms List
**GET** `/api/symptoms/list`

Returns a list of common symptoms with categories for frontend use.

**Response:**
```json
{
  "success": true,
  "message": "Symptoms list retrieved successfully",
  "data": {
    "symptoms": [
      {"name": "Fever", "category": "General"},
      {"name": "Headache", "category": "Neurological"},
      {"name": "Cough", "category": "Respiratory"}
    ],
    "categories": {
      "General": ["Fever", "Fatigue", "Loss of appetite"],
      "Respiratory": ["Cough", "Shortness of breath", "Sore throat"],
      "Neurological": ["Headache", "Dizziness"],
      "Gastrointestinal": ["Nausea", "Vomiting", "Diarrhea"]
    },
    "total": 20
  }
}
```

#### 3. Validate Symptom Data
**POST** `/api/symptoms/validate`

Validates symptom data before analysis.

**Request Body:**
```json
{
  "symptoms": [
    {"name": "Fever", "severity": 7},
    {"name": "Cough", "severity": 8}
  ]
}
```

#### 4. Get Analysis History
**GET** `/api/symptoms/history?limit=10&offset=0`

Retrieves user's previous symptom analyses (future implementation).

### Rate Limiting

- **Symptom Analysis**: 5 requests per 15 minutes per user
- **Get Symptoms List**: 10 requests per minute per user
- **Validation**: 20 requests per minute per user
- **History**: 30 requests per minute per user

### Data Validation

#### Symptoms Array:
- **Required**: Must contain 1-20 symptoms
- **name**: 2-100 characters, letters/spaces/hyphens only
- **severity**: Integer between 1-10
- **duration**: Optional, up to 50 characters

#### Patient Info (Optional):
- **age**: 0-150
- **gender**: 'M', 'F', or 'Other'
- **medicalHistory**: Array of strings
- **allergies**: Array of strings
- **currentMedications**: Array of strings

### Error Handling

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "symptoms.0.severity",
      "message": "Severity must be an integer between 1 and 10"
    }
  ]
}
```

### Security Features

- **Authentication Required**: All endpoints require valid JWT token
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive data validation
- **Error Sanitization**: Sensitive information not exposed in production

### Usage Example

```javascript
// Frontend integration example
const analyzeSymptoms = async (symptoms, patientInfo) => {
  try {
    const response = await fetch('/api/symptoms/analyze', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ symptoms, patientInfo })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Display analysis results
      console.log('Disease:', result.data.disease.name);
      console.log('Severity:', result.data.severity.description);
      console.log('Medications:', result.data.medications);
      
      // Check for emergency
      if (result.data.emergency.isEmergency) {
        alert('Emergency medical attention required!');
      }
    }
  } catch (error) {
    console.error('Analysis failed:', error);
  }
};
```

### Best Practices

1. **Always include disclaimer**: The AI analysis is for preliminary assessment only
2. **Emergency handling**: Implement proper emergency detection and response
3. **Data privacy**: Never store sensitive medical data without proper encryption
4. **Rate limiting**: Respect API limits to avoid blocking
5. **Error handling**: Implement proper error handling for network issues
6. **Validation**: Always validate input data before sending to API

### Testing in Development

The API includes development-friendly features:
- OTP is returned in response (development only)
- Detailed error messages
- Console logging
- Gemini API error details in development mode

### Production Considerations

- Set `NODE_ENV=production`
- Configure proper CORS origins
- Set up SSL/TLS
- Configure proper database connection pooling
- Set up monitoring and logging
- Configure backup strategies
- **Medical Compliance**: Ensure compliance with healthcare regulations (HIPAA, etc.)
- **Data Encryption**: Encrypt all medical data at rest and in transit
- **Audit Logging**: Log all medical analysis requests for compliance

## License

MIT License