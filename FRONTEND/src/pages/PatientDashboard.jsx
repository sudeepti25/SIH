import React, { useState } from 'react';
import Header from '../components/Header';
import SymptomChecker from '../components/SymptomChecker';
import SymptomAnalysisResult from '../components/SymptomAnalysisResult';
import AppointmentManagement from '../components/AppointmentManagement';
import MedicalRecords from '../components/MedicalRecords';
import { useUser } from '../contexts/UserContext';
import { useSymptomAnalysis } from '../hooks/useSymptomAnalysis';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';

export default function PatientDashboard() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  
  const { isAuthenticated } = useUser();
  const {
    analysisResult,
    isAnalyzing,
    analysisError,
    analyzeSymptoms,
    clearAnalysis,
    clearError,
    isEmergency,
    hasResult
  } = useSymptomAnalysis();

  const handleAnalyze = async (data) => {
    setAnalysisData(data);
    const result = await analyzeSymptoms(data);
    
    if (result) {
      setShowBooking(true);
    }
  };

  const handleSymptomsChange = (symptoms) => {
    setSelectedSymptoms(symptoms);
    // If user clears all symptoms, hide booking section and results
    if (symptoms.length === 0) {
      setShowBooking(false);
      setAnalysisData(null);
      clearAnalysis();
      clearError();
    }
  };

  const handleBookingComplete = () => {
    // Optional: Add any logic after booking is completed
    console.log('Booking completed successfully');
  };

  const handleCloseAnalysis = () => {
    clearAnalysis();
    setShowBooking(false);
  };

  const handleRetryAnalysis = () => {
    if (analysisData) {
      handleAnalyze(analysisData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Uncomment if you have a Header component */}
      {/* <Header /> */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Health Dashboard</h1>
          <p className="text-gray-600">Manage your health, track symptoms, and connect with healthcare professionals.</p>
        </div>

        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Authentication Required</p>
              <p>Please log in to use the AI symptom checker and access personalized health features.</p>
            </div>
          </div>
        )}

        {/* Emergency Alert */}
        {isEmergency && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">🚨 URGENT MEDICAL ATTENTION REQUIRED</h3>
                <p className="text-red-700 mt-1">Your symptoms may indicate a serious condition that requires immediate medical care.</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Error */}
        {analysisError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Analysis Failed</p>
              <p className="text-sm text-red-700 mt-1">{analysisError}</p>
              {analysisData && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={handleRetryAnalysis}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Retry Analysis
                  </button>
                  <button
                    onClick={clearError}
                    className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Analyzing your symptoms...</p>
              <p>Our AI is processing your information to provide personalized health insights.</p>
            </div>
          </div>
        )}

        {/* Analysis Success */}
        {hasResult && !isAnalyzing && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Analysis Complete!</p>
              <p>Your symptom analysis has been generated. Review the results below.</p>
            </div>
          </div>
        )}

        {/* Analysis Summary */}
        {analysisData && !isAnalyzing && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Symptoms</div>
                <div className="text-lg font-semibold text-blue-900">
                  {analysisData.symptoms.length} selected
                </div>
                <div className="text-sm text-blue-700">
                  {analysisData.symptoms.map(s => s.name).join(', ')}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">Duration</div>
                <div className="text-lg font-semibold text-green-900">
                  {analysisData.symptoms[0]?.duration || 'Not specified'}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium">Severity</div>
                <div className="text-lg font-semibold text-orange-900">
                  {analysisData.symptoms[0]?.severity || 'N/A'}/10
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column: Symptom Checker or Analysis Results */}
          <div>
            {hasResult ? (
              <SymptomAnalysisResult 
                analysisResult={analysisResult}
                onClose={handleCloseAnalysis}
              />
            ) : (
              <SymptomChecker 
                onAnalyze={handleAnalyze}
                onSymptomsChange={handleSymptomsChange}
                isLoading={isAnalyzing}
              />
            )}
          </div>
          
          {/* Right Column: Appointment Management */}
          <div>
            <AppointmentManagement 
              showBooking={showBooking}
              onBookingComplete={handleBookingComplete}
              selectedSymptoms={selectedSymptoms}
              analysisResult={analysisResult}
            />
          </div>
        </div>

        {/* Medical Records - Uncomment if you have this component */}
        {/* <MedicalRecords /> */}
      </main>
    </div>
  );
}