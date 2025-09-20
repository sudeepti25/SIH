import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import NotificationSystem from '../components/NotificationSystem';
import { 
  Pill, 
  Package, 
  FileText, 
  Bell, 
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Phone,
  ArrowRight,
  Activity,
  LogOut
} from 'lucide-react';

const PharmacyDashboard = () => {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: '',
    dosage: '',
    quantity: '',
    price: '',
    expiryDate: '',
    supplier: ''
  });
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "Ram Singh",
      doctorName: "Dr. Rajesh Kumar",
      date: "2024-01-15",
      medicines: ["Paracetamol 500mg", "Amoxicillin 250mg"],
      status: "pending",
      totalAmount: 17.50,
      phone: "+91 98765 43210"
    },
    {
      id: 2,
      patientName: "Priya Devi",
      doctorName: "Dr. Priya Sharma",
      date: "2024-01-15",
      medicines: ["Metformin 500mg"],
      status: "completed",
      totalAmount: 8.50,
      phone: "+91 98765 43211"
    },
    {
      id: 3,
      patientName: "Amarjeet Kaur",
      doctorName: "Dr. Amit Singh",
      date: "2024-01-16",
      medicines: ["Amlodipine 5mg", "Omeprazole 20mg"],
      status: "pending",
      totalAmount: 30.00,
      phone: "+91 98765 43212"
    }
  ]);

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Pain Relief",
      stock: 150,
      minStock: 50,
      price: 2.50,
      expiryDate: "2025-12-31",
      status: "available",
      supplier: "ABC Pharma"
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      stock: 25,
      minStock: 30,
      price: 15.00,
      expiryDate: "2024-06-30",
      status: "low_stock",
      supplier: "XYZ Medical"
    },
    {
      id: 3,
      name: "Metformin 500mg",
      category: "Diabetes",
      stock: 0,
      minStock: 20,
      price: 8.50,
      expiryDate: "2025-03-15",
      status: "out_of_stock",
      supplier: "DEF Healthcare"
    },
    {
      id: 4,
      name: "Amlodipine 5mg",
      category: "Cardiology",
      stock: 45,
      minStock: 50,
      price: 12.00,
      expiryDate: "2025-08-20",
      status: "low_stock",
      supplier: "GHI Pharma"
    },
    {
      id: 5,
      name: "Omeprazole 20mg",
      category: "Gastro",
      stock: 80,
      minStock: 30,
      price: 18.00,
      expiryDate: "2026-01-10",
      status: "available",
      supplier: "JKL Medical"
    }
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem('pharmacyInventory');
    const savedOrders = localStorage.getItem('pharmacyOrders');
    const savedPrescriptions = localStorage.getItem('pharmacyPrescriptions');
    
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    if (savedPrescriptions) {
      setPrescriptions(JSON.parse(savedPrescriptions));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('pharmacyInventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('pharmacyOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pharmacyPrescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);


  // Function to add new medicine
  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.category || !newMedicine.stock || !newMedicine.price) {
      alert('Please fill in all required fields');
      return;
    }

    const medicine = {
      id: Date.now(),
      ...newMedicine,
      stock: parseInt(newMedicine.stock),
      price: parseFloat(newMedicine.price),
      minStock: 20,
      status: newMedicine.stock > 20 ? 'available' : 'low_stock'
    };

    setInventory(prev => [...prev, medicine]);
    setNewMedicine({
      name: '',
      category: '',
      dosage: '',
      stock: '',
      price: '',
      expiryDate: '',
      supplier: ''
    });
    setShowAddMedicine(false);
    alert('Medicine added successfully!');
  };

  // Function to update medicine stock
  const handleUpdateStock = (medicineId, newStock) => {
    setInventory(prev => 
      prev.map(medicine => 
        medicine.id === medicineId 
          ? { 
              ...medicine, 
              stock: newStock,
              status: newStock === 0 ? 'out_of_stock' : 
                     newStock <= medicine.minStock ? 'low_stock' : 'available'
            }
          : medicine
      )
    );
  };

  // Function to process prescription
  const handleProcessPrescription = (prescriptionId) => {
    setPrescriptions(prev => 
      prev.map(prescription => 
        prescription.id === prescriptionId 
          ? { ...prescription, status: 'processed' }
          : prescription
      )
    );
    alert('Prescription processed successfully!');
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "low_stock",
      message: "Amoxicillin 250mg is running low (25 units remaining)",
      time: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      type: "prescription",
      message: "New prescription received from Dr. Rajesh Kumar",
      time: "1 hour ago",
      priority: "medium"
    },
    {
      id: 3,
      type: "expiry",
      message: "Some medicines are expiring soon",
      time: "3 hours ago",
      priority: "low"
    }
  ]);

  const InventoryManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sterile-900">Inventory Management</h3>
        <button 
          onClick={() => setShowAddMedicine(true)}
          className="btn-medical"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sterile-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
      </div>

      <div className="space-y-4">
        {inventory
          .filter(medicine => 
            medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === '' || medicine.category === selectedCategory)
          )
          .map((medicine) => (
          <div key={medicine.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Pill className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                    <p className="text-sm text-gray-600">{medicine.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className="font-semibold text-gray-900">{medicine.stock} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Min. Stock</p>
                    <p className="font-semibold text-gray-900">{medicine.minStock} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold text-gray-900">₹{medicine.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expiry</p>
                    <p className="font-semibold text-gray-900">{medicine.expiryDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  medicine.status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : medicine.status === 'low_stock'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {medicine.status === 'available' ? 'Available' : 
                   medicine.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      const newStock = prompt(`Enter new stock for ${medicine.name}:`, medicine.stock);
                      if (newStock !== null && !isNaN(newStock)) {
                        handleUpdateStock(medicine.id, parseInt(newStock));
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600"
                    title="Update Stock"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${medicine.name}?`)) {
                        setInventory(prev => prev.filter(m => m.id !== medicine.id));
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Delete Medicine"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PrescriptionManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sterile-900">Prescription Management</h3>
        <div className="flex space-x-2">
          <select className="input-field w-32">
            <option>All Status</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
          <button className="btn-medical">
            <FileText className="h-4 w-4 mr-2" />
            New Prescription
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <div key={prescription.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{prescription.patientName}</h4>
                    <p className="text-sm text-gray-600">Prescribed by {prescription.doctorName}</p>
                  </div>
                </div>
                
                <div className="ml-13">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {prescription.date}
                    </span>
                    <span className="font-medium text-gray-900">
                      Total: ₹{prescription.totalAmount}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Medicines:</p>
                    <div className="flex flex-wrap gap-2">
                      {prescription.medicines.map((medicine, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {medicine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  prescription.status === 'completed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {prescription.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
                {prescription.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleProcessPrescription(prescription.id)}
                      className="btn-primary text-sm py-1 px-3"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Fulfill
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to reject this prescription for ${prescription.patientName}?`)) {
                          setPrescriptions(prev => 
                            prev.map(p => 
                              p.id === prescription.id 
                                ? { ...p, status: 'rejected' }
                                : p
                            )
                          );
                        }
                      }}
                      className="btn-secondary text-sm py-1 px-3"
                    >
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Notifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-sterile-900">Notifications</h3>
        <button 
          onClick={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            alert('All notifications marked as read!');
          }}
          className="btn-secondary"
        >
          Mark All Read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="card">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.priority === 'high' 
                  ? 'bg-healthcare-100 text-healthcare-600'
                  : notification.priority === 'medium'
                  ? 'bg-emergency-100 text-emergency-600'
                  : 'bg-primary-100 text-primary-600'
              }`}>
                {notification.type === 'low_stock' && <AlertCircle className="h-4 w-4" />}
                {notification.type === 'prescription' && <FileText className="h-4 w-4" />}
                {notification.type === 'expiry' && <Clock className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sterile-900">{notification.message}</p>
                <p className="text-sm text-sterile-500 mt-1">{notification.time}</p>
              </div>
              <button className="text-sterile-400 hover:text-sterile-600">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileText className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-sterile-900 mb-2">Pharmacy Dashboard</h1>
            <p className="text-sterile-600">Welcome back, {user?.name || 'Pharmacist'}! Manage inventory and fulfill prescriptions</p>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <NotificationSystem userType="pharmacy" />
            <button 
              onClick={logout}
              className="p-2 text-sterile-400 hover:text-healthcare-600"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-sterile-600">Total Medicines</p>
              <p className="text-2xl font-bold text-sterile-900">{inventory.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-medical-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-medical-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-sterile-600">Available</p>
              <p className="text-2xl font-bold text-sterile-900">
                {inventory.filter(m => m.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-emergency-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-emergency-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-sterile-600">Low Stock</p>
              <p className="text-2xl font-bold text-sterile-900">
                {inventory.filter(m => m.status === 'low_stock').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-healthcare-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-healthcare-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-sterile-600">Pending Orders</p>
              <p className="text-2xl font-bold text-sterile-900">
                {prescriptions.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-sterile-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-sterile-500 hover:text-sterile-700 hover:border-sterile-300'
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
        {activeTab === 'inventory' && <InventoryManagement />}
        {activeTab === 'prescriptions' && <PrescriptionManagement />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'analytics' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-sterile-900 mb-4">Analytics</h3>
            <p className="text-sterile-600">Analytics dashboard coming soon...</p>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showAddMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Medicine</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter medicine name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newMedicine.category}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, category: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select category</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Gastro">Gastro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, dosage: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., 500mg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={newMedicine.stock}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, stock: e.target.value }))}
                  className="input-field"
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, price: e.target.value }))}
                  className="input-field"
                  placeholder="Enter price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newMedicine.expiryDate}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  value={newMedicine.supplier}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, supplier: e.target.value }))}
                  className="input-field"
                  placeholder="Enter supplier name"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddMedicine(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMedicine}
                className="flex-1 btn-primary"
              >
                Add Medicine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
