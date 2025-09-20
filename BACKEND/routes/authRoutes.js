import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validateSendOTP, 
  validateVerifyOTP, 
  validateRegister, 
  validateLogin, 
  validateSyncUsers,
  validateRefreshToken 
} from '../middleware/validation.js';
import { otpLimiter, authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// OTP Routes
router.post('/send-otp', otpLimiter, validateSendOTP, AuthController.sendOTP);
router.post('/verify-otp', otpLimiter, validateVerifyOTP, AuthController.verifyOTP);

// Registration Routes
router.post('/register', validateRegister, AuthController.register);
router.post('/register-offline', validateRegister, AuthController.registerOffline);

// Authentication Routes
router.post('/login', authLimiter, validateLogin, AuthController.login);
router.post('/refresh-token', validateRefreshToken, AuthController.refreshToken);

// Sync Routes
router.post('/sync-users', validateSyncUsers, AuthController.syncUsers);

// Protected Routes
router.get('/profile', authenticate, AuthController.getProfile);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
