import { useState, useCallback } from 'react';
import { symptomAPI, apiErrors } from '../utils/api';
import { useUser } from '../contexts/UserContext';

/**
 * Custom hook for managing symptom analysis
 * @returns {Object} Hook state and functions
 */
export const useSymptomAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  
  const { isAuthenticated, updateTokens } = useUser();

  /**
   * Analyze symptoms using AI
   * @param {Object} symptomData - Symptom data to analyze
   * @returns {Promise<Object|null>} Analysis result or null if failed
   */
  const analyzeSymptoms = useCallback(async (symptomData) => {
    if (!isAuthenticated) {
      setAnalysisError('Please log in to use the symptom checker.');
      return null;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await symptomAPI.analyzeSymptoms(symptomData);
      setAnalysisResult(result);
      
      // Add to history
      setAnalysisHistory(prev => [
        {
          id: result.data?.analysisId || Date.now(),
          timestamp: result.data?.timestamp || new Date().toISOString(),
          symptoms: symptomData.symptoms,
          result: result.data
        },
        ...prev.slice(0, 9) // Keep only last 10 analyses
      ]);
      
      return result;
    } catch (error) {
      console.error('Symptom analysis failed:', error);
      
      let errorMessage;
      if (apiErrors.isTokenExpired(error)) {
        errorMessage = 'Your session has expired. Please log in again.';
        // Could trigger automatic token refresh here
      } else if (apiErrors.isValidationError(error)) {
        errorMessage = `Validation error: ${apiErrors.formatErrorMessage(error)}`;
      } else {
        errorMessage = error.message || 'Failed to analyze symptoms. Please try again.';
      }
      
      setAnalysisError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAuthenticated, updateTokens]);

  /**
   * Validate symptom data before analysis
   * @param {Object} symptomData - Symptom data to validate
   * @returns {Promise<boolean>} True if valid
   */
  const validateSymptoms = useCallback(async (symptomData) => {
    if (!isAuthenticated) {
      setAnalysisError('Please log in to validate symptoms.');
      return false;
    }

    try {
      await symptomAPI.validateSymptoms(symptomData);
      return true;
    } catch (error) {
      if (apiErrors.isValidationError(error)) {
        setAnalysisError(`Validation failed: ${apiErrors.formatErrorMessage(error)}`);
      } else {
        setAnalysisError('Failed to validate symptoms.');
      }
      return false;
    }
  }, [isAuthenticated]);

  /**
   * Get list of available symptoms
   * @returns {Promise<Object|null>} Symptoms list or null if failed
   */
  const getSymptomsList = useCallback(async () => {
    try {
      const result = await symptomAPI.getSymptomsList();
      return result.data;
    } catch (error) {
      console.warn('Failed to fetch symptoms list:', error);
      return null;
    }
  }, []);

  /**
   * Get analysis history
   * @param {number} limit - Number of results to fetch
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Object|null>} History data or null if failed
   */
  const getHistory = useCallback(async (limit = 10, offset = 0) => {
    if (!isAuthenticated) {
      return null;
    }

    try {
      const result = await symptomAPI.getAnalysisHistory(limit, offset);
      return result.data;
    } catch (error) {
      console.warn('Failed to fetch analysis history:', error);
      return null;
    }
  }, [isAuthenticated]);

  /**
   * Clear current analysis
   */
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setAnalysisError(null);
  }, []);

  /**
   * Clear analysis error
   */
  const clearError = useCallback(() => {
    setAnalysisError(null);
  }, []);

  /**
   * Check if current analysis indicates emergency
   * @returns {boolean} True if emergency
   */
  const isEmergency = useCallback(() => {
    return analysisResult?.data?.emergency?.isEmergency === true;
  }, [analysisResult]);

  /**
   * Get urgency level from current analysis
   * @returns {string} Urgency level
   */
  const getUrgencyLevel = useCallback(() => {
    return analysisResult?.data?.emergency?.urgencyLevel || 'Low';
  }, [analysisResult]);

  /**
   * Get severity level from current analysis
   * @returns {number} Severity level (1-10)
   */
  const getSeverityLevel = useCallback(() => {
    return analysisResult?.data?.severity?.level || 0;
  }, [analysisResult]);

  return {
    // State
    analysisResult,
    isAnalyzing,
    analysisError,
    analysisHistory,
    
    // Actions
    analyzeSymptoms,
    validateSymptoms,
    getSymptomsList,
    getHistory,
    clearAnalysis,
    clearError,
    
    // Computed values
    isEmergency: isEmergency(),
    urgencyLevel: getUrgencyLevel(),
    severityLevel: getSeverityLevel(),
    hasResult: !!analysisResult,
    hasError: !!analysisError,
  };
};

export default useSymptomAnalysis;