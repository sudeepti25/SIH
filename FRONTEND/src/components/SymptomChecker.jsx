import React, { useState, useEffect } from 'react';
import { Stethoscope, ChevronDown, User, AlertTriangle, Plus, X } from 'lucide-react';

export default function SymptomChecker({ onAnalyze, onSymptomsChange, isLoading = false }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  
  // Patient information state
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    medicalHistory: [],
    allergies: [],
    currentMedications: []
  });

  // Additional fields for dynamic input
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const symptoms = [
    'Fever', 'Cough', 'Headache', 'Nausea',
    'Chest Pain', 'Dizziness', 'Fatigue', 'Sore Throat',
    'Runny Nose', 'Body Aches', 'Shortness of Breath', 
    'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Rash',
    'Vomiting', 'Diarrhea', 'Constipation', 'Difficulty Swallowing',
    'Other'
  ];

  const durations = [
    '1-2 days',
    '3-5 days',
    '1 week',
    'More than 1 week'
  ];

  const genderOptions = [
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  // Notify parent component whenever symptoms change
  useEffect(() => {
    if (onSymptomsChange) {
      onSymptomsChange(selectedSymptoms);
    }
  }, [selectedSymptoms, onSymptomsChange]);

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field, value, setterFunction) => {
    if (value.trim()) {
      setPatientInfo(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setterFunction('');
    }
  };

  const removeFromArray = (field, index) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length > 0 && duration) {
      const analysisData = {
        symptoms: selectedSymptoms.map(symptomName => ({
          name: symptomName,
          severity: severity,
          duration: duration
        })),
        ...(showPatientInfo && Object.values(patientInfo).some(val => 
          Array.isArray(val) ? val.length > 0 : val
        ) && {
          patientInfo: {
            ...patientInfo,
            age: patientInfo.age ? parseInt(patientInfo.age) : undefined
          }
        })
      };

      if (onAnalyze) {
        onAnalyze(analysisData);
      }
    }
  };

  const isFormValid = selectedSymptoms.length > 0 && duration;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Symptom Checker</h2>
      <p className="text-gray-600 mb-6">Answer a few questions about your symptoms to get personalized health insights and recommendations.</p>
      
      <div className="space-y-6">
        {/* Symptoms Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What symptoms are you experiencing? (Select all that apply)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {symptoms.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomChange(symptom)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-gray-700">{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How long have you had these symptoms?</h3>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
              className="w-full p-4 text-left border border-gray-300 rounded-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Severity Rating */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate the severity (1-10): {severity}</h3>
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Patient Information Toggle */}
        <div className="border-t pt-6">
          <button
            onClick={() => setShowPatientInfo(!showPatientInfo)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            disabled={isLoading}
          >
            <User className="w-5 h-5" />
            <span>{showPatientInfo ? 'Hide' : 'Add'} Patient Information (Optional)</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showPatientInfo ? 'rotate-180' : ''}`} />
          </button>
          
          {showPatientInfo && (
            <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
              {/* Age and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={patientInfo.age}
                    onChange={(e) => handlePatientInfoChange('age', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter age"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newMedicalHistory}
                    onChange={(e) => setNewMedicalHistory(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add medical condition"
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('medicalHistory', newMedicalHistory, setNewMedicalHistory)}
                  />
                  <button
                    onClick={() => addToArray('medicalHistory', newMedicalHistory, setNewMedicalHistory)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !newMedicalHistory.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patientInfo.medicalHistory.map((condition, index) => (
                    <span key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {condition}
                      <button
                        onClick={() => removeFromArray('medicalHistory', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add allergy"
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('allergies', newAllergy, setNewAllergy)}
                  />
                  <button
                    onClick={() => addToArray('allergies', newAllergy, setNewAllergy)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !newAllergy.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patientInfo.allergies.map((allergy, index) => (
                    <span key={index} className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {allergy}
                      <button
                        onClick={() => removeFromArray('allergies', index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add medication"
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && addToArray('currentMedications', newMedication, setNewMedication)}
                  />
                  <button
                    onClick={() => addToArray('currentMedications', newMedication, setNewMedication)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !newMedication.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patientInfo.currentMedications.map((medication, index) => (
                    <span key={index} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {medication}
                      <button
                        onClick={() => removeFromArray('currentMedications', index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                        disabled={isLoading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!isFormValid || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Stethoscope className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          <span>{isLoading ? 'Analyzing...' : 'Analyze Symptoms'}</span>
        </button>

        {/* Selected Symptoms Summary */}
        {selectedSymptoms.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Selected Symptoms:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <span key={symptom} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {symptom}
                </span>
              ))}
            </div>
            <div className="mt-2 text-sm text-blue-700">
              <span className="font-medium">Duration:</span> {duration || 'Not specified'} | 
              <span className="font-medium ml-2">Severity:</span> {severity}/10
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Medical Disclaimer</p>
            <p>This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper medical guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}