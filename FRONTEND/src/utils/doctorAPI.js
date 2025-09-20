import { apiRequest } from './api';

/**
 * Doctor Dashboard API services
 */

// Patient queue management
export const doctorAPI = {
  /**
   * Get patient queue with AI analysis data
   * @returns {Promise<Object>} Patient queue data
   */
  getPatientQueue: async () => {
    try {
      const response = await apiRequest('/doctor/queue', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch patient queue:', error);
      throw error;
    }
  },

  /**
   * Get detailed patient information including AI analysis
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Detailed patient data
   */
  getPatientDetails: async (patientId) => {
    try {
      const response = await apiRequest(`/doctor/patients/${patientId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
      throw error;
    }
  },

  /**
   * Get patient's symptom analysis history
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Analysis history
   */
  getPatientAnalysisHistory: async (patientId) => {
    try {
      const response = await apiRequest(`/doctor/patients/${patientId}/analysis-history`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
      throw error;
    }
  },

  /**
   * Update patient status in queue
   * @param {string} patientId - Patient ID
   * @param {string} status - New status (waiting, in-consultation, completed)
   * @returns {Promise<Object>} Updated patient data
   */
  updatePatientStatus: async (patientId, status) => {
    try {
      const response = await apiRequest(`/doctor/patients/${patientId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      console.error('Failed to update patient status:', error);
      throw error;
    }
  },

  /**
   * Create consultation record
   * @param {Object} consultationData - Consultation details
   * @returns {Promise<Object>} Created consultation record
   */
  createConsultation: async (consultationData) => {
    try {
      const response = await apiRequest('/doctor/consultations', {
        method: 'POST',
        body: JSON.stringify(consultationData),
      });
      return response;
    } catch (error) {
      console.error('Failed to create consultation:', error);
      throw error;
    }
  },

  /**
   * Generate prescription
   * @param {Object} prescriptionData - Prescription details
   * @returns {Promise<Object>} Generated prescription
   */
  generatePrescription: async (prescriptionData) => {
    try {
      const response = await apiRequest('/doctor/prescriptions', {
        method: 'POST',
        body: JSON.stringify(prescriptionData),
      });
      return response;
    } catch (error) {
      console.error('Failed to generate prescription:', error);
      throw error;
    }
  },

  /**
   * Get doctor's consultation history
   * @param {number} limit - Number of records to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Object>} Consultation history
   */
  getConsultationHistory: async (limit = 20, offset = 0) => {
    try {
      const response = await apiRequest(`/doctor/consultations?limit=${limit}&offset=${offset}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch consultation history:', error);
      throw error;
    }
  },

  /**
   * Search patients by name, condition, or symptoms
   * @param {string} query - Search query
   * @returns {Promise<Object>} Search results
   */
  searchPatients: async (query) => {
    try {
      const response = await apiRequest(`/doctor/patients/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to search patients:', error);
      throw error;
    }
  },

  /**
   * Get AI analysis summary for dashboard stats
   * @returns {Promise<Object>} Analysis statistics
   */
  getAnalysisStats: async () => {
    try {
      const response = await apiRequest('/doctor/stats/analysis', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch analysis stats:', error);
      throw error;
    }
  },

  /**
   * Acknowledge emergency case
   * @param {string} patientId - Patient ID
   * @param {string} action - Action taken (acknowledged, escalated, treated)
   * @returns {Promise<Object>} Acknowledgment record
   */
  acknowledgeEmergency: async (patientId, action) => {
    try {
      const response = await apiRequest(`/doctor/patients/${patientId}/emergency`, {
        method: 'POST',
        body: JSON.stringify({ action, timestamp: new Date().toISOString() }),
      });
      return response;
    } catch (error) {
      console.error('Failed to acknowledge emergency:', error);
      throw error;
    }
  },

  /**
   * Request additional AI analysis for patient
   * @param {string} patientId - Patient ID
   * @param {Array} additionalSymptoms - New symptoms to analyze
   * @returns {Promise<Object>} New analysis result
   */
  requestAdditionalAnalysis: async (patientId, additionalSymptoms) => {
    try {
      const response = await apiRequest(`/doctor/patients/${patientId}/additional-analysis`, {
        method: 'POST',
        body: JSON.stringify({ symptoms: additionalSymptoms }),
      });
      return response;
    } catch (error) {
      console.error('Failed to request additional analysis:', error);
      throw error;
    }
  }
};

/**
 * Utility functions for doctor dashboard data processing
 */
export const doctorUtils = {
  /**
   * Sort patients by priority and severity
   * @param {Array} patients - Array of patient objects
   * @returns {Array} Sorted patients
   */
  sortPatientsByPriority: (patients) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    
    return patients.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by AI analysis severity
      const severityA = a.aiAnalysis?.severity?.level || 0;
      const severityB = b.aiAnalysis?.severity?.level || 0;
      if (severityB !== severityA) return severityB - severityA;
      
      // Finally by wait time
      return a.waitTime.localeCompare(b.waitTime);
    });
  },

  /**
   * Filter patients by emergency status
   * @param {Array} patients - Array of patient objects
   * @returns {Array} Emergency patients
   */
  getEmergencyPatients: (patients) => {
    return patients.filter(patient => 
      patient.aiAnalysis?.emergency?.isEmergency === true
    );
  },

  /**
   * Calculate average severity for dashboard stats
   * @param {Array} patients - Array of patient objects
   * @returns {number} Average severity level
   */
  calculateAverageSeverity: (patients) => {
    const severities = patients
      .map(p => p.aiAnalysis?.severity?.level)
      .filter(s => s !== undefined);
    
    if (severities.length === 0) return 0;
    return Math.round(severities.reduce((sum, s) => sum + s, 0) / severities.length);
  },

  /**
   * Group patients by condition
   * @param {Array} patients - Array of patient objects
   * @returns {Object} Grouped patients
   */
  groupPatientsByCondition: (patients) => {
    return patients.reduce((groups, patient) => {
      const condition = patient.aiAnalysis?.disease?.name || 'Unknown';
      if (!groups[condition]) {
        groups[condition] = [];
      }
      groups[condition].push(patient);
      return groups;
    }, {});
  },

  /**
   * Get patients requiring immediate attention
   * @param {Array} patients - Array of patient objects
   * @returns {Array} High priority patients
   */
  getHighPriorityPatients: (patients) => {
    return patients.filter(patient => 
      patient.priority === 'urgent' || 
      patient.priority === 'high' ||
      (patient.aiAnalysis?.severity?.level && patient.aiAnalysis.severity.level >= 7)
    );
  },

  /**
   * Format patient data for display
   * @param {Object} patient - Patient object
   * @returns {Object} Formatted patient data
   */
  formatPatientForDisplay: (patient) => {
    return {
      ...patient,
      formattedSymptoms: patient.aiAnalysis?.symptoms?.map(s => s.name).join(', ') || 'No symptoms recorded',
      severityLabel: patient.aiAnalysis?.severity?.description || 'Not assessed',
      emergencyStatus: patient.aiAnalysis?.emergency?.isEmergency ? 'Emergency' : 'Normal',
      analysisAge: patient.aiAnalysis?.timestamp ? 
        Math.round((new Date() - new Date(patient.aiAnalysis.timestamp)) / (1000 * 60)) + ' min ago' : 
        'No analysis'
    };
  },

  /**
   * Validate prescription data
   * @param {Object} prescription - Prescription object
   * @returns {Object} Validation result
   */
  validatePrescription: (prescription) => {
    const errors = [];
    
    if (!prescription.diagnosis || prescription.diagnosis.trim() === '') {
      errors.push('Diagnosis is required');
    }
    
    if (!prescription.medicines || prescription.medicines.length === 0) {
      errors.push('At least one medicine is required');
    }
    
    prescription.medicines?.forEach((med, index) => {
      if (!med.name || !med.dosage || !med.frequency) {
        errors.push(`Medicine ${index + 1}: Name, dosage, and frequency are required`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default {
  doctorAPI,
  doctorUtils
};