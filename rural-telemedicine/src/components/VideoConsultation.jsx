import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  MessageCircle, 
  Send, 
  Camera, 
  CameraOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';

const VideoConsultation = ({ 
  isActive, 
  onClose, 
  appointment, 
  userType = 'patient' 
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(50);
  const [videoQuality, setVideoQuality] = useState('HD');

  // Simulate call duration timer
  useEffect(() => {
    let interval;
    if (isActive && connectionStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, connectionStatus]);

  // Simulate connection process
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsConnecting(false);
        setConnectionStatus('connected');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    // In a real app, this would control the camera stream
  };

  const handleAudioToggle = () => {
    setIsAudioOn(!isAudioOn);
    // In a real app, this would control the microphone
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleEndCall = () => {
    setConnectionStatus('ended');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: newMessage,
        sender: userType,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setNewMessage('');
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isActive) return null;

  return (
    <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? '' : 'p-4'}`}>
      <div className={`bg-black h-full ${isFullscreen ? 'rounded-none' : 'rounded-lg'} overflow-hidden`}>
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">
                {connectionStatus === 'connecting' ? 'Connecting...' : 
                 connectionStatus === 'connected' ? 'Connected' : 'Call Ended'}
              </span>
            </div>
            {connectionStatus === 'connected' && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(callDuration)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleFullscreenToggle}
              className="p-2 hover:bg-gray-700 rounded"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="relative h-full flex">
          {/* Main Video */}
          <div className="flex-1 relative">
            {isConnecting ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Connecting to {appointment?.doctor || 'Doctor'}...</p>
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                {/* Remote Video */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <User className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">{appointment?.doctor || 'Doctor'}</p>
                    <p className="text-sm text-gray-400">{appointment?.specialty || 'Specialist'}</p>
                  </div>
                </div>

                {/* Local Video */}
                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden">
                  {isVideoOn ? (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <CameraOff className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Connection Status */}
                {connectionStatus === 'connected' && (
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">HD Quality</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-medium">Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === userType ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === userType
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-900 bg-opacity-90 rounded-full px-6 py-3 flex items-center space-x-4">
            {/* Video Toggle */}
            <button
              onClick={handleVideoToggle}
              className={`p-3 rounded-full ${
                isVideoOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              className={`p-3 rounded-full ${
                isAudioOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>

            {/* Mute Toggle */}
            <button
              onClick={handleMuteToggle}
              className={`p-3 rounded-full ${
                !isMuted ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {!isMuted ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-full ${
                showChat ? 'bg-primary-600 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-16 right-4 bg-gray-900 text-white p-4 rounded-lg w-64">
            <h3 className="font-medium mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Audio Level</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioLevel}
                  onChange={(e) => setAudioLevel(e.target.value)}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{audioLevel}%</span>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Video Quality</label>
                <select
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                >
                  <option value="SD">Standard (480p)</option>
                  <option value="HD">High (720p)</option>
                  <option value="FHD">Full HD (1080p)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConsultation;

