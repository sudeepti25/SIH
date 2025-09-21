import React, { useState, useEffect } from 'react';
import { 
  Package, 
  FileText, 
  Bell, 
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Timer,
  Shield,
  Activity,
  LogOut,
  Eye,
  AlertTriangle,
  Plus,
  Minus,
  Edit3,
  Save,
  X,
  UserCheck
} from 'lucide-react';

const GovernmentPharmacyDashboard = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingInventory, setEditingInventory] = useState(null);
  const [manualUpdateQty, setManualUpdateQty] = useState('');
  const [manualUpdateReason, setManualUpdateReason] = useState('');

  const pharmacyInfo = {
    name: "Government Pharmacy - Civil Hospital",
    id: "PH001",
    district: "Central District",
    address: "Civil Hospital Complex, Medical Road"
  };

  // Initial inventory state
  const [inventory, setInventory] = useState([
    { id: 1, name: "Paracetamol 500mg", totalStock: 150, reserved: 0, sold: 0 },
    { id: 2, name: "Amoxicillin 250mg", totalStock: 85, reserved: 0, sold: 0 },
    { id: 3, name: "Metformin 500mg", totalStock: 120, reserved: 0, sold: 0 },
    { id: 4, name: "Glimepiride 2mg", totalStock: 45, reserved: 0, sold: 0 },
    { id: 5, name: "Amlodipine 5mg", totalStock: 60, reserved: 0, sold: 0 },
    { id: 6, name: "Omeprazole 20mg", totalStock: 75, reserved: 0, sold: 0 },
    { id: 7, name: "Insulin Mixtard", totalStock: 25, reserved: 0, sold: 0 },
    { id: 8, name: "Glucometer Strips", totalStock: 200, reserved: 0, sold: 0 },
    { id: 9, name: "Crocin 650mg", totalStock: 100, reserved: 0, sold: 0 },
    { id: 10, name: "Azithromycin 250mg", totalStock: 50, reserved: 0, sold: 0 }
  ]);

  // Reserved prescriptions from admin system
  const [reservedPrescriptions, setReservedPrescriptions] = useState([
    {
      id: "RX2024001",
      patientName: "Ram Singh",
      patientPhone: "+91 98765 43210",
      doctorName: "Dr. Rajesh Kumar",
      reservationTime: "2024-01-15T10:30:00",
      expiryTime: "2024-01-15T15:30:00",
      estimatedArrival: "2024-01-15T14:00:00",
      status: "reserved",
      medicines: [
        { name: "Paracetamol 500mg", quantity: 10 },
        { name: "Amoxicillin 250mg", quantity: 21 }
      ],
      distance: "2.5 km",
      priority: "normal"
    },
    {
      id: "RX2024002",
      patientName: "Priya Devi",
      patientPhone: "+91 98765 43211",
      doctorName: "Dr. Priya Sharma",
      reservationTime: "2024-01-15T11:15:00",
      expiryTime: "2024-01-15T16:15:00",
      estimatedArrival: "2024-01-15T15:30:00",
      status: "reserved",
      medicines: [
        { name: "Metformin 500mg", quantity: 30 },
        { name: "Glimepiride 2mg", quantity: 15 }
      ],
      distance: "1.8 km",
      priority: "urgent"
    },
    {
      id: "RX2024003",
      patientName: "Amarjeet Kaur",
      patientPhone: "+91 98765 43212",
      doctorName: "Dr. Amit Singh",
      reservationTime: "2024-01-15T09:45:00",
      expiryTime: "2024-01-15T14:45:00",
      estimatedArrival: "2024-01-15T13:30:00",
      status: "reserved",
      medicines: [
        { name: "Amlodipine 5mg", quantity: 30 },
        { name: "Omeprazole 20mg", quantity: 14 }
      ],
      distance: "3.2 km",
      priority: "normal"
    },
    {
      id: "RX2024004",
      patientName: "Suresh Kumar",
      patientPhone: "+91 98765 43213",
      doctorName: "Dr. Meera Patel",
      reservationTime: "2024-01-15T12:00:00",
      expiryTime: "2024-01-15T17:00:00",
      estimatedArrival: "2024-01-15T16:00:00",
      status: "fulfilled",
      medicines: [
        { name: "Insulin Mixtard", quantity: 1 },
        { name: "Glucometer Strips", quantity: 50 }
      ],
      distance: "1.2 km",
      priority: "urgent",
      fulfilledAt: "2024-01-15T15:45:00"
    }
  ]);

  // Check if medicines are available in inventory
  const checkMedicineAvailability = (medicines) => {
    return medicines.map(medicine => {
      const inventoryItem = inventory.find(item => item.name === medicine.name);
      const availableStock = inventoryItem ? (inventoryItem.totalStock - inventoryItem.reserved - inventoryItem.sold) : 0;
      return {
        ...medicine,
        available: availableStock >= medicine.quantity,
        availableStock: availableStock
      };
    });
  };

  // Reserve stock when prescription is reserved
  const reserveStock = (medicines) => {
    setInventory(prev => 
      prev.map(item => {
        const medicine = medicines.find(med => med.name === item.name);
        if (medicine && (item.totalStock - item.reserved - item.sold) >= medicine.quantity) {
          return { ...item, reserved: item.reserved + medicine.quantity };
        }
        return item;
      })
    );
  };

  // Release reserved stock
  const releaseReservedStock = (medicines) => {
    setInventory(prev => 
      prev.map(item => {
        const medicine = medicines.find(med => med.name === item.name);
        if (medicine) {
          return { ...item, reserved: Math.max(0, item.reserved - medicine.quantity) };
        }
        return item;
      })
    );
  };

  // Move reserved stock to sold
  const moveReservedToSold = (medicines) => {
    setInventory(prev => 
      prev.map(item => {
        const medicine = medicines.find(med => med.name === item.name);
        if (medicine) {
          return { 
            ...item, 
            reserved: Math.max(0, item.reserved - medicine.quantity),
            sold: item.sold + medicine.quantity
          };
        }
        return item;
      })
    );
  };

  // Calculate time remaining for reservation
  const getTimeRemaining = (expiryTime) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Handle prescription fulfillment (when pharmacist prepares)
  const handleFulfillPrescription = (prescriptionId) => {
    const prescription = reservedPrescriptions.find(p => p.id === prescriptionId);
    const medicinesWithAvailability = checkMedicineAvailability(prescription.medicines);
    
    // Check if all medicines are available
    const allAvailable = medicinesWithAvailability.every(med => med.available);
    
    if (!allAvailable) {
      alert("Cannot fulfill prescription: Some medicines are not available in sufficient quantity");
      return;
    }

    // Reserve the stock
    reserveStock(prescription.medicines);

    setReservedPrescriptions(prev => 
      prev.map(p => 
        p.id === prescriptionId 
          ? { ...p, status: 'fulfilled', fulfilledAt: new Date().toISOString() }
          : p
      )
    );

    alert(`Prescription ${prescriptionId} fulfilled and medicines reserved!`);
  };

  // Handle prescription completion (when patient arrives and takes medicines)
  const handleCompletePrescription = (prescriptionId) => {
    const prescription = reservedPrescriptions.find(p => p.id === prescriptionId);
    
    // Move reserved stock to sold
    moveReservedToSold(prescription.medicines);

    setReservedPrescriptions(prev => 
      prev.map(p => 
        p.id === prescriptionId 
          ? { ...p, status: 'completed', completedAt: new Date().toISOString() }
          : p
      )
    );

    alert(`Prescription ${prescriptionId} completed successfully! Patient has received medicines.`);
  };

  // Handle prescription expiry
  const handleExpirePrescription = (prescriptionId) => {
    const prescription = reservedPrescriptions.find(p => p.id === prescriptionId);
    
    // Release reserved stock back to available
    releaseReservedStock(prescription.medicines);

    setReservedPrescriptions(prev => 
      prev.map(p => 
        p.id === prescriptionId 
          ? { ...p, status: 'expired', expiredAt: new Date().toISOString() }
          : p
      )
    );

    alert(`Prescription ${prescriptionId} marked as expired. Reserved stock has been released.`);
  };

  // Manual inventory update
  const handleManualInventoryUpdate = (itemId, quantityChange, reason) => {
    if (!quantityChange || quantityChange === 0) {
      alert("Please enter a valid quantity");
      return;
    }

    setInventory(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const newSoldQuantity = Math.max(0, item.sold + quantityChange);
          return { ...item, sold: newSoldQuantity };
        }
        return item;
      })
    );

    setEditingInventory(null);
    setManualUpdateQty('');
    setManualUpdateReason('');
    
    alert(`Inventory updated successfully. ${reason ? `Reason: ${reason}` : ''}`);
  };

  const ReservationManagement = () => {
    const filteredPrescriptions = reservedPrescriptions.filter(prescription =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Prescription Management</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => {
            const medicinesWithAvailability = checkMedicineAvailability(prescription.medicines);
            
            return (
              <div key={prescription.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {prescription.patientName}
                      </h4>
                      <p className="text-sm text-gray-600">ID: {prescription.id}</p>
                      <p className="text-sm text-gray-600">By {prescription.doctorName}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prescription.status === 'reserved'
                        ? prescription.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                        : prescription.status === 'fulfilled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : prescription.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prescription.status === 'reserved' 
                        ? `Reserved ${prescription.priority === 'urgent' ? '(URGENT)' : ''}`
                        : prescription.status === 'fulfilled'
                        ? 'Fulfilled (Ready for Pickup)'
                        : prescription.status === 'completed'
                        ? 'Completed'
                        : 'Expired'}
                    </span>
                    
                    {(prescription.status === 'reserved' || prescription.status === 'fulfilled') && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Timer className="h-4 w-4 mr-1" />
                        {getTimeRemaining(prescription.expiryTime)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {prescription.patientPhone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      Distance: {prescription.distance}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      ETA: {new Date(prescription.estimatedArrival).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Prescribed Medicines:</p>
                    {medicinesWithAvailability.map((medicine, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className={medicine.available ? 'text-gray-700' : 'text-red-600'}>
                          {medicine.name} × {medicine.quantity}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Available: {medicine.availableStock}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            medicine.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {medicine.available ? 'Available' : 'Insufficient Stock'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons based on status */}
                {prescription.status === 'reserved' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleFulfillPrescription(prescription.id)}
                      disabled={!medicinesWithAvailability.every(med => med.available)}
                      className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
                        medicinesWithAvailability.every(med => med.available)
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Fulfill Prescription
                    </button>
                    <button 
                      onClick={() => handleExpirePrescription(prescription.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Mark as Expired
                    </button>
                  </div>
                )}

                {prescription.status === 'fulfilled' && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleCompletePrescription(prescription.id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Mark as Completed (Patient Received)
                    </button>
                    <button 
                      onClick={() => handleExpirePrescription(prescription.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Mark as Expired
                    </button>
                  </div>
                )}

                {prescription.status === 'fulfilled' && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-yellow-600">
                      ✓ Fulfilled on {new Date(prescription.fulfilledAt).toLocaleString()}
                      <br />
                      <span className="text-xs">Medicines are ready for pickup. Waiting for patient arrival.</span>
                    </p>
                  </div>
                )}

                {prescription.status === 'completed' && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-green-600">
                      ✓ Completed on {new Date(prescription.completedAt).toLocaleString()}
                      <br />
                      <span className="text-xs">Patient has received all medicines.</span>
                    </p>
                  </div>
                )}

                {prescription.status === 'expired' && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      ⚠ Expired on {new Date(prescription.expiredAt || prescription.expiryTime).toLocaleString()}
                      <br />
                      <span className="text-xs">Reserved stock has been released back to available inventory.</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const InventoryView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Real-time Inventory Management</h3>
        <div className="text-sm text-gray-600">
          Live stock tracking with manual update capability
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const availableStock = item.totalStock - item.reserved - item.sold;
          const isEditing = editingInventory === item.id;
          
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  {!isEditing && (
                    <button
                      onClick={() => setEditingInventory(item.id)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Manual Update"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className={`font-medium ${
                    availableStock > 10 ? 'text-green-600' : availableStock > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {availableStock}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reserved:</span>
                  <span className="font-medium text-blue-600">{item.reserved}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sold:</span>
                  <span className="font-medium text-purple-600">{item.sold}</span>
                </div>
                
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-600">Total Stock:</span>
                  <span className="font-medium text-gray-900">{item.totalStock}</span>
                </div>
              </div>
              
              {/* Manual update section */}
              {isEditing && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium text-gray-700 mb-2">Manual Local Sale</p>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Quantity sold"
                      value={manualUpdateQty}
                      onChange={(e) => setManualUpdateQty(parseInt(e.target.value) || '')}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      value={manualUpdateReason}
                      onChange={(e) => setManualUpdateReason(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleManualInventoryUpdate(item.id, parseInt(manualUpdateQty) || 0, manualUpdateReason)}
                        className="flex-1 flex items-center justify-center px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Update
                      </button>
                      <button
                        onClick={() => {
                          setEditingInventory(null);
                          setManualUpdateQty('');
                          setManualUpdateReason('');
                        }}
                        className="px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Stock status indicators */}
              {availableStock === 0 && (
                <div className="mt-2 flex items-center text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Out of Stock
                </div>
              )}
              
              {availableStock > 0 && availableStock <= 10 && (
                <div className="mt-2 flex items-center text-xs text-yellow-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Low Stock
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const NotificationCenter = () => {
    const reservedCount = reservedPrescriptions.filter(p => p.status === 'reserved').length;
    const urgentCount = reservedPrescriptions.filter(p => p.status === 'reserved' && p.priority === 'urgent').length;
    const lowStockCount = inventory.filter(item => (item.totalStock - item.reserved - item.sold) <= 10 && (item.totalStock - item.reserved - item.sold) > 0).length;
    const outOfStockCount = inventory.filter(item => (item.totalStock - item.reserved - item.sold) === 0).length;
    
    const notifications = [
      {
        id: 1,
        type: "new_reservation",
        message: `${reservedCount} prescription(s) awaiting fulfillment`,
        time: "Live",
        priority: reservedCount > 0 ? "medium" : "low"
      },
      {
        id: 2,
        type: "urgent_prescription",
        message: `${urgentCount} urgent prescription(s) need immediate attention`,
        time: "Live",
        priority: urgentCount > 0 ? "high" : "low"
      },
      {
        id: 3,
        type: "stock_alert",
        message: `${outOfStockCount} medicine(s) are out of stock`,
        time: "Live",
        priority: outOfStockCount > 0 ? "high" : "low"
      },
      {
        id: 4,
        type: "low_stock",
        message: `${lowStockCount} medicine(s) are running low`,
        time: "Live",
        priority: lowStockCount > 0 ? "medium" : "low"
      }
    ].filter(notification => notification.priority !== "low");

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Live Notifications</h3>
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            {notifications.filter(n => n.priority === 'high').length} urgent
          </span>
        </div>

        <div className="space-y-3">
          {notifications.length > 0 ? notifications.map((notification) => (
            <div key={notification.id} className={`bg-white border-l-4 border-gray-200 p-4 shadow-sm ${
              notification.priority === 'high' 
                ? 'border-l-red-500 bg-red-50'
                : notification.priority === 'medium'
                ? 'border-l-yellow-500 bg-yellow-50'
                : 'border-l-green-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-900">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  notification.priority === 'high' 
                    ? 'bg-red-100'
                    : notification.priority === 'medium'
                    ? 'bg-yellow-100'
                    : 'bg-green-100'
                }`}>
                  {notification.type === 'new_reservation' && <FileText className="h-4 w-4 text-blue-600" />}
                  {notification.type === 'urgent_prescription' && <Clock className="h-4 w-4 text-red-600" />}
                  {notification.type === 'stock_alert' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {notification.type === 'low_stock' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">All systems running smoothly!</p>
              <p className="text-sm text-gray-500 mt-2">No urgent notifications at this time.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'reservations', label: 'Prescription Management', icon: <FileText className="h-4 w-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> }
  ];

  // Get counts for stats
  const reservedCount = reservedPrescriptions.filter(p => p.status === 'reserved').length;
  const urgentCount = reservedPrescriptions.filter(p => p.status === 'reserved' && p.priority === 'urgent').length;
  const fulfilledCount = reservedPrescriptions.filter(p => p.status === 'fulfilled').length;
  const completedToday = reservedPrescriptions.filter(p => p.status === 'completed').length;
  const outOfStockCount = inventory.filter(item => (item.totalStock - item.reserved - item.sold) === 0).length;

  // Auto-reserve stock for existing reserved prescriptions on component mount
  useEffect(() => {
    reservedPrescriptions.forEach(prescription => {
      if (prescription.status === 'reserved') {
        const medicinesWithAvailability = checkMedicineAvailability(prescription.medicines);
        if (medicinesWithAvailability.every(med => med.available)) {
          // This is just to show reserved stock, not actually reserve again
          // In real app, this would come from backend with already reserved stock
        }
      }
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pharmacyInfo.name}</h1>
                <p className="text-gray-600">ID: {pharmacyInfo.id} | {pharmacyInfo.district}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">{pharmacyInfo.address}</p>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Reservations</p>
              <p className="text-2xl font-bold text-blue-600">{reservedCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Cases</p>
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ready for Pickup</p>
              <p className="text-2xl font-bold text-yellow-600">{fulfilledCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-green-600">{completedToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-orange-600">{outOfStockCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'reservations' && (reservedCount + fulfilledCount) > 0 && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {reservedCount + fulfilledCount}
                  </span>
                )}
                {tab.id === 'notifications' && urgentCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {urgentCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reservations' && <ReservationManagement />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'notifications' && <NotificationCenter />}
        </div>
      </div>
    </div>
  );
};

export default GovernmentPharmacyDashboard;