import { getGeminiModel } from '../config/gemini.js';

class GeminiService {
  constructor() {
    this.model = null;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      this.model = getGeminiModel();
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error.message);
      throw error;
    }
  }

  /**
   * Analyze symptoms using Gemini AI
   * @param {Array} symptoms - Array of symptom objects with name and severity
   * @returns {Promise<Object>} - Analysis result with disease, severity, medications
   */
  async analyzeSymptoms(symptoms) {
    try {
      if (!this.model) {
        await this.initializeModel();
      }

      // Construct the prompt for Gemini
      const prompt = this.constructAnalysisPrompt(symptoms);
      
      // Generate response using Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const analysisResult = this.parseGeminiResponse(text);
      
      return {
        success: true,
        data: analysisResult
      };

    } catch (error) {
      console.error('Error analyzing symptoms with Gemini:', error);
      throw new Error(`Symptom analysis failed: ${error.message}`);
    }
  }

  /**
   * Construct the prompt for Gemini AI
   * @param {Array} symptoms - Array of symptom objects
   * @returns {string} - Formatted prompt
   */
  constructAnalysisPrompt(symptoms) {
    const symptomsText = symptoms.map(symptom => 
      `- ${symptom.name} (Severity: ${symptom.severity}/10)`
    ).join('\n');

    return `You are an AI medical assistant. Analyze the following symptoms and provide a medical assessment.

**Patient Symptoms:**
${symptomsText}

**Instructions:**
1. Based on these symptoms, identify the most likely disease/condition
2. Assess the overall severity level (1-10 scale)
3. Suggest possible medications (generic names)
4. Provide brief recommendations
5. Include a disclaimer about consulting healthcare professionals

**Response Format (JSON only):**
{
  "disease": {
    "name": "Primary suspected condition",
    "description": "Brief description of the condition",
    "probability": "High/Medium/Low"
  },
  "severity": {
    "level": 1-10,
    "description": "Mild/Moderate/Severe",
    "urgency": "Low/Medium/High/Emergency"
  },
  "medications": [
    {
      "name": "Medication name",
      "type": "Over-the-counter/Prescription",
      "purpose": "Pain relief/Fever reduction/etc",
      "dosage": "Suggested dosage",
      "notes": "Important notes or warnings"
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "redFlags": [
    "Warning signs that require immediate medical attention"
  ],
  "disclaimer": "This is an AI analysis and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment."
}

Respond with only the JSON object, no additional text.`;
  }

  /**
   * Parse Gemini response and validate JSON
   * @param {string} responseText - Raw response from Gemini
   * @returns {Object} - Parsed JSON response
   */
  parseGeminiResponse(responseText) {
    try {
      // Clean the response text to extract JSON
      let cleanedText = responseText.trim();
      
      // Remove any markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Parse JSON
      const parsedResponse = JSON.parse(cleanedText);
      
      // Validate required fields
      this.validateAnalysisResponse(parsedResponse);
      
      return parsedResponse;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw response:', responseText);
      throw new Error('Failed to parse AI response. Invalid JSON format.');
    }
  }

  /**
   * Validate the structure of analysis response
   * @param {Object} response - Parsed response object
   */
  validateAnalysisResponse(response) {
    const requiredFields = ['disease', 'severity', 'medications', 'recommendations', 'disclaimer'];
    
    for (const field of requiredFields) {
      if (!response[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate disease object
    if (!response.disease.name || !response.disease.description) {
      throw new Error('Invalid disease information in response');
    }

    // Validate severity
    if (!response.severity.level || response.severity.level < 1 || response.severity.level > 10) {
      throw new Error('Invalid severity level in response');
    }

    // Validate medications array
    if (!Array.isArray(response.medications)) {
      throw new Error('Medications must be an array');
    }

    // Validate recommendations array
    if (!Array.isArray(response.recommendations)) {
      throw new Error('Recommendations must be an array');
    }
  }

  /**
   * Get emergency assessment for severe symptoms
   * @param {Array} symptoms - Array of symptom objects
   * @returns {Promise<Object>} - Emergency assessment
   */
  async getEmergencyAssessment(symptoms) {
    try {
      const highSeveritySymptoms = symptoms.filter(s => s.severity >= 8);
      
      if (highSeveritySymptoms.length === 0) {
        return {
          isEmergency: false,
          message: 'No high-severity symptoms detected'
        };
      }

      const emergencyPrompt = `Assess if these high-severity symptoms require emergency medical attention:
${highSeveritySymptoms.map(s => `- ${s.name} (Severity: ${s.severity}/10)`).join('\n')}

Respond with JSON:
{
  "isEmergency": true/false,
  "urgencyLevel": "Low/Medium/High/Critical",
  "timeframe": "Seek immediate care/Within 24 hours/Within a week",
  "reason": "Brief explanation"
}`;

      const result = await this.model.generateContent(emergencyPrompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, ''));
    } catch (error) {
      console.error('Error in emergency assessment:', error);
      return {
        isEmergency: true, // Default to emergency for safety
        urgencyLevel: 'High',
        timeframe: 'Seek immediate care',
        reason: 'Unable to assess - please consult healthcare provider immediately'
      };
    }
  }
}

export default new GeminiService();