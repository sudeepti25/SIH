import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { doctorAPI, doctorUtils } from '../utils/doctorAPI';

/**
 * Custom hook for managing doctor dashboard state and data
 */
const useDoctorDashboard = () => {
  const { user } = useContext(UserContext);
  
  // State management
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    emergencyPatients: 0,
    averageSeverity: 0,
    waitingTime: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priority: 'all',
    severity: 'all',
    emergency: 'all'
  });

  // Derived state
  const filteredPatients = patients.filter(patient => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = patient.name.toLowerCase().includes(query);
      const matchesSymptoms = patient.aiAnalysis?.symptoms?.some(s => 
        s.name.toLowerCase().includes(query)
      );
      const matchesCondition = patient.aiAnalysis?.disease?.name?.toLowerCase().includes(query);
      
      if (!matchesName && !matchesSymptoms && !matchesCondition) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority !== 'all' && patient.priority !== filters.priority) {
      return false;
    }

    // Severity filter
    if (filters.severity !== 'all') {
      const severityLevel = patient.aiAnalysis?.severity?.level || 0;
      switch (filters.severity) {
        case 'low':
          if (severityLevel > 3) return false;
          break;
        case 'medium':
          if (severityLevel <= 3 || severityLevel > 6) return false;
          break;
        case 'high':
          if (severityLevel <= 6) return false;
          break;
      }
    }

    // Emergency filter
    if (filters.emergency !== 'all') {
      const isEmergency = patient.aiAnalysis?.emergency?.isEmergency;
      if (filters.emergency === 'emergency' && !isEmergency) return false;
      if (filters.emergency === 'normal' && isEmergency) return false;
    }

    return true;
  });

  const sortedPatients = doctorUtils.sortPatientsByPriority(filteredPatients);
  const emergencyPatients = doctorUtils.getEmergencyPatients(patients);
  const highPriorityPatients = doctorUtils.getHighPriorityPatients(patients);

  /**
   * Load patient queue data
   */
  const loadPatientQueue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch real data from backend
      const response = await doctorAPI.getPatientQueue();
      setPatients(response.patients || []);
      updateStats(response.patients || []);
    } catch (err) {
      console.warn('Failed to fetch real patient data, using mock data:', err);
      
      // Use mock data when backend is not available
      const mockPatients = generateMockPatients();
      setPatients(mockPatients);
      updateStats(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load detailed patient information
   */
  const loadPatientDetails = async (patientId) => {
    try {
      const response = await doctorAPI.getPatientDetails(patientId);
      setSelectedPatient(response.patient);
      return response.patient;
    } catch (err) {
      console.warn('Failed to fetch patient details, using mock data:', err);
      const mockPatient = generateMockPatientDetails(patientId);
      setSelectedPatient(mockPatient);
      return mockPatient;
    }
  };

  /**
   * Update patient status
   */
  const updatePatientStatus = async (patientId, status) => {
    try {
      await doctorAPI.updatePatientStatus(patientId, status);
      
      // Update local state
      setPatients(prev => prev.map(p => 
        p.id === patientId ? { ...p, status } : p
      ));
      
      return true;
    } catch (err) {
      console.error('Failed to update patient status:', err);
      setError('Failed to update patient status');
      return false;
    }
  };

  /**
   * Acknowledge emergency case
   */
  const acknowledgeEmergency = async (patientId, action) => {
    try {
      await doctorAPI.acknowledgeEmergency(patientId, action);
      
      // Update local state
      setPatients(prev => prev.map(p => 
        p.id === patientId 
          ? { 
              ...p, 
              aiAnalysis: {
                ...p.aiAnalysis,
                emergency: {
                  ...p.aiAnalysis.emergency,
                  acknowledged: true,
                  acknowledgedBy: user?.name,
                  acknowledgedAt: new Date().toISOString(),
                  action
                }
              }
            }
          : p
      ));
      
      return true;
    } catch (err) {
      console.error('Failed to acknowledge emergency:', err);
      setError('Failed to acknowledge emergency');
      return false;
    }
  };

  /**
   * Search patients
   */
  const searchPatients = async (query) => {
    if (!query) {
      setSearchQuery('');
      return;
    }
    
    setSearchQuery(query);
    
    try {
      const response = await doctorAPI.searchPatients(query);
      setPatients(response.patients || []);
    } catch (err) {
      console.warn('Search failed, using local filter:', err);
      // Local search will be handled by filteredPatients
    }
  };

  /**
   * Update dashboard statistics
   */
  const updateStats = (patientList) => {
    const emergencyCount = doctorUtils.getEmergencyPatients(patientList).length;
    const averageSeverity = doctorUtils.calculateAverageSeverity(patientList);
    const totalWaitTime = patientList.reduce((sum, p) => {
      const waitMinutes = parseInt(p.waitTime) || 0;
      return sum + waitMinutes;
    }, 0);
    
    setStats({
      totalPatients: patientList.length,
      emergencyPatients: emergencyCount,
      averageSeverity,
      waitingTime: patientList.length > 0 ? Math.round(totalWaitTime / patientList.length) : 0
    });
  };

  /**
   * Generate mock patient data for development
   */
  const generateMockPatients = () => {
    return [
      {
        id: 1,
        name: "Rajesh Kumar",
        age: 45,
        gender: "Male",
        status: "waiting",
        priority: "urgent",
        waitTime: "25 min",
        phone: "+91 9876543210",
        aiAnalysis: {
          id: "analysis_001",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          symptoms: [
            { name: "Chest pain", severity: 8, duration: "2 hours" },
            { name: "Shortness of breath", severity: 7, duration: "2 hours" },
            { name: "Sweating", severity: 6, duration: "1 hour" }
          ],
          severity: {
            level: 9,
            description: "High - Requires immediate attention"
          },
          disease: {
            name: "Acute Myocardial Infarction (Heart Attack)",
            confidence: 0.85,
            description: "Based on symptoms, this appears to be a cardiac emergency requiring immediate medical attention."
          },
          emergency: {
            isEmergency: true,
            reason: "Symptoms suggest acute myocardial infarction",
            recommendedAction: "Call emergency services immediately",
            timeframe: "Immediate (< 5 minutes)"
          },
          medications: [
            {
              name: "Aspirin",
              dosage: "325mg",
              frequency: "Once immediately",
              purpose: "Blood thinner to prevent clot formation"
            }
          ],
          recommendations: [
            "Call emergency services immediately",
            "Take aspirin if not allergic",
            "Rest in comfortable position",
            "Monitor vital signs"
          ]
        }
      },
      {
        id: 2,
        name: "Priya Sharma",
        age: 28,
        gender: "Female",
        status: "waiting",
        priority: "high",
        waitTime: "15 min",
        phone: "+91 9876543211",
        aiAnalysis: {
          id: "analysis_002",
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          symptoms: [
            { name: "Fever", severity: 7, duration: "3 days" },
            { name: "Severe headache", severity: 8, duration: "2 days" },
            { name: "Neck stiffness", severity: 6, duration: "1 day" }
          ],
          severity: {
            level: 8,
            description: "High - Urgent medical attention needed"
          },
          disease: {
            name: "Bacterial Meningitis",
            confidence: 0.75,
            description: "Symptoms suggest possible bacterial meningitis requiring urgent evaluation."
          },
          emergency: {
            isEmergency: true,
            reason: "Combination of fever, headache, and neck stiffness suggests meningitis",
            recommendedAction: "Seek emergency medical care immediately",
            timeframe: "Urgent (< 30 minutes)"
          },
          medications: [
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Every 6 hours",
              purpose: "Fever and pain relief"
            }
          ],
          recommendations: [
            "Immediate hospital evaluation",
            "Blood tests and lumbar puncture may be needed",
            "Avoid bright lights",
            "Monitor for worsening symptoms"
          ]
        }
      },
      {
        id: 3,
        name: "Amit Patel",
        age: 35,
        gender: "Male",
        status: "waiting",
        priority: "medium",
        waitTime: "40 min",
        phone: "+91 9876543212",
        aiAnalysis: {
          id: "analysis_003",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          symptoms: [
            { name: "Persistent cough", severity: 5, duration: "2 weeks" },
            { name: "Low-grade fever", severity: 4, duration: "1 week" },
            { name: "Fatigue", severity: 5, duration: "1 week" }
          ],
          severity: {
            level: 5,
            description: "Moderate - Requires medical consultation"
          },
          disease: {
            name: "Upper Respiratory Tract Infection",
            confidence: 0.70,
            description: "Symptoms suggest viral or bacterial respiratory infection."
          },
          emergency: {
            isEmergency: false,
            reason: "Symptoms are concerning but not immediately life-threatening",
            recommendedAction: "Schedule appointment with healthcare provider",
            timeframe: "Within 24-48 hours"
          },
          medications: [
            {
              name: "Dextromethorphan",
              dosage: "15mg",
              frequency: "Every 4 hours",
              purpose: "Cough suppressant"
            },
            {
              name: "Paracetamol",
              dosage: "500mg",
              frequency: "Every 6 hours as needed",
              purpose: "Fever and pain relief"
            }
          ],
          recommendations: [
            "Increase fluid intake",
            "Rest and avoid strenuous activities",
            "Use humidifier or steam inhalation",
            "Monitor temperature regularly"
          ]
        }
      }
    ];
  };

  /**
   * Generate mock patient details
   */
  const generateMockPatientDetails = (patientId) => {
    const patient = patients.find(p => p.id.toString() === patientId.toString());
    if (!patient) return null;

    return {
      ...patient,
      medicalHistory: [
        "Hypertension (2018)",
        "Type 2 Diabetes (2020)",
        "Previous myocardial infarction (2021)"
      ],
      allergies: ["Penicillin", "Shellfish"],
      currentMedications: [
        "Metformin 500mg twice daily",
        "Lisinopril 10mg once daily",
        "Atorvastatin 20mg once daily"
      ],
      vitalSigns: {
        bloodPressure: "150/95 mmHg",
        heartRate: "95 bpm",
        temperature: "98.6°F",
        respiratoryRate: "18 breaths/min",
        oxygenSaturation: "98%"
      },
      analysisHistory: [
        {
          id: "prev_001",
          date: "2024-01-15",
          condition: "Common Cold",
          severity: 3,
          resolved: true
        },
        {
          id: "prev_002",
          date: "2024-02-20",
          condition: "Gastritis",
          severity: 4,
          resolved: true
        }
      ]
    };
  };

  // Load initial data
  useEffect(() => {
    if (user) {
      loadPatientQueue();
    }
  }, [user]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !loading) {
        loadPatientQueue();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, loading]);

  return {
    // State
    patients: sortedPatients,
    selectedPatient,
    loading,
    error,
    stats,
    searchQuery,
    filters,
    
    // Derived data
    emergencyPatients,
    highPriorityPatients,
    
    // Actions
    loadPatientQueue,
    loadPatientDetails,
    updatePatientStatus,
    acknowledgeEmergency,
    searchPatients,
    setSearchQuery,
    setFilters,
    setSelectedPatient,
    setError
  };
};

export default useDoctorDashboard;