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

// Symptom analysis validation
export const validateSymptomAnalysis = [
  body('symptoms')
    .isArray({ min: 1, max: 20 })
    .withMessage('Symptoms array is required and must contain 1-20 symptoms'),
  body('symptoms.*.name')
    .notEmpty()
    .withMessage('Symptom name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Symptom name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'()]+$/)
    .withMessage('Symptom name can only contain letters, spaces, hyphens, apostrophes, and parentheses'),
  body('symptoms.*.severity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Severity must be an integer between 1 and 10'),
  body('symptoms.*.duration')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Duration must be between 1 and 50 characters'),
  body('patientInfo.age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('patientInfo.gender')
    .optional()
    .isIn(['M', 'F', 'Other'])
    .withMessage('Gender must be M, F, or Other'),
  body('patientInfo.medicalHistory')
    .optional()
    .isArray()
    .withMessage('Medical history must be an array'),
  body('patientInfo.allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  body('patientInfo.currentMedications')
    .optional()
    .isArray()
    .withMessage('Current medications must be an array')
];

export const validateSymptomData = [
  body('symptoms')
    .isArray({ min: 1 })
    .withMessage('Symptoms array is required and must contain at least one symptom'),
  body('symptoms.*.name')
    .notEmpty()
    .withMessage('Symptom name is required'),
  body('symptoms.*.severity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Severity must be an integer between 1 and 10')
];
  