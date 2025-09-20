import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Copy } from 'lucide-react';

// Simple in-memory signaling - replace with your backend/Firebase
let globalSignalingData = {};

export default function SimpleWebRTCCaller({ 
  isDoctor = true, 
  doctorName = "Dr. Smith",
  onCallStateChange 
}) {
  const [callId, setCallId] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  };

  // Generate call ID
  const generateCallId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  // Get user media
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false // Start audio-only
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Please allow microphone access to start the call');
      throw error;
    }
  };

  // Create peer connection
  const createPeerConnection = async (stream, callId) => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle connection state
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        setIsConnecting(false);
        setIsCallActive(true);
        if (onCallStateChange) onCallStateChange('connected');
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        endCall();
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Store ICE candidate in global signaling
        if (!globalSignalingData[callId]) {
          globalSignalingData[callId] = { candidates: [], offer: null, answer: null };
        }
        globalSignalingData[callId].candidates.push(event.candidate);
      }
    };

    return peerConnection;
  };

  // Start call (Doctor side)
  const startCall = async () => {
    try {
      setIsConnecting(true);
      const newCallId = generateCallId();
      setCallId(newCallId);

      const stream = await getUserMedia();
      const peerConnection = await createPeerConnection(stream, newCallId);

      // Create and store offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Store offer in global signaling
      globalSignalingData[newCallId] = {
        offer: offer,
        answer: null,
        candidates: [],
        doctorName: doctorName,
        status: 'waiting'
      };

      console.log('Call created with ID:', newCallId);
      console.log('Waiting for patient to join...');
      
      // Poll for answer (in real app, use WebSocket/Firebase)
      pollForAnswer(newCallId, peerConnection);

    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
    }
  };

  // Poll for answer from patient
  const pollForAnswer = (callId, peerConnection) => {
    const checkForAnswer = async () => {
      const callData = globalSignalingData[callId];
      if (callData && callData.answer && !peerConnection.remoteDescription) {
        await peerConnection.setRemoteDescription(callData.answer);
        
        // Add any stored ICE candidates
        callData.candidates.forEach(async (candidate) => {
          try {
            await peerConnection.addIceCandidate(candidate);
          } catch (e) {
            console.warn('Error adding ICE candidate:', e);
          }
        });
        
        console.log('Answer received and connection established');
        return;
      }
      
      // Continue polling if still connecting
      if (isConnecting) {
        setTimeout(checkForAnswer, 1000);
      }
    };
    
    checkForAnswer();
  };

  // Toggle video
  const toggleVideo = async () => {
    if (!localStream) return;

    try {
      if (!isVideoEnabled) {
        // Enable video
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        
        // Replace or add video track
        const sender = peerConnectionRef.current?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        } else {
          peerConnectionRef.current?.addTrack(videoTrack, localStream);
        }
        
        localStream.addTrack(videoTrack);
        setIsVideoEnabled(true);
      } else {
        // Disable video
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.stop();
          localStream.removeTrack(videoTrack);
        }
        setIsVideoEnabled(false);
      }
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (!localStream) return;
    
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = !isAudioEnabled;
    });
    setIsAudioEnabled(!isAudioEnabled);
  };

  // End call
  const endCall = () => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset state
    setIsCallActive(false);
    setIsConnecting(false);
    setIsVideoEnabled(false);
    setIsAudioEnabled(true);
    setRemoteStream(null);
    setCallId('');

    // Clear video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // Clean up signaling data
    if (callId && globalSignalingData[callId]) {
      delete globalSignalingData[callId];
    }

    if (onCallStateChange) onCallStateChange('ended');
  };

  // Copy call ID
  const copyCallId = async () => {
    try {
      await navigator.clipboard.writeText(callId);
      alert('Call ID copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {!isCallActive && !isConnecting ? (
        // Start Call UI
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Video Call</h3>
          <button
            onClick={startCall}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2 mx-auto"
          >
            <Phone className="w-5 h-5" />
            <span>Start Call</span>
          </button>
        </div>
      ) : isConnecting ? (
        // Connecting UI
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Created</h3>
          <p className="text-gray-600 mb-4">Share this ID with the patient:</p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl font-bold text-gray-900 font-mono">{callId}</span>
              <button
                onClick={copyCallId}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">Waiting for patient to join...</p>
          
          <button
            onClick={endCall}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Cancel Call
          </button>
        </div>
      ) : (
        // Active Call UI
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Call Active</h3>
            <p className="text-sm text-gray-600">Call ID: {callId}</p>
          </div>

          {/* Video Area */}
          <div className="relative">
            {/* Remote video (patient) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            />
            
            {/* Local video (doctor) - picture in picture */}
            {isVideoEnabled && (
              <div className="absolute top-2 right-2 w-24 h-18 bg-gray-800 rounded overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Audio-only indicator */}
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Mic className="w-8 h-8 mx-auto mb-2" />
                  <p>Audio Call</p>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full ${
                isAudioEnabled ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAudioEnabled ? (
                <Mic className="w-5 h-5 text-gray-700" />
              ) : (
                <MicOff className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${
                isVideoEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {isVideoEnabled ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={endCall}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the global signaling data for the receiver component
export { globalSignalingData };