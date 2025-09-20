import React, { useState } from 'react';
import Header from '../components/Header';
import SymptomChecker from '../components/SymptomChecker';
import AppointmentManagement from '../components/AppointmentManagement';
import MedicalRecords from '../components/MedicalRecords';

export default function PatientDashboard() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalyze = (data) => {
    setAnalysisData(data);
    setShowBooking(true);
  };

  const handleSymptomsChange = (symptoms) => {
    setSelectedSymptoms(symptoms);
    // If user clears all symptoms, hide booking section
    if (symptoms.length === 0) {
      setShowBooking(false);
      setAnalysisData(null);
    }
  };

  const handleBookingComplete = () => {
    // Optional: Add any logic after booking is completed
    console.log('Booking completed successfully');
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

        {/* Analysis Summary */}
        {analysisData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Symptoms</div>
                <div className="text-lg font-semibold text-blue-900">
                  {analysisData.symptoms.length} selected
                </div>
                <div className="text-sm text-blue-700">
                  {analysisData.symptoms.join(', ')}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">Duration</div>
                <div className="text-lg font-semibold text-green-900">
                  {analysisData.duration}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium">Severity</div>
                <div className="text-lg font-semibold text-orange-900">
                  {analysisData.severity}/10
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout: Symptom Checker & Appointment Management */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column: Symptom Checker */}
          <div>
            <SymptomChecker 
              onAnalyze={handleAnalyze}
              onSymptomsChange={handleSymptomsChange}
            />
          </div>
          
          {/* Right Column: Appointment Management */}
          <div>
            <AppointmentManagement 
              showBooking={showBooking}
              onBookingComplete={handleBookingComplete}
              selectedSymptoms={selectedSymptoms}
            />
          </div>
        </div>

        {/* Medical Records - Uncomment if you have this component */}
        {/* <MedicalRecords /> */}
      </main>
    </div>
  );
}