import React, { useState, useEffect } from 'react';
import { 
  Pill,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  Send,
  Clock,
  AlertTriangle,
  Navigation,
  Star,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Package,
  User,
  FileText
} from 'lucide-react';

const PrescriptionManagementDashboard = () => {
  const [incomingPrescriptions, setIncomingPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [pharmacyAllocations, setPharmacyAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extended mock data for incoming prescriptions
  const mockIncomingPrescriptions = [
    {
      id: 'RX001',
      patientName: 'Ram Singh',
      patientLocation: { lat: 30.2649, lng: 76.0844, address: 'Village Nabha, Punjab' },
      doctorName: 'Dr. Sharma',
      consultationTime: '10:30 AM',
      status: 'pending',
      urgency: 'medium',
      medicines: [
        { name: 'Paracetamol 500mg', dosage: '1 tablet twice daily', quantity: 10 },
        { name: 'Cetirizine 10mg', dosage: '1 tablet at night', quantity: 7 },
        { name: 'Vitamin C tablets', dosage: '1 tablet daily', quantity: 15 }
      ]
    },
    {
      id: 'RX002',
      patientName: 'Priya Kaur',
      patientLocation: { lat: 30.2842, lng: 76.1234, address: 'Kotla Village, Punjab' },
      doctorName: 'Dr. Gupta',
      consultationTime: '11:15 AM',
      status: 'pending',
      urgency: 'high',
      medicines: [
        { name: 'Propranolol 40mg', dosage: '1 tablet twice daily', quantity: 14 },
        { name: 'Alprazolam 0.25mg', dosage: '1/2 tablet when needed', quantity: 10 }
      ]
    },
    {
      id: 'RX003',
      patientName: 'Gurpreet Singh',
      patientLocation: { lat: 30.2456, lng: 76.0567, address: 'Bhadson Village, Punjab' },
      doctorName: 'Dr. Kaur',
      consultationTime: '09:45 AM',
      status: 'pending',
      urgency: 'low',
      medicines: [
        { name: 'Metformin 500mg', dosage: '1 tablet twice daily', quantity: 60 },
        { name: 'Amlodipine 5mg', dosage: '1 tablet daily', quantity: 30 }
      ]
    },
    {
      id: 'RX004',
      patientName: 'Manpreet Kaur',
      patientLocation: { lat: 30.2700, lng: 76.0800, address: 'Ghanaur, Punjab' },
      doctorName: 'Dr. Singh',
      consultationTime: '12:30 PM',
      status: 'sent_to_pharmacy',
      urgency: 'medium',
      medicines: [
        { name: 'Amoxicillin 500mg', dosage: '1 tablet three times daily', quantity: 21 }
      ],
      allocations: [{ pharmacy: { name: 'HealthPlus Pharmacy' }, medicines: [{ name: 'Amoxicillin 500mg' }] }]
    },
    {
      id: 'RX005',
      patientName: 'Harjeet Singh',
      patientLocation: { lat: 30.2500, lng: 76.0600, address: 'Dudhansadhan, Punjab' },
      doctorName: 'Dr. Patel',
      consultationTime: '02:15 PM',
      status: 'pending',
      urgency: 'high',
      medicines: [
        { name: 'Insulin Glargine', dosage: '10 units at bedtime', quantity: 1 },
        { name: 'Glucose strips', dosage: 'As needed for monitoring', quantity: 50 }
      ]
    },
    {
      id: 'RX006',
      patientName: 'Jasbir Kaur',
      patientLocation: { lat: 30.2800, lng: 76.1100, address: 'Sanour, Punjab' },
      doctorName: 'Dr. Bhalla',
      consultationTime: '01:45 PM',
      status: 'pending',
      urgency: 'low',
      medicines: [
        { name: 'Omeprazole 20mg', dosage: '1 tablet before breakfast', quantity: 30 }
      ]
    },
    {
      id: 'RX007',
      patientName: 'Rajinder Singh',
      patientLocation: { lat: 30.2350, lng: 76.0750, address: 'Rampur, Punjab' },
      doctorName: 'Dr. Arora',
      consultationTime: '03:00 PM',
      status: 'pending',
      urgency: 'medium',
      medicines: [
        { name: 'Atorvastatin 20mg', dosage: '1 tablet at night', quantity: 30 },
        { name: 'Aspirin 75mg', dosage: '1 tablet daily', quantity: 30 }
      ]
    }
  ];

  // Mock pharmacy data with medicine inventory
  const pharmacyDatabase = [
    {
      id: 'PH001',
      name: 'HealthPlus Pharmacy',
      location: { lat: 30.2650, lng: 76.0850, address: 'Main Market, Nabha' },
      contact: '+91-9876543210',
      rating: 4.8,
      deliveryTime: '30 mins',
      inventory: {
        'Paracetamol 500mg': { available: true, stock: 150 },
        'Cetirizine 10mg': { available: true, stock: 80 },
        'Vitamin C tablets': { available: false, stock: 0 },
        'Propranolol 40mg': { available: true, stock: 45 },
        'Alprazolam 0.25mg': { available: true, stock: 25 },
        'Metformin 500mg': { available: true, stock: 120 },
        'Amlodipine 5mg': { available: true, stock: 90 },
        'Amoxicillin 500mg': { available: true, stock: 60 }
      }
    },
    {
      id: 'PH002',
      name: 'MediCare Central',
      location: { lat: 30.2845, lng: 76.1240, address: 'Civil Lines, Kotla' },
      contact: '+91-9876543211',
      rating: 4.6,
      deliveryTime: '45 mins',
      inventory: {
        'Paracetamol 500mg': { available: true, stock: 100 },
        'Vitamin C tablets': { available: true, stock: 75 },
        'Propranolol 40mg': { available: true, stock: 30 },
        'Alprazolam 0.25mg': { available: true, stock: 15 },
        'Insulin Glargine': { available: true, stock: 10 },
        'Glucose strips': { available: true, stock: 200 },
        'Omeprazole 20mg': { available: true, stock: 80 }
      }
    },
    {
      id: 'PH003',
      name: 'Apollo Pharmacy',
      location: { lat: 30.2460, lng: 76.0570, address: 'Main Road, Bhadson' },
      contact: '+91-9876543212',
      rating: 4.7,
      deliveryTime: '60 mins',
      inventory: {
        'Paracetamol 500mg': { available: true, stock: 200 },
        'Vitamin C tablets': { available: true, stock: 100 },
        'Metformin 500mg': { available: true, stock: 150 },
        'Amlodipine 5mg': { available: true, stock: 80 },
        'Cetirizine 10mg': { available: true, stock: 60 },
        'Atorvastatin 20mg': { available: true, stock: 40 },
        'Aspirin 75mg': { available: true, stock: 120 }
      }
    },
    {
      id: 'PH004',
      name: 'Life Pharmacy',
      location: { lat: 30.2700, lng: 76.0900, address: 'Hospital Road, Nabha' },
      contact: '+91-9876543213',
      rating: 4.4,
      deliveryTime: '40 mins',
      inventory: {
        'Vitamin C tablets': { available: true, stock: 50 },
        'Alprazolam 0.25mg': { available: true, stock: 20 },
        'Amlodipine 5mg': { available: true, stock: 70 },
        'Omeprazole 20mg': { available: true, stock: 45 },
        'Atorvastatin 20mg': { available: false, stock: 0 },
        'Aspirin 75mg': { available: true, stock: 90 }
      }
    }
  ];

  useEffect(() => {
    setIncomingPrescriptions(mockIncomingPrescriptions);
  }, []);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Smart allocation algorithm
  const allocateMedicines = (prescription) => {
    setLoading(true);
    
    const pharmaciesWithDistance = pharmacyDatabase.map(pharmacy => ({
      ...pharmacy,
      distance: Math.round(calculateDistance(
        prescription.patientLocation.lat,
        prescription.patientLocation.lng,
        pharmacy.location.lat,
        pharmacy.location.lng
      ) * 10) / 10
    })).sort((a, b) => a.distance - b.distance);

    let remainingMedicines = [...prescription.medicines];
    const allocations = [];

    for (const pharmacy of pharmaciesWithDistance) {
      const availableMedicines = remainingMedicines.filter(medicine => {
        const inventory = pharmacy.inventory[medicine.name];
        return inventory?.available && inventory.stock >= medicine.quantity;
      });

      if (availableMedicines.length > 0) {
        allocations.push({
          pharmacy,
          medicines: availableMedicines,
          isPrimary: allocations.length === 0
        });

        remainingMedicines = remainingMedicines.filter(medicine => 
          !availableMedicines.some(allocated => allocated.name === medicine.name)
        );
      }

      if (remainingMedicines.length === 0) break;
    }

    const unallocatedPharmacies = pharmaciesWithDistance
      .filter(pharmacy => !allocations.some(alloc => alloc.pharmacy.id === pharmacy.id))
      .slice(0, 3);

    unallocatedPharmacies.forEach(pharmacy => {
      allocations.push({
        pharmacy,
        medicines: [],
        isPrimary: false,
        isReference: true
      });
    });

    setTimeout(() => {
      setPharmacyAllocations({
        allocations,
        unfulfilledMedicines: remainingMedicines,
        totalAllocated: prescription.medicines.length - remainingMedicines.length
      });
      setLoading(false);
    }, 1000);
  };

  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription);
    allocateMedicines(prescription);
  };

  const sendAllocationToPharmacies = () => {
    const allocationsWithMedicines = pharmacyAllocations.allocations.filter(alloc => alloc.medicines.length > 0);
    
    if (allocationsWithMedicines.length === 0) {
      alert('No medicines can be fulfilled by available pharmacies.');
      return;
    }

    const updatedPrescriptions = incomingPrescriptions.map(p => 
      p.id === selectedPrescription.id 
        ? { ...p, status: 'sent_to_pharmacy', allocations: allocationsWithMedicines }
        : p
    );
    setIncomingPrescriptions(updatedPrescriptions);
    
    const notifications = allocationsWithMedicines.map(alloc => 
      `${alloc.pharmacy.name}: ${alloc.medicines.map(m => m.name).join(', ')}`
    ).join('\n');
    
    alert(`Prescription ${selectedPrescription.id} allocated to pharmacies:\n${notifications}`);
    
    setSelectedPrescription(null);
    setPharmacyAllocations([]);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      sent_to_pharmacy: 'bg-blue-50 text-blue-700 border border-blue-200',
      completed: 'bg-green-50 text-green-700 border border-green-200'
    };
    return styles[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getUrgencyBadge = (urgency) => {
    const styles = {
      high: 'bg-red-50 text-red-700 border border-red-200',
      medium: 'bg-orange-50 text-orange-700 border border-orange-200',
      low: 'bg-green-50 text-green-700 border border-green-200'
    };
    return styles[urgency] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Prescription Management</h1>
              <p className="text-gray-600 text-sm mt-1">Allocate prescriptions to nearest pharmacies</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin Dashboard</p>
                <p className="text-xs text-gray-500">Healthcare Coordinator</p>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
              <button className="p-2 text-gray-400 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-semibold text-gray-900">
                  {incomingPrescriptions.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Allocated</p>
                <p className="text-xl font-semibold text-gray-900">
                  {incomingPrescriptions.filter(p => p.status === 'sent_to_pharmacy').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-xl font-semibold text-gray-900">
                  {incomingPrescriptions.filter(p => p.urgency === 'high').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Today</p>
                <p className="text-xl font-semibold text-gray-900">{incomingPrescriptions.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prescriptions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Incoming Prescriptions</h2>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {incomingPrescriptions.map((prescription) => (
                  <div 
                    key={prescription.id} 
                    className={`p-5 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedPrescription?.id === prescription.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handlePrescriptionSelect(prescription)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{prescription.patientName}</h3>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getUrgencyBadge(prescription.urgency)}`}>
                            {prescription.urgency}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadge(prescription.status)}`}>
                            {prescription.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">ID: {prescription.id} • Dr. {prescription.doctorName} • {prescription.consultationTime}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{prescription.patientLocation.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Prescribed Medicines:</h4>
                      <div className="grid gap-2">
                        {prescription.medicines.map((medicine, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{medicine.name}</p>
                                <p className="text-xs text-gray-600">{medicine.dosage}</p>
                              </div>
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                Qty: {medicine.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {prescription.allocations && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Allocated to {prescription.allocations.length} pharmacy(ies)
                        </p>
                        <div className="mt-1 text-xs text-green-600">
                          {prescription.allocations.map((alloc, idx) => (
                            <span key={idx}>
                              {alloc.pharmacy.name}: {alloc.medicines.map(m => m.name).join(', ')}
                              {idx < prescription.allocations.length - 1 && ' | '}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pharmacy Allocation */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pharmacy Allocation</h2>
                {selectedPrescription && (
                  <p className="text-sm text-gray-600">{selectedPrescription.patientName} ({selectedPrescription.id})</p>
                )}
              </div>

              <div className="p-6">
                {!selectedPrescription ? (
                  <div className="text-center py-8">
                    <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Select a prescription to view allocations</p>
                  </div>
                ) : loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-6 w-6 text-blue-500 mx-auto animate-spin mb-3" />
                    <p className="text-sm text-gray-600">Finding optimal allocation...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary */}
                    {pharmacyAllocations.allocations && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">Allocation Summary</h3>
                        <p className="text-xs text-gray-700">
                          {pharmacyAllocations.totalAllocated} of {selectedPrescription.medicines.length} medicines allocated
                        </p>
                        {pharmacyAllocations.unfulfilledMedicines.length > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            Unable to fulfill: {pharmacyAllocations.unfulfilledMedicines.map(m => m.name).join(', ')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Allocations */}
                    {pharmacyAllocations.allocations?.map((allocation, index) => (
                      <div 
                        key={allocation.pharmacy.id} 
                        className={`border rounded-lg p-3 ${
                          allocation.medicines.length > 0
                            ? allocation.isPrimary 
                              ? 'border-green-300 bg-green-50'
                              : 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900">{allocation.pharmacy.name}</h4>
                              {allocation.isPrimary && allocation.medicines.length > 0 && (
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">PRIMARY</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{allocation.pharmacy.location.address}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>{allocation.pharmacy.distance} km</span>
                              <span>{allocation.pharmacy.rating} ★</span>
                              <span>{allocation.pharmacy.deliveryTime}</span>
                            </div>
                          </div>
                        </div>

                        {allocation.medicines.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-xs font-medium text-gray-700 mb-1">Allocated medicines:</h5>
                            <div className="space-y-1">
                              {allocation.medicines.map((medicine, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white rounded p-2 border">
                                  <span className="text-xs text-gray-900">{medicine.name}</span>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Qty: {medicine.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Send Button */}
                    {pharmacyAllocations.allocations?.some(alloc => alloc.medicines.length > 0) && (
                      <button 
                        onClick={sendAllocationToPharmacies}
                        className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send to Pharmacies
                      </button>
                    )}

                    {pharmacyAllocations.allocations?.length === 0 && (
                      <div className="text-center py-6 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-red-700">No compatible pharmacies found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagementDashboard;