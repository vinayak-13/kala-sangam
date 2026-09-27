'use client';

import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Video, Volume2, Square, RefreshCw, FolderOpen, Sparkles } from 'lucide-react';
import { playTanpuraChime, playUiBeep, speakText, stopAllAudio } from '@/lib/audio-utils';
import { getStepActionGuide, getStep2BilingualI18n } from '@/lib/i18n/indic-languages';

interface MobileMediaPickerProps {
  onPhotoCaptured: (dataUrl: string) => void;
  onVideoRecorded?: (videoBlob: Blob, hasSpeech: boolean, duration: number) => void;
  onOpenInBrowserCamera?: () => void;
  maxPhotos?: number;
  currentPhotoCount?: number;
  locale?: string;
}

/**
 * 3-Option Tactile Media Studio Bridge
 * Option 1: Native Video Camera App (Record Live Video Reel)
 * Option 2: Live In-Browser Photo Camera (Interactive Live Viewfinder on Webpage)
 * Option 3: Device Files & Gallery (Upload Existing Media & Files)
 * Full Dynamic Dual-Language Rendering (Selected Indic Language + English)
 */
export function MobileMediaPicker({
  onPhotoCaptured,
  onVideoRecorded,
  onOpenInBrowserCamera,
  maxPhotos = 5,
  currentPhotoCount = 0,
  locale = 'hi',
}: MobileMediaPickerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const videoCameraInputRef = useRef<HTMLInputElement | null>(null);
  const photoCameraInputRef = useRef<HTMLInputElement | null>(null);
  const deviceFilesInputRef = useRef<HTMLInputElement | null>(null);

  const t = getStep2BilingualI18n(locale);

  const toggleVoiceGuide = (key: 'video_option' | 'camera_photo_option' | 'device_files_option', e: React.MouseEvent) => {
    e.stopPropagation();
    if (speakingKey === key) {
      stopAllAudio();
      setSpeakingKey(null);
      playUiBeep('stop');
      return;
    }

    stopAllAudio();
    const guideText = getStepActionGuide(key, locale);
    if (!guideText) return;

    setSpeakingKey(key);
    playTanpuraChime(1.5);
    speakText(guideText, locale, () => {
      setSpeakingKey(null);
    });
  };

  const processAndCompressImage = (file: File) => {
    setIsProcessing(true);
    playUiBeep('start');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          playTanpuraChime(1.0);
          onPhotoCaptured(compressedDataUrl);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processAndCompressImage(files[0]);
    e.target.value = '';
  };

  const handleDeviceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('video/') && onVideoRecorded) {
        playTanpuraChime(1.5);
        onVideoRecorded(file, true, 25);
      } else if (file.type.startsWith('image/')) {
        processAndCompressImage(file);
      }
    });

    e.target.value = '';
  };

  const handleVideoCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (onVideoRecorded) {
      playTanpuraChime(1.5);
      onVideoRecorded(file, true, 20);
    }
    e.target.value = '';
  };

  const canAddMorePhotos = currentPhotoCount < maxPhotos;

  return (
    <div className="space-y-4">
      {/* Hidden Native File & Camera Inputs */}
      {/* 1. Video Camera Input (Opens Native Camera App in Video Mode) */}
      <input
        ref={videoCameraInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleVideoCameraChange}
        className="hidden"
      />

      {/* 2. Photo Camera Input Fallback */}
      <input
        ref={photoCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCameraChange}
        className="hidden"
      />

      {/* 3. Device Files & Gallery Multi-Upload Input */}
      <input
        ref={deviceFilesInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleDeviceFilesChange}
        className="hidden"
      />

      {/* 3 Prominent Large Touch Capture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* OPTION 1: VIDEO (Takes user to camera app to record live video) */}
        <div
          onClick={() => {
            stopAllAudio();
            videoCameraInputRef.current?.click();
          }}
          className="group relative bg-[#F0FDF4] hover:bg-[#DCFCE7]/80 border-2 border-[#006B2F] rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition active:scale-[0.98] flex flex-col justify-between min-h-[175px]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#006B2F] text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition">
              <Video className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Voice explanation button for Option 1 */}
            <button
              type="button"
              onClick={(e) => toggleVoiceGuide('video_option', e)}
              className={`p-2.5 rounded-full border shadow-xs transition active:scale-90 flex items-center gap-1 text-xs font-bold ${
                speakingKey === 'video_option'
                  ? 'bg-[#221A16] text-white border-[#221A16] animate-pulse'
                  : 'bg-white hover:bg-[#DCFCE7] text-[#006B2F] border-[#006B2F]/40'
              }`}
              title="Voice Guide"
            >
              {speakingKey === 'video_option' ? (
                <>
                  <Square className="w-4 h-4 fill-current text-white" />
                  <span className="text-[11px]">{t.stopGuide}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#006B2F]" />
                  <span className="text-[11px] font-bold">{t.voiceBtn}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 space-y-1">
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#006B2F] text-white uppercase tracking-wider inline-block">
              {t.opt1Badge}
            </span>
            <h3 className="text-lg font-black text-[#221A16] leading-tight font-heading">
              {t.opt1Title}
            </h3>
            <p className="text-xs text-[#56423C] font-medium leading-relaxed">
              {t.opt1Desc}
            </p>
          </div>
        </div>

        {/* OPTION 2: LIVE IN-BROWSER CAMERA PHOTO (Takes user to camera to click live picture directly on browser) */}
        <div
          onClick={() => {
            if (!canAddMorePhotos) return;
            stopAllAudio();
            if (onOpenInBrowserCamera) {
              onOpenInBrowserCamera();
            } else {
              photoCameraInputRef.current?.click();
            }
          }}
          className={`group relative bg-[#FFF1EB] hover:bg-[#FBEBE4] border-2 border-[#9D3E1B] rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition active:scale-[0.98] flex flex-col justify-between min-h-[175px] ${
            !canAddMorePhotos ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#9D3E1B] text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition">
              <Camera className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Voice explanation button for Option 2 */}
            <button
              type="button"
              onClick={(e) => toggleVoiceGuide('camera_photo_option', e)}
              className={`p-2.5 rounded-full border shadow-xs transition active:scale-90 flex items-center gap-1 text-xs font-bold ${
                speakingKey === 'camera_photo_option'
                  ? 'bg-[#221A16] text-white border-[#221A16] animate-pulse'
                  : 'bg-white hover:bg-[#FFDCC3] text-[#9D3E1B] border-[#DDC0B8]'
              }`}
              title="Voice Guide"
            >
              {speakingKey === 'camera_photo_option' ? (
                <>
                  <Square className="w-4 h-4 fill-current text-white" />
                  <span className="text-[11px]">{t.stopGuide}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#FE932C]" />
                  <span className="text-[11px] font-bold">{t.voiceBtn}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 space-y-1">
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#9D3E1B] text-white uppercase tracking-wider inline-block">
              {t.opt2Badge}
            </span>
            <h3 className="text-lg font-black text-[#221A16] leading-tight font-heading">
              {t.opt2Title}
            </h3>
            <p className="text-xs text-[#56423C] font-medium leading-relaxed">
              {t.opt2Desc}
            </p>
          </div>
        </div>

        {/* OPTION 3: UPLOAD DATA & FILES (Selects saved photos, videos, or craft files) */}
        <div
          onClick={() => {
            stopAllAudio();
            deviceFilesInputRef.current?.click();
          }}
          className="group relative bg-[#FFFBEB] hover:bg-[#FEF3C7] border-2 border-[#D97706] rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition active:scale-[0.98] flex flex-col justify-between min-h-[175px]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition">
              <FolderOpen className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Voice explanation button for Option 3 */}
            <button
              type="button"
              onClick={(e) => toggleVoiceGuide('device_files_option', e)}
              className={`p-2.5 rounded-full border shadow-xs transition active:scale-90 flex items-center gap-1 text-xs font-bold ${
                speakingKey === 'device_files_option'
                  ? 'bg-[#221A16] text-white border-[#221A16] animate-pulse'
                  : 'bg-white hover:bg-amber-100 text-[#904D00] border-amber-300'
              }`}
              title="Voice Guide"
            >
              {speakingKey === 'device_files_option' ? (
                <>
                  <Square className="w-4 h-4 fill-current text-white" />
                  <span className="text-[11px]">{t.stopGuide}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#D97706]" />
                  <span className="text-[11px] font-bold">{t.voiceBtn}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3 space-y-1">
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#D97706] text-white uppercase tracking-wider inline-block">
              {t.opt3Badge}
            </span>
            <h3 className="text-lg font-black text-[#221A16] leading-tight font-heading">
              {t.opt3Title}
            </h3>
            <p className="text-xs text-[#56423C] font-medium leading-relaxed">
              {t.opt3Desc}
            </p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="p-3.5 bg-[#FFF1EB] border-2 border-[#9D3E1B] rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bold text-[#9D3E1B] animate-pulse shadow-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-[#9D3E1B]" />
          <span>तस्वीर प्रोसेस हो रही है (Optimizing Photo Quality)...</span>
        </div>
      )}
    </div>
  );
}
