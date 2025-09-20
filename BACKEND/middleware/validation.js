import { body } from 'express-validator';

export const validateSendOTP = [
  body('mobile_number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be 10 digits')
    .isNumeric()
    .withMessage('Mobile number must contain only numbers')
];

export const validateVerifyOTP = [
  body('mobile_number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be 10 digits')
    .isNumeric()
    .withMessage('Mobile number must contain only numbers'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

export const validateRegister = [
  body('mobile_number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be 10 digits')
    .isNumeric()
    .withMessage('Mobile number must contain only numbers'),
  body('pin')
    .isLength({ min: 4, max: 4 })
    .withMessage('PIN must be 4 digits')
    .isNumeric()
    .withMessage('PIN must contain only numbers'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('dob')
    .isDate()
    .withMessage('Valid date of birth is required'),
  body('gender')
    .isIn(['M', 'F', 'Other'])
    .withMessage('Gender must be M, F, or Other'),
  body('aadhaar_id')
    .optional()
    .isLength({ min: 12, max: 12 })
    .withMessage('Aadhaar ID must be 12 digits')
    .isNumeric()
    .withMessage('Aadhaar ID must contain only numbers'),
  body('device_id')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Device ID must be between 1 and 255 characters')
];

export const validateLogin = [
  body('mobile_number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be 10 digits')
    .isNumeric()
    .withMessage('Mobile number must contain only numbers'),
  body('pin')
    .isLength({ min: 4, max: 4 })
    .withMessage('PIN must be 4 digits')
    .isNumeric()
    .withMessage('PIN must contain only numbers'),
      body('device_id')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Device ID must be between 1 and 255 characters')
];
export const validateSyncUsers = [
  body('users')
    .isArray({ min: 1 })
    .withMessage('Users array is required and must contain at least one user'),
  body('users.*.mobile_number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number must be 10 digits')
    .isNumeric()
    .withMessage('Mobile number must contain only numbers'),
  body('users.*.pin')
    .isLength({ min: 4, max: 4 })
    .withMessage('PIN must be 4 digits')
    .isNumeric()
    .withMessage('PIN must contain only numbers'),
  body('users.*.name')
    .notEmpty()
    .withMessage('Name is required'),
  body('users.*.dob')
    .isDate()
    .withMessage('Valid date of birth is required'),
  body('users.*.gender')
    .isIn(['M', 'F', 'Other'])
    .withMessage('Gender must be M, F, or Other'),
  body('users.*.local_id')
    .notEmpty()
    .withMessage('Local ID is required for sync')
];

export const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];
  