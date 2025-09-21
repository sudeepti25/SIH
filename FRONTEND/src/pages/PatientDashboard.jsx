import React, { useState } from 'react';
import Header from '../components/Header';
import SymptomChecker from '../components/SymptomChecker';
import SymptomAnalysisResult from '../components/SymptomAnalysisResult';
import AppointmentManagement from '../components/AppointmentManagement';
import MedicalRecords from '../components/MedicalRecords';
import SimpleWebRTCReceiver from '../components/SimpleWebRTCReceiver';
import { useUser } from '../contexts/UserContext';
import { useSymptomAnalysis } from '../hooks/useSymptomAnalysis';
import { 
  AlertCircle, 
  Loader, 
  CheckCircle, 
  Video, 
  X, 
  Pill, 
  Calendar, 
  Clock, 
  FileText, 
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function PatientDashboard() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [showJoinCallModal, setShowJoinCallModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);
  
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

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionDetails(true);
  };

  const closePrescriptionModal = () => {
    setSelectedPrescription(null);
    setShowPrescriptionDetails(false);
  };

  // Sample prescriptions data
  const prescriptions = [
    {
      id: 1,
      consultationId: 'CONS001',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      consultationDate: '2024-01-15',
      consultationTime: '10:30 AM',
      diagnosis: 'Viral Upper Respiratory Infection',
      symptoms: 'Fever, Cough, Sore throat',
      status: 'active',
      medicines: [
        {
          id: 1,
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosage: '500mg',
          frequency: 'Every 6 hours',
          duration: '5 days',
          instructions: 'Take with food. Do not exceed 4 tablets per day.',
          quantity: '20 tablets',
          refillsLeft: 2,
          status: 'active'
        },
        {
          id: 2,
          name: 'Amoxicillin',
          genericName: 'Amoxicillin trihydrate',
          dosage: '250mg',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'Complete the full course. Take with plenty of water.',
          quantity: '21 capsules',
          refillsLeft: 0,
          status: 'active'
        },
        {
          id: 3,
          name: 'Cough Syrup',
          genericName: 'Dextromethorphan',
          dosage: '10ml',
          frequency: 'Every 4 hours as needed',
          duration: '7 days',
          instructions: 'Do not exceed 6 doses per day. Avoid alcohol.',
          quantity: '100ml bottle',
          refillsLeft: 1,
          status: 'active'
        }
      ],
      notes: 'Rest well, stay hydrated. Return if symptoms worsen or persist beyond 7 days.',
      followUpDate: '2024-01-22',
      prescriptionPdf: 'prescription_001.pdf'
    },
    {
      id: 2,
      consultationId: 'CONS002',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      consultationDate: '2024-01-08',
      consultationTime: '2:15 PM',
      diagnosis: 'Hypertension - Stage 1',
      symptoms: 'High blood pressure, Occasional headaches',
      status: 'completed',
      medicines: [
        {
          id: 4,
          name: 'Lisinopril',
          genericName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take at the same time each day. Monitor blood pressure.',
          quantity: '30 tablets',
          refillsLeft: 3,
          status: 'completed'
        },
        {
          id: 5,
          name: 'Aspirin',
          genericName: 'Acetylsalicylic acid',
          dosage: '81mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take with food to avoid stomach upset.',
          quantity: '30 tablets',
          refillsLeft: 5,
          status: 'completed'
        }
      ],
      notes: 'Lifestyle modifications recommended: reduce sodium intake, regular exercise, maintain healthy weight.',
      followUpDate: '2024-02-08',
      prescriptionPdf: 'prescription_002.pdf'
    }
  ];

  // Prescriptions Section Component
  const PrescriptionsSection = () => {
    const [activeTab, setActiveTab] = useState('all');

    const filteredPrescriptions = prescriptions.filter(prescription => {
      if (activeTab === 'active') return prescription.status === 'active';
      if (activeTab === 'completed') return prescription.status === 'completed';
      return true;
    });

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">My Prescriptions</h3>
          </div>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Prescription Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{prescription.doctorName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prescription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prescription.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{prescription.specialty}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{prescription.consultationDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{prescription.consultationTime}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewPrescription(prescription)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg flex items-center space-x-1 text-sm transition-colors">
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis and Symptoms */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Diagnosis</p>
                    <p className="text-sm text-gray-900">{prescription.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Symptoms</p>
                    <p className="text-sm text-gray-900">{prescription.symptoms}</p>
                  </div>
                </div>
              </div>

              {/* Medicines Summary */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Prescribed Medicines ({prescription.medicines.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {prescription.medicines.map((medicine) => (
                    <div key={medicine.id} className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-blue-900 text-sm">{medicine.name}</p>
                          <p className="text-xs text-blue-700">{medicine.dosage} • {medicine.frequency}</p>
                          <p className="text-xs text-blue-600 mt-1">{medicine.duration}</p>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          medicine.status === 'active' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            medicine.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Date */}
              {prescription.followUpDate && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Next Follow-up:</span> {prescription.followUpDate}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-8">
            <Pill className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions found for the selected filter.</p>
          </div>
        )}
      </div>
    );
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
              onClick={() => window.open('https://knowsyash.github.io/webrtc_testing/', '_blank')}
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
                      onClick={() => window.open('https://knowsyash.github.io/webrtc_testing/', '_blank')}
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

        {/* Prescriptions Section */}
        <PrescriptionsSection />

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

        {/* Prescription Details Modal */}
        {showPrescriptionDetails && selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Prescription Details</h2>
                  <p className="text-sm text-gray-600">Consultation ID: {selectedPrescription.consultationId}</p>
                </div>
                <button
                  onClick={closePrescriptionModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Consultation Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Consultation Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Doctor</p>
                      <p className="text-sm text-gray-900">{selectedPrescription.doctorName}</p>
                      <p className="text-xs text-gray-600">{selectedPrescription.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date & Time</p>
                      <p className="text-sm text-gray-900">
                        {selectedPrescription.consultationDate} at {selectedPrescription.consultationTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Diagnosis</p>
                      <p className="text-sm text-gray-900">{selectedPrescription.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Symptoms</p>
                      <p className="text-sm text-gray-900">{selectedPrescription.symptoms}</p>
                    </div>
                  </div>
                </div>

                {/* Prescribed Medicines */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Prescribed Medicines</h3>
                  <div className="space-y-4">
                    {selectedPrescription.medicines.map((medicine) => (
                      <div key={medicine.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                            <p className="text-sm text-gray-600">{medicine.genericName}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            medicine.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {medicine.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs font-medium text-gray-700">Dosage</p>
                            <p className="text-sm text-gray-900">{medicine.dosage}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700">Frequency</p>
                            <p className="text-sm text-gray-900">{medicine.frequency}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700">Duration</p>
                            <p className="text-sm text-gray-900">{medicine.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700">Quantity</p>
                            <p className="text-sm text-gray-900">{medicine.quantity}</p>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 rounded-md p-3 mb-3">
                          <p className="text-xs font-medium text-yellow-800 mb-1">Instructions</p>
                          <p className="text-sm text-yellow-700">{medicine.instructions}</p>
                        </div>
                        
                        {medicine.refillsLeft > 0 && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              Refills available: <span className="font-medium">{medicine.refillsLeft}</span>
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md flex items-center space-x-1 transition-colors">
                              <RefreshCw className="h-3 w-3" />
                              <span>Request Refill</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor's Notes */}
                {selectedPrescription.notes && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Doctor's Notes
                    </h4>
                    <p className="text-sm text-blue-800">{selectedPrescription.notes}</p>
                  </div>
                )}

                {/* Follow-up Information */}
                {selectedPrescription.followUpDate && (
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-green-900 mb-2">Next Follow-up</h4>
                    <p className="text-sm text-green-800">
                      Scheduled for: <span className="font-medium">{selectedPrescription.followUpDate}</span>
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <Calendar className="h-4 w-4" />
                    <span>Book Follow-up</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}