# Quick Start Guide - Symptom Checker

## Step 1: Start Backend Server

Open a new terminal/PowerShell window and run:

```powershell
cd d:\HACKS\SIH\BACKEND
node simple-server.js
```

This will start a simplified server that only runs the symptom checker (no database dependencies).

## Step 2: Verify Backend is Running

You should see output like:
```
🚀 Simplified Symptom Checker Server Started
🔗 Server running on: http://localhost:5000
💡 Symptom Checker API: http://localhost:5000/api/symptoms
🔍 Health Check: http://localhost:5000/health
🎭 Gemini AI: Using mock responses (set GEMINI_API_KEY for real AI)

✅ Ready to receive symptom analysis requests!
```

## Step 3: Test Backend API

Open another terminal and test:
```powershell
cd d:\HACKS\SIH\BACKEND
node test-symptom-checker.js
```

## Step 4: Start Frontend

Open another terminal window and run:
```powershell
cd d:\HACKS\SIH\FRONTEND
npm run dev
```

## Step 5: Test the Integration

1. Open your browser to the frontend URL (usually http://localhost:3000 or http://localhost:5173)
2. Navigate to the Patient Dashboard
3. Fill out the symptom checker form
4. Click "Analyze Symptoms"
5. You should see the AI analysis results

## Troubleshooting

### If Backend Fails to Start:
1. Make sure no other process is using port 5000
2. Try running `netstat -ano | findstr :5000` to check
3. If something is using port 5000, either stop it or change the port in `.env`

### If Frontend Can't Connect:
1. Verify backend is running on http://localhost:5000
2. Check that `.env` in frontend has: `VITE_API_BASE_URL=http://localhost:5000/api`
3. Check browser console for CORS errors

### If You Want Real AI (not mock responses):
1. Get a Gemini API key from https://makersuite.google.com/app/apikey
2. Add to `BACKEND/.env`: `GEMINI_API_KEY=your_actual_api_key_here`
3. Restart the backend server

## Files Created/Modified:

1. `BACKEND/simple-server.js` - Simplified server without database dependencies
2. `BACKEND/test-symptom-checker.js` - Test script for API
3. `AI_SYMPTOM_CHECKER_SETUP.md` - Complete setup documentation
4. Modified symptom service, controller, and frontend components for proper integration

The symptom checker should now work without authentication as requested!