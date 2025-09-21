import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      welcome: "Welcome to Sahayata",
      whyChooseUs: "Why Choose Sahayata?",
      appName: "Sahayata",
      appTagline: "Healthcare for Everyone",
      appDescription: "Bringing quality healthcare to rural communities through technology. Accessible, affordable, and reliable telemedicine services for everyone.",
      securePrivate: "Secure & Private",
      multilingualSupport: "Multilingual Support",
      madeWithCare: "Made with care for rural communities",
      allRightsReserved: "All rights reserved",
      language: "Language",
      login: "Login",
      register: "Register",
      logout: "Logout",
      home: "Home",
      profile: "Profile",
      settings: "Settings",
      back: "Back",
      next: "Next",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      search: "Search",
      loading: "Loading...",
      
      // Patient specific
      symptomChecker: "Symptom Checker",
      bookAppointment: "Book Appointment",
      myAppointments: "My Appointments",
      videoConsultation: "Video Consultation",
      prescriptions: "Prescriptions",
      medicineAvailability: "Medicine Availability",
      healthRecords: "Health Records",
      emergency: "Emergency",
      
      // Doctor specific
      dashboard: "Dashboard",
      patientQueue: "Patient Queue",
      consultations: "Consultations",
      doctorPrescriptions: "Prescriptions",
      patientHistory: "Patient History",
      
      // Pharmacy specific
      inventory: "Inventory",
      stockUpdate: "Update Stock",
      pharmacyPrescriptions: "Prescriptions",
      notifications: "Notifications",
      
      // Admin specific
      analytics: "Analytics",
      reports: "Reports",
      userManagement: "User Management",
      systemSettings: "System Settings",
      
      // Common UI elements
      selectLanguage: "Select Language",
      english: "English",
      hindi: "हिंदी",
      punjabi: "ਪੰਜਾਬੀ",
      
      // HomePage content
      heroDescription: "Bringing quality healthcare to rural communities through technology. Accessible, affordable, and reliable telemedicine services for everyone.",
      getStarted: "Get Started",
      trySymptomChecker: "Try Symptom Checker",
      
      // Features
      symptomCheckerDesc: "AI-powered symptom analysis to help you understand your health concerns",
      videoConsultationDesc: "Connect with qualified doctors through secure video consultations",
      medicineAvailabilityDesc: "Check medicine availability at nearby pharmacies in real-time",
      healthRecordsDesc: "Digital health records accessible anytime, anywhere",
      
      // Stats
      patientsServed: "Patients Served",
      doctorsAvailable: "Doctors Available",
      villagesCovered: "Villages Covered",
      satisfactionRate: "Satisfaction Rate",
      
      // Sections
      keyFeatures: "Key Features",
      keyFeaturesDesc: "Comprehensive healthcare solutions designed for rural communities",
      chooseYourRole: "Choose Your Role",
      chooseYourRoleDesc: "Access tailored features based on your role in the healthcare ecosystem",
      
      // User Types
      patient: "Patient",
      patientDesc: "Access healthcare services, book appointments, and manage your health",
      doctor: "Doctor",
      doctorDesc: "Manage patient consultations and provide remote healthcare",
      pharmacy: "Pharmacy",
      pharmacyDesc: "Manage inventory and fulfill prescriptions for patients",
      admin: "Admin",
      adminDesc: "Monitor system usage and manage healthcare resources",
      
      // User Type Features
      patientFeatures: ["Symptom Checker", "Video Consultation", "Health Records", "Medicine Tracking"],
      doctorFeatures: ["Patient Queue", "Video Calls", "Prescriptions", "Case History"],
      pharmacyFeatures: ["Inventory Management", "Prescription Fulfillment", "Stock Updates", "Notifications"],
      adminFeatures: ["Analytics Dashboard", "User Management", "Reports", "System Settings"],
      
      accessDashboard: "Access Dashboard",
      
      // Why Choose Us section
      multilingualSupportTitle: "Multilingual Support",
      multilingualSupportDesc: "Available in Hindi, Punjabi, and English for better accessibility",
      mobileFirstTitle: "Mobile-First Design",
      mobileFirstDesc: "Optimized for smartphones with offline capabilities",
      communityFocusedTitle: "Community Focused",
      communityFocusedDesc: "Designed specifically for rural healthcare needs",
      
      startYourJourney: "Start Your Journey",
      emergencyHelp: "Emergency Help",
      
      // Testimonials
      whatUsersSay: "What Our Users Say",
      realStories: "Real stories from our community",
      testimonialText: "This app has been a lifesaver for our village. We can now consult with doctors without traveling long distances. The multilingual support makes it easy for everyone to use.",
      villageResident: "Village Resident",
      location: "Nabha, Punjab",
    }
  },
  hi: {
    translation: {
      // Common
      welcome: "सहायता में आपका स्वागत है",
      whyChooseUs: "सहायता क्यों चुनें?",
      appName: "सहायता",
      appTagline: "सभी के लिए स्वास्थ्य सेवा",
      appDescription: "प्रौद्योगिकी के माध्यम से ग्रामीण समुदायों तक गुणवत्तापूर्ण स्वास्थ्य सेवा पहुंचाना। सभी के लिए सुलभ, किफायती और विश्वसनीय टेलीमेडिसिन सेवाएं।",
      securePrivate: "सुरक्षित और निजी",
      multilingualSupport: "बहुभाषी समर्थन",
      madeWithCare: "ग्रामीण समुदायों के लिए देखभाल के साथ बनाया गया",
      allRightsReserved: "सभी अधिकार सुरक्षित",
      language: "भाषा",
      login: "लॉगिन",
      register: "रजिस्टर",
      logout: "लॉगआउट",
      home: "होम",
      profile: "प्रोफाइल",
      settings: "सेटिंग्स",
      back: "वापस",
      next: "अगला",
      submit: "सबमिट",
      cancel: "रद्द करें",
      save: "सेव",
      edit: "एडिट",
      delete: "डिलीट",
      search: "खोजें",
      loading: "लोड हो रहा है...",
      
      // Patient specific
      symptomChecker: "लक्षण जांचकर्ता",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      myAppointments: "मेरे अपॉइंटमेंट",
      videoConsultation: "वीडियो परामर्श",
      prescriptions: "पर्चे",
      medicineAvailability: "दवा की उपलब्धता",
      healthRecords: "स्वास्थ्य रिकॉर्ड",
      emergency: "आपातकाल",
      
      // Doctor specific
      dashboard: "डैशबोर्ड",
      patientQueue: "रोगी कतार",
      consultations: "परामर्श",
      doctorPrescriptions: "पर्चे",
      patientHistory: "रोगी इतिहास",
      
      // Pharmacy specific
      inventory: "इन्वेंटरी",
      stockUpdate: "स्टॉक अपडेट",
      pharmacyPrescriptions: "पर्चे",
      notifications: "सूचनाएं",
      
      // Admin specific
      analytics: "विश्लेषण",
      reports: "रिपोर्ट्स",
      userManagement: "उपयोगकर्ता प्रबंधन",
      systemSettings: "सिस्टम सेटिंग्स",
      
      // Common UI elements
      selectLanguage: "भाषा चुनें",
      english: "English",
      hindi: "हिंदी",
      punjabi: "ਪੰਜਾਬੀ",
      
      // HomePage content
      heroDescription: "प्रौद्योगिकी के माध्यम से ग्रामीण समुदायों तक गुणवत्तापूर्ण स्वास्थ्य सेवा पहुंचाना। सभी के लिए सुलभ, किफायती और विश्वसनीय टेलीमेडिसिन सेवाएं।",
      getStarted: "शुरू करें",
      trySymptomChecker: "लक्षण जांचकर्ता आज़माएं",
      
      // Features
      symptomCheckerDesc: "आपकी स्वास्थ्य चिंताओं को समझने में मदद के लिए AI-संचालित लक्षण विश्लेषण",
      videoConsultationDesc: "सुरक्षित वीडियो परामर्श के माध्यम से योग्य डॉक्टरों से जुड़ें",
      medicineAvailabilityDesc: "आस-पास की फार्मेसियों में दवाओं की उपलब्धता वास्तविक समय में जांचें",
      healthRecordsDesc: "डिजिटल स्वास्थ्य रिकॉर्ड कभी भी, कहीं भी सुलभ",
      
      // Stats
      patientsServed: "रोगियों की सेवा की गई",
      doctorsAvailable: "उपलब्ध डॉक्टर",
      villagesCovered: "कवर किए गए गांव",
      satisfactionRate: "संतुष्टि दर",
      
      // Sections
      keyFeatures: "मुख्य विशेषताएं",
      keyFeaturesDesc: "ग्रामीण समुदायों के लिए डिज़ाइन किए गए व्यापक स्वास्थ्य समाधान",
      chooseYourRole: "अपनी भूमिका चुनें",
      chooseYourRoleDesc: "स्वास्थ्य पारिस्थितिकी तंत्र में अपनी भूमिका के आधार पर अनुकूलित सुविधाओं तक पहुंच",
      
      // User Types
      patient: "रोगी",
      patientDesc: "स्वास्थ्य सेवाओं तक पहुंच, अपॉइंटमेंट बुक करें और अपने स्वास्थ्य का प्रबंधन करें",
      doctor: "डॉक्टर",
      doctorDesc: "रोगी परामर्श का प्रबंधन करें और दूरस्थ स्वास्थ्य सेवा प्रदान करें",
      pharmacy: "फार्मेसी",
      pharmacyDesc: "इन्वेंटरी प्रबंधन और रोगियों के लिए नुस्खे पूरे करें",
      admin: "प्रशासक",
      adminDesc: "सिस्टम उपयोग की निगरानी करें और स्वास्थ्य संसाधनों का प्रबंधन करें",
      
      accessDashboard: "डैशबोर्ड तक पहुंच",
      
      // Why Choose Us section
      multilingualSupportTitle: "बहुभाषी समर्थन",
      multilingualSupportDesc: "बेहतर सुलभता के लिए हिंदी, पंजाबी और अंग्रेजी में उपलब्ध",
      mobileFirstTitle: "मोबाइल-फर्स्ट डिज़ाइन",
      mobileFirstDesc: "ऑफ़लाइन क्षमताओं के साथ स्मार्टफ़ोन के लिए अनुकूलित",
      communityFocusedTitle: "समुदाय केंद्रित",
      communityFocusedDesc: "विशेष रूप से ग्रामीण स्वास्थ्य आवश्यकताओं के लिए डिज़ाइन किया गया",
      
      startYourJourney: "अपनी यात्रा शुरू करें",
      emergencyHelp: "आपातकालीन सहायता",
      
      // Testimonials
      whatUsersSay: "हमारे उपयोगकर्ता क्या कहते हैं",
      realStories: "हमारे समुदाय की वास्तविक कहानियां",
      testimonialText: "यह ऐप हमारे गांव के लिए जीवनदाता रहा है। अब हम लंबी दूरी की यात्रा किए बिना डॉक्टरों से सलाह ले सकते हैं। बहुभाषी समर्थन इसे सभी के लिए उपयोग करना आसान बनाता है।",
      villageResident: "गांव निवासी",
      location: "नाभा, पंजाब",
    }
  },
  pa: {
    translation: {
      // Common
      welcome: "ਸਹਾਇਤਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
      whyChooseUs: "ਸਹਾਇਤਾ ਕਿਉਂ ਚੁਣੋ?",
      appName: "ਸਹਾਇਤਾ",
      appTagline: "ਸਭ ਲਈ ਸਿਹਤ ਸੇਵਾ",
      appDescription: "ਤਕਨਾਲੋਜੀ ਰਾਹੀਂ ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਤੱਕ ਗੁਣਵੱਤਾ ਭਰਪੂਰ ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚਾਉਣਾ। ਸਭ ਲਈ ਪਹੁੰਚਯੋਗ, ਕਿਫਾਇਤੀ ਅਤੇ ਭਰੋਸੇਮੰਦ ਟੈਲੀਮੈਡੀਸਨ ਸੇਵਾਵਾਂ।",
      securePrivate: "ਸੁਰੱਖਿਤ ਅਤੇ ਨਿੱਜੀ",
      multilingualSupport: "ਬਹੁਭਾਸ਼ੀ ਸਹਾਇਤਾ",
      madeWithCare: "ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਲਈ ਦੇਖਭਾਲ ਨਾਲ ਬਣਾਇਆ ਗਿਆ",
      allRightsReserved: "ਸਾਰੇ ਅਧਿਕਾਰ ਸੁਰੱਖਿਤ",
      language: "ਭਾਸ਼ਾ",
      login: "ਲੌਗਇਨ",
      register: "ਰਜਿਸਟਰ",
      logout: "ਲੌਗਆਉਟ",
      home: "ਹੋਮ",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      settings: "ਸੈਟਿੰਗਸ",
      back: "ਵਾਪਸ",
      next: "ਅਗਲਾ",
      submit: "ਸਬਮਿਟ",
      cancel: "ਰੱਦ ਕਰੋ",
      save: "ਸੇਵ",
      edit: "ਸੰਪਾਦਨ",
      delete: "ਮਿਟਾਓ",
      search: "ਖੋਜ",
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      
      // Patient specific
      symptomChecker: "ਲੱਛਣ ਜਾਂਚਕ",
      bookAppointment: "ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ",
      myAppointments: "ਮੇਰੇ ਅਪਾਇੰਟਮੈਂਟ",
      videoConsultation: "ਵੀਡੀਓ ਸਲਾਹ",
      prescriptions: "ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ",
      medicineAvailability: "ਦਵਾਈ ਦੀ ਉਪਲਬਧਤਾ",
      healthRecords: "ਸਿਹਤ ਰਿਕਾਰਡ",
      emergency: "ਐਮਰਜੈਂਸੀ",
      
      // Doctor specific
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      patientQueue: "ਮਰੀਜ਼ ਕਤਾਰ",
      consultations: "ਸਲਾਹ",
      doctorPrescriptions: "ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ",
      patientHistory: "ਮਰੀਜ਼ ਇਤਿਹਾਸ",
      
      // Pharmacy specific
      inventory: "ਇਨਵੈਂਟਰੀ",
      stockUpdate: "ਸਟਾਕ ਅਪਡੇਟ",
      pharmacyPrescriptions: "ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ",
      notifications: "ਸੂਚਨਾਵਾਂ",
      
      // Admin specific
      analytics: "ਵਿਸ਼ਲੇਸ਼ਣ",
      reports: "ਰਿਪੋਰਟਾਂ",
      userManagement: "ਯੂਜ਼ਰ ਪ੍ਰਬੰਧਨ",
      systemSettings: "ਸਿਸਟਮ ਸੈਟਿੰਗਸ",
      
      // Common UI elements
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
      english: "English",
      hindi: "हिंदी",
      punjabi: "ਪੰਜਾਬੀ",
      
      // HomePage content
      heroDescription: "ਤਕਨਾਲੋਜੀ ਰਾਹੀਂ ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਤੱਕ ਗੁਣਵੱਤਾ ਭਰਪੂਰ ਸਿਹਤ ਸੇਵਾ ਪਹੁੰਚਾਉਣਾ। ਸਭ ਲਈ ਪਹੁੰਚਯੋਗ, ਕਿਫਾਇਤੀ ਅਤੇ ਭਰੋਸੇਮੰਦ ਟੈਲੀਮੈਡੀਸਨ ਸੇਵਾਵਾਂ।",
      getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
      trySymptomChecker: "ਲੱਛਣ ਜਾਂਚਕ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
      
      // Features
      symptomCheckerDesc: "ਤੁਹਾਡੀਆਂ ਸਿਹਤ ਚਿੰਤਾਵਾਂ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਲਈ AI-ਸੰਚਾਲਿਤ ਲੱਛਣ ਵਿਸ਼ਲੇਸ਼ਣ",
      videoConsultationDesc: "ਸੁਰੱਖਿਤ ਵੀਡੀਓ ਸਲਾਹ ਰਾਹੀਂ ਯੋਗ ਡਾਕਟਰਾਂ ਨਾਲ ਜੁੜੋ",
      medicineAvailabilityDesc: "ਨੇੜਲੇ ਫਾਰਮੇਸੀਆਂ ਵਿੱਚ ਦਵਾਈਆਂ ਦੀ ਉਪਲਬਧਤਾ ਅਸਲ ਸਮੇਂ ਵਿੱਚ ਜਾਂਚੋ",
      healthRecordsDesc: "ਡਿਜੀਟਲ ਸਿਹਤ ਰਿਕਾਰਡ ਕਿਸੇ ਵੀ ਸਮੇਂ, ਕਿਤੇ ਵੀ ਪਹੁੰਚਯੋਗ",
      
      // Stats
      patientsServed: "ਮਰੀਜ਼ਾਂ ਦੀ ਸੇਵਾ ਕੀਤੀ ਗਈ",
      doctorsAvailable: "ਉਪਲਬਧ ਡਾਕਟਰ",
      villagesCovered: "ਕਵਰ ਕੀਤੇ ਪਿੰਡ",
      satisfactionRate: "ਸੰਤੁਸ਼ਟੀ ਦਰ",
      
      // Sections
      keyFeatures: "ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      keyFeaturesDesc: "ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਲਈ ਡਿਜ਼ਾਇਨ ਕੀਤੇ ਵਿਆਪਕ ਸਿਹਤ ਹੱਲ",
      chooseYourRole: "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ",
      chooseYourRoleDesc: "ਸਿਹਤ ਵਾਤਾਵਰਣ ਵਿੱਚ ਆਪਣੀ ਭੂਮਿਕਾ ਦੇ ਆਧਾਰ ਤੇ ਅਨੁਕੂਲ ਸੁਵਿਧਾਵਾਂ ਤੱਕ ਪਹੁੰਚ",
      
      // User Types
      patient: "ਮਰੀਜ਼",
      patientDesc: "ਸਿਹਤ ਸੇਵਾਵਾਂ ਤੱਕ ਪਹੁੰਚ, ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਕ ਕਰੋ ਅਤੇ ਆਪਣੀ ਸਿਹਤ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ",
      doctor: "ਡਾਕਟਰ",
      doctorDesc: "ਮਰੀਜ਼ ਸਲਾਹ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ ਅਤੇ ਦੂਰੋਂ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਨ ਕਰੋ",
      pharmacy: "ਫਾਰਮੇਸੀ",
      pharmacyDesc: "ਵਸਤੂ-ਸੂਚੀ ਪ੍ਰਬੰਧਨ ਅਤੇ ਮਰੀਜ਼ਾਂ ਲਈ ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ ਪੂਰੇ ਕਰੋ",
      admin: "ਪ੍ਰਸ਼ਾਸਕ",
      adminDesc: "ਸਿਸਟਮ ਦੀ ਵਰਤੋਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਸਿਹਤ ਸਰੋਤਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ",
      
      accessDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੱਕ ਪਹੁੰਚ",
      
      // Why Choose Us section
      multilingualSupportTitle: "ਬਹੁਭਾਸ਼ੀ ਸਹਾਇਤਾ",
      multilingualSupportDesc: "ਬਿਹਤਰ ਪਹੁੰਚ ਲਈ ਹਿੰਦੀ, ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਉਪਲਬਧ",
      mobileFirstTitle: "ਮੋਬਾਈਲ-ਫਰਸਟ ਡਿਜ਼ਾਇਨ",
      mobileFirstDesc: "ਔਫਲਾਈਨ ਸਮਰੱਥਾਵਾਂ ਦੇ ਨਾਲ ਸਮਾਰਟਫੋਨ ਲਈ ਅਨੁਕੂਲ",
      communityFocusedTitle: "ਕਮਿਊਨਿਟੀ ਕੇਂਦਰਿਤ",
      communityFocusedDesc: "ਵਿਸ਼ੇਸ਼ ਤੌਰ ਤੇ ਪੇਂਡੂ ਸਿਹਤ ਲੋੜਾਂ ਲਈ ਡਿਜ਼ਾਇਨ ਕੀਤਾ ਗਿਆ",
      
      startYourJourney: "ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ",
      emergencyHelp: "ਐਮਰਜੈਂਸੀ ਮਦਦ",
      
      // Testimonials
      whatUsersSay: "ਸਾਡੇ ਉਪਭੋਗਤਾ ਕੀ ਕਹਿੰਦੇ ਹਨ",
      realStories: "ਸਾਡੇ ਸਮੁਦਾਏ ਦੀਆਂ ਅਸਲ ਕਹਾਣੀਆਂ",
      testimonialText: "ਇਹ ਐਪ ਸਾਡੇ ਪਿੰਡ ਲਈ ਜ਼ਿੰਦਗੀ ਬਚਾਉਣ ਵਾਲਾ ਰਿਹਾ ਹੈ। ਅਸੀਂ ਹੁਣ ਲੰਬੀ ਦੂਰੀ ਦੀ ਯਾਤਰਾ ਕੀਤੇ ਬਿਨਾਂ ਡਾਕਟਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰ ਸਕਦੇ ਹਾਂ। ਬਹੁਭਾਸ਼ੀ ਸਹਾਇਤਾ ਇਸਨੂੰ ਸਭ ਲਈ ਵਰਤਣਾ ਆਸਾਨ ਬਣਾਉਂਦੀ ਹੈ।",
      villageResident: "ਪਿੰਡ ਵਾਸੀ",
      location: "ਨਾਭਾ, ਪੰਜਾਬ",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
