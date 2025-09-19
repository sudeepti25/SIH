import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Stethoscope, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Shield,
  Users
} from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Rural Telemedicine</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Bringing quality healthcare to rural communities through technology. 
              Accessible, affordable, and reliable telemedicine services for everyone.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Users className="h-4 w-4" />
                <span>Multilingual Support</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="/patient" className="text-gray-300 hover:text-white transition-colors">
                  {t('symptomChecker')}
                </a>
              </li>
              <li>
                <a href="/patient" className="text-gray-300 hover:text-white transition-colors">
                  {t('bookAppointment')}
                </a>
              </li>
              <li>
                <a href="/emergency" className="text-gray-300 hover:text-white transition-colors">
                  {t('emergency')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">support@ruraltelemedicine.in</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">Nabha, Punjab, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4 md:mb-0">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Made with care for rural communities</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Rural Telemedicine. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
