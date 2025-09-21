import { getGeminiModel, isGeminiAvailable } from '../config/gemini.js';

class GeminiService {
  constructor() {
    this.model = null;
    this.isAvailable = false;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      if (!isGeminiAvailable()) {
        console.warn('⚠️  Gemini AI is not available. Using mock responses for development.');
        this.isAvailable = false;
        return;
      }
      
      this.model = getGeminiModel();
      this.isAvailable = true;
      console.log('✅ Gemini model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error.message);
      this.isAvailable = false;
    }
  }

  /**
   * Analyze symptoms using Gemini AI
   * @param {Array} symptoms - Array of symptom objects with name and severity
   * @returns {Promise<Object>} - Analysis result with disease, severity, medications
   */
  async analyzeSymptoms(symptoms) {
    try {
      // Validate input
      if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        throw new Error('Invalid symptoms data: must be a non-empty array');
      }

      // If Gemini is not available, return mock data for development
      if (!this.isAvailable) {
        console.warn('⚠️  Using mock symptom analysis response (Gemini API not configured)');
        return this.getMockAnalysisResponse(symptoms);
      }

      if (!this.model) {
        await this.initializeModel();
        if (!this.isAvailable) {
          return this.getMockAnalysisResponse(symptoms);
        }
      }

      // Construct the prompt for Gemini
      const prompt = this.constructAnalysisPrompt(symptoms);
      
      console.log('🤖 Sending request to Gemini AI for symptom analysis...');
      
      // Generate response using Gemini with timeout
      const result = await Promise.race([
        this.model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API timeout')), 30000)
        )
      ]);
      
      const response = await result.response;
      const text = response.text();

      console.log('✅ Received response from Gemini AI');

      // Parse the JSON response
      const analysisResult = this.parseGeminiResponse(text);
      
      return {
        success: true,
        data: analysisResult
      };

    } catch (error) {
      console.error('Error analyzing symptoms with Gemini:', error.message);
      // Fallback to mock response if Gemini fails
      console.warn('⚠️  Falling back to mock response due to Gemini error');
      return this.getMockAnalysisResponse(symptoms);
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
          urgencyLevel: 'Low',
          timeframe: 'No immediate concern',
          message: 'No high-severity symptoms detected'
        };
      }

      // If Gemini is not available, use basic logic
      if (!this.isAvailable || !this.model) {
        return {
          isEmergency: true,
          urgencyLevel: 'High',
          timeframe: 'Seek immediate care',
          reason: 'High severity symptoms detected - medical evaluation recommended'
        };
      }

      const emergencyPrompt = `Assess if these high-severity symptoms require emergency medical attention:
${highSeveritySymptoms.map(s => `- ${s.name} (Severity: ${s.severity}/10)`).join('\n')}

Respond with JSON only:
{
  "isEmergency": true/false,
  "urgencyLevel": "Low/Medium/High/Critical",
  "timeframe": "Seek immediate care/Within 24 hours/Within a week",
  "reason": "Brief explanation"
}`;

      const result = await Promise.race([
        this.model.generateContent(emergencyPrompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Emergency assessment timeout')), 15000)
        )
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
      
    } catch (error) {
      console.error('Error in emergency assessment:', error.message);
      return {
        isEmergency: true, // Default to emergency for safety
        urgencyLevel: 'High',
        timeframe: 'Seek immediate care',
        reason: 'Unable to assess - please consult healthcare provider immediately'
      };
    }
  }

  /**
   * Generate mock analysis response for development when Gemini is not available
   * @param {Array} symptoms - Array of symptom objects
   * @returns {Object} Mock analysis result
   */
  getMockAnalysisResponse(symptoms) {
    const symptomNames = symptoms.map(s => s.name).join(', ');
    const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length;
    
    return {
      success: true,
      data: {
        disease: {
          name: "General Medical Consultation Recommended",
          description: `Based on the reported symptoms (${symptomNames}), a medical evaluation is recommended for proper diagnosis.`,
          probability: "Moderate"
        },
        severity: {
          level: Math.round(avgSeverity),
          description: avgSeverity >= 7 ? "High" : avgSeverity >= 4 ? "Moderate" : "Mild",
          urgency: avgSeverity >= 7 ? "High" : avgSeverity >= 4 ? "Medium" : "Low"
        },
        medications: [
          {
            name: "Consultation Required",
            type: "Professional Medical Advice",
            purpose: "Proper medical evaluation needed for medication recommendations",
            dosage: "As prescribed by healthcare provider",
            notes: "This is a mock response. Please consult a healthcare professional for actual medication advice."
          }
        ],
        recommendations: [
          "Consult with a healthcare professional for proper diagnosis",
          "Monitor your symptoms and seek immediate care if they worsen",
          "Stay hydrated and get adequate rest",
          "Keep a symptom diary to share with your doctor"
        ],
        redFlags: [
          "Sudden worsening of symptoms",
          "Difficulty breathing or chest pain",
          "High fever (above 103°F/39.4°C)",
          "Severe pain or discomfort"
        ],
        emergency: {
          isEmergency: avgSeverity >= 8,
          urgencyLevel: avgSeverity >= 8 ? "High" : avgSeverity >= 6 ? "Medium" : "Low",
          timeframe: avgSeverity >= 8 ? "Seek immediate care" : "Within 24-48 hours",
          reason: avgSeverity >= 8 ? "High severity symptoms require immediate evaluation" : "Medical consultation recommended"
        },
        analysisId: `mock_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        disclaimer: "⚠️ DEVELOPMENT MODE: This is a mock response generated for testing purposes. The actual Gemini AI analysis requires a valid API key. Please consult with a qualified healthcare provider for real medical advice."
      }
    };
  }
}

export default new GeminiService();