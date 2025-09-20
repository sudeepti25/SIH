import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Stethoscope, 
  Video, 
  Pill, 
  FileText, 
  Users, 
  Shield,
  Smartphone,
  Globe,
  Heart,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: t('symptomChecker'),
      description: "AI-powered symptom analysis to help you understand your health concerns",
      color: "text-blue-600"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: t('videoConsultation'),
      description: "Connect with qualified doctors through secure video consultations",
      color: "text-green-600"
    },
    {
      icon: <Pill className="h-8 w-8" />,
      title: t('medicineAvailability'),
      description: "Check medicine availability at nearby pharmacies in real-time",
      color: "text-purple-600"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: t('healthRecords'),
      description: "Digital health records accessible anytime, anywhere",
      color: "text-orange-600"
    }
  ];

  const userTypes = [
    {
      title: "Patient",
      description: "Access healthcare services, book appointments, and manage your health",
      icon: <Users className="h-12 w-12 text-primary-600" />,
      link: "/patient",
      features: ["Symptom Checker", "Video Consultation", "Health Records", "Medicine Tracking"]
    },
    {
      title: "Doctor",
      description: "Manage patient consultations and provide remote healthcare",
      icon: <Stethoscope className="h-12 w-12 text-green-600" />,
      link: "/doctor",
      features: ["Patient Queue", "Video Calls", "Prescriptions", "Case History"]
    },
    {
      title: "Pharmacy",
      description: "Manage inventory and fulfill prescriptions for patients",
      icon: <Pill className="h-12 w-12 text-purple-600" />,
      link: "/pharmacy",
      features: ["Inventory Management", "Prescription Fulfillment", "Stock Updates", "Notifications"]
    },
    {
      title: "Admin",
      description: "Monitor system usage and manage healthcare resources",
      icon: <Shield className="h-12 w-12 text-red-600" />,
      link: "/admin",
      features: ["Analytics Dashboard", "User Management", "Reports", "System Settings"]
    }
  ];

  const stats = [
    { number: "10,000+", label: "Patients Served" },
    { number: "500+", label: "Doctors Available" },
    { number: "50+", label: "Villages Covered" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-healthcare-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('welcome')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Bringing quality healthcare to rural communities through technology. 
              Accessible, affordable, and reliable telemedicine services for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn-primary text-lg px-8 py-4">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link to="/patient" className="btn-secondary text-lg px-8 py-4">
                Try Symptom Checker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed for rural communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className={`${feature.color} mb-4 flex justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access tailored features based on your role in the healthcare ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userTypes.map((userType, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow group">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {userType.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {userType.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {userType.description}
                  </p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {userType.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={userType.link}
                  className="w-full btn-primary group-hover:bg-primary-700 transition-colors"
                >
                  Access Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 inline" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Why Choose Rural Telemedicine?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
                <p className="text-primary-100">
                  Available in Hindi, Punjabi, and English for better accessibility
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mobile-First Design</h3>
                <p className="text-primary-100">
                  Optimized for smartphones with offline capabilities
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Focused</h3>
                <p className="text-primary-100">
                  Designed specifically for rural healthcare needs
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
                Start Your Journey
              </Link>
              <Link to="/emergency" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
                Emergency Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "This app has been a lifesaver for our village. We can now consult with doctors 
                  without traveling long distances. The multilingual support makes it easy for everyone to use."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Village Resident</div>
                    <div className="text-sm text-gray-500">Nabha, Punjab</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
