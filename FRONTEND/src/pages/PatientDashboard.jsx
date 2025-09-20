import React, { useState } from 'react';
import Header from '../components/Header';
import SymptomChecker from '../components/SymptomChecker';
import SymptomAnalysisResult from '../components/SymptomAnalysisResult';
import AppointmentManagement from '../components/AppointmentManagement';
import MedicalRecords from '../components/MedicalRecords';
import SimpleWebRTCReceiver from '../components/SimpleWebRTCReceiver';
import { useUser } from '../contexts/UserContext';
import { useSymptomAnalysis } from '../hooks/useSymptomAnalysis';
import { AlertCircle, Loader, CheckCircle, Video, X } from 'lucide-react';

export default function PatientDashboard() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [showJoinCallModal, setShowJoinCallModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const { isAuthenticated, user } = useUser();
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

  const handleJoinVideoCall = (appointment = null) => {
    setSelectedAppointment(appointment);
    setShowJoinCallModal(true);
  };

  const handleCallStateChange = (state) => {
    if (state === 'ended') {
      setIsVideoCallActive(false);
    } else if (state === 'connected') {
      setShowJoinCallModal(false);
      setIsVideoCallActive(true);
    }
  };

  const closeVideoCallModal = () => {
    setIsVideoCallActive(false);
    setShowJoinCallModal(false);
    setSelectedAppointment(null);
  };

  // Enhanced AppointmentManagement component with video call integration
  const EnhancedAppointmentManagement = ({ showBooking, onBookingComplete, selectedSymptoms, analysisResult }) => {
    const [appointments, setAppointments] = useState([
      {
        id: 1,
        doctorName: "Dr. Sarah Johnson",
        specialty: "General Medicine",
        date: "2024-01-20",
        time: "10:00 AM",
        status: "confirmed",
        type: "video",
        symptoms: "Fever, Headache",
        callId: "ABC123"
      },
      {
        id: 2,
        doctorName: "Dr. Rajesh Kumar",
        specialty: "Cardiology",
        date: "2024-01-22",
        time: "2:30 PM",
        status: "pending",
        type: "in-person",
        symptoms: "Chest pain"
      }
    ]);

    const handleJoinCall = (appointment) => {
      handleJoinVideoCall(appointment);
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointments</h3>
        
        {/* Quick Join Call Section */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Join Video Consultation</h4>
              <p className="text-sm text-blue-700">Enter the call ID provided by your doctor</p>
            </div>
            <button
              onClick={() => handleJoinVideoCall()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Video className="h-4 w-4" />
              <span>Join Call</span>
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>📅 {appointment.date}</span>
                    <span>🕐 {appointment.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  {appointment.symptoms && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                    </p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  {appointment.type === 'video' && appointment.status === 'confirmed' && (
                    <button
                      onClick={() => handleJoinCall(appointment)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Call</span>
                    </button>
                  )}
                  <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Book New Appointment */}
        {showBooking && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Book New Appointment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" name="consultationType" value="video" className="mr-2" defaultChecked />
                  <span className="text-sm">Video Call</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="consultationType" value="in-person" className="mr-2" />
                  <span className="text-sm">In-Person</span>
                </label>
              </div>
            </div>
            <button
              onClick={onBookingComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>
    );
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

        {/* Authentication Info */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Symptom Checker Available</p>
              <p>You can use our AI symptom checker without logging in. For personalized features like appointment booking and health records, please log in.</p>
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
          
          {/* Right Column: Enhanced Appointment Management */}
          <div>
            <EnhancedAppointmentManagement 
              showBooking={showBooking}
              onBookingComplete={handleBookingComplete}
              selectedSymptoms={selectedSymptoms}
              analysisResult={analysisResult}
            />
          </div>
        </div>

        {/* Medical Records - Uncomment if you have this component */}
        {/* <MedicalRecords /> */}

        {/* Video Call Modal */}
        {(showJoinCallModal || isVideoCallActive) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isVideoCallActive ? 'Video Consultation' : 'Join Video Call'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAppointment 
                      ? `Consultation with ${selectedAppointment.doctorName}`
                      : isVideoCallActive 
                        ? 'Connected to healthcare provider'
                        : 'Enter the call ID provided by your doctor'
                    }
                  </p>
                </div>
                <button
                  onClick={closeVideoCallModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <SimpleWebRTCReceiver
                patientId={user?.id || 'patient_123'}
                onCallStateChange={handleCallStateChange}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}