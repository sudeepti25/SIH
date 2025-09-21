import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  Stethoscope, 
  Users, 
  Video, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Calendar,
  Pill,
  Activity,
  User,
  MapPin,
  Heart,
  ArrowRight,
  Search,
  LogOut,
  Eye,
  Plus,
  Edit,
  Save,
  X,
  AlertTriangle,
  Brain,
  Shield,
  Info,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const EnhancedDoctorDashboard = ({ 
  onStartConsultation, 
  onCreatePrescription, 
  isOnline = true 
}) => {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState('queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState({});

  // Enhanced patient queue with AI analysis data
  const [patientQueue, setPatientQueue] = useState([
    {
      id: 1,
      name: "Ram Singh",
      age: 45,
      gender: "Male",
      location: "Nabha Village",
      phone: "+91 98765 43210",
      waitTime: "5 min",
      priority: "high",
      aiAnalysis: {
        timestamp: "2024-01-15T10:30:00Z",
        analysisId: "analysis_1705315800_abc123",
        symptoms: [
          { name: "Fever", severity: 8, duration: "3 days" },
          { name: "Cough", severity: 7, duration: "3 days" },
          { name: "Headache", severity: 6, duration: "2 days" }
        ],
        disease: {
          name: "Upper Respiratory Tract Infection",
          description: "Common viral infection affecting nose, throat, and airways",
          probability: "High"
        },
        severity: {
          level: 7,
          description: "Moderate to High",
          urgency: "Medium"
        },
        medications: [
          {
            name: "Paracetamol",
            type: "Over-the-counter",
            purpose: "Fever reduction and pain relief",
            dosage: "500mg every 6 hours",
            notes: "Do not exceed 4g in 24 hours"
          },
          {
            name: "Dextromethorphan",
            type: "Over-the-counter",
            purpose: "Cough suppression",
            dosage: "15mg every 4 hours",
            notes: "Take with plenty of water"
          }
        ],
        recommendations: [
          "Stay hydrated with plenty of fluids",
          "Get adequate rest",
          "Use humidifier or steam inhalation",
          "Monitor temperature regularly"
        ],
        redFlags: [
          "High fever above 103°F (39.4°C)",
          "Difficulty breathing or shortness of breath",
          "Persistent chest pain",
          "Severe headache with neck stiffness"
        ],
        emergency: {
          isEmergency: false,
          urgencyLevel: "Medium",
          timeframe: "Within 24 hours",
          reason: "Moderate symptoms requiring medical attention"
        },
        patientInfo: {
          age: 45,
          gender: "M",
          medicalHistory: ["Diabetes Type 2"],
          allergies: ["Penicillin"],
          currentMedications: ["Metformin 500mg"]
        }
      }
    },
    {
      id: 2,
      name: "Priya Devi",
      age: 32,
      gender: "Female",
      location: "Kotla Village",
      phone: "+91 98765 43211",
      waitTime: "10 min",
      priority: "urgent",
      aiAnalysis: {
        timestamp: "2024-01-15T09:45:00Z",
        analysisId: "analysis_1705313100_def456",
        symptoms: [
          { name: "Chest Pain", severity: 9, duration: "1 hour" },
          { name: "Shortness of Breath", severity: 8, duration: "30 minutes" },
          { name: "Dizziness", severity: 6, duration: "1 hour" }
        ],
        disease: {
          name: "Possible Cardiac Event",
          description: "Symptoms suggest potential heart-related condition requiring immediate evaluation",
          probability: "High"
        },
        severity: {
          level: 9,
          description: "High",
          urgency: "Critical"
        },
        medications: [
          {
            name: "Immediate Medical Attention Required",
            type: "Emergency",
            purpose: "Professional evaluation needed",
            dosage: "N/A",
            notes: "Do not self-medicate"
          }
        ],
        recommendations: [
          "Seek immediate emergency medical care",
          "Do not drive to hospital - call ambulance",
          "Avoid physical exertion",
          "Stay calm and rest"
        ],
        redFlags: [
          "Severe chest pain",
          "Difficulty breathing",
          "Radiating pain to arm or jaw",
          "Profuse sweating"
        ],
        emergency: {
          isEmergency: true,
          urgencyLevel: "Critical",
          timeframe: "Immediate",
          reason: "High-risk cardiac symptoms requiring urgent evaluation"
        },
        patientInfo: {
          age: 32,
          gender: "F",
          medicalHistory: ["Hypertension"],
          allergies: [],
          currentMedications: ["Amlodipine 5mg"]
        }
      }
    },
    {
      id: 3,
      name: "Amarjeet Kaur",
      age: 28,
      gender: "Female",
      location: "Bhadson Village",
      phone: "+91 98765 43212",
      waitTime: "15 min",
      priority: "medium",
      aiAnalysis: {
        timestamp: "2024-01-15T11:00:00Z",
        analysisId: "analysis_1705317600_ghi789",
        symptoms: [
          { name: "Abdominal Pain", severity: 5, duration: "2 days" },
          { name: "Nausea", severity: 4, duration: "1 day" },
          { name: "Loss of Appetite", severity: 3, duration: "2 days" }
        ],
        disease: {
          name: "Gastroenteritis",
          description: "Inflammation of stomach and intestines, likely viral in origin",
          probability: "Moderate"
        },
        severity: {
          level: 4,
          description: "Mild to Moderate",
          urgency: "Low"
        },
        medications: [
          {
            name: "ORS (Oral Rehydration Solution)",
            type: "Over-the-counter",
            purpose: "Hydration and electrolyte balance",
            dosage: "200ml after each loose motion",
            notes: "Essential for preventing dehydration"
          },
          {
            name: "Domperidone",
            type: "Prescription",
            purpose: "Nausea control",
            dosage: "10mg three times daily",
            notes: "Take before meals"
          }
        ],
        recommendations: [
          "Maintain hydration with ORS",
          "Eat light, bland foods (BRAT diet)",
          "Avoid dairy and spicy foods",
          "Rest and avoid strenuous activities"
        ],
        redFlags: [
          "Severe dehydration",
          "Blood in vomit or stool",
          "High fever",
          "Severe abdominal pain"
        ],
        emergency: {
          isEmergency: false,
          urgencyLevel: "Low",
          timeframe: "Within 48 hours",
          reason: "Manageable symptoms with monitoring"
        },
        patientInfo: {
          age: 28,
          gender: "F",
          medicalHistory: [],
          allergies: [],
          currentMedications: []
        }
      }
    }
  ]);

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Get severity color
  const getSeverityColor = (level) => {
    if (level >= 8) return 'text-red-600 bg-red-50';
    if (level >= 6) return 'text-orange-600 bg-orange-50';
    if (level >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800';
      case 'in-consultation':
        return 'bg-green-100 text-green-800';
      case 'on-call':
        return 'bg-purple-100 text-purple-800';
      case 'prescribing':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'in-consultation':
        return 'In Consultation';
      case 'on-call':
        return 'On Call';
      case 'prescribing':
        return 'Prescribing';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  // Filter patients based on search
  const filteredPatients = patientQueue.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.aiAnalysis?.disease?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle analysis expansion
  const toggleAnalysisExpansion = (patientId) => {
    setExpandedAnalysis(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  // Handle start consultation
  const handleStartConsultation = (patient) => {
    if (onStartConsultation) {
      // Use the parent component's handler
      onStartConsultation(patient);
    } else {
      // Fallback to local implementation
      alert(`Starting video consultation with ${patient.name}.\n\nThis will open the video consultation interface.`);
    }
    
    // Update local patient status
    setPatients(prev => prev.map(p => 
      p.id === patient.id ? { ...p, status: 'in-consultation' } : p
    ));
  };

  // Handle call patient
  const handleCallPatient = (patient) => {
    // In a real app, this would initiate a phone call
    const confirmCall = window.confirm(
      `Call ${patient.name}?\n\nPhone: ${patient.phone}\n\nThis will initiate a phone call.`
    );
    
    if (confirmCall) {
      // Update patient status
      setPatients(prev => prev.map(p => 
        p.id === patient.id ? { ...p, status: 'on-call' } : p
      ));
      
      // In a real implementation, integrate with telephony system
      alert(`Calling ${patient.name} at ${patient.phone}...`);
    }
  };

  // Handle create prescription
  const handleCreatePrescription = (patient) => {
    if (onCreatePrescription) {
      // Use the parent component's handler (opens prescription modal)
      onCreatePrescription(patient);
    } else {
      // Fallback to local implementation
      alert(`Creating prescription for ${patient.name}.\n\nPatient Details:\n- Age: ${patient.age}\n- Condition: ${patient.aiAnalysis?.disease?.name || 'To be diagnosed'}\n- AI Recommendations: ${patient.aiAnalysis?.medications?.length || 0} suggested medications\n\nThis will open the prescription interface.`);
    }
    
    // Update local patient status
    setPatients(prev => prev.map(p => 
      p.id === patient.id ? { ...p, status: 'prescribing' } : p
    ));
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Dr. {user?.name || 'Smith'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patients in Queue</p>
                <p className="text-2xl font-semibold text-gray-900">{patientQueue.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent Cases</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {patientQueue.filter(p => p.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Analyses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {patientQueue.filter(p => p.aiAnalysis).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Severity</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(
                    patientQueue.reduce((sum, p) => sum + (p.aiAnalysis?.severity?.level || 0), 0) / 
                    patientQueue.length
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients by name, location, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Patient Queue */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Patient Queue with AI Analysis
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredPatients.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                {searchTerm ? 'No patients found matching your search.' : 'No patients in queue.'}
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                  {/* Patient Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{patient.age} years, {patient.gender}</span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {patient.location}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {patient.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {getStatusLabel(patient.status)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                        {patient.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {patient.waitTime}
                      </span>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStartConsultation(patient)}
                          disabled={patient.status === 'in-consultation' || patient.status === 'completed' || !isOnline}
                          className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 text-sm ${
                            patient.status === 'in-consultation' || patient.status === 'completed' || !isOnline
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                          title={
                            !isOnline ? 'Doctor is offline' :
                            patient.status === 'in-consultation' ? 'Already in consultation' : 
                            'Start Video Consultation'
                          }
                        >
                          <Video className="h-4 w-4" />
                          <span>Consult</span>
                        </button>
                        
                        <button
                          onClick={() => handleCallPatient(patient)}
                          disabled={patient.status === 'on-call' || patient.status === 'completed'}
                          className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 text-sm ${
                            patient.status === 'on-call' || patient.status === 'completed'
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          title={patient.status === 'on-call' ? 'Already on call' : 'Call Patient'}
                        >
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </button>
                        
                        <button
                          onClick={() => handleCreatePrescription(patient)}
                          disabled={patient.status === 'completed'}
                          className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 text-sm ${
                            patient.status === 'completed'
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                          title="Create Prescription"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Prescribe</span>
                        </button>
                        
                        <button
                          onClick={() => handlePatientSelect(patient)}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1 text-sm"
                          title="View Detailed Information"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Summary */}
                  {patient.aiAnalysis && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-purple-600" />
                          AI Symptom Analysis
                        </h4>
                        <button
                          onClick={() => toggleAnalysisExpansion(patient.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                        >
                          {expandedAnalysis[patient.id] ? (
                            <>Hide Details <ChevronUp className="h-4 w-4 ml-1" /></>
                          ) : (
                            <>Show Details <ChevronDown className="h-4 w-4 ml-1" /></>
                          )}
                        </button>
                      </div>

                      {/* Quick Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className={`p-3 rounded-lg ${getSeverityColor(patient.aiAnalysis.severity.level)}`}>
                          <div className="text-sm font-medium">Condition</div>
                          <div className="text-sm">{patient.aiAnalysis.disease.name}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 text-blue-800">
                          <div className="text-sm font-medium">Severity</div>
                          <div className="text-sm">{patient.aiAnalysis.severity.level}/10 - {patient.aiAnalysis.severity.description}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-50 text-purple-800">
                          <div className="text-sm font-medium">Symptoms</div>
                          <div className="text-sm">{patient.aiAnalysis.symptoms.length} reported</div>
                        </div>
                      </div>

                      {/* Emergency Alert */}
                      {patient.aiAnalysis.emergency.isEmergency && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                            <div>
                              <p className="text-sm font-semibold text-red-800">EMERGENCY CASE</p>
                              <p className="text-sm text-red-700">{patient.aiAnalysis.emergency.reason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expanded Analysis */}
                      {expandedAnalysis[patient.id] && (
                        <div className="mt-4 space-y-3">
                          {/* Symptoms Detail */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">Reported Symptoms</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {patient.aiAnalysis.symptoms.map((symptom, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                                  <span className="text-sm">{symptom.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-600">{symptom.duration}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(symptom.severity)}`}>
                                      {symptom.severity}/10
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* AI Recommendations */}
                          <div>
                            <h5 className="text-sm font-semibold text-gray-900 mb-2">AI Recommendations</h5>
                            <div className="bg-blue-50 p-3 rounded">
                              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                                {patient.aiAnalysis.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Analysis Timestamp */}
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Analysis generated: {formatTimestamp(patient.aiAnalysis.timestamp)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <PatientDetailsModal 
          patient={selectedPatient}
          onClose={() => {
            setShowPatientDetails(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
};

// Patient Details Modal Component
const PatientDetailsModal = ({ patient, onClose }) => {
  if (!patient) return null;

  const { aiAnalysis } = patient;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Patient Details & AI Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-sm text-gray-900">{patient.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Age:</span>
                <span className="ml-2 text-sm text-gray-900">{patient.age} years</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Gender:</span>
                <span className="ml-2 text-sm text-gray-900">{patient.gender}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Location:</span>
                <span className="ml-2 text-sm text-gray-900">{patient.location}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Phone:</span>
                <span className="ml-2 text-sm text-gray-900">{patient.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Priority:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${patient.priority === 'urgent' ? 'bg-red-100 text-red-800' : patient.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {patient.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* AI Analysis Details */}
          {aiAnalysis && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                Complete AI Analysis Report
              </h3>

              {/* Emergency Status */}
              {aiAnalysis.emergency.isEmergency && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                    <div>
                      <h4 className="text-lg font-semibold text-red-800">⚠️ EMERGENCY CASE</h4>
                      <p className="text-red-700 mt-1">{aiAnalysis.emergency.reason}</p>
                      <p className="text-sm text-red-600 mt-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {aiAnalysis.emergency.timeframe}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">AI Diagnosis</h4>
                <div>
                  <h5 className="font-medium text-blue-800">{aiAnalysis.disease.name}</h5>
                  <p className="text-blue-700 mt-1">{aiAnalysis.disease.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Probability: {aiAnalysis.disease.probability}
                  </span>
                </div>
              </div>

              {/* Symptoms Analysis */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Symptoms Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aiAnalysis.symptoms.map((symptom, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{symptom.name}</span>
                        <span className={`px-2 py-1 rounded text-sm ${symptom.severity >= 7 ? 'bg-red-100 text-red-800' : symptom.severity >= 4 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {symptom.severity}/10
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Duration: {symptom.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Medication Suggestions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">AI Medication Suggestions</h4>
                <div className="space-y-3">
                  {aiAnalysis.medications.map((med, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-green-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-green-900">{med.name}</h5>
                          <p className="text-sm text-green-700 mt-1">{med.purpose}</p>
                          {med.dosage && (
                            <p className="text-sm text-green-800 mt-1">
                              <strong>Dosage:</strong> {med.dosage}
                            </p>
                          )}
                          {med.notes && (
                            <p className="text-xs text-green-600 mt-1">{med.notes}</p>
                          )}
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {med.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Care Recommendations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Care Recommendations</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Warning Signs */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Warning Signs to Monitor</h4>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {aiAnalysis.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-red-800">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Patient Medical History */}
              {aiAnalysis.patientInfo && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Patient Medical Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aiAnalysis.patientInfo.medicalHistory?.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <h5 className="font-medium text-yellow-900 mb-2">Medical History</h5>
                        <ul className="space-y-1">
                          {aiAnalysis.patientInfo.medicalHistory.map((condition, index) => (
                            <li key={index} className="text-sm text-yellow-800">• {condition}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {aiAnalysis.patientInfo.allergies?.length > 0 && (
                      <div className="bg-red-50 rounded-lg p-3">
                        <h5 className="font-medium text-red-900 mb-2">Allergies</h5>
                        <ul className="space-y-1">
                          {aiAnalysis.patientInfo.allergies.map((allergy, index) => (
                            <li key={index} className="text-sm text-red-800">• {allergy}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {aiAnalysis.patientInfo.currentMedications?.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h5 className="font-medium text-purple-900 mb-2">Current Medications</h5>
                        <ul className="space-y-1">
                          {aiAnalysis.patientInfo.currentMedications.map((med, index) => (
                            <li key={index} className="text-sm text-purple-800">• {med}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analysis Metadata */}
              <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
                <p><strong>Analysis ID:</strong> {aiAnalysis.analysisId}</p>
                <p><strong>Generated:</strong> {new Date(aiAnalysis.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <Info className="h-4 w-4 inline mr-1" />
            This analysis is generated by AI and should be used as a reference alongside clinical judgment.
          </div>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDoctorDashboard;