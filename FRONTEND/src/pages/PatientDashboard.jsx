import React, { useState } from 'react';
import { 
  User, Bell, Settings, Stethoscope, ChevronDown, Calendar, Video, Clock, 
  CheckCircle, AlertCircle, Download, Upload, FileText, Pill, Camera 
} from 'lucide-react';

// Header Component
function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H+</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">HealthCare</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <User className="w-5 h-5" />
            <span className="hidden sm:block">John Doe</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// Symptom Checker Component
function SymptomChecker({ onAnalyze }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const symptoms = [
    'Fever', 'Cough', 'Headache', 'Nausea',
    'Chest Pain', 'Dizziness', 'Fatigue', 'Sore Throat',
    'Runny Nose', 'Body Aches', 'Shortness of Breath', 'Other'
  ];

  const durations = [
    '1-2 days',
    '3-5 days',
    '1 week',
    'More than 1 week'
  ];

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length > 0 && duration) {
      onAnalyze();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Symptom Checker</h2>
      <p className="text-gray-600 mb-6">Answer a few questions about your symptoms to get personalized health insights and recommendations.</p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What symptoms are you experiencing? (Select all that apply)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {symptoms.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomChange(symptom)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How long have you had these symptoms?</h3>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <span className={duration ? 'text-gray-900' : 'text-gray-500'}>
                {duration || 'Select duration'}
              </span>
              <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {durations.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => {
                      setDuration(dur);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {dur}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate the severity (1-10): {severity}</h3>
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((severity-1)/9)*100}%, #e5e7eb ${((severity-1)/9)*100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Mild (1)</span>
              <span>Severe (10)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={selectedSymptoms.length === 0 || !duration}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Stethoscope className="w-5 h-5" />
          <span>Analyze Symptoms</span>
        </button>
      </div>
    </div>
  );
}

// Appointment Management Component
function AppointmentManagement({ showBooking }) {
  const [appointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialization: 'General Medicine',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialization: 'Cardiology',
      date: '2024-01-18',
      time: '2:30 PM',
      status: 'pending'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Rodriguez',
      specialization: 'Dermatology',
      date: '2024-01-20',
      time: '11:15 AM',
      status: 'confirmed'
    }
  ]);

  return (
    <div className="space-y-6">
      {showBooking && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Symptom Analysis Complete</h3>
          </div>
          <p className="text-gray-600 mb-4">Based on your symptoms, we recommend consulting with a healthcare professional.</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors">
            <Calendar className="w-5 h-5" />
            <span>Book Appointment</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Appointments</h2>
        
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {appointment.status === 'confirmed' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">Confirmed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-600 font-medium">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {appointment.status === 'confirmed' && (
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                    <Video className="w-4 h-4" />
                    <span>Join Call</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Medical Records Component
function MedicalRecords() {
  const [prescriptions] = useState([
    {
      id: 1,
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      medicines: ['Amoxicillin 500mg', 'Ibuprofen 400mg'],
      diagnosis: 'Respiratory Infection'
    },
    {
      id: 2,
      date: '2024-01-05',
      doctor: 'Dr. Michael Chen',
      medicines: ['Lisinopril 10mg', 'Metformin 500mg'],
      diagnosis: 'Routine Check-up'
    },
    {
      id: 3,
      date: '2023-12-28',
      doctor: 'Dr. Emily Rodriguez',
      medicines: ['Hydrocortisone cream', 'Antihistamine 10mg'],
      diagnosis: 'Skin Allergy'
    }
  ]);

  const [consultations] = useState([
    {
      id: 1,
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      type: 'Video Consultation',
      notes: 'Patient presented with cold symptoms. Prescribed antibiotics and rest.'
    },
    {
      id: 2,
      date: '2024-01-05',
      doctor: 'Dr. Michael Chen',
      type: 'In-Person Visit',
      notes: 'Routine check-up. Blood pressure and glucose levels normal.'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Health Records</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prescriptions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Pill className="w-5 h-5 text-blue-600" />
              <span>Recent Prescriptions</span>
            </h3>
            <div className="space-y-3">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{prescription.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{prescription.doctor}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Medicines:</p>
                    <div className="flex flex-wrap gap-1">
                      {prescription.medicines.map((medicine, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {medicine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>Consultation History</span>
            </h3>
            <div className="space-y-3">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{consultation.type}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{consultation.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{consultation.doctor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{consultation.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Upload className="w-5 h-5 text-teal-600" />
          <span>Upload Medical Documents</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Lab Test Reports</p>
            <p className="text-xs text-gray-600">Upload PDF files</p>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Medical Images</p>
            <p className="text-xs text-gray-600">Upload JPG, PNG files</p>
          </div>
        </div>
        
        <button className="mt-4 w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload Documents</span>
        </button>
      </div>
    </div>
  );
}

// Main Patient Dashboard Component
export default function PatientDashboard() {
  const [showBooking, setShowBooking] = useState(false);

  const handleAnalyze = () => {
    setShowBooking(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Health Dashboard</h1>
          <p className="text-gray-600">Manage your health, track symptoms, and connect with healthcare professionals.</p>
        </div>

        {/* Two Column Layout: Symptom Checker & Appointment Management */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column: Symptom Checker */}
          <div>
            <SymptomChecker onAnalyze={handleAnalyze} />
          </div>
          
          {/* Right Column: Appointment Management */}
          <div>
            <AppointmentManagement showBooking={showBooking} />
          </div>
        </div>

        {/* Medical Records */}
        <MedicalRecords />
      </main>
    </div>
  );
}