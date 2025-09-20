import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, User } from 'lucide-react';
import { globalSignalingData } from './SimpleWebRTCCaller';

export default function SimpleWebRTCReceiver({ 
  patientId = 'patient_123',
  onCallStateChange 
}) {
  const [callId, setCallId] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [doctorName, setDoctorName] = useState('');
  const [incomingCall, setIncomingCall] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  };

  // Check for incoming calls (polling)
  useEffect(() => {
    const checkForIncomingCall = () => {
      if (callId && globalSignalingData[callId] && globalSignalingData[callId].offer) {
        const callData = globalSignalingData[callId];
        if (callData.status === 'waiting' && !incomingCall) {
          setIncomingCall({
            callId: callId,
            doctorName: callData.doctorName || 'Doctor'
          });
        }
      }
    };

    if (callId && !isCallActive) {
      const interval = setInterval(checkForIncomingCall, 1000);
      return () => clearInterval(interval);
    }
  }, [callId, isCallActive, incomingCall]);

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
      alert('Please allow microphone access to join the call');
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
        if (globalSignalingData[callId]) {
          globalSignalingData[callId].candidates.push(event.candidate);
        }
      }
    };

    return peerConnection;
  };

  // Join call with PIN
  const joinCall = () => {
    const inputCallId = callId.trim().toUpperCase();
    if (!inputCallId) {
      alert('Please enter a call ID');
      return;
    }

    if (!globalSignalingData[inputCallId] || !globalSignalingData[inputCallId].offer) {
      alert('Call ID not found. Please check the ID and try again.');
      return;
    }

    setCallId(inputCallId);
    // The useEffect will detect the incoming call and show the accept dialog
  };

  // Accept the incoming call
  const acceptCall = async () => {
    try {
      setIsConnecting(true);
      setIncomingCall(null);

      const stream = await getUserMedia();
      const peerConnection = await createPeerConnection(stream, callId);

      // Get the stored offer
      const callData = globalSignalingData[callId];
      if (callData && callData.offer) {
        // Set remote description with the offer
        await peerConnection.setRemoteDescription(callData.offer);

        // Create and send answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Store answer in global signaling
        globalSignalingData[callId].answer = answer;
        globalSignalingData[callId].status = 'connected';

        setDoctorName(callData.doctorName || 'Doctor');

        // Add any stored ICE candidates
        if (callData.candidates) {
          callData.candidates.forEach(async (candidate) => {
            try {
              await peerConnection.addIceCandidate(candidate);
            } catch (e) {
              console.warn('Error adding ICE candidate:', e);
            }
          });
        }

        console.log('Call accepted and answer sent');
      }
    } catch (error) {
      console.error('Error accepting call:', error);
      setIsConnecting(false);
    }
  };

  // Decline the incoming call
  const declineCall = () => {
    setIncomingCall(null);
    setCallId('');
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
    setDoctorName('');
    setIncomingCall(null);

    // Clear video elements
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    // Clean up signaling data
    if (callId && globalSignalingData[callId]) {
      globalSignalingData[callId].status = 'ended';
    }

    setCallId('');
    if (onCallStateChange) onCallStateChange('ended');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-md w-full mx-4">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Incoming Call</h3>
              <p className="text-lg text-gray-700 mb-1">{incomingCall.doctorName}</p>
              <p className="text-sm text-gray-500 mb-4">Healthcare Professional</p>
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-1">Call ID</p>
                <p className="font-mono text-sm font-semibold text-gray-800">{incomingCall.callId}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={declineCall}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Decline</span>
              </button>
              <button
                onClick={acceptCall}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Accept</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {!isCallActive && !isConnecting ? (
        // Join Call UI
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 text-center">Join Video Call</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Call ID
              </label>
              <input
                type="text"
                value={callId}
                onChange={(e) => setCallId(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit call ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-lg"
                maxLength={6}
              />
            </div>
            
            <button
              onClick={joinCall}
              disabled={!callId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Join Call</span>
            </button>
          </div>
        </div>
      ) : isConnecting ? (
        // Connecting UI
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecting...</h3>
          <p className="text-gray-600 mb-4">Joining call with {doctorName}</p>
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>
      ) : (
        // Active Call UI
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Call with {doctorName}</h3>
            <p className="text-sm text-gray-600">Call ID: {callId}</p>
          </div>

          {/* Video Area */}
          <div className="relative">
            {/* Remote video (doctor) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            />
            
            {/* Local video (patient) - picture in picture */}
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