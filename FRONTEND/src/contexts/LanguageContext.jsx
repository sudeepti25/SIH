import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../utils/i18n'; // Import i18n directly

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isReady, setIsReady] = useState(false);

  const changeLanguage = useCallback(async (language) => {
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      localStorage.setItem('selectedLanguage', language);
    } catch (error) {
      console.error('Language change failed:', error);
    }
  }, []);

  // Initialize language on mount
  useEffect(() => {
    const initLanguage = async () => {
      const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      
      if (savedLanguage !== 'en') {
        await i18n.changeLanguage(savedLanguage);
      }
      
      setCurrentLanguage(savedLanguage);
      setIsReady(true);
    };
    
    initLanguage();
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    isReady
  };

  // Don't render children until i18n is ready
  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
