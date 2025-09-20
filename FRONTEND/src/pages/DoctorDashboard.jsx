import React, { useState, useEffect } from 'react';
import SimpleWebRTCCaller from '../components/SimpleWebRTCCaller';
import NotificationSystem from '../components/NotificationSystem';
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
  Trash2,
  Search,
  LogOut,
  Plus,
  Edit,
  Save,
  X
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
  const [editingPrescription, setEditingPrescription] = useState(null);

  // Custom medicine form state
  const [customMedicineForm, setCustomMedicineForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [showCustomMedicineForm, setShowCustomMedicineForm] = useState(false);
  const [editingMedicineIndex, setEditingMedicineIndex] = useState(-1);

  // Medicine database - now stored in state so it can be updated
  const [medicineDatabase, setMedicineDatabase] = useState([
    { 
      id: 1, 
      name: "Paracetamol 500mg", 
      dosage: "1-2 tablets", 
      frequency: "Twice daily", 
      duration: "3-5 days",
      instructions: "Take after meals"
    },
    { 
      id: 2, 
      name: "Amoxicillin 250mg", 
      dosage: "1 tablet", 
      frequency: "Three times daily", 
      duration: "7 days",
      instructions: "Complete the full course"
    },
    { 
      id: 3, 
      name: "Metformin 500mg", 
      dosage: "1 tablet", 
      frequency: "Twice daily", 
      duration: "As prescribed",
      instructions: "Take with meals"
    },
    { 
      id: 4, 
      name: "Amlodipine 5mg", 
      dosage: "1 tablet", 
      frequency: "Once daily", 
      duration: "As prescribed",
      instructions: "Take at same time daily"
    },
    { 
      id: 5, 
      name: "Omeprazole 20mg", 
      dosage: "1 tablet", 
      frequency: "Once daily", 
      duration: "4-8 weeks",
      instructions: "Take before breakfast"
    }
  ]);

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
      prescription: {
        medicines: [
          {
            name: "Paracetamol 500mg",
            dosage: "1-2 tablets",
            frequency: "Twice daily",
            duration: "3-5 days",
            instructions: "Take after meals"
          }
        ],
        instructions: "Rest and drink plenty of fluids",
        followUp: "2024-01-22"
      },
      notes: "Patient responded well to treatment"
    },
    {
      id: 2,
      patient: "Kamla Devi",
      date: "2024-01-15",
      time: "11:30 AM",
      diagnosis: "Hypertension",
      status: "completed",
      prescription: {
        medicines: [
          {
            name: "Amlodipine 5mg",
            dosage: "1 tablet",
            frequency: "Once daily",
            duration: "As prescribed",
            instructions: "Take at same time daily"
          }
        ],
        instructions: "Monitor blood pressure regularly",
        followUp: "2024-01-29"
      },
      notes: "Blood pressure under control"
    }
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedConsultations = localStorage.getItem('doctorConsultations');
    const savedNotifications = localStorage.getItem('doctorNotifications');
    const savedMedicines = localStorage.getItem('medicineDatabase');
    
    if (savedConsultations) {
      setRecentConsultations(JSON.parse(savedConsultations));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedMedicines) {
      setMedicineDatabase(JSON.parse(savedMedicines));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('doctorConsultations', JSON.stringify(recentConsultations));
  }, [recentConsultations]);

  useEffect(() => {
    localStorage.setItem('doctorNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('medicineDatabase', JSON.stringify(medicineDatabase));
  }, [medicineDatabase]);

  // Function to start consultation with WebRTC
  const handleStartConsultation = (patient) => {
    setCurrentPatient(patient);
    setIsVideoCallActive(true);
  };

  // Handle call state change
  const handleCallStateChange = (state) => {
    if (state === 'ended') {
      setIsVideoCallActive(false);
      setCurrentPatient(null);
    }
  };

  // Function to add custom medicine to database
  const handleAddCustomMedicine = () => {
    if (!customMedicineForm.name || !customMedicineForm.dosage || !customMedicineForm.frequency) {
      alert('Please fill in medicine name, dosage, and frequency');
      return;
    }

    const newMedicine = {
      id: Date.now(),
      name: customMedicineForm.name,
      dosage: customMedicineForm.dosage,
      frequency: customMedicineForm.frequency,
      duration: customMedicineForm.duration || 'As prescribed',
      instructions: customMedicineForm.instructions || ''
    };

    setMedicineDatabase(prev => [...prev, newMedicine]);
    setCustomMedicineForm({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setShowCustomMedicineForm(false);
    alert('Medicine added to database successfully!');
  };

  // Function to edit medicine in prescription
  const handleEditMedicine = (index, updatedMedicine) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => i === index ? updatedMedicine : med)
    }));
    setEditingMedicineIndex(-1);
  };

  // Function to generate prescription
  const handleGeneratePrescription = () => {
    if (!prescriptionForm.diagnosis || prescriptionForm.medicines.length === 0) {
      alert('Please fill in diagnosis and add at least one medicine');
      return;
    }

    const newConsultation = {
      id: Date.now(),
      patient: selectedPatient?.name || 'Unknown Patient',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnosis: prescriptionForm.diagnosis,
      status: 'completed',
      prescription: {
        medicines: prescriptionForm.medicines,
        instructions: prescriptionForm.instructions,
        followUp: prescriptionForm.followUp
      },
      notes: 'Prescription generated',
      doctor: user?.name || 'Dr. Unknown'
    };

    setRecentConsultations(prev => [newConsultation, ...prev]);
    alert('Prescription generated successfully!');
    setShowPrescriptionModal(false);
    setPrescriptionForm({
      patientId: '',
      diagnosis: '',
      medicines: [],
      instructions: '',
      followUp: ''
    });
    setSelectedPatient(null);
  };

  // Function to add medicine to prescription
  const handleAddMedicine = (medicine) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { ...medicine }]
    }));
  };

  // Function to remove medicine from prescription
  const handleRemoveMedicine = (medicineIndex) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== medicineIndex)
    }));
  };

  // Function to edit existing prescription
  const handleEditPrescription = (consultation) => {
    setEditingPrescription(consultation);
    setPrescriptionForm({
      patientId: consultation.id,
      diagnosis: consultation.diagnosis,
      medicines: [...consultation.prescription.medicines],
      instructions: consultation.prescription.instructions,
      followUp: consultation.prescription.followUp
    });
    setSelectedPatient({ name: consultation.patient });
    setShowPrescriptionModal(true);
  };

  // Function to update existing prescription
  const handleUpdatePrescription = () => {
    if (!prescriptionForm.diagnosis || prescriptionForm.medicines.length === 0) {
      alert('Please fill in diagnosis and add at least one medicine');
      return;
    }

    setRecentConsultations(prev => 
      prev.map(consultation => 
        consultation.id === editingPrescription.id 
          ? {
              ...consultation,
              diagnosis: prescriptionForm.diagnosis,
              prescription: {
                medicines: prescriptionForm.medicines,
                instructions: prescriptionForm.instructions,
                followUp: prescriptionForm.followUp
              }
            }
          : consultation
      )
    );

    alert('Prescription updated successfully!');
    setShowPrescriptionModal(false);
    setEditingPrescription(null);
    setPrescriptionForm({
      patientId: '',
      diagnosis: '',
      medicines: [],
      instructions: '',
      followUp: ''
    });
    setSelectedPatient(null);
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48">
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
          <div key={patient.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
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
  onClick={() => window.open('https://knowsyash.github.io/webrtc_testing/', '_blank')}
  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors text-sm"
  disabled={!isOnline}
>
  <Video className="h-4 w-4" />
  <span>Start Call</span>
</button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedPatient(patient);
                    setEditingPrescription(null);
                    setPrescriptionForm({
                      patientId: '',
                      diagnosis: '',
                      medicines: [],
                      instructions: '',
                      followUp: ''
                    });
                    setShowPrescriptionModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Prescription</span>
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
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Schedule Consultation</span>
        </button>
      </div>

      <div className="space-y-4">
        {recentConsultations.map((consultation) => (
          <div key={consultation.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
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
                  {consultation.prescription?.medicines?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Prescribed Medicines:</p>
                      <ul className="text-sm text-gray-600 ml-4">
                        {consultation.prescription.medicines.map((medicine, index) => (
                          <li key={index} className="list-disc">
                            {medicine.name} - {medicine.dosage}, {medicine.frequency}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {consultation.status}
                </span>
                <div className="mt-2 flex flex-col space-y-1">
                  <button 
                    onClick={() => handleEditPrescription(consultation)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    <Edit className="h-3 w-3" />
                    <span>Edit Prescription</span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 text-sm">
                    View Details
                  </button>
                </div>
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
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCustomMedicineForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medicine</span>
          </button>
          <button 
            onClick={() => {
              setEditingPrescription(null);
              setPrescriptionForm({
                patientId: '',
                diagnosis: '',
                medicines: [],
                instructions: '',
                followUp: ''
              });
              setSelectedPatient(null);
              setShowPrescriptionModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Create Prescription</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medicine Database */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Medicine Database ({medicineDatabase.length})</h4>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {medicineDatabase.map((medicine) => (
              <div key={medicine.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{medicine.name}</h5>
                    <p className="text-sm text-gray-600">{medicine.dosage} - {medicine.frequency}</p>
                    <p className="text-sm text-gray-600">Duration: {medicine.duration}</p>
                    {medicine.instructions && (
                      <p className="text-xs text-gray-500 mt-1">{medicine.instructions}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddMedicine(medicine)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Recent Prescriptions</h4>
          <div className="space-y-3">
            {recentConsultations.slice(0, 5).map((consultation) => (
              <div key={consultation.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900">{consultation.patient}</h5>
                    <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
                    <p className="text-xs text-gray-500">{consultation.date}</p>
                    <p className="text-xs text-gray-500">
                      {consultation.prescription?.medicines?.length || 0} medicine(s)
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <button 
                      onClick={() => handleEditPrescription(consultation)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm">
                      View
                    </button>
                  </div>
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
    <div className="max-w-7xl mx-auto p-4">
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
        <div className="bg-white rounded-lg shadow-md p-6">
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
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Consultations Today</p>
              <p className="text-2xl font-bold text-gray-900">{recentConsultations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prescriptions Issued</p>
              <p className="text-2xl font-bold text-gray-900">{recentConsultations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Pill className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medicines in Database</p>
              <p className="text-2xl font-bold text-gray-900">{medicineDatabase.length}</p>
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
                  ? 'border-blue-500 text-blue-600'
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h3>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        )}
      </div>

      {/* WebRTC Video Call Modal */}
      {isVideoCallActive && currentPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Video Consultation with {currentPatient.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentPatient.age} years, {currentPatient.gender} • {currentPatient.symptoms}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsVideoCallActive(false);
                  setCurrentPatient(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <SimpleWebRTCCaller
              isDoctor={true}
              doctorName={user?.name || 'Dr. Smith'}
              onCallStateChange={handleCallStateChange}
            />
          </div>
        </div>
      )}

      {/* Add Custom Medicine Modal */}
      {showCustomMedicineForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Medicine</h3>
              <button
                onClick={() => {
                  setShowCustomMedicineForm(false);
                  setCustomMedicineForm({
                    name: '',
                    dosage: '',
                    frequency: '',
                    duration: '',
                    instructions: ''
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={customMedicineForm.name}
                  onChange={(e) => setCustomMedicineForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Aspirin 100mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={customMedicineForm.dosage}
                  onChange={(e) => setCustomMedicineForm(prev => ({ ...prev, dosage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1 tablet, 5ml"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <input
                  type="text"
                  value={customMedicineForm.frequency}
                  onChange={(e) => setCustomMedicineForm(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Twice daily, Every 8 hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={customMedicineForm.duration}
                  onChange={(e) => setCustomMedicineForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 7 days, As needed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={customMedicineForm.instructions}
                  onChange={(e) => setCustomMedicineForm(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="e.g., Take after meals, Avoid alcohol"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCustomMedicineForm(false);
                  setCustomMedicineForm({
                    name: '',
                    dosage: '',
                    frequency: '',
                    duration: '',
                    instructions: ''
                  });
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomMedicine}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPrescription ? 'Edit Prescription' : 'Generate Prescription'} 
                {selectedPatient?.name && ` for ${selectedPatient.name}`}
              </h3>
              <button
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setEditingPrescription(null);
                  setPrescriptionForm({
                    patientId: '',
                    diagnosis: '',
                    medicines: [],
                    instructions: '',
                    followUp: ''
                  });
                  setSelectedPatient(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={selectedPatient?.name || ''}
                    onChange={(e) => setSelectedPatient(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis *
                  </label>
                  <input
                    type="text"
                    value={prescriptionForm.diagnosis}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter diagnosis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={prescriptionForm.instructions}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Column: Medicine Selection */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Medicines from Database
                    </label>
                    <button
                      onClick={() => setShowCustomMedicineForm(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>New Medicine</span>
                    </button>
                  </div>
                  <div className="max-h-auto overflow-y-auto border border-gray-200 rounded-lg p-2">
                    <div className="grid grid-cols-1 gap-2">
                      {medicineDatabase.map((medicine) => (
                        <button
                          key={medicine.id}
                          onClick={() => handleAddMedicine(medicine)}
                          className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900 text-sm">{medicine.name}</div>
                          <div className="text-xs text-gray-600">{medicine.dosage} - {medicine.frequency}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Medicines */}
                {prescriptionForm.medicines.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Medicines ({prescriptionForm.medicines.length})
                    </label>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {prescriptionForm.medicines.map((medicine, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3">
                          {editingMedicineIndex === index ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={medicine.name}
                                onChange={(e) => handleEditMedicine(index, { ...medicine, name: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Medicine name"
                              />
                              <input
                                type="text"
                                value={medicine.dosage}
                                onChange={(e) => handleEditMedicine(index, { ...medicine, dosage: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Dosage"
                              />
                              <input
                                type="text"
                                value={medicine.frequency}
                                onChange={(e) => handleEditMedicine(index, { ...medicine, frequency: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Frequency"
                              />
                              <input
                                type="text"
                                value={medicine.duration || ''}
                                onChange={(e) => handleEditMedicine(index, { ...medicine, duration: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Duration"
                              />
                              <input
                                type="text"
                                value={medicine.instructions || ''}
                                onChange={(e) => handleEditMedicine(index, { ...medicine, instructions: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Special instructions"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingMedicineIndex(-1)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                                >
                                  <Save className="h-3 w-3" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={() => setEditingMedicineIndex(-1)}
                                  className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">{medicine.name}</div>
                                <div className="text-xs text-gray-600">{medicine.dosage} - {medicine.frequency}</div>
                                {medicine.duration && (
                                  <div className="text-xs text-gray-600">Duration: {medicine.duration}</div>
                                )}
                                {medicine.instructions && (
                                  <div className="text-xs text-gray-500 mt-1">{medicine.instructions}</div>
                                )}
                              </div>
                              <div className="flex space-x-1 ml-2">
                                <button
                                  onClick={() => setEditingMedicineIndex(index)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                  title="Edit medicine"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleRemoveMedicine(index)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Remove medicine"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setEditingPrescription(null);
                  setPrescriptionForm({
                    patientId: '',
                    diagnosis: '',
                    medicines: [],
                    instructions: '',
                    followUp: ''
                  });
                  setSelectedPatient(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={editingPrescription ? handleUpdatePrescription : handleGeneratePrescription}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                {editingPrescription ? 'Update Prescription' : 'Generate Prescription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;