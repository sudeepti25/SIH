import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class JWTService {
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
  }

  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export default JWTService;