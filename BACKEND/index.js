import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import configurations
import sequelize from './config/db.js';
import redisClient from './config/redis.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import symptomRoutes from './routes/symptomRoutes.js';

// Import middleware
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy settings for rate limiting to work correctly
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with your actual domain
    : ['http://localhost:5000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MVP Auth Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      symptoms: '/api/symptoms',
      health: '/api/auth/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  let dbConnected = false;
  let redisConnected = false;

  try {
    // Try to connect to Redis (non-blocking)
    try {
      await redisClient.connect();
      console.log('✅ Connected to Redis');
      redisConnected = true;
    } catch (redisError) {
      console.warn('⚠️  Redis connection failed:', redisError.message);
      console.warn('⚠️  Some features may not work (OTP, caching)');
    }

    // Try to connect to database (non-blocking)
    try {
      await sequelize.authenticate();
      console.log('✅ Connected to PostgreSQL database');
      
      // Sync database models (create tables)
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      console.log('✅ Database models synchronized');
      dbConnected = true;
    } catch (dbError) {
      console.warn('⚠️  Database connection failed:', dbError.message);
      console.warn('⚠️  Some features may not work (authentication, history)');
    }

    // Start server regardless of database/Redis status
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💡 Symptom Checker: Available (public endpoint)`);
      if (!dbConnected) {
        console.log(`⚠️  Authentication: Disabled (database not connected)`);
      }
      if (!redisConnected) {
        console.log(`⚠️  OTP/Caching: Disabled (Redis not connected)`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  await redisClient.disconnect();
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  await redisClient.disconnect();
  await sequelize.close();
  process.exit(0);
});

startServer();