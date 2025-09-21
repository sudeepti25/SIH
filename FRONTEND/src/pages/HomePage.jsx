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
      description: t('symptomCheckerDesc'),
      color: "text-blue-600"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: t('videoConsultation'),
      description: t('videoConsultationDesc'),
      color: "text-green-600"
    },
    {
      icon: <Pill className="h-8 w-8" />,
      title: t('medicineAvailability'),
      description: t('medicineAvailabilityDesc'),
      color: "text-purple-600"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: t('healthRecords'),
      description: t('healthRecordsDesc'),
      color: "text-orange-600"
    }
  ];

  const userTypes = [
    {
      title: t('patient'),
      description: t('patientDesc'),
      icon: <Users className="h-12 w-12 text-primary-600" />,
      link: "/patient",
      features: [t('symptomChecker'), t('videoConsultation'), t('healthRecords'), "Medicine Tracking"]
    },
    {
      title: t('doctor'),
      description: t('doctorDesc'),
      icon: <Stethoscope className="h-12 w-12 text-green-600" />,
      link: "/doctor",
      features: [t('patientQueue'), "Video Calls", t('prescriptions'), "Case History"]
    },
    {
      title: t('pharmacy'),
      description: t('pharmacyDesc'),
      icon: <Pill className="h-12 w-12 text-purple-600" />,
      link: "/pharmacy",
      features: ["Inventory Management", "Prescription Fulfillment", "Stock Updates", t('notifications')]
    },
    {
      title: t('admin'),
      description: t('adminDesc'),
      icon: <Shield className="h-12 w-12 text-red-600" />,
      link: "/admin",
      features: [t('analytics') + " Dashboard", "User Management", t('reports'), t('systemSettings')]
    }
  ];

  const stats = [
    { number: "10,000+", label: t('patientsServed') },
    { number: "500+", label: t('doctorsAvailable') },
    { number: "50+", label: t('villagesCovered') },
    { number: "99%", label: t('satisfactionRate') }
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
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn-primary text-lg px-8 py-4">
                {t('getStarted')}
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link to="/patient" className="btn-secondary text-lg px-8 py-4">
                {t('trySymptomChecker')}
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
              {t('keyFeatures')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('keyFeaturesDesc')}
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
              {t('chooseYourRole')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('chooseYourRoleDesc')}
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
                  {t('accessDashboard')}
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
              {t('whyChooseUs')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('multilingualSupportTitle')}</h3>
                <p className="text-primary-100">
                  {t('multilingualSupportDesc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('mobileFirstTitle')}</h3>
                <p className="text-primary-100">
                  {t('mobileFirstDesc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('communityFocusedTitle')}</h3>
                <p className="text-primary-100">
                  {t('communityFocusedDesc')}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
                {t('startYourJourney')}
              </Link>
              <Link to="/emergency" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
                {t('emergencyHelp')}
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
              {t('whatUsersSay')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('realStories')}
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
                  "{t('testimonialText')}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t('villageResident')}</div>
                    <div className="text-sm text-gray-500">{t('location')}</div>
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
