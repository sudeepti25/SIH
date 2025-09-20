import React from 'react';
import { 
  AlertTriangle, 
  Shield, 
  Pill, 
  CheckCircle, 
  Clock, 
  Phone, 
  Heart,
  AlertCircle,
  Info
} from 'lucide-react';

export default function SymptomAnalysisResult({ analysisResult, onClose }) {
  if (!analysisResult?.data) {
    return null;
  }

  const { data } = analysisResult;
  const {
    disease,
    severity,
    medications = [],
    recommendations = [],
    redFlags = [],
    emergency,
    disclaimer,
    analysisId,
    timestamp
  } = data;

  // Format timestamp
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  // Get severity color based on level
  const getSeverityColor = (level) => {
    if (level >= 8) return 'text-red-600 bg-red-50';
    if (level >= 6) return 'text-orange-600 bg-orange-50';
    if (level >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Symptom Analysis</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Emergency Alert */}
      {emergency?.isEmergency && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">⚠️ URGENT MEDICAL ATTENTION REQUIRED</h3>
              <p className="text-red-700 mt-1">{emergency.reason}</p>
              <p className="text-sm text-red-600 mt-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Seek care {emergency.timeframe || 'immediately'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Call Emergency</span>
            </button>
          </div>
        </div>
      )}

      {/* Disease Information */}
      {disease && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Heart className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900">{disease.name}</h3>
              {disease.description && (
                <p className="text-blue-700 mt-1">{disease.description}</p>
              )}
              {disease.probability && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Probability: {disease.probability}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Severity Assessment */}
      {severity && (
        <div className={`border rounded-lg p-4 ${getSeverityColor(severity.level)}`}>
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold">Severity Assessment</h3>
              <p className="text-sm mt-1">
                <span className="font-medium">Level:</span> {severity.level}/10 ({severity.description})
              </p>
              <p className="text-sm">
                <span className="font-medium">Urgency:</span> {severity.urgency}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medications */}
        {medications.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-green-600" />
              Recommended Medications
            </h3>
            <div className="space-y-3">
              {medications.map((medication, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">{medication.name}</h4>
                      <p className="text-sm text-green-700 mb-2">{medication.purpose}</p>
                      {medication.dosage && (
                        <p className="text-sm text-green-800">
                          <span className="font-medium">Dosage:</span> {medication.dosage}
                        </p>
                      )}
                      {medication.notes && (
                        <p className="text-xs text-green-600 mt-1">{medication.notes}</p>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {medication.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
              Care Recommendations
            </h3>
            <div className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-800 text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Red Flags / Warning Signs */}
      {redFlags.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-900 flex items-center mb-3">
            <AlertCircle className="w-5 h-5 mr-2" />
            Warning Signs - Seek Immediate Care If You Experience:
          </h3>
          <div className="space-y-2">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-red-800 text-sm">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Metadata */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Analysis Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
          {analysisId && (
            <div>
              <span className="font-medium">Analysis ID:</span> {analysisId}
            </div>
          )}
          {timestamp && (
            <div>
              <span className="font-medium">Generated:</span> {formatDate(timestamp)}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Medical Disclaimer</p>
            <p>{disclaimer || "This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for proper medical guidance."}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Book Appointment
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          Save Analysis
        </button>
        <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Share with Doctor
        </button>
      </div>
    </div>
  );
}