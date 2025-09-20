import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { 
  Stethoscope, 
  User, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Shield,
  Users,
  Pill,
  Settings
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userType: 'patient',
    email: '',
    phone: '',
    password: '',
    name: '',
    aadhaar: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      id: 'patient',
      name: 'Patient',
      icon: <Users className="h-6 w-6" />,
      description: 'Access healthcare services'
    },
    {
      id: 'doctor',
      name: 'Doctor',
      icon: <Stethoscope className="h-6 w-6" />,
      description: 'Provide consultations'
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      icon: <Pill className="h-6 w-6" />,
      description: 'Manage prescriptions'
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: <Settings className="h-6 w-6" />,
      description: 'System management'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.phone || !formData.password) {
      alert('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        name: formData.name || 'User',
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        aadhaar: formData.aadhaar
      };

      login(userData, formData.userType);
      setIsLoading(false);
      
      // Navigate to appropriate dashboard
      navigate(`/${formData.userType}`);
    }, 1000);
  };

  const handleOTPLogin = () => {
    if (!formData.phone) {
      alert('Please enter your phone number first');
      return;
    }
    // Simulate OTP sending
    alert(`OTP sent to ${formData.phone}. In a real app, this would send an actual OTP.`);
  };

  const handleAadhaarLogin = () => {
    if (!formData.aadhaar) {
      alert('Please enter your Aadhaar number first');
      return;
    }
    // Simulate Aadhaar verification
    alert(`Aadhaar verification initiated for ${formData.aadhaar}. In a real app, this would verify with UIDAI.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Join our healthcare community'}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">I am a:</h3>
          <div className="grid grid-cols-2 gap-3">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setFormData(prev => ({ ...prev, userType: type.id }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  formData.userType === type.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`${formData.userType === type.id ? 'text-primary-600' : 'text-gray-500'}`}>
                    {type.icon}
                  </div>
                  <div className="text-sm font-medium">{type.name}</div>
                  <div className="text-xs text-gray-500 text-center">{type.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login/Register Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number (Optional)
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="aadhaar"
                      name="aadhaar"
                      type="text"
                      value={formData.aadhaar}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Enter 12-digit Aadhaar number"
                      maxLength="12"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={handleOTPLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <Phone className="h-4 w-4 mr-2" />
                OTP Login
              </button>
              <button 
                type="button"
                onClick={handleAadhaarLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Aadhaar
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need immediate help? 
            <Link to="/emergency" className="ml-1 font-medium text-red-600 hover:text-red-500">
              Contact Emergency Services
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
