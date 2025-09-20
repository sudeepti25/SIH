import React, { useState } from 'react';
import { Download, Upload, FileText, Calendar, User, Pill, Camera } from 'lucide-react';

export default function MedicalRecords() {
  const [prescriptions] = useState([
    {
      id: 1,
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      medicines: ['Amoxicillin 500mg', 'Ibuprofen 400mg'],
      diagnosis: 'Respiratory Infection'
    },
    {
      id: 2,
      date: '2024-01-05',
      doctor: 'Dr. Michael Chen',
      medicines: ['Lisinopril 10mg', 'Metformin 500mg'],
      diagnosis: 'Routine Check-up'
    },
    {
      id: 3,
      date: '2023-12-28',
      doctor: 'Dr. Emily Rodriguez',
      medicines: ['Hydrocortisone cream', 'Antihistamine 10mg'],
      diagnosis: 'Skin Allergy'
    }
  ]);

  const [consultations] = useState([
    {
      id: 1,
      date: '2024-01-10',
      doctor: 'Dr. Sarah Johnson',
      type: 'Video Consultation',
      notes: 'Patient presented with cold symptoms. Prescribed antibiotics and rest.'
    },
    {
      id: 2,
      date: '2024-01-05',
      doctor: 'Dr. Michael Chen',
      type: 'In-Person Visit',
      notes: 'Routine check-up. Blood pressure and glucose levels normal.'
    }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toLocaleDateString()
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDownload = (prescriptionId) => {
    // Simulate download functionality
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    console.log(`Downloading prescription for: ${prescription.diagnosis}`);
    // In a real app, this would trigger an actual file download
  };

  const handleUploadClick = () => {
    // Trigger file input click
    document.getElementById('file-upload').click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Health Records</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prescriptions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Pill className="w-5 h-5 text-blue-600" />
              <span>Recent Prescriptions</span>
            </h3>
            <div className="space-y-3">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{prescription.diagnosis}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{prescription.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{prescription.doctor}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(prescription.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label={`Download prescription for ${prescription.diagnosis}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Medicines:</p>
                    <div className="flex flex-wrap gap-1">
                      {prescription.medicines.map((medicine, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {medicine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span>Consultation History</span>
            </h3>
            <div className="space-y-3">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{consultation.type}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{consultation.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{consultation.doctor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{consultation.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Upload className="w-5 h-5 text-teal-600" />
          <span>Upload Medical Documents</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div 
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer"
          >
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Lab Test Reports</p>
            <p className="text-xs text-gray-600">Upload PDF files</p>
          </div>
          
          <div 
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer"
          >
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Medical Images</p>
            <p className="text-xs text-gray-600">Upload JPG, PNG files</p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button 
          onClick={handleUploadClick}
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Documents</span>
        </button>

        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Recently Uploaded</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-600">
                        Uploaded on {file.uploadDate} • {Math.round(file.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-800 transition-colors text-sm">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}