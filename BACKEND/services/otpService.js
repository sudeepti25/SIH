import twilio from 'twilio';
import redisClient from '../config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client with error handling
let twilioClient = null;

try {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (accountSid && authToken && 
      accountSid !== 'your_twilio_account_sid' && 
      authToken !== 'your_twilio_auth_token' &&
      accountSid.startsWith('AC')) {
    twilioClient = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
  } else {
    console.warn('⚠️  Twilio credentials not configured. SMS functionality will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error.message);
  twilioClient = null;
}

class OTPService {
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(mobileNumber) {
    try {
      const otp = this.generateOTP();
      const key = `otp:${mobileNumber}`;
      const attemptKey = `otp_attempts:${mobileNumber}`;
      
      // Check attempt limits
      const attempts = await redisClient.get(attemptKey) || 0;
      if (parseInt(attempts) >= parseInt(process.env.MAX_OTP_ATTEMPTS)) {
        throw new Error('Maximum OTP attempts exceeded. Please try after some time.');
      }

      // Store OTP in Redis with expiry
     await redisClient.setEx(
  key,
  parseInt(process.env.OTP_EXPIRY_MINUTES) * 60,
  otp.toString()
);

// Increment attempt counter
await redisClient.setEx(
  attemptKey,
  3600,
  (parseInt(attempts) + 1).toString()
);

      // Send SMS (only in production or if explicitly enabled)
      if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SMS === 'true') {
        console.log(`Attempting to send SMS to: +91${mobileNumber}`);
        console.log(`Using Twilio Phone: ${process.env.TWILIO_PHONE_NUMBER}`);
        
        try {
          const message = await twilioClient.messages.create({
            body: `Your OTP for MVP Auth is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${mobileNumber}` // Assuming Indian numbers
          });
          
          console.log(`SMS sent successfully. Message SID: ${message.sid}`);
        } catch (smsError) {
          console.error('Twilio SMS Error:', {
            error: smsError.message,
            code: smsError.code,
            status: smsError.status,
            moreInfo: smsError.moreInfo
          });
          
          // Don't throw error for SMS failure in development
          if (process.env.NODE_ENV === 'production') {
            throw new Error(`SMS sending failed: ${smsError.message}`);
          } else {
            console.log('SMS failed but continuing in development mode...');
          }
        }
      } else {
        console.log('SMS sending disabled. Set ENABLE_SMS=true to enable SMS in development.');
      }

      // In development, return OTP for testing
      const response = {
        success: true,
        message: 'OTP sent successfully'
      };

      if (process.env.NODE_ENV === 'development') {
        response.otp = otp; // Only for development
      }

      return response;
    } catch (error) {
      console.error('OTP Service Error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  static async verifyOTP(mobileNumber, otp) {
    try {
      const key = `otp:${mobileNumber}`;
      const storedOTP = await redisClient.get(key);

      if (!storedOTP) {
        return { success: false, message: 'OTP expired or not found' };
      }

      if (storedOTP !== otp) {
        return { success: false, message: 'Invalid OTP' };
      }

      // Delete OTP after successful verification
      await redisClient.del(key);
      await redisClient.del(`otp_attempts:${mobileNumber}`);

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return { success: false, message: 'OTP verification failed' };
    }
  }

  static async clearOTPAttempts(mobileNumber) {
    try {
      await redisClient.del(`otp_attempts:${mobileNumber}`);
      return true;
    } catch (error) {
      console.error('Clear OTP Attempts Error:', error);
      return false;
    }
  }
}

export default OTPService;