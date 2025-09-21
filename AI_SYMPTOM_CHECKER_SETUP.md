# AI Symptom Checker Integration Guide

This guide explains how to set up and use the AI-powered symptom checker that integrates with Google's Gemini AI.

## Features

✅ **Public Endpoint**: Works without user authentication  
✅ **AI-Powered Analysis**: Uses Google Gemini AI for symptom analysis  
✅ **Fallback Support**: Provides mock responses when API is unavailable  
✅ **Emergency Detection**: Identifies high-severity symptoms  
✅ **Error Handling**: Robust error handling with timeouts  
✅ **Frontend Integration**: Complete React component with validation  

## Setup Instructions

### 1. Backend Configuration

#### Install Dependencies
The required Google Generative AI package is already installed in the backend.

#### Environment Variables
Create a `.env` file in the `BACKEND` folder with the following:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Other configurations...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mvp_auth
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

#### Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key and replace `your_actual_gemini_api_key_here` in your `.env` file

### 2. Frontend Configuration

#### Environment Variables
Create a `.env` file in the `FRONTEND` folder:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints

### Symptom Analysis (Public)
```
POST /api/symptoms/analyze
```

**Request Body:**
```json
{
  "symptoms": [
    {
      "name": "Fever",
      "severity": 7,
      "duration": "3-5 days"
    },
    {
      "name": "Cough",
      "severity": 5,
      "duration": "1 week"
    }
  ],
  "patientInfo": {
    "age": 30,
    "gender": "M",
    "medicalHistory": ["diabetes"],
    "allergies": ["peanuts"],
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
      "name": "Upper Respiratory Infection",
      "description": "Common viral infection affecting the upper respiratory tract",
      "probability": "High"
    },
    "severity": {
      "level": 6,
      "description": "Moderate",
      "urgency": "Medium"
    },
    "medications": [
      {
        "name": "Acetaminophen",
        "type": "Over-the-counter",
        "purpose": "Fever reduction",
        "dosage": "500mg every 6 hours",
        "notes": "Do not exceed 3000mg per day"
      }
    ],
    "recommendations": [
      "Rest and stay hydrated",
      "Monitor symptoms for worsening",
      "Consult doctor if symptoms persist beyond 7 days"
    ],
    "redFlags": [
      "Difficulty breathing",
      "Fever above 103°F",
      "Severe chest pain"
    ],
    "emergency": {
      "isEmergency": false,
      "urgencyLevel": "Medium",
      "timeframe": "Within 24 hours",
      "reason": "Moderate symptoms warrant medical consultation"
    },
    "analysisId": "analysis_1234567890_abc123",
    "timestamp": "2025-09-20T10:30:00.000Z",
    "disclaimer": "This is an AI analysis and should not replace professional medical advice."
  }
}
```

### Other Endpoints (Public)
```
GET /api/symptoms/list          # Get available symptoms
POST /api/symptoms/validate     # Validate symptom data
GET /api/symptoms/history       # Get analysis history (auth required)
```

## Usage in Frontend

### React Component Integration

```jsx
import React, { useState } from 'react';
import SymptomChecker from '../components/SymptomChecker';
import SymptomAnalysisResult from '../components/SymptomAnalysisResult';
import { useSymptomAnalysis } from '../hooks/useSymptomAnalysis';

function MyComponent() {
  const {
    analysisResult,
    isAnalyzing,
    analysisError,
    analyzeSymptoms,
    clearAnalysis,
    isEmergency
  } = useSymptomAnalysis();

  const handleAnalyze = async (symptomData) => {
    const result = await analyzeSymptoms(symptomData);
    if (result) {
      console.log('Analysis completed:', result);
    }
  };

  return (
    <div>
      <SymptomChecker
        onAnalyze={handleAnalyze}
        isLoading={isAnalyzing}
      />
      
      {analysisResult && (
        <SymptomAnalysisResult
          result={analysisResult}
          onClose={clearAnalysis}
          isEmergency={isEmergency}
        />
      )}
      
      {analysisError && (
        <div className="error">
          Error: {analysisError}
        </div>
      )}
    </div>
  );
}
```

## Testing the Integration

### 1. Start the Backend
```bash
cd BACKEND
npm install
npm run dev
```

### 2. Start the Frontend
```bash
cd FRONTEND
npm install
npm run dev
```

### 3. Test the Symptom Checker
1. Navigate to the Patient Dashboard
2. Fill out the symptom checker form
3. Click "Analyze Symptoms"
4. View the AI-generated analysis

### 4. Test Without Gemini API
If you don't have a Gemini API key yet, the system will automatically use mock responses for testing.

## Key Improvements Made

1. **Removed Authentication Requirement**: The symptom checker now works without login
2. **Enhanced Error Handling**: Added timeouts and better error messages
3. **Improved Gemini Integration**: Better prompt engineering and response parsing
4. **Mock Response Fallback**: Graceful degradation when API is unavailable
5. **Frontend Updates**: Updated hooks to work without authentication
6. **Public API Endpoints**: Created separate public API request functions

## Troubleshooting

### Common Issues

1. **"Gemini API not configured" message**
   - Ensure your `GEMINI_API_KEY` is set in the backend `.env` file
   - Verify the API key is valid

2. **Network errors**
   - Check if the backend server is running on the correct port
   - Verify `VITE_API_BASE_URL` in frontend `.env` file

3. **CORS issues**
   - Ensure the backend CORS configuration allows frontend requests

4. **Timeout errors**
   - The system has 30-second timeouts for analysis and 15-second for emergency assessment
   - If Gemini is slow, it will fall back to mock responses

### Debug Mode
Set `NODE_ENV=development` in your backend `.env` file to see detailed error messages.

## Security Notes

- The symptom analysis endpoint is intentionally public as requested
- Patient information is optional and not stored
- All other authenticated endpoints remain protected
- API keys are properly secured in environment variables

## Next Steps

1. **Add Gemini API Key**: Get a real Gemini API key for production use
2. **Test with Real Data**: Try various symptom combinations
3. **Monitor Performance**: Check response times and accuracy
4. **Customize Prompts**: Adjust the Gemini prompts for your specific use case
5. **Add Analytics**: Track usage patterns and improve the system

The AI symptom checker is now fully integrated and ready for use!