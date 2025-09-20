import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import NotificationSystem from '../components/NotificationSystem';
import { 
  BarChart3, 
  Users, 
  Activity, 
  MapPin, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Pill,
  FileText,
  Globe,
  Phone,
  Heart,
  LogOut
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  const systemStats = {
    totalUsers: 1250,
    activeUsers: 890,
    consultationsToday: 45,
    prescriptionsIssued: 32,
    villagesCovered: 15,
    satisfactionRate: 94.5,
    totalRevenue: 45600,
    newRegistrations: 23,
    emergencyCalls: 3,
    systemAlerts: 1
  };

  const diseaseTrends = [
    { name: 'Common Cold', cases: 45, trend: 'up', percentage: 12 },
    { name: 'Fever', cases: 38, trend: 'down', percentage: -8 },
    { name: 'Chest Pain', cases: 25, trend: 'up', percentage: 15 },
    { name: 'Stomach Ache', cases: 22, trend: 'stable', percentage: 0 },
    { name: 'Headache', cases: 18, trend: 'up', percentage: 5 }
  ];

  const villageData = [
    { name: 'Nabha', consultations: 120, population: 15000, satisfaction: 96 },
    { name: 'Kotla', consultations: 85, population: 12000, satisfaction: 92 },
    { name: 'Bhadson', consultations: 65, population: 8000, satisfaction: 94 },
    { name: 'Dudhansadhan', consultations: 45, population: 6000, satisfaction: 89 },
    { name: 'Rampur', consultations: 35, population: 5000, satisfaction: 91 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'consultation',
      description: 'New consultation completed in Nabha',
      time: '2 minutes ago',
      icon: <Stethoscope className="h-4 w-4" />
    },
    {
      id: 2,
      type: 'prescription',
      description: 'Prescription issued for Ram Singh',
      time: '5 minutes ago',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 3,
      type: 'user',
      description: 'New patient registered from Kotla',
      time: '10 minutes ago',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 4,
      type: 'medicine',
      description: 'Medicine stock updated in Bhadson',
      time: '15 minutes ago',
      icon: <Pill className="h-4 w-4" />
    }
  ];

  const Overview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.activeUsers.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultations Today</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.consultationsToday}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+15% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Disease Trends */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Trends</h3>
        <div className="space-y-4">
          {diseaseTrends.map((disease, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{disease.name}</p>
                  <p className="text-sm text-gray-600">{disease.cases} cases this week</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  disease.trend === 'up' 
                    ? 'bg-red-100 text-red-800'
                    : disease.trend === 'down'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {disease.trend === 'up' ? '↗' : disease.trend === 'down' ? '↘' : '→'} {Math.abs(disease.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const VillageAnalytics = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Village-wise Analytics</h3>
        <div className="space-y-4">
          {villageData.map((village, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{village.name}</h4>
                  <p className="text-sm text-gray-600">Population: {village.population.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">{village.consultations}</p>
                  <p className="text-sm text-gray-600">Consultations</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${village.satisfaction}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{village.satisfaction}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consultation Rate</p>
                  <p className="text-sm font-medium text-gray-900">
                    {(village.consultations / village.population * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SystemHealth = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-green-600">120ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database Status</span>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Video Quality</span>
              <span className="text-sm font-medium text-green-600">HD</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">CPU Usage</span>
                <span className="text-sm font-medium text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Memory Usage</span>
                <span className="text-sm font-medium text-gray-900">62%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-medium text-gray-900">38%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">High consultation volume in Nabha</p>
              <p className="text-xs text-yellow-600">Consider adding more doctors</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">System backup completed successfully</p>
              <p className="text-xs text-green-600">All data is secure</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Scheduled maintenance in 2 hours</p>
              <p className="text-xs text-blue-600">System will be down for 30 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'villages', label: 'Village Analytics', icon: <MapPin className="h-4 w-4" /> },
    { id: 'system', label: 'System Health', icon: <Activity className="h-4 w-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}! Monitor system performance and healthcare analytics</p>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <NotificationSystem userType="admin" />
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Consultations Today</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.consultationsToday}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Villages Covered</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.villagesCovered}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.satisfactionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'villages' && <VillageAnalytics />}
        {activeTab === 'system' && <SystemHealth />}
        {activeTab === 'reports' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reports</h3>
            <p className="text-gray-600">Reports dashboard coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
