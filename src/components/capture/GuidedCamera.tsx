'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, Volume2, HelpCircle, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  analyzeFrame,
  GUIDANCE_MESSAGES,
  type FrameGuidance,
} from '@/lib/capture/frame-analysis';
import { speakText, playUiBeep } from '@/lib/audio-utils';

interface GuidedCameraProps {
  onPhotoCaptured: (dataUrl: string, isBlurry: boolean) => void;
  onClose: () => void;
  locale?: string;
}

export function GuidedCamera({ onPhotoCaptured, onClose, locale = 'hi' }: GuidedCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [guidance, setGuidance] = useState<FrameGuidance>('ready');
  const [isReady, setIsReady] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [explainerStep, setExplainerStep] = useState(0);
  const lastSpokenStateRef = useRef<string>('');
  const animFrameRef = useRef<number | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.warn('getUserMedia unavailable, falling back to file input:', err);
      }
    }

    void startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Frame analysis loop (sampled every 300ms on 200x200 canvas)
  useEffect(() => {
    if (!stream) return;

    let lastSampleTime = 0;

    const processFrame = (now: number) => {
      if (now - lastSampleTime >= 300 && videoRef.current && canvasRef.current) {
        lastSampleTime = now;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.videoWidth > 0 && video.videoHeight > 0 && ctx) {
          ctx.drawImage(video, 0, 0, 200, 200);
          const imgData = ctx.getImageData(0, 0, 200, 200);
          const result = analyzeFrame(imgData, true);

          setGuidance(result.guidance);
          setIsReady(result.isReady);

          // Announce on state transition (debounced)
          if (result.guidance !== lastSpokenStateRef.current) {
            lastSpokenStateRef.current = result.guidance;
            const msg =
              GUIDANCE_MESSAGES[result.guidance]?.[locale === 'en' ? 'en' : 'hi'] ||
              GUIDANCE_MESSAGES[result.guidance]?.hi;

            if (result.guidance === 'ready') {
              if ('vibrate' in navigator) navigator.vibrate(80);
              speakText(msg, locale);
            }
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stream, locale]);

  const capturePhoto = () => {
    playUiBeep('start');
    if (!videoRef.current) return;

    const video = videoRef.current;
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = video.videoWidth || 1280;
    captureCanvas.height = video.videoHeight || 720;
    const ctx = captureCanvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

    const dataUrl = captureCanvas.toDataURL('image/jpeg', 0.85);
    const wasBlurry = guidance === 'too_blurry';

    if ('vibrate' in navigator) navigator.vibrate([60, 40, 60]);
    onPhotoCaptured(dataUrl, wasBlurry);
  };

  const explainerFrames = [
    {
      title: 'उत्पाद को बीच में रखें',
      sub: 'Place your product inside the glowing frame outline',
      hi: 'उत्पाद को गोल घेरे के अंदर रखें',
    },
    {
      title: 'अच्छी रोशनी में फोटो लें',
      sub: 'Take the photo in natural daylight or bright room light',
      hi: 'अच्छी रोशनी में फोटो लें',
    },
    {
      title: 'जब हरा दिखे, टैप करें',
      sub: 'Tap the camera button when the outline turns green',
      hi: 'जब हरा निशान दिखे, टैप करें',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none">
      {/* Offscreen 200x200 canvas for fast frame analysis */}
      <canvas ref={canvasRef} width={200} height={200} className="hidden" />

      {/* Top Controls Overlay */}
      <div className="absolute top-0 inset-x-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <button
          type="button"
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center active:scale-95"
          aria-label="Close camera"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Live Spoken Guidance Badge */}
        <div
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 backdrop-blur-md transition-all ${
            isReady
              ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-900/50 animate-pulse'
              : 'bg-amber-500/90 text-black'
          }`}
        >
          {isReady ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{GUIDANCE_MESSAGES[guidance]?.[locale === 'en' ? 'en' : 'hi']}</span>
        </div>

        <button
          type="button"
          onClick={() => setShowExplainer(true)}
          className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center active:scale-95"
          aria-label="How to photograph"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Camera Live Feed & AR Frame Guide */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className="w-full h-full object-cover"
        />

        {/* AR SVG Silhouette Outline */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none p-8"
          viewBox="0 0 400 400"
        >
          <rect
            x="45"
            y="45"
            width="310"
            height="310"
            rx="32"
            fill="none"
            stroke={isReady ? '#10B981' : '#F59E0B'}
            strokeWidth={isReady ? '4' : '3'}
            strokeDasharray={isReady ? 'none' : '14 8'}
            className="transition-colors duration-300 drop-shadow-md"
          />
        </svg>
      </div>

      {/* Bottom Shutter Action Bar */}
      <div className="p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center relative z-20">
        <button
          type="button"
          onClick={capturePhoto}
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-2xl active:scale-90 transition-transform ${
            isReady
              ? 'bg-emerald-500 border-white text-white hover:scale-105 ring-4 ring-emerald-500/50'
              : 'bg-[#C05A34] border-white text-white'
          }`}
          aria-label="Capture photo"
        >
          <Camera className="w-9 h-9" />
        </button>
      </div>

      {/* Static 3-Frame Onboarding Explainer Modal */}
      {showExplainer && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md p-6 flex flex-col justify-center items-center text-white">
          <div className="bg-[#22201D] border-2 border-[#E4DACE] rounded-3xl p-6 max-w-sm w-full space-y-5 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#C05A34]/20 border border-[#C05A34] flex items-center justify-center mx-auto text-[#C05A34]">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black">{explainerFrames[explainerStep]?.title}</h3>
              <p className="text-xs text-stone-400">{explainerFrames[explainerStep]?.sub}</p>
            </div>

            <button
              type="button"
              onClick={() => speakText(explainerFrames[explainerStep]?.hi || '', 'hi')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs"
            >
              <Volume2 className="w-4 h-4 text-[#C05A34]" />
              <span>सुनें (Listen)</span>
            </button>

            <div className="flex gap-2 justify-center pt-2">
              {explainerFrames.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === explainerStep ? 'bg-[#C05A34] w-6' : 'bg-stone-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (explainerStep < 2) {
                    setExplainerStep(explainerStep + 1);
                  } else {
                    setShowExplainer(false);
                    setExplainerStep(0);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-[#C05A34] text-white font-bold text-sm"
              >
                {explainerStep < 2 ? 'आगे बढ़ें (Next)' : 'समझ गए! (Start)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
