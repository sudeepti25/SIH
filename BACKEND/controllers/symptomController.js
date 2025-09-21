import geminiService from '../services/geminiService.js';
import { validationResult } from 'express-validator';

class SymptomController {
  /**
   * Analyze symptoms using AI
   * POST /api/symptoms/analyze
   */
  async analyzeSymptoms(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { symptoms, patientInfo } = req.body;
      const userId = req.user?.id || 'anonymous'; // Handle non-authenticated requests

      // Log the analysis request
      console.log(`Symptom analysis requested by user ${userId}:`, {
        symptomCount: symptoms.length,
        timestamp: new Date().toISOString()
      });

      // Perform symptom analysis
      const analysisResult = await geminiService.analyzeSymptoms(symptoms);

      // Check if emergency assessment is needed
      const emergencyAssessment = await geminiService.getEmergencyAssessment(symptoms);

      // Prepare response
      const response = {
        success: true,
        message: 'Symptom analysis completed successfully',
        data: {
          ...analysisResult.data,
          emergency: emergencyAssessment,
          analysisId: SymptomController.generateAnalysisId(),
          timestamp: new Date().toISOString(),
          patientInfo: patientInfo || null
        },
        metadata: {
          totalSymptoms: symptoms.length,
          highSeverityCount: symptoms.filter(s => s.severity >= 8).length,
          averageSeverity: SymptomController.calculateAverageSeverity(symptoms)
        }
      };

      // Log successful analysis
      console.log(`Analysis completed for user ${userId}, Analysis ID: ${response.data.analysisId}`);

      res.status(200).json(response);

    } catch (error) {
      console.error('Error in symptom analysis:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to analyze symptoms',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get symptom analysis history for a user
   * GET /api/symptoms/history
   */
  async getAnalysisHistory(req, res) {
    try {
      const userId = req.user?.id || 'anonymous';
      const { limit = 10, offset = 0 } = req.query;

      // TODO: Implement database storage for analysis history
      // For now, return a placeholder response
      res.status(200).json({
        success: true,
        message: 'Analysis history retrieved',
        data: {
          analyses: [],
          total: 0,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });

    } catch (error) {
      console.error('Error retrieving analysis history:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analysis history',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get available symptoms list
   * GET /api/symptoms/list
   */
  async getSymptomsList(req, res) {
    try {
      const commonSymptoms = [
        { name: 'Fever', category: 'General' },
        { name: 'Headache', category: 'Neurological' },
        { name: 'Cough', category: 'Respiratory' },
        { name: 'Sore throat', category: 'Respiratory' },
        { name: 'Runny nose', category: 'Respiratory' },
        { name: 'Chest pain', category: 'Cardiovascular' },
        { name: 'Shortness of breath', category: 'Respiratory' },
        { name: 'Nausea', category: 'Gastrointestinal' },
        { name: 'Vomiting', category: 'Gastrointestinal' },
        { name: 'Diarrhea', category: 'Gastrointestinal' },
        { name: 'Abdominal pain', category: 'Gastrointestinal' },
        { name: 'Fatigue', category: 'General' },
        { name: 'Dizziness', category: 'Neurological' },
        { name: 'Joint pain', category: 'Musculoskeletal' },
        { name: 'Muscle aches', category: 'Musculoskeletal' },
        { name: 'Skin rash', category: 'Dermatological' },
        { name: 'Back pain', category: 'Musculoskeletal' },
        { name: 'Loss of appetite', category: 'General' },
        { name: 'Sleep problems', category: 'General' },
        { name: 'Anxiety', category: 'Mental Health' }
      ];

      const categorizedSymptoms = this.categorizeSymptoms(commonSymptoms);

      res.status(200).json({
        success: true,
        message: 'Symptoms list retrieved successfully',
        data: {
          symptoms: commonSymptoms,
          categories: categorizedSymptoms,
          total: commonSymptoms.length
        }
      });

    } catch (error) {
      console.error('Error retrieving symptoms list:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve symptoms list',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Validate symptom data format
   * POST /api/symptoms/validate
   */
  async validateSymptomData(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { symptoms } = req.body;

      // Additional business logic validation
      const validationIssues = [];

      // Check for duplicate symptoms
      const symptomNames = symptoms.map(s => s.name.toLowerCase());
      const duplicates = symptomNames.filter((name, index) => symptomNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        validationIssues.push(`Duplicate symptoms found: ${duplicates.join(', ')}`);
      }

      // Check severity ranges
      const invalidSeverities = symptoms.filter(s => s.severity < 1 || s.severity > 10);
      if (invalidSeverities.length > 0) {
        validationIssues.push('Some symptoms have invalid severity levels (must be 1-10)');
      }

      if (validationIssues.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Symptom data validation failed',
          issues: validationIssues
        });
      }

      res.status(200).json({
        success: true,
        message: 'Symptom data is valid',
        data: {
          totalSymptoms: symptoms.length,
          averageSeverity: SymptomController.calculateAverageSeverity(symptoms),
          highSeverityCount: symptoms.filter(s => s.severity >= 8).length
        }
      });

    } catch (error) {
      console.error('Error validating symptom data:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to validate symptom data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Helper methods

  /**
   * Generate unique analysis ID
   */
  static generateAnalysisId() {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate average severity of symptoms
   */
  static calculateAverageSeverity(symptoms) {
    if (symptoms.length === 0) return 0;
    const total = symptoms.reduce((sum, symptom) => sum + symptom.severity, 0);
    return Math.round((total / symptoms.length) * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Categorize symptoms by type
   */
  categorizeSymptoms(symptoms) {
    const categories = {};
    symptoms.forEach(symptom => {
      if (!categories[symptom.category]) {
        categories[symptom.category] = [];
      }
      categories[symptom.category].push(symptom.name);
    });
    return categories;
  }
}

export default new SymptomController();