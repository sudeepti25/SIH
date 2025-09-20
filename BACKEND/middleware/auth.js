import JWTService from '../services/jwtService.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = JWTService.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = JWTService.verifyToken(token);
    
    // Optional: Verify user still exists
    const user = await User.findByPk(decoded.server_id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = JWTService.extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = JWTService.verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional routes
    next();
  }
};