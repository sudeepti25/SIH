// API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Create API headers with authentication if token is available
 * @param {string} token - JWT token
 * @returns {Object} Headers object
 */
const createHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response and extract data
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed response data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }
  
  return data;
};

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Request options
 * @returns {Promise<Object>} API response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: createHeaders(token),
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    // Network error or other issues
    if (!error.status) {
      error.message = 'Network error. Please check your connection.';
    }
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  /**
   * Send OTP to mobile number
   * @param {string} mobileNumber - Mobile number
   * @returns {Promise<Object>} API response
   */
  sendOTP: (mobileNumber) => 
    apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile_number: mobileNumber }),
    }),

  /**
   * Verify OTP
   * @param {string} mobileNumber - Mobile number
   * @param {string} otp - OTP code
   * @returns {Promise<Object>} API response
   */
  verifyOTP: (mobileNumber, otp) =>
    apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile_number: mobileNumber, otp }),
    }),

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} API response
   */
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  /**
   * Login user
   * @param {string} mobileNumber - Mobile number
   * @param {string} pin - User PIN
   * @param {string} deviceId - Device identifier
   * @returns {Promise<Object>} API response
   */
  login: (mobileNumber, pin, deviceId) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        mobile_number: mobileNumber, 
        pin, 
        device_id: deviceId 
      }),
    }),

  /**
   * Get user profile
   * @returns {Promise<Object>} API response
   */
  getProfile: () =>
    apiRequest('/auth/profile', {
      method: 'GET',
    }),

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} API response
   */
  refreshToken: (refreshToken) =>
    apiRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
};

// Symptom analysis API calls
export const symptomAPI = {
  /**
   * Analyze symptoms using AI
   * @param {Object} symptomData - Symptom analysis data
   * @param {Array} symptomData.symptoms - Array of symptoms with severity and duration
   * @param {Object} symptomData.patientInfo - Patient information (optional)
   * @returns {Promise<Object>} AI analysis results
   */
  analyzeSymptoms: (symptomData) =>
    apiRequest('/symptoms/analyze', {
      method: 'POST',
      body: JSON.stringify(symptomData),
    }),

  /**
   * Get list of available symptoms
   * @returns {Promise<Object>} List of symptoms and categories
   */
  getSymptomsList: () =>
    apiRequest('/symptoms/list', {
      method: 'GET',
    }),

  /**
   * Validate symptom data before analysis
   * @param {Object} symptomData - Symptom data to validate
   * @returns {Promise<Object>} Validation results
   */
  validateSymptoms: (symptomData) =>
    apiRequest('/symptoms/validate', {
      method: 'POST',
      body: JSON.stringify(symptomData),
    }),

  /**
   * Get user's symptom analysis history
   * @param {number} limit - Number of results to return
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Object>} Analysis history
   */
  getAnalysisHistory: (limit = 10, offset = 0) =>
    apiRequest(`/symptoms/history?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    }),
};

// Utility functions for symptom data formatting
export const symptomUtils = {
  /**
   * Format symptoms array for API submission
   * @param {Array} symptoms - Array of symptom names
   * @param {number} severity - Overall severity rating
   * @param {string} duration - Duration string
   * @returns {Array} Formatted symptoms array
   */
  formatSymptomsForAPI: (symptoms, severity, duration) => {
    return symptoms.map(symptomName => ({
      name: symptomName,
      severity: severity,
      duration: duration
    }));
  },

  /**
   * Create patient info object
   * @param {Object} patientData - Raw patient data
   * @returns {Object} Formatted patient info
   */
  formatPatientInfo: (patientData) => {
    const {
      age,
      gender,
      medicalHistory = [],
      allergies = [],
      currentMedications = []
    } = patientData;

    return {
      age: parseInt(age) || undefined,
      gender: gender || undefined,
      medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : [],
      allergies: Array.isArray(allergies) ? allergies : [],
      currentMedications: Array.isArray(currentMedications) ? currentMedications : []
    };
  },

  /**
   * Check if analysis indicates emergency
   * @param {Object} analysisResult - AI analysis result
   * @returns {boolean} True if emergency
   */
  isEmergency: (analysisResult) => {
    return analysisResult?.data?.emergency?.isEmergency === true;
  },

  /**
   * Get emergency urgency level
   * @param {Object} analysisResult - AI analysis result
   * @returns {string} Urgency level
   */
  getUrgencyLevel: (analysisResult) => {
    return analysisResult?.data?.emergency?.urgencyLevel || 'Low';
  }
};

// Error handling utilities
export const apiErrors = {
  /**
   * Check if error is due to expired token
   * @param {Error} error - API error
   * @returns {boolean} True if token expired
   */
  isTokenExpired: (error) => {
    return error.status === 401 && error.message.includes('token');
  },

  /**
   * Check if error is validation error
   * @param {Error} error - API error
   * @returns {boolean} True if validation error
   */
  isValidationError: (error) => {
    return error.status === 400 && Array.isArray(error.errors) && error.errors.length > 0;
  },

  /**
   * Format error message for display
   * @param {Error} error - API error
   * @returns {string} Formatted error message
   */
  formatErrorMessage: (error) => {
    if (apiErrors.isValidationError(error)) {
      return error.errors.map(err => err.message).join(', ');
    }
    return error.message || 'An unexpected error occurred';
  }
};

export default {
  authAPI,
  symptomAPI,
  symptomUtils,
  apiErrors
};