import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Heart, 
  Ambulance,
  User,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EmergencyPage = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const emergencyTypes = [
    { id: 'medical', name: 'Medical Emergency', icon: <Heart className="h-6 w-6" />, color: 'bg-red-500' },
    { id: 'ambulance', name: 'Ambulance Required', icon: <Ambulance className="h-6 w-6" />, color: 'bg-orange-500' },
    { id: 'accident', name: 'Accident', icon: <AlertTriangle className="h-6 w-6" />, color: 'bg-red-600' },
    { id: 'other', name: 'Other Emergency', icon: <AlertTriangle className="h-6 w-6" />, color: 'bg-gray-500' }
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', number: '108', type: 'Government' },
    { name: 'Police', number: '100', type: 'Police' },
    { name: 'Fire Department', number: '101', type: 'Fire' },
    { name: 'Women Helpline', number: '1091', type: 'Women Safety' },
    { name: 'Child Helpline', number: '1098', type: 'Child Safety' }
  ];

  const nearbyHospitals = [
    { name: 'Civil Hospital Nabha', distance: '2.5 km', phone: '+91 1765 220123', available: true },
    { name: 'Guru Nanak Hospital', distance: '3.2 km', phone: '+91 1765 220456', available: true },
    { name: 'Punjab Health Center', distance: '4.1 km', phone: '+91 1765 220789', available: false }
  ];

  const handleEmergencyCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleSubmitEmergency = (e) => {
    e.preventDefault();
    // In a real app, this would send data to emergency services
    alert('Emergency request submitted! Help is on the way.');
  };

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <div className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2 text-white hover:text-red-200">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6" />
              <h1 className="text-xl font-bold">Emergency Services</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Emergency Contacts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleEmergencyCall(contact.number)}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-left group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500">{contact.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
                <p className="text-2xl font-bold text-red-600">{contact.number}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Request Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Emergency</h2>
          <form onSubmit={handleSubmitEmergency} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type of Emergency
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEmergencyType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      emergencyType === type.id
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`${type.color} p-2 rounded-lg text-white`}>
                        {type.icon}
                      </div>
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Your Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your current location"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows="4"
                placeholder="Describe the emergency situation..."
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <AlertTriangle className="h-5 w-5 inline mr-2" />
                Submit Emergency Request
              </button>
              <button
                type="button"
                onClick={() => handleEmergencyCall('108')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <Phone className="h-5 w-5 inline mr-2" />
                Call 108 Now
              </button>
            </div>
          </form>
        </div>

        {/* Nearby Hospitals */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Nearby Hospitals</h2>
          <div className="space-y-4">
            {nearbyHospitals.map((hospital, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {hospital.distance} away
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {hospital.phone}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      hospital.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {hospital.available ? 'Available' : 'Busy'}
                    </span>
                    <button
                      onClick={() => handleEmergencyCall(hospital.phone)}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Call Hospital
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Emergency Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Stay calm and provide clear information about the emergency
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Keep your location details ready and accessible
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              If possible, have someone else call emergency services while you attend to the patient
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Follow the instructions given by emergency operators
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
