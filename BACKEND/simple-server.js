import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import symptom routes (only essential for symptom checker)
import symptomRoutes from './routes/symptomRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes - only symptom checker for now
app.use('/api/symptoms', symptomRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Symptom Checker API - Simplified Mode',
    version: '1.0.0',
    endpoints: {
      symptoms: '/api/symptoms',
      health: '/health'
    },
    note: 'Running in simplified mode - only symptom checker available'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    features: {
      symptomChecker: 'Available',
      geminiAI: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'Configured' : 'Mock Mode'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: ['/api/symptoms', '/health']
  });
});

// Start server immediately (no database dependencies)
app.listen(PORT, () => {
  console.log('🚀 Simplified Symptom Checker Server Started');
  console.log(`🔗 Server running on: http://localhost:${PORT}`);
  console.log(`💡 Symptom Checker API: http://localhost:${PORT}/api/symptoms`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    console.log('🤖 Gemini AI: Configured and ready');
  } else {
    console.log('🎭 Gemini AI: Using mock responses (set GEMINI_API_KEY for real AI)');
  }
  
  console.log('\n✅ Ready to receive symptom analysis requests!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  process.exit(0);
});