import React, { useState, useEffect } from 'react';
import { Calendar, Video, Clock, User, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import doctorsData from '../data/doctors.json';

export default function AppointmentManagement({ showBooking, onBookingComplete, selectedSymptoms = [] }) {
  const [suggestedAppointments, setSuggestedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Find matching doctors based on selected symptoms
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const matchingDoctors = doctorsData.doctors.filter(doctor => 
          doctor.symptoms.some(symptom => selectedSymptoms.includes(symptom))
        );

        // Create suggested appointments from matching doctors
        const appointments = matchingDoctors.flatMap(doctor => 
          doctor.availability.map(slot => ({
            id: `${doctor.id}-${slot.date}-${slot.time}`,
            doctor: doctor.name,
            specialization: doctor.specialization,
            date: slot.date,
            time: slot.time,
            status: slot.status,
            matchingSymptoms: doctor.symptoms.filter(symptom => selectedSymptoms.includes(symptom)),
            doctorId: doctor.id
          }))
        );

        // Sort by relevance (number of matching symptoms) and date
        appointments.sort((a, b) => {
          if (b.matchingSymptoms.length !== a.matchingSymptoms.length) {
            return b.matchingSymptoms.length - a.matchingSymptoms.length;
          }
          return new Date(a.date) - new Date(b.date);
        });

        setSuggestedAppointments(appointments);
        setIsLoading(false);
      }, 500);
    } else {
      setSuggestedAppointments([]);
    }
  }, [selectedSymptoms]);

  const handleBookAppointment = (appointmentId) => {
    // Update appointment status to confirmed
    setSuggestedAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed' }
          : apt
      )
    );
    
    if (onBookingComplete) {
      onBookingComplete();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {showBooking && selectedSymptoms.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Symptom Analysis Complete</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Based on your symptoms ({selectedSymptoms.join(', ')}), we found {suggestedAppointments.length} available specialists.
          </p>
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <UserCheck className="w-4 h-4" />
            <span>Recommended appointments are shown below</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedSymptoms.length > 0 ? 'Recommended Appointments' : 'Available Appointments'}
          </h2>
          {selectedSymptoms.length > 0 && (
            <div className="text-sm text-gray-500">
              {suggestedAppointments.length} specialists found
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding specialists for your symptoms...</p>
          </div>
        ) : suggestedAppointments.length > 0 ? (
          <div className="space-y-4">
            {suggestedAppointments.map((appointment) => (
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
                    
                    {/* Matching symptoms indicator */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700">
                          Treats: {appointment.matchingSymptoms.join(', ')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.matchingSymptoms.length} of {selectedSymptoms.length} symptoms match
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.date)}</span>
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
                            <span className="text-yellow-600 font-medium">Available</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {appointment.status === 'confirmed' ? (
                      <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                        <Video className="w-4 h-4" />
                        <span>Join Call</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBookAppointment(appointment.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedSymptoms.length > 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No specialists found</h3>
            <p className="text-gray-600">
              We couldn't find specialists for the selected symptoms. Please try different symptoms or contact support.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select symptoms to see recommendations</h3>
            <p className="text-gray-600">
              Choose your symptoms in the symptom checker to get personalized doctor recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}