import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import VideoConsultation from '../components/VideoConsultation';
import NotificationSystem from '../components/NotificationSystem';
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
  Trash2,
  Search,
  LogOut
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState('queue');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    diagnosis: '',
    medicines: [],
    instructions: '',
    followUp: ''
  });
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  const [patientQueue, setPatientQueue] = useState([
    {
      id: 1,
      name: "Ram Singh",
      age: 45,
      gender: "Male",
      symptoms: "Fever, Cough, Headache",
      priority: "high",
      waitTime: "5 min",
      location: "Nabha Village",
      phone: "+91 98765 43210"
    },
    {
      id: 2,
      name: "Priya Devi",
      age: 32,
      gender: "Female",
      symptoms: "Chest pain, Shortness of breath",
      priority: "urgent",
      waitTime: "10 min",
      location: "Kotla Village",
      phone: "+91 98765 43211"
    },
    {
      id: 3,
      name: "Amarjeet Kaur",
      age: 28,
      gender: "Female",
      symptoms: "Stomach ache, Nausea",
      priority: "medium",
      waitTime: "15 min",
      location: "Bhadson Village",
      phone: "+91 98765 43212"
    }
  ]);

  const [recentConsultations, setRecentConsultations] = useState([
    {
      id: 1,
      patient: "Suresh Kumar",
      date: "2024-01-15",
      time: "10:00 AM",
      diagnosis: "Common Cold",
      status: "completed",
      prescription: "Paracetamol 500mg",
      notes: "Patient responded well to treatment",
      followUp: "2024-01-22"
    },
    {
      id: 2,
      patient: "Kamla Devi",
      date: "2024-01-15",
      time: "11:30 AM",
      diagnosis: "Hypertension",
      status: "completed",
      prescription: "Amlodipine 5mg",
      notes: "Blood pressure under control",
      followUp: "2024-01-29"
    }
  ]);

  const medicineDatabase = [
    { id: 1, name: "Paracetamol 500mg", dosage: "1-2 tablets", frequency: "Twice daily", duration: "3-5 days" },
    { id: 2, name: "Amoxicillin 250mg", dosage: "1 tablet", frequency: "Three times daily", duration: "7 days" },
    { id: 3, name: "Metformin 500mg", dosage: "1 tablet", frequency: "Twice daily", duration: "As prescribed" },
    { id: 4, name: "Amlodipine 5mg", dosage: "1 tablet", frequency: "Once daily", duration: "As prescribed" },
    { id: 5, name: "Omeprazole 20mg", dosage: "1 tablet", frequency: "Once daily", duration: "4-8 weeks" }
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedConsultations = localStorage.getItem('doctorConsultations');
    const savedNotifications = localStorage.getItem('doctorNotifications');
    
    if (savedConsultations) {
      setRecentConsultations(JSON.parse(savedConsultations));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('doctorConsultations', JSON.stringify(recentConsultations));
  }, [recentConsultations]);

  useEffect(() => {
    localStorage.setItem('doctorNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Function to start consultation
  const handleStartConsultation = (patient) => {
    setCurrentPatient(patient);
    setIsVideoCallActive(true);
  };


  // Function to generate prescription
  const handleGeneratePrescription = () => {
    if (!prescriptionForm.diagnosis || prescriptionForm.medicines.length === 0) {
      alert('Please fill in diagnosis and add at least one medicine');
      return;
    }

    const newPrescription = {
      id: Date.now(),
      patientId: prescriptionForm.patientId,
      diagnosis: prescriptionForm.diagnosis,
      medicines: prescriptionForm.medicines,
      instructions: prescriptionForm.instructions,
      followUp: prescriptionForm.followUp,
      date: new Date().toISOString().split('T')[0],
      doctor: user?.name || 'Dr. Unknown'
    };

    alert('Prescription generated successfully!');
    setShowPrescriptionModal(false);
    setPrescriptionForm({
      patientId: '',
      diagnosis: '',
      medicines: [],
      instructions: '',
      followUp: ''
    });
  };

  // Function to add medicine to prescription
  const handleAddMedicine = (medicine) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, medicine]
    }));
  };

  // Function to remove medicine from prescription
  const handleRemoveMedicine = (medicineId) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter(m => m.id !== medicineId)
    }));
  };

  const PatientQueue = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Patient Queue</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {patientQueue.length} patients waiting
          </span>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1 rounded text-sm ${
              isOnline 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <select className="input-field w-48">
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High Priority</option>
          <option value="medium">Normal</option>
        </select>
      </div>

      <div className="space-y-4">
        {patientQueue
          .filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((patient) => (
          <div key={patient.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                    <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
                  </div>
                </div>
                
                <div className="ml-13 space-y-2">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Stethoscope className="h-4 w-4 mr-1" />
                      {patient.symptoms}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {patient.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {patient.waitTime}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.priority === 'urgent' 
                        ? 'bg-red-100 text-red-800'
                        : patient.priority === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.priority === 'urgent' ? 'Urgent' : 
                       patient.priority === 'high' ? 'High Priority' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => handleStartConsultation(patient)}
                  className="btn-primary text-sm py-2 px-4"
                  disabled={!isOnline}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Start Consultation
                </button>
                <button className="btn-secondary text-sm py-2 px-4">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </button>
                <button 
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPrescriptionModal(true);
                  }}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Prescription
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Consultations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Recent Consultations</h3>
        <button className="btn-primary">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Consultation
        </button>
      </div>

      <div className="space-y-4">
        {recentConsultations.map((consultation) => (
          <div key={consultation.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{consultation.patient}</h4>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {consultation.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {consultation.time}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Diagnosis:</span> {consultation.diagnosis}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Prescription:</span> {consultation.prescription}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {consultation.status}
                </span>
                <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Prescriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Prescription Management</h3>
        <button 
          onClick={() => setShowPrescriptionModal(true)}
          className="btn-primary"
        >
          <FileText className="h-4 w-4 mr-2" />
          Create Prescription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-4">Quick Prescription</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input type="text" className="input-field" placeholder="Enter patient name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis
              </label>
              <input type="text" className="input-field" placeholder="Enter diagnosis" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicines
              </label>
              <textarea 
                className="input-field" 
                rows="3" 
                placeholder="Enter medicines and dosage"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea 
                className="input-field" 
                rows="2" 
                placeholder="Enter instructions for patient"
              ></textarea>
            </div>
            <button className="w-full btn-primary">
              Generate Prescription
            </button>
          </div>
        </div>

        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-4">Recent Prescriptions</h4>
          <div className="space-y-3">
            {[
              { patient: "Ram Singh", medicine: "Paracetamol 500mg", date: "2024-01-15" },
              { patient: "Priya Devi", medicine: "Amlodipine 5mg", date: "2024-01-14" },
              { patient: "Suresh Kumar", medicine: "Azithromycin 250mg", date: "2024-01-13" }
            ].map((prescription, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900">{prescription.patient}</h5>
                    <p className="text-sm text-gray-600">{prescription.medicine}</p>
                    <p className="text-xs text-gray-500">{prescription.date}</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'queue', label: 'Patient Queue', icon: <Users className="h-4 w-4" /> },
    { id: 'consultations', label: 'Consultations', icon: <Video className="h-4 w-4" /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileText className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Doctor'}! Manage patient consultations and provide healthcare services</p>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <NotificationSystem userType="doctor" />
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Patients in Queue</p>
              <p className="text-2xl font-bold text-gray-900">{patientQueue.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Consultations Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prescriptions Issued</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Wait Time</p>
              <p className="text-2xl font-bold text-gray-900">8 min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'queue' && <PatientQueue />}
        {activeTab === 'consultations' && <Consultations />}
        {activeTab === 'prescriptions' && <Prescriptions />}
        {activeTab === 'analytics' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h3>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        )}
      </div>

      {/* Video Consultation Modal */}
      <VideoConsultation
        isActive={isVideoCallActive}
        onClose={() => {
          setIsVideoCallActive(false);
          setCurrentPatient(null);
        }}
        appointment={currentPatient}
        userType="doctor"
      />

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Generate Prescription for {selectedPatient?.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  value={prescriptionForm.diagnosis}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="input-field"
                  placeholder="Enter diagnosis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Medicines
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {medicineDatabase.map((medicine) => (
                    <button
                      key={medicine.id}
                      onClick={() => handleAddMedicine(medicine)}
                      className="p-3 text-left border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50"
                    >
                      <div className="font-medium text-gray-900">{medicine.name}</div>
                      <div className="text-sm text-gray-600">{medicine.dosage} - {medicine.frequency}</div>
                    </button>
                  ))}
                </div>
              </div>

              {prescriptionForm.medicines.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Medicines
                  </label>
                  <div className="space-y-2">
                    {prescriptionForm.medicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{medicine.name}</div>
                          <div className="text-sm text-gray-600">{medicine.dosage} - {medicine.frequency}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveMedicine(medicine.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={prescriptionForm.instructions}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, instructions: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Enter instructions for the patient"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={prescriptionForm.followUp}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, followUp: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePrescription}
                className="flex-1 btn-primary"
              >
                Generate Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
