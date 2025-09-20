import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import VideoConsultation from '../components/VideoConsultation';
import NotificationSystem from '../components/NotificationSystem';
import { 
  Stethoscope, 
  Calendar, 
  Video, 
  Pill, 
  FileText, 
  AlertTriangle,
  Search,
  Clock,
  CheckCircle,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Heart,
  Activity,
  Download,
  Upload,
  Bell,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Filter,
  SortAsc,
  Eye,
  Star,
  MessageCircle,
  RotateCcw
} from 'lucide-react';

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomSeverity, setSymptomSeverity] = useState(5);
  const [symptomDuration, setSymptomDuration] = useState('');
  const [symptomAnalysis, setSymptomAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
    urgency: 'normal'
  });

  const [recentAppointments, setRecentAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Rajesh Kumar",
      specialty: "General Medicine",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "completed",
      type: "Video Consultation",
      notes: "Prescribed medication for cold symptoms",
      prescription: "Paracetamol 500mg twice daily"
    },
    {
      id: 2,
      doctor: "Dr. Priya Sharma",
      specialty: "Cardiology",
      date: "2024-01-20",
      time: "2:00 PM",
      status: "scheduled",
      type: "In-person",
      notes: "",
      prescription: ""
    },
    {
      id: 3,
      doctor: "Dr. Amit Singh",
      specialty: "Dermatology",
      date: "2024-01-18",
      time: "11:30 AM",
      status: "completed",
      type: "Video Consultation",
      notes: "Skin condition treatment",
      prescription: "Topical cream application"
    }
  ]);

  const [healthRecords, setHealthRecords] = useState([
    {
      id: 1,
      title: "Blood Pressure",
      value: "120/80 mmHg",
      status: "normal",
      category: "vital",
      date: "2024-01-15",
      doctor: "Dr. Rajesh Kumar"
    },
    {
      id: 2,
      title: "Blood Sugar",
      value: "95 mg/dL",
      status: "normal",
      category: "lab",
      date: "2024-01-10",
      doctor: "Dr. Priya Sharma"
    },
    {
      id: 3,
      title: "X-Ray Chest",
      value: "Clear",
      status: "normal",
      category: "imaging",
      date: "2024-01-05",
      doctor: "Dr. Amit Singh"
    }
  ]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('patientAppointments');
    const savedHealthRecords = localStorage.getItem('patientHealthRecords');
    const savedNotifications = localStorage.getItem('patientNotifications');
    
    if (savedAppointments) {
      setRecentAppointments(JSON.parse(savedAppointments));
    }
    if (savedHealthRecords) {
      setHealthRecords(JSON.parse(savedHealthRecords));
    }
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('patientAppointments', JSON.stringify(recentAppointments));
  }, [recentAppointments]);

  useEffect(() => {
    localStorage.setItem('patientHealthRecords', JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem('patientNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const quickActions = [
    {
      icon: <Stethoscope className="h-6 w-6" />,
      title: t('symptomChecker'),
      description: "Check your symptoms and get health insights",
      color: "bg-blue-500",
      action: () => setActiveTab('symptoms')
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: t('bookAppointment'),
      description: "Schedule a consultation with a doctor",
      color: "bg-green-500",
      action: () => setActiveTab('appointments')
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: t('videoConsultation'),
      description: "Start a video call with your doctor",
      color: "bg-purple-500",
      action: () => setActiveTab('consultations')
    },
    {
      icon: <Pill className="h-6 w-6" />,
      title: t('medicineAvailability'),
      description: "Check medicine availability nearby",
      color: "bg-orange-500",
      action: () => setActiveTab('medicines')
    }
  ];



  const availableDoctors = [
    { id: 1, name: "Dr. Rajesh Kumar", specialty: "General Medicine", rating: 4.8, experience: "10 years", available: true },
    { id: 2, name: "Dr. Priya Sharma", specialty: "Cardiology", rating: 4.9, experience: "15 years", available: true },
    { id: 3, name: "Dr. Amit Singh", specialty: "Dermatology", rating: 4.7, experience: "8 years", available: false },
    { id: 4, name: "Dr. Sunita Devi", specialty: "Pediatrics", rating: 4.9, experience: "12 years", available: true },
    { id: 5, name: "Dr. Vikram Joshi", specialty: "Orthopedics", rating: 4.6, experience: "14 years", available: true }
  ];

  const medicineDatabase = [
    { id: 1, name: "Paracetamol 500mg", category: "Pain Relief", price: 2.50, available: true, pharmacy: "City Medical Store", distance: "0.5 km" },
    { id: 2, name: "Amoxicillin 250mg", category: "Antibiotic", price: 15.00, available: false, pharmacy: "Health Plus Pharmacy", distance: "1.2 km" },
    { id: 3, name: "Metformin 500mg", category: "Diabetes", price: 8.50, available: true, pharmacy: "Village Pharmacy", distance: "2.1 km" },
    { id: 4, name: "Amlodipine 5mg", category: "Cardiology", price: 12.00, available: true, pharmacy: "City Medical Store", distance: "0.5 km" },
    { id: 5, name: "Omeprazole 20mg", category: "Gastro", price: 18.00, available: true, pharmacy: "Health Plus Pharmacy", distance: "1.2 km" }
  ];

  // Function to handle symptom selection
  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  // Enhanced synchronous symptom analysis function
  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate synchronous processing with a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced AI analysis based on symptoms, severity, and duration
    const analysis = performSymptomAnalysis(selectedSymptoms, symptomSeverity, symptomDuration);
    
    setSymptomAnalysis(analysis);
    setIsAnalyzing(false);
    
    // Add notification about analysis completion
    const newNotification = {
      id: Date.now(),
      type: 'info',
      title: 'Symptom Analysis Complete',
      message: `Analysis completed for ${selectedSymptoms.length} symptoms. ${analysis.urgency === 'high' ? 'High priority - consider immediate consultation.' : 'Review recommendations below.'}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Enhanced symptom analysis logic
  const performSymptomAnalysis = (symptoms, severity, duration) => {
    const symptomDatabase = {
      'Fever': { conditions: ['Viral Infection', 'Bacterial Infection', 'Flu'], weight: 0.8 },
      'Cough': { conditions: ['Common Cold', 'Flu', 'Bronchitis', 'Pneumonia'], weight: 0.6 },
      'Headache': { conditions: ['Migraine', 'Tension Headache', 'Sinusitis'], weight: 0.5 },
      'Nausea': { conditions: ['Gastroenteritis', 'Food Poisoning', 'Migraine'], weight: 0.7 },
      'Chest Pain': { conditions: ['Heart Condition', 'Pneumonia', 'Anxiety'], weight: 0.9 },
      'Dizziness': { conditions: ['Low Blood Pressure', 'Dehydration', 'Inner Ear Problem'], weight: 0.6 },
      'Fatigue': { conditions: ['Viral Infection', 'Anemia', 'Sleep Disorder'], weight: 0.4 },
      'Sore Throat': { conditions: ['Strep Throat', 'Viral Infection', 'Allergies'], weight: 0.6 },
      'Runny Nose': { conditions: ['Common Cold', 'Allergies', 'Sinusitis'], weight: 0.4 },
      'Body Aches': { conditions: ['Flu', 'Viral Infection', 'Fibromyalgia'], weight: 0.5 },
      'Shortness of Breath': { conditions: ['Asthma', 'Pneumonia', 'Heart Condition'], weight: 0.9 }
    };

    // Calculate condition probabilities
    const conditionScores = {};
    symptoms.forEach(symptom => {
      if (symptomDatabase[symptom]) {
        const data = symptomDatabase[symptom];
        const adjustedWeight = data.weight * (severity / 10);
        
        data.conditions.forEach(condition => {
          conditionScores[condition] = (conditionScores[condition] || 0) + adjustedWeight;
        });
      }
    });

    // Sort conditions by probability
    const sortedConditions = Object.entries(conditionScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([condition]) => condition);

    // Generate recommendations based on analysis
    const recommendations = generateRecommendations(symptoms, severity, duration, sortedConditions);
    
    // Determine urgency level
    const urgency = determineUrgency(symptoms, severity, duration);
    
    // Calculate confidence score
    const confidence = Math.min(95, Math.max(60, Object.values(conditionScores).reduce((a, b) => a + b, 0) * 10));

    return {
      possibleConditions: sortedConditions,
      recommendations,
      urgency,
      confidence: Math.round(confidence),
      severity: severity,
      duration: duration,
      analyzedAt: new Date().toISOString()
    };
  };

  // Generate personalized recommendations
  const generateRecommendations = (symptoms, severity, duration, conditions) => {
    const recommendations = [];
    
    // General recommendations
    recommendations.push('Rest and maintain proper hydration');
    
    // Severity-based recommendations
    if (severity >= 7) {
      recommendations.push('Consider immediate medical consultation');
      recommendations.push('Monitor symptoms closely for any worsening');
    } else if (severity >= 4) {
      recommendations.push('Schedule a consultation within 24-48 hours');
      recommendations.push('Take over-the-counter pain relief if appropriate');
    } else {
      recommendations.push('Monitor symptoms for 24-48 hours');
      recommendations.push('Consider home remedies and rest');
    }
    
    // Duration-based recommendations
    if (duration === 'more-than-2-weeks') {
      recommendations.push('Persistent symptoms require medical evaluation');
    } else if (duration === '1-2-weeks') {
      recommendations.push('Symptoms lasting over a week should be evaluated');
    }
    
    // Symptom-specific recommendations
    if (symptoms.includes('Fever')) {
      recommendations.push('Monitor temperature regularly');
    }
    if (symptoms.includes('Chest Pain') || symptoms.includes('Shortness of Breath')) {
      recommendations.push('Seek immediate medical attention if symptoms worsen');
    }
    if (symptoms.includes('Cough')) {
      recommendations.push('Use cough suppressants if cough is disruptive');
    }
    
    return recommendations;
  };

  // Determine urgency level
  const determineUrgency = (symptoms, severity, duration) => {
    let urgencyScore = 0;
    
    // High-risk symptoms
    if (symptoms.includes('Chest Pain') || symptoms.includes('Shortness of Breath')) {
      urgencyScore += 3;
    }
    
    // Severity factor
    if (severity >= 8) urgencyScore += 2;
    else if (severity >= 6) urgencyScore += 1;
    
    // Duration factor
    if (duration === 'more-than-2-weeks') urgencyScore += 2;
    else if (duration === '1-2-weeks') urgencyScore += 1;
    
    // Multiple symptoms
    if (symptoms.length >= 4) urgencyScore += 1;
    
    if (urgencyScore >= 4) return 'high';
    if (urgencyScore >= 2) return 'medium';
    return 'low';
  };

  // Function to book appointment
  const handleBookAppointment = (appointment) => {
    const newAppointment = {
      id: Date.now(),
      ...appointment,
      status: 'scheduled'
    };
    setRecentAppointments(prev => [...prev, newAppointment]);
    setShowNewAppointment(false);
    alert('Appointment booked successfully!');
  };

  // Function to join video call
  const handleJoinVideoCall = (appointmentId) => {
    const appointment = recentAppointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setCurrentAppointment(appointment);
      setIsVideoCallActive(true);
      alert('Video call started! (Simulated)');
    }
  };

  // Function to search medicines
  const handleMedicineSearch = (searchTerm) => {
    const filtered = medicineDatabase.filter(medicine =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  };

  const SymptomChecker = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Symptom Checker</h3>
        <p className="text-gray-600 mb-6">
          Answer a few questions about your symptoms to get personalized health insights and recommendations.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What symptoms are you experiencing? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Fever', 'Cough', 'Headache', 'Nausea', 'Chest Pain', 'Dizziness', 'Fatigue', 'Sore Throat', 'Runny Nose', 'Body Aches', 'Shortness of Breath', 'Other'].map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedSymptoms.includes(symptom)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedSymptoms.includes(symptom)
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedSymptoms.includes(symptom) && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{symptom}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How long have you had these symptoms?
            </label>
            <select 
              value={symptomDuration}
              onChange={(e) => setSymptomDuration(e.target.value)}
              className="input-field"
            >
              <option value="">Select duration</option>
              <option value="less-than-1-day">Less than 1 day</option>
              <option value="1-3-days">1-3 days</option>
              <option value="4-7-days">4-7 days</option>
              <option value="1-2-weeks">1-2 weeks</option>
              <option value="more-than-2-weeks">More than 2 weeks</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate the severity (1-10): {symptomSeverity}
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={symptomSeverity}
              onChange={(e) => setSymptomSeverity(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Mild (1)</span>
              <span>Severe (10)</span>
            </div>
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Selected Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <span key={symptom} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={analyzeSymptoms}
            className="btn-primary w-full"
            disabled={selectedSymptoms.length === 0 || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Stethoscope className="h-5 w-5 mr-2 inline" />
                Analyze Symptoms
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {symptomAnalysis && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Confidence: {symptomAnalysis.confidence}%
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                symptomAnalysis.urgency === 'high' 
                  ? 'bg-red-100 text-red-800'
                  : symptomAnalysis.urgency === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {symptomAnalysis.urgency.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Possible Conditions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Possible Conditions</h4>
              <div className="space-y-2">
                {symptomAnalysis.possibleConditions.map((condition, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-800">{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-2">
                {symptomAnalysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800 text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            {symptomAnalysis.urgency === 'high' && (
              <button 
                onClick={() => setActiveTab('appointments')}
                className="btn-primary flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Urgent Appointment
              </button>
            )}
            <button 
              onClick={() => setActiveTab('consultations')}
              className="btn-secondary flex-1"
            >
              <Video className="h-4 w-4 mr-2" />
              Video Consultation
            </button>
            <button 
              onClick={() => setSymptomAnalysis(null)}
              className="btn-secondary"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Analysis
            </button>
          </div>

          {/* Analysis Details */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Severity:</span> {symptomAnalysis.severity}/10
              </div>
              <div>
                <span className="font-medium">Duration:</span> {symptomAnalysis.duration.replace('-', ' ')}
              </div>
              <div>
                <span className="font-medium">Analyzed:</span> {new Date(symptomAnalysis.analyzedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Appointments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">My Appointments</h3>
        <button 
          onClick={() => setShowNewAppointment(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Book New Appointment
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <select className="input-field w-48">
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {recentAppointments
          .filter(appointment => 
            appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((appointment) => (
          <div key={appointment.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{appointment.doctor}</h4>
                    <p className="text-gray-600">{appointment.specialty}</p>
                  </div>
                </div>
                
                <div className="ml-13 space-y-2">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {appointment.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {appointment.time}
                    </span>
                    <span className="flex items-center">
                      <Video className="h-4 w-4 mr-1" />
                      {appointment.type}
                    </span>
                  </div>
                  
                  {appointment.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    </div>
                  )}
                  
                  {appointment.prescription && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">Prescription:</span> {appointment.prescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : appointment.status === 'scheduled'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {appointment.status === 'completed' ? 'Completed' : 
                   appointment.status === 'upcoming' ? 'Upcoming' :
                   appointment.status === 'scheduled' ? 'Scheduled' : 'Cancelled'}
                </span>
                
                <div className="flex space-x-2">
                  {appointment.status === 'upcoming' && (
                    <button 
                      onClick={() => handleJoinVideoCall(appointment.id)}
                      className="btn-primary text-sm py-2 px-3"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join Call
                    </button>
                  )}
                  
                  {appointment.status === 'scheduled' && (
                    <button className="btn-secondary text-sm py-2 px-3">
                      <Edit className="h-4 w-4 mr-1" />
                      Reschedule
                    </button>
                  )}
                  
                  <button className="text-gray-400 hover:text-red-600 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book New Appointment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select 
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, doctor: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Choose a doctor</option>
                  {availableDoctors.filter(doctor => doctor.available).map(doctor => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name} - {doctor.specialty} ({doctor.experience})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <select 
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, reason: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Describe your symptoms or reason for consultation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select 
                  value={newAppointment.urgency}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, urgency: e.target.value }))}
                  className="input-field"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewAppointment(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBookAppointment(newAppointment)}
                className="flex-1 btn-primary"
                disabled={!newAppointment.doctor || !newAppointment.date || !newAppointment.time}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const HealthRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Health Records</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(healthRecords, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `health-records-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Records
          </button>
          <button 
            onClick={() => {
              const title = prompt('Enter record title:');
              const value = prompt('Enter record value:');
              const category = prompt('Enter category (vital/lab/imaging/medication):');
              if (title && value && category) {
                const newRecord = {
                  id: Date.now(),
                  title,
                  value,
                  status: 'normal',
                  category,
                  date: new Date().toISOString().split('T')[0],
                  doctor: user?.name || 'Dr. Unknown'
                };
                setHealthRecords(prev => [newRecord, ...prev]);
                alert('Health record added successfully!');
              }
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search health records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
        <select className="input-field w-48">
          <option value="">All Categories</option>
          <option value="vital">Vital Signs</option>
          <option value="lab">Lab Tests</option>
          <option value="imaging">Imaging</option>
          <option value="medication">Medications</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthRecords
          .filter(record => 
            record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((record) => (
          <div key={record.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{record.title}</h4>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <button className="text-gray-400 hover:text-primary-600">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary-600">{record.value}</p>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {record.date}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Doctor:</span> {record.doctor}
              </p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  record.status === 'normal' 
                    ? 'bg-green-100 text-green-800'
                    : record.status === 'abnormal'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {record.status}
                </span>
                <span className="text-xs text-gray-500 capitalize">{record.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Health Summary */}
      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-4">Health Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">Good</div>
            <div className="text-sm text-gray-600">Overall Health</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">Records This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">2</div>
            <div className="text-sm text-gray-600">Upcoming Tests</div>
          </div>
        </div>
      </div>
    </div>
  );

  const MedicineAvailability = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');

    const filteredMedicines = medicineDatabase
      .filter(medicine => 
        medicine.name.toLowerCase().includes(medicineSearch.toLowerCase()) &&
        (selectedCategory === '' || medicine.category === selectedCategory)
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
        return 0;
      });

    const handleReserveMedicine = (medicine) => {
      alert(`Medicine reserved at ${medicine.pharmacy}! You will receive a confirmation SMS.`);
    };

    return (
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Medicine Availability</h3>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for medicines..."
                    value={medicineSearch}
                    onChange={(e) => {
                      setMedicineSearch(e.target.value);
                      handleMedicineSearch(e.target.value);
                    }}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-48"
              >
                <option value="">All Categories</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Gastro">Gastro</option>
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-32"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="distance">Sort by Distance</option>
              </select>
            </div>
            
            {/* Medicine List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((medicine) => (
                <div key={medicine.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                      <p className="text-sm text-gray-600">{medicine.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      medicine.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {medicine.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">₹{medicine.price}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {medicine.distance} away
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm">{medicine.pharmacy}</p>
                    
                    {medicine.available && (
                      <div className="flex space-x-2 mt-3">
                        <button 
                          onClick={() => handleReserveMedicine(medicine)}
                          className="flex-1 btn-primary text-sm py-2"
                        >
                          <Pill className="h-4 w-4 mr-1" />
                          Reserve Medicine
                        </button>
                        <button className="btn-secondary text-sm py-2 px-3">
                          <Phone className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No medicines found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Medicine Categories */}
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-4">Popular Medicine Categories</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Pain Relief', 'Antibiotic', 'Diabetes', 'Cardiology', 'Gastro'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedCategory === category
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Pill className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
    { id: 'symptoms', label: 'Symptom Checker', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-4 w-4" /> },
    { id: 'records', label: 'Health Records', icon: <FileText className="h-4 w-4" /> },
    { id: 'medicines', label: 'Medicines', icon: <Pill className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Patient'}! Manage your health and access healthcare services</p>
          </div>
          
          {/* User Profile and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationSystem userType="patient" />
            
            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="h-6 w-6" />
            </button>
            
            {/* Logout */}
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

      {/* Emergency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
          <div>
            <h3 className="font-semibold text-red-800">Emergency Services</h3>
            <p className="text-red-700 text-sm">Need immediate medical help? Call emergency services at 108</p>
          </div>
          <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Call Now
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="card hover:shadow-lg transition-shadow text-left group"
          >
            <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
            <ArrowRight className="h-4 w-4 text-primary-600 mt-2 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Appointments />
            <HealthRecords />
          </div>
        )}
        {activeTab === 'symptoms' && <SymptomChecker />}
        {activeTab === 'appointments' && <Appointments />}
        {activeTab === 'records' && <HealthRecords />}
        {activeTab === 'medicines' && <MedicineAvailability />}
      </div>

      {/* Video Consultation Modal */}
      <VideoConsultation
        isActive={isVideoCallActive}
        onClose={() => {
          setIsVideoCallActive(false);
          setCurrentAppointment(null);
        }}
        appointment={currentAppointment}
        userType="patient"
      />
    </div>
  );
};

export default PatientDashboard;
