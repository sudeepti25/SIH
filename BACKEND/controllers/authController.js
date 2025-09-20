import { validationResult } from 'express-validator';
import User from '../models/User.js';
import OTPService from '../services/otpService.js';
import JWTService from '../services/jwtService.js';
import redisClient from '../config/redis.js';

class AuthController {
  // Step 1: Send OTP for mobile verification
  static async sendOTP(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { mobile_number } = req.body;

      const result = await OTPService.sendOTP(mobile_number);
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Send OTP Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send OTP'
      });
    }
  }

  // Step 2: Verify OTP and allow registration/login
  static async verifyOTP(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { mobile_number, otp } = req.body;

      const verification = await OTPService.verifyOTP(mobile_number, otp);
      
      if (!verification.success) {
        return res.status(400).json(verification);
      }

      // Store verified mobile in Redis temporarily for registration
      await redisClient.setEx(`verified:${mobile_number}`, 1800, 'true'); // 30 minutes

      res.status(200).json({
        success: true,
        message: 'Mobile number verified successfully',
        verified: true
      });
    } catch (error) {
      console.error('Verify OTP Error:', error);
      res.status(500).json({
        success: false,
        message: 'OTP verification failed'
      });
    }
  }

  // Step 3: Register new user (after OTP verification)
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { mobile_number, pin, name, dob, gender, aadhaar_id, device_id } = req.body;

      // Check if mobile is verified
      const isVerified = await redisClient.get(`verified:${mobile_number}`);
      if (!isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number not verified. Please verify OTP first.'
        });
      }

      // Check if user with same mobile and pin already exists
      const existingUser = await User.findOne({
        where: { mobile_number, }
      });

      if (existingUser && await existingUser.validatePin(pin)) {
        return res.status(409).json({
          success: false,
          message: 'User with this mobile number and PIN already exists'
        });
      }

      // Create new user
      const user = await User.create({
        mobile_number,
        pin,
        name,
        dob,
        gender,
        aadhaar_id,
        device_id,
        is_mobile_verified: true,
        synced_at: new Date()
      });

      // Generate JWT token
      const token = JWTService.generateToken({
        server_id: user.server_id,
        mobile_number: user.mobile_number
      });

      const refreshToken = JWTService.generateRefreshToken({
        server_id: user.server_id,
        mobile_number: user.mobile_number
      });

      // Clear verification status
      await redisClient.del(`verified:${mobile_number}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: user.toJSON(),
        token,
        refreshToken
      });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  }

  // Step 4: Login with mobile + PIN
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { mobile_number, pin, device_id } = req.body;

      // Find user by mobile number
      const user = await User.findOne({
        where: { mobile_number }
      });

      if (!user || !(await user.validatePin(pin))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid mobile number or PIN'
        });
      }

      // Update device_id if provided and different
      if (device_id && user.device_id !== device_id) {
        await user.update({ device_id });
      }

      // Generate JWT token
      const token = JWTService.generateToken({
        server_id: user.server_id,
        mobile_number: user.mobile_number
      });

      const refreshToken = JWTService.generateRefreshToken({
        server_id: user.server_id,
        mobile_number: user.mobile_number
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: user.toJSON(),
        token,
        refreshToken
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  // Step 5: Sync users from offline to online
  static async syncUsers(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { users } = req.body; // Array of users from local DB
      const syncResults = [];

      for (const userData of users) {
        try {
          const { mobile_number, pin, name, dob, gender, aadhaar_id, device_id, local_id } = userData;

          // Check if user already exists
          let user = await User.findOne({
            where: { mobile_number }
          });

          if (user && await user.validatePin(pin)) {
            // User exists, return server_id
            syncResults.push({
              local_id,
              server_id: user.server_id,
              status: 'exists',
              message: 'User already exists on server'
            });
          } else {
            // Create new user
            user = await User.create({
              mobile_number,
              pin,
              name,
              dob,
              gender,
              aadhaar_id,
              device_id,
              is_mobile_verified: false, // Will be verified when online
              synced_at: new Date()
            });

            syncResults.push({
              local_id,
              server_id: user.server_id,
              status: 'created',
              message: 'User created successfully'
            });
          }
        } catch (userError) {
          console.error(`Sync error for user ${userData.local_id}:`, userError);
          syncResults.push({
            local_id: userData.local_id,
            server_id: null,
            status: 'error',
            message: userError.message || 'Sync failed for this user'
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'User sync completed',
        results: syncResults
      });
    } catch (error) {
      console.error('Sync Users Error:', error);
      res.status(500).json({
        success: false,
        message: 'User sync failed'
      });
    }
  }

  // Refresh token endpoint
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      const decoded = JWTService.verifyToken(refreshToken);
      
      // Generate new access token
      const newToken = JWTService.generateToken({
        server_id: decoded.server_id,
        mobile_number: decoded.mobile_number
      });

      res.status(200).json({
        success: true,
        token: newToken
      });
    } catch (error) {
      console.error('Refresh Token Error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }

  // Get user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.server_id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Get Profile Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }

  // Offline registration fallback (without OTP)
  static async registerOffline(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { mobile_number, pin, name, dob, gender, aadhaar_id, device_id } = req.body;

      // Create user without mobile verification
      const user = await User.create({
        mobile_number,
        pin,
        name,
        dob,
        gender,
        aadhaar_id,
        device_id,
        is_mobile_verified: false, // Will be verified later
        synced_at: new Date()
      });

      // Generate JWT token
      const token = JWTService.generateToken({
        server_id: user.server_id,
        mobile_number: user.mobile_number
      });

      const refreshToken = JWTService.generateRefreshToken({
        server_id: user.server_id,
        mobile_number: user.mobile_number
      });

      res.status(201).json({
        success: true,
        message: 'User registered offline successfully. Please verify mobile when online.',
        user: user.toJSON(),
        token,
        refreshToken,
        requires_verification: true
      });
    } catch (error) {
      console.error('Offline Registration Error:', error);
      res.status(500).json({
        success: false,
        message: 'Offline registration failed'
      });
    }
  }
}

export default AuthController;