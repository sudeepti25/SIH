import twilio from 'twilio';
import redisClient from '../config/redis.js';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
        await twilioClient.messages.create({
          body: `Your OTP for MVP Auth is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${mobileNumber}` // Assuming Indian numbers
        });
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