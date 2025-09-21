# Sahayata Healthcare Solution

A comprehensive Progressive Web App (PWA) designed to provide accessible digital healthcare services to rural communities. Built with React, Vite, and Tailwind CSS, this application supports multiple user types and includes multilingual support.

## 🌟 Features

### Core Features
- **Multilingual Support**: Available in English, Hindi, and Punjabi
- **Progressive Web App**: Works offline and can be installed on mobile devices
- **Enhanced Symptom Checker**: AI-powered synchronous analysis with detailed recommendations
- **Responsive Design**: Mobile-first approach optimized for smartphones
- **Role-based Access**: Separate dashboards for patients, doctors, pharmacies, and administrators

### Patient Features
- Enhanced AI-powered symptom checker with synchronous analysis
- Appointment booking system
- Video consultation interface
- Digital health records
- Medicine availability checker
- Emergency contact integration

### Doctor Features
- Patient queue management
- Video consultation tools
- Prescription generation
- Patient history access
- Analytics dashboard

### Pharmacy Features
- Inventory management
- Prescription fulfillment
- Stock level monitoring
- Real-time notifications
- Medicine availability updates

### Admin Features
- System analytics
- Village-wise health data
- User management
- Performance monitoring
- Disease trend analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sahayata
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Project Structure

```
sahayata/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Navigation header
│   │   ├── Footer.jsx         # Footer component
│   │   └── VoiceAssistant.jsx # Voice accessibility features
│   ├── contexts/
│   │   ├── LanguageContext.jsx # Multilingual support
│   │   └── UserContext.jsx    # User state management
│   ├── pages/
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── LoginPage.jsx      # Authentication
│   │   ├── PatientDashboard.jsx
│   │   ├── DoctorDashboard.jsx
│   │   ├── PharmacyDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── utils/
│   │   └── i18n.js           # Internationalization config
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Trust and reliability
- **Healthcare**: Green (#22c55e) - Health and wellness
- **Accent**: Various colors for different features

### Typography
- **English**: System fonts
- **Hindi**: Noto Sans Devanagari
- **Punjabi**: Noto Sans Gurmukhi

### Components
- Consistent button styles with hover states
- Card-based layouts for better organization
- Responsive grid systems
- Accessible form inputs

## 🌐 Multilingual Support

The application supports three languages:
- **English** (en) - Default language
- **Hindi** (hi) - हिंदी
- **Punjabi** (pa) - ਪੰਜਾਬੀ

Language switching is available in the header and persists across sessions.

## ♿ Accessibility Features

- **Voice Assistant**: Speech recognition and synthesis
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast**: Clear visual hierarchy
- **Large Touch Targets**: Mobile-optimized interface
- **Offline Support**: PWA capabilities for low-connectivity areas

## 📱 PWA Features

- **Installable**: Can be installed on mobile devices
- **Offline Support**: Basic functionality works without internet
- **Service Worker**: Caches resources for offline use
- **App Manifest**: Native app-like experience
- **Responsive**: Works on all device sizes

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Sahayata
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000/api
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with healthcare-specific colors and fonts. See `tailwind.config.js` for details.

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Traditional Hosting
1. Run `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server to serve the PWA files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Healthcare professionals who provided insights
- Rural community members for feedback
- Open source libraries and frameworks used
- Design inspiration from modern healthcare applications

## 📞 Support

For support and questions:
- Email: support@ruraltelemedicine.in
- Phone: +91 98765 43210
- Emergency: 108

---

**Made with ❤️ for rural communities**