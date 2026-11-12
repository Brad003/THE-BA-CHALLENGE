import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  X,
  Check,
  RotateCcw,
  AlertCircle,
  Loader2,
  Timer,
  Upload,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface CameraCaptureModalProps {
  userId: string;
  currentAvatarUrl?: string;
  onPhotoSaved: (avatarUrl: string) => void;
  onClose: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  userId,
  currentAvatarUrl,
  onPhotoSaved,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);

  // Timer: 0 = off, 3 = 3 second countdown
  const [timerDuration, setTimerDuration] = useState<0 | 3>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Stop camera tracks cleanly
  const stopTracks = (mediaStream?: MediaStream | null) => {
    const s = mediaStream !== undefined ? mediaStream : stream;
    if (s) {
      s.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping camera track:', e);
        }
      });
    }
  };

  // Start device camera
  const startCamera = async (mode: 'user' | 'environment') => {
    setIsCameraStarting(true);
    setCameraError(null);

    // Stop current stream if running
    if (stream) {
      stopTracks(stream);
      setStream(null);
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        'Camera access is not supported by this browser. You can still upload a photo directly.'
      );
      setIsCameraStarting(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: mode,
          width: { ideal: 1080, max: 1920 },
          height: { ideal: 1080, max: 1920 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.warn('Auto-play blocked or error:', err);
          });
        };
      }

      // Check if multiple camera devices exist
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch (err) {
        console.warn('Could not enumerate devices:', err);
      }
    } catch (err: any) {
      console.warn('Notice accessing device camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          'Camera permission was denied. Please allow camera permissions in your browser address bar or settings.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please connect a camera or upload a file.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError(
          'Your camera is currently in use by another application or tab. Please close other apps using the camera and retry.'
        );
      } else {
        setCameraError(err.message || 'Unable to start camera. Please try again or upload a photo.');
      }
    } finally {
      setIsCameraStarting(false);
    }
  };

  // Switch between front and back camera
  const toggleCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Initialize camera on mount, cleanup on unmount
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopTracks();
    };
  }, []);

  // Handle countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      takeSnapshot();
      setCountdown(null);
    }
  }, [countdown]);

  const handleCaptureClick = () => {
    if (timerDuration > 0) {
      setCountdown(timerDuration);
    } else {
      takeSnapshot();
    }
  };

  // Capture frame from video and generate centered square 1:1 image
  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Visual shutter flash effect
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 180);

    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;

    // Center crop square calculation
    const cropSize = Math.min(videoWidth, videoHeight);
    const startX = (videoWidth - cropSize) / 2;
    const startY = (videoHeight - cropSize) / 2;

    const outputDim = 480; // High resolution square avatar
    canvas.width = outputDim;
    canvas.height = outputDim;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    // Mirror if selfie/front camera to match viewfinder intuition
    if (facingMode === 'user') {
      ctx.translate(outputDim, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      video,
      startX,
      startY,
      cropSize,
      cropSize,
      0,
      0,
      outputDim,
      outputDim
    );
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);

    // Temporarily pause camera stream to save power while reviewing
    stopTracks();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera(facingMode);
  };

  const handleSavePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      setIsSaving(true);

      // Convert data URL to Blob for storage upload
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();

      let finalUrl = capturedPhoto;

      // Attempt to save to Firebase Cloud Storage if possible
      try {
        const fileName = `avatars/${userId}_${Date.now()}.jpg`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, blob, {
          contentType: 'image/jpeg',
        });
        finalUrl = await getDownloadURL(snapshot.ref);
      } catch (storageError) {
        console.warn(
          'Firebase Storage upload unavailable or restricted, using direct avatar data payload:',
          storageError
        );
        // Fallback to optimized data URL so user change is NEVER blocked
        finalUrl = capturedPhoto;
      }

      onPhotoSaved(finalUrl);
      onClose();
    } catch (err) {
      console.warn('Notice while saving captured photo:', err);
      // Fallback save anyway
      onPhotoSaved(capturedPhoto);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  // Alternative: upload existing file from disk
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCapturedPhoto(result);
        stopTracks();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleModalClose = () => {
    stopTracks();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#08120b] border border-[#1b3e28] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Flash Effect */}
        {isFlashActive && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150 opacity-90" />
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#142e1e] flex items-center justify-between bg-[#0b1b11]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-main)]/10 border border-[var(--accent-main)]/30 flex items-center justify-center text-[var(--accent-main)]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#f5ebd7] font-['Cinzel'] tracking-wide">
                Take Profile Photo
              </h3>
              <p className="text-[11px] text-[#8ea496]">
                Position your face inside the Panther guide
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-xl bg-[#122418] hover:bg-[#1b3524] text-[#8ea496] hover:text-[#f5ebd7] flex items-center justify-center transition-colors"
            title="Close camera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder / Preview Container */}
        <div className="relative bg-[#050b07] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
          
          {/* Review Captured Photo Mode */}
          {capturedPhoto ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="relative">
                {/* Circular Profile Avatar Preview */}
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden ring-4 ring-[var(--accent-main)] shadow-[0_0_30px_rgba(201,151,56,0.3)] bg-black relative">
                  <img
                    src={capturedPhoto}
                    alt="Captured profile preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 right-4 px-2.5 py-0.5 rounded-full bg-[#1b4b2f] border border-[#2b7249] text-[10px] font-bold text-[#86efac] flex items-center space-x-1 shadow-md">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Photo Ready</span>
                </div>
              </div>

              <p className="text-xs text-[#9eb6a8] text-center max-w-xs">
                Looking sharp! Confirm to set this as your official Panther profile photo.
              </p>
            </div>
          ) : (
            /* Live Camera Stream Mode */
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              
              {/* Video Feed */}
              <div className="w-full h-full rounded-2xl overflow-hidden bg-black border border-[#163622] relative flex items-center justify-center">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    facingMode === 'user' ? '-scale-x-100' : ''
                  }`}
                />

                {/* Circular Viewfinder Framing Guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-dashed border-[var(--accent-main)]/80 shadow-[0_0_0_9999px_rgba(4,9,6,0.55)] transition-all" />
                  <div className="absolute w-60 h-60 sm:w-68 sm:h-68 rounded-full border border-[var(--accent-main)]/30 pointer-events-none" />
                </div>

                {/* Live Countdown Overlay */}
                {countdown !== null && countdown > 0 && (
                  <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="text-7xl font-black text-[var(--accent-main)] animate-ping font-['Cinzel']">
                      {countdown}
                    </span>
                  </div>
                )}

                {/* Camera Starting Spinner */}
                {isCameraStarting && (
                  <div className="absolute inset-0 bg-[#060e09] flex flex-col items-center justify-center space-y-3 z-20">
                    <Loader2 className="w-8 h-8 text-[var(--accent-main)] animate-spin" />
                    <span className="text-xs text-[#8ea496]">Starting camera...</span>
                  </div>
                )}

                {/* Camera Error Message */}
                {cameraError && (
                  <div className="absolute inset-0 bg-[#07130b] p-6 flex flex-col items-center justify-center text-center space-y-3 z-20">
                    <div className="w-10 h-10 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center text-red-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-red-300">Camera Unavailable</h4>
                    <p className="text-[11px] text-[#8ea496] leading-relaxed">
                      {cameraError}
                    </p>
                    <div className="flex flex-col gap-2 w-full pt-1">
                      <button
                        onClick={() => startCamera(facingMode)}
                        className="w-full py-2 px-3 rounded-xl bg-[#143321] hover:bg-[#1d472f] text-xs font-semibold text-[#86efac] border border-[#27603c] transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-[#102015] hover:bg-[#172c1e] text-xs font-semibold text-[#c8d6ce] border border-[#1e3c27] transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo Instead</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Viewfinder Controls Bar (Overlay on top of video) */}
              {!cameraError && !isCameraStarting && (
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                  {/* Timer Toggle Button */}
                  <button
                    onClick={() => setTimerDuration(timerDuration === 0 ? 3 : 0)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1 backdrop-blur-md border transition-all ${
                      timerDuration > 0
                        ? 'bg-[var(--accent-main)] text-[#09150e] border-[var(--accent-main)] shadow-lg'
                        : 'bg-black/50 text-[#9eb6a8] border-white/10 hover:bg-black/70'
                    }`}
                    title={timerDuration > 0 ? '3s Timer Enabled' : 'Timer Disabled'}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{timerDuration > 0 ? '3s' : 'Timer Off'}</span>
                  </button>

                  {/* Switch Front/Rear Camera if available */}
                  {hasMultipleCameras && (
                    <button
                      onClick={toggleCamera}
                      className="p-2 rounded-xl bg-black/50 hover:bg-black/75 backdrop-blur-md text-[#f5ebd7] border border-white/10 transition-colors"
                      title="Switch camera"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hidden Canvas for capture rendering */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Hidden File Input for fallback upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Modal Action Controls Footer */}
        <div className="p-4 sm:p-5 border-t border-[#142e1e] bg-[#09150e] flex flex-col space-y-3">
          {capturedPhoto ? (
            /* Review Mode Actions */
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleRetake}
                disabled={isSaving}
                className="py-3 px-4 rounded-2xl bg-[#112418] hover:bg-[#193523] border border-[#1e3e29] text-xs font-bold text-[#c8d6ce] flex items-center justify-center space-x-2 transition-colors active:scale-98 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Photo</span>
              </button>

              <button
                onClick={handleSavePhoto}
                disabled={isSaving}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-[var(--accent-main)] to-[#e5b349] text-[#09150e] text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-98 disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Set Profile Photo</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Live Camera Capture Actions */
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center justify-center space-x-6 w-full">
                
                {/* Fallback Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-2xl bg-[#102216] hover:bg-[#183321] text-[#9eb6a8] hover:text-[#f5ebd7] border border-[#1d3d29] transition-colors"
                  title="Choose from device storage"
                >
                  <Upload className="w-4 h-4" />
                </button>

                {/* Primary Shutter Button */}
                <button
                  type="button"
                  disabled={isCameraStarting || !!cameraError}
                  onClick={handleCaptureClick}
                  className="relative group p-1.5 rounded-full border-4 border-[var(--accent-main)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(201,151,56,0.4)]"
                  title="Capture photo"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[var(--accent-main)] to-[#f3cf7a] flex items-center justify-center group-hover:scale-95 transition-transform shadow-inner">
                    <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-[#09150e]" />
                  </div>
                </button>

                {/* Reset / Flip camera button on the right */}
                <button
                  type="button"
                  onClick={toggleCamera}
                  disabled={!hasMultipleCameras || isCameraStarting || !!cameraError}
                  className="p-3 rounded-2xl bg-[#102216] hover:bg-[#183321] text-[#9eb6a8] hover:text-[#f5ebd7] border border-[#1d3d29] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={hasMultipleCameras ? "Switch front/rear camera" : "Only one camera detected"}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] text-[#6e8a78] text-center">
                Tap the gold shutter to snap your photo
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
