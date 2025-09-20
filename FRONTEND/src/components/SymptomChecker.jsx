import React, { useState, useEffect } from 'react';
import { Stethoscope, ChevronDown } from 'lucide-react';

export default function SymptomChecker({ onAnalyze, onSymptomsChange }) {
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

  const handleAnalyze = () => {
    if (selectedSymptoms.length > 0 && duration) {
      if (onAnalyze) {
        onAnalyze({
          symptoms: selectedSymptoms,
          duration,
          severity
        });
      }
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
          </div>
        )}
      </div>
    </div>
  );
}