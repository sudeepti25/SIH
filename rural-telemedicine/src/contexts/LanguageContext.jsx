import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const changeLanguage = useCallback((language) => {
    i18n.changeLanguage(language).then(() => {
      setCurrentLanguage(language);
      localStorage.setItem('selectedLanguage', language);
    }).catch((error) => {
      console.error('Language change failed:', error);
    });
  }, [i18n]);

  // Load saved language on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    changeLanguage(savedLanguage);
  }, [changeLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
