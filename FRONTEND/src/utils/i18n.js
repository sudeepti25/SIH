import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      welcome: "Welcome to Rural Telemedicine",
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
    }
  },
  hi: {
    translation: {
      // Common
      welcome: "ग्रामीण टेलीमेडिसिन में आपका स्वागत है",
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
    }
  },
  pa: {
    translation: {
      // Common
      welcome: "ਪੇਂਡੂ ਟੈਲੀਮੈਡੀਸਨ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
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
