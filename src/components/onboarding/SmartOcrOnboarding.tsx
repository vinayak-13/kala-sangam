'use client';

import React, { useState, useRef } from 'react';
import {
  Scan,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Volume2,
  Square,
  ArrowRight,
} from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { AIBadge } from '@/components/AIBadge';

export interface ExtractedArtisanData {
  fullName: string;
  pehchanId: string;
  craftType: string;
  district: string;
  state: string;
  skillLevel: string;
  avatarUrl?: string;
}

interface SmartOcrProps {
  onDataExtracted: (data: ExtractedArtisanData) => void;
  locale?: string;
}

export function SmartOcrOnboarding({ onDataExtracted, locale = 'hi' }: SmartOcrProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedArtisanData | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateOcrProcess = (imageSrc: string) => {
    setIsScanning(true);
    setIsDone(false);
    playTanpuraChime(1.2);

    // Realistic OCR extraction payload simulating Ministry of Textiles Pehchan Card Scan
    setTimeout(() => {
      const mockResult: ExtractedArtisanData = {
        fullName: 'सुनील वाघ (Sunil Wagh)',
        pehchanId: 'PEHCHAN-MH-04-1849-2024',
        craftType: 'पारंपरिक वारली चित्रकला (Warli Folk Art)',
        district: 'पालघर (Palghar)',
        state: 'महाराष्ट्र (Maharashtra)',
        skillLevel: 'मास्टर शिल्पकार (Master Craftsman)',
        avatarUrl: imageSrc,
      };

      setExtractedData(mockResult);
      setIsScanning(false);
      setIsDone(true);
      playUiBeep('ready');

      // Voice read-back in Indic language
      const speakMsg = `नमस्ते सुनील जी, आपका पहचान कार्ड संख्या MH 04 1849 सफलतापूर्वक सत्यापित हो गया है। आपकी कला वारली चित्रकला है।`;
      speakText(speakMsg, locale);
    }, 2200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setPreviewImage(src);
        simulateOcrProcess(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleScan = () => {
    const sampleCard = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600';
    setPreviewImage(sampleCard);
    simulateOcrProcess(sampleCard);
  };

  const handleConfirmAndApply = () => {
    if (extractedData) {
      stopAllAudio();
      onDataExtracted(extractedData);
    }
  };

  const toggleVoiceReadback = () => {
    if (isPlayingAudio) {
      stopAllAudio();
      setIsPlayingAudio(false);
      return;
    }

    if (extractedData) {
      setIsPlayingAudio(true);
      const text = `पहचान कार्ड सत्यापन: नाम ${extractedData.fullName}, शिल्प ${extractedData.craftType}, जिला ${extractedData.district}, स्तर ${extractedData.skillLevel}`;
      speakText(text, locale, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-[#FFF8F6] border-2 border-[#E6DCCF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-[#FFF1EB] text-[#9D3E1B]">
              <Scan className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#9D3E1B]">
              स्मार्ट पहचान OCR स्कैनर (Smart ID OCR Scanner)
            </span>
            <AIBadge label="Instant Autofill" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#221A16] font-heading">
            पहचान कार्ड / आधार कार्ड स्कैन करें (Scan Pehchan Artisan Card)
          </h2>
          <p className="text-xs sm:text-sm text-[#56423C] font-semibold mt-0.5">
            बिना टाइपिंग के फोटो से सीधे अपनी प्रोफ़ाइल और शिल्प विवरण स्वतः भरें। (Zero-typing profile creation)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSampleScan}
            className="px-4 py-2 rounded-2xl bg-[#FAF5EF] hover:bg-[#F2E8DC] text-[#9D3E1B] border border-[#E6DCCF] font-bold text-xs transition active:scale-95 shadow-xs"
          >
            नमूना कार्ड जांचें (Demo Scan)
          </button>
        </div>
      </div>

      {/* Camera / Scan Upload Box */}
      <div className="relative border-2 border-dashed border-[#DDC0B8] hover:border-[#9D3E1B] rounded-3xl p-6 text-center transition bg-white/60">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {previewImage ? (
          <div className="relative max-w-sm mx-auto h-48 rounded-2xl overflow-hidden border-2 border-[#E6DCCF] shadow-md bg-stone-900 flex items-center justify-center">
            <img
              src={previewImage}
              alt="Scanned Card"
              className="w-full h-full object-cover opacity-90"
            />

            {/* Scanning Laser Beam */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FE932C] to-transparent shadow-[0_0_15px_#FE932C] animate-pulse top-1/2 -translate-y-1/2" />
            )}

            {isScanning && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-300" />
                <span className="text-xs font-black tracking-wider">AI टेक्स्ट निकाल रहा है (Extracting OCR)...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFF1EB] text-[#9D3E1B] mx-auto flex items-center justify-center shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-base text-[#221A16]">
                पहचान पत्र का फोटो खींचें या अपलोड करें
              </h3>
              <p className="text-xs text-[#56423C] font-semibold max-w-md mx-auto">
                वस्त्र मंत्रालय का पहचान पत्र (Ministry of Textiles Pehchan Card) या आधार कार्ड
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>कैमरा खोलें (Open Camera)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-3 rounded-2xl bg-white border border-[#E6DCCF] text-[#56423C] hover:bg-[#FFF8F6] font-bold text-xs sm:text-sm shadow-xs transition"
              >
                <Upload className="w-4 h-4 inline mr-1.5" />
                गैलरी से चुनें (Upload)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Data Card */}
      {isDone && extractedData && (
        <div className="bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-3xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#006B2F]">
              <CheckCircle2 className="w-5 h-5 fill-current text-[#006B2F]" />
              <span className="font-black text-sm sm:text-base">
                कार्ड सफलतापूर्वक पहचाना गया (OCR Verified)
              </span>
            </div>

            <button
              type="button"
              onClick={toggleVoiceReadback}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#86EFAC] text-[#006B2F] hover:bg-[#DCFCE7] font-bold text-xs flex items-center gap-1.5 transition"
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" /> <span>रोकें (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" /> <span>आवाज़ में सुनें (Listen)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#BBF7D0]">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase">शिल्पकार का नाम (Artisan Name)</span>
              <div className="font-black text-sm text-[#221A16]">{extractedData.fullName}</div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase">पहचान संख्या (Pehchan ID)</span>
              <div className="font-black text-sm text-[#9D3E1B] font-mono">{extractedData.pehchanId}</div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase">शिल्प विधा (Craft Specialty)</span>
              <div className="font-black text-sm text-[#221A16]">{extractedData.craftType}</div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase">क्लस्टर / जिला (Village Cluster)</span>
              <div className="font-black text-sm text-[#221A16]">
                {extractedData.district}, {extractedData.state}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmAndApply}
            className="w-full py-3.5 rounded-2xl bg-[#006B2F] hover:bg-[#005224] text-white font-black text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>यह विवरण लागू करें एवं आगे बढ़ें (Apply & Continue)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
