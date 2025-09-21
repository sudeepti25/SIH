import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
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
  Settings,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Multi-step signup state
  const [signupStep, setSignupStep] = useState(1); // 1: Mobile, 2: OTP, 3: Details
  const [otpVerified, setOtpVerified] = useState(false);
  
  const [formData, setFormData] = useState({
    userType: 'patient',
    email: '',
    phone: '',
    password: '',
    name: '',
    aadhaar: '',
    // Signup specific fields
    mobile_number: '',
    otp: '',
    pin: '',
    dob: '',
    gender: '',
    age: ''
  });
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Step 1: Send OTP to mobile number
  const sendOTP = async () => {
    if (!formData.mobile_number || formData.mobile_number.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-otp', {
        mobile_number: formData.mobile_number
      });

      if (response.data.success) {
        setSignupStep(2);
        alert(`OTP sent to ${formData.mobile_number}`);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        mobile_number: formData.mobile_number,
        otp: formData.otp
      });

      if (response.data.success) {
        setOtpVerified(true);
        setSignupStep(3);
        alert('OTP verified successfully!');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete registration
  const completeRegistration = async () => {
    // Validation
    if (!formData.name || formData.name.trim().length < 2) {
      setError('Please enter a valid name (at least 2 characters)');
      return;
    }
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      setError('Please enter a valid age (1-120)');
      return;
    }
    if (!formData.gender) {
      setError('Please select gender');
      return;
    }
    if (!formData.dob) {
      setError('Please select date of birth');
      return;
    }
    if (!formData.pin || formData.pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        mobile_number: formData.mobile_number,
        pin: formData.pin,
        name: formData.name.trim(),
        dob: formData.dob,
        gender: formData.gender,
        aadhaar_id: "123456789012", // Hardcoded as requested
        device_id: "device_test_123" // Hardcoded as requested
      });

      if (response.data.success) {
        alert('Registration completed successfully!');
        
        // Auto login after successful registration
        const userData = {
          id: response.data.user?.id || Date.now(),
          name: formData.name,
          phone: formData.mobile_number,
          userType: formData.userType
        };

        login(userData, formData.userType);
        navigate(`/${formData.userType}`);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

        {/* Login/Signup Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Progress Steps for Signup */}
          {!isLogin && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${signupStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${signupStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    {signupStep > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                  </div>
                  <span className="ml-2 text-sm font-medium">Mobile</span>
                </div>
                <div className={`flex-1 h-px mx-2 ${signupStep > 1 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${signupStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${signupStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    {signupStep > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
                  </div>
                  <span className="ml-2 text-sm font-medium">OTP</span>
                </div>
                <div className={`flex-1 h-px mx-2 ${signupStep > 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                <div className={`flex items-center ${signupStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${signupStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium">Details</span>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your PIN"
                    maxLength="4"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Signup Forms */}
          {!isLogin && (
            <div className="space-y-6">
              {/* Step 1: Mobile Number */}
              {signupStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Enter Mobile Number</h3>
                  <div>
                    <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="mobile_number"
                        name="mobile_number"
                        type="tel"
                        required
                        value={formData.mobile_number}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={isLoading}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {signupStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Enter OTP</h3>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit OTP to {formData.mobile_number}
                  </p>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      OTP
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center text-lg tracking-widest"
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={isLoading}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify OTP
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={sendOTP}
                    className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Resend OTP
                  </button>
                </div>
              )}

              {/* Step 3: User Details */}
              {signupStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
                  
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
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Age"
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                      Create 4-digit PIN
                    </label>
                    <input
                      id="pin"
                      name="pin"
                      type="password"
                      required
                      value={formData.pin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter 4-digit PIN"
                      maxLength="4"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={completeRegistration}
                      disabled={isLoading}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Alternative Login Methods - Only show for login */}
          {isLogin && (
            <>
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
            </>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setSignupStep(1);
                setError('');
                setFormData(prev => ({
                  ...prev,
                  mobile_number: '',
                  otp: '',
                  pin: '',
                  name: '',
                  age: '',
                  gender: '',
                  dob: ''
                }));
              }}
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
