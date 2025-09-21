# AI Symptom Checker Integration Documentation

## Overview

This documentation describes the integration between the AI symptom checker backend and frontend components for the Sahayata Platform.

## Backend API Endpoints

The backend provides the following API endpoints for symptom analysis:

### 1. Analyze Symptoms
- **Endpoint**: `POST /api/symptoms/analyze`
- **Description**: Analyzes patient symptoms using Google's Gemini AI
- **Authentication**: Required (JWT token)
- **Rate Limit**: 5 requests per 15 minutes per user

### 2. Get Symptoms List
- **Endpoint**: `GET /api/symptoms/list`
- **Description**: Returns a list of common symptoms with categories
- **Rate Limit**: 10 requests per minute per user

### 3. Validate Symptom Data
- **Endpoint**: `POST /api/symptoms/validate`
- **Description**: Validates symptom data before analysis
- **Rate Limit**: 20 requests per minute per user

### 4. Get Analysis History
- **Endpoint**: `GET /api/symptoms/history`
- **Description**: Retrieves user's previous symptom analyses
- **Rate Limit**: 30 requests per minute per user

## Frontend Integration

### 1. API Service Utility (`src/utils/api.js`)
- Centralized API communication with proper authentication
- Error handling and token management
- Utility functions for data formatting
- Support for all backend endpoints

### 2. Enhanced SymptomChecker Component (`src/components/SymptomChecker.jsx`)
**New Features:**
- Patient information input (age, gender, medical history, allergies, medications)
- Support for API data format with individual symptom severity and duration
- Loading states and disabled states during analysis
- Expanded symptom list (20 symptoms)
- Better error handling and user feedback
- Medical disclaimer

### 3. New SymptomAnalysisResult Component (`src/components/SymptomAnalysisResult.jsx`)
**Features:**
- Display comprehensive AI analysis results
- Emergency alerts with urgent care recommendations
- Disease information with probability assessment
- Severity assessment with color-coded urgency levels
- Medication recommendations with dosage and notes
- Care recommendations and warning signs
- Action buttons for booking appointments, saving analysis, and sharing with doctors

### 4. Updated UserContext (`src/contexts/UserContext.jsx`)
**Enhancements:**
- JWT token storage and management
- Refresh token support
- Authentication state tracking
- Token update functionality

### 5. Custom Hook (`src/hooks/useSymptomAnalysis.js`)
**Features:**
- Centralized symptom analysis logic
- State management for analysis results, loading, and errors
- Analysis history tracking
- Emergency detection utilities
- Validation functions

### 6. Updated PatientDashboard (`src/pages/PatientDashboard.jsx`)
**Enhancements:**
- Integration with symptom analysis API
- Real-time emergency alerts
- Loading states and error handling
- Analysis result display
- Improved user experience with feedback messages

## Data Flow

### 1. Symptom Analysis Process
```
User Input → SymptomChecker → API Call → Gemini AI → Analysis Result → Display
```

### 2. Data Structure

**Input to API:**
```json
{
  "symptoms": [
    {
      "name": "Fever",
      "severity": 7,
      "duration": "2 days"
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

**Output from API:**
```json
{
  "success": true,
  "data": {
    "disease": {
      "name": "Upper Respiratory Tract Infection",
      "description": "Common viral infection",
      "probability": "High"
    },
    "severity": {
      "level": 6,
      "description": "Moderate",
      "urgency": "Medium"
    },
    "medications": [...],
    "recommendations": [...],
    "redFlags": [...],
    "emergency": {
      "isEmergency": false,
      "urgencyLevel": "Medium"
    }
  }
}
```

## Security Features

### 1. Authentication
- JWT-based authentication required for all symptom analysis endpoints
- Token refresh mechanism
- Automatic token expiration handling

### 2. Rate Limiting
- Different rate limits for different endpoints
- User-specific rate limiting
- Protection against API abuse

### 3. Input Validation
- Comprehensive validation of symptom data
- Sanitization of user inputs
- Error messages for validation failures

### 4. Error Handling
- Network error detection
- Token expiration handling
- Validation error processing
- User-friendly error messages

## Environment Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development
VITE_APP_NAME=Sahayata Platform
```

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
# ... other configurations
```

## Usage Examples

### 1. Basic Symptom Analysis
```javascript
import { useSymptomAnalysis } from '../hooks/useSymptomAnalysis';

const { analyzeSymptoms, isAnalyzing, analysisResult } = useSymptomAnalysis();

const handleAnalyze = async (symptomData) => {
  const result = await analyzeSymptoms(symptomData);
  if (result) {
    // Handle successful analysis
  }
};
```

### 2. Emergency Detection
```javascript
const { isEmergency, urgencyLevel } = useSymptomAnalysis();

if (isEmergency) {
  // Show emergency alert
  alert('Urgent medical attention required!');
}
```

## Error Handling

### 1. Common Error Types
- **Authentication Errors**: Token expired, invalid token
- **Validation Errors**: Invalid symptom data, missing required fields
- **Network Errors**: Connection issues, server unavailable
- **Rate Limit Errors**: Too many requests

### 2. Error Recovery
- Automatic retry mechanisms
- Token refresh for expired tokens
- User-friendly error messages
- Graceful degradation

## Best Practices

### 1. API Usage
- Always validate data before sending to API
- Handle loading states appropriately
- Implement proper error handling
- Respect rate limits

### 2. User Experience
- Show loading indicators during analysis
- Display clear error messages
- Provide retry options for failed requests
- Include medical disclaimers

### 3. Security
- Never store sensitive medical data without encryption
- Always use HTTPS in production
- Implement proper authentication checks
- Validate all user inputs

## Testing

### 1. Component Testing
- Test symptom input validation
- Test API integration
- Test error handling
- Test loading states

### 2. API Testing
- Test all endpoints with valid data
- Test error responses
- Test rate limiting
- Test authentication

## Future Enhancements

### 1. Planned Features
- Symptom analysis history
- Export analysis results
- Integration with doctor appointments
- Offline symptom tracking
- Voice input for symptoms

### 2. Performance Improvements
- Caching of symptoms list
- Optimistic UI updates
- Background analysis validation
- Progressive loading

## Support and Maintenance

### 1. Monitoring
- API response times
- Error rates
- User engagement metrics
- Emergency alert frequency

### 2. Updates
- Regular security updates
- API version management
- Feature rollouts
- Bug fixes

## Compliance and Legal

### 1. Medical Compliance
- HIPAA compliance considerations
- Medical disclaimer requirements
- Data privacy protection
- Professional medical advice limitations

### 2. Data Protection
- Encryption at rest and in transit
- Audit logging
- Data retention policies
- User consent management

---

This integration provides a comprehensive AI-powered symptom analysis system that enhances the telemedicine platform's capabilities while maintaining security, usability, and medical compliance standards.