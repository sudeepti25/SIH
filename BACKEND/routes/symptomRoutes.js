import express from 'express';
import symptomController from '../controllers/symptomController.js';
import { validateSymptomAnalysis, validateSymptomData } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import { rateLimiter, createRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/symptoms/analyze
 * @desc    Analyze symptoms using AI
 * @access  Public
 * @body    { symptoms: [{ name: string, severity: number, duration?: string }], patientInfo?: object }
 */
router.post('/analyze', 
  createRateLimiter(5, 15 * 60 * 1000), // 5 requests per 15 minutes
  validateSymptomAnalysis,
  symptomController.analyzeSymptoms
);

/**
 * @route   GET /api/symptoms/history
 * @desc    Get symptom analysis history for the authenticated user
 * @access  Public
 * @query   ?limit=10&offset=0
 */
router.get('/history',
  rateLimiter(30, 60 * 1000), // 30 requests per minute
  symptomController.getAnalysisHistory
);

/**
 * @route   GET /api/symptoms/list
 * @desc    Get list of available symptoms with categories
 * @access  Public
 */
router.get('/list',
  rateLimiter(10, 60 * 1000), // 10 requests per minute
  symptomController.getSymptomsList
);

/**
 * @route   POST /api/symptoms/validate
 * @desc    Validate symptom data format
 * @access  Public
 * @body    { symptoms: [{ name: string, severity: number }] }
 */
router.post('/validate',
  rateLimiter(20, 60 * 1000), // 20 requests per minute
  validateSymptomData,
  symptomController.validateSymptomData
);

export default router;