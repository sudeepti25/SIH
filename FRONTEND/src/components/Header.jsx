import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { 
  Menu, 
  X, 
  Globe, 
  User, 
  LogOut, 
  Stethoscope,
  Phone,
  AlertTriangle
} from 'lucide-react';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { user, userType, logout, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardPath = () => {
    switch (userType) {
      case 'patient': return '/patient';
      case 'doctor': return '/doctor';
      case 'pharmacy': return '/pharmacy';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-sterile-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="medical-gradient p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-sterile-900">
              {t('appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sterile-100 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
                <span className="text-sm">{t('language')}</span>
              </button>
              
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-sterile-200 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-sterile-50 first:rounded-t-lg last:rounded-b-lg ${
                        currentLanguage === lang.code ? 'bg-primary-50 text-primary-600' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Button */}
            <Link
              to="/emergency"
              className="btn-emergency flex items-center space-x-2 px-4 py-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{t('emergency')}</span>
            </Link>

            {/* User Menu */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sterile-100 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name || t('profile')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sterile-100 transition-colors text-healthcare-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                {t('login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sterile-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-sterile-200">
            <div className="space-y-2">
              {/* Language Selector Mobile */}
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-sterile-700 mb-2">{t('selectLanguage')}</div>
                <div className="flex space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
                        currentLanguage === lang.code 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-sterile-100 text-sterile-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emergency Button Mobile */}
              <Link
                to="/emergency"
                className="flex items-center space-x-2 px-4 py-3 text-emergency-600 hover:bg-emergency-50 rounded-lg mx-4"
                onClick={() => setIsMenuOpen(false)}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>{t('emergency')}</span>
              </Link>

              {/* User Menu Mobile */}
              {isLoggedIn ? (
                <div className="px-4 space-y-2">
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sterile-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.name || t('profile')}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-sterile-100 text-healthcare-600 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block px-4 py-3 text-center btn-primary mx-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
