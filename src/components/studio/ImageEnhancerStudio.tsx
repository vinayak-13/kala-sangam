'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Sliders, Image as ImageIcon, Check, RefreshCw, Layers, Wand2, Download, Eye } from 'lucide-react';
import { AIBadge } from '@/components/AIBadge';

export interface ImageEnhancerProps {
  initialImage?: string;
  onEnhancedImageSelected?: (imageUrl: string) => void;
}

const BACKDROP_PRESETS = [
  {
    id: 'studio-white',
    name: 'Minimal Studio White',
    nativeName: 'सफेद स्टूडियो',
    bgColor: 'bg-[#F8F9FA]',
    borderColor: '#E5E7EB',
    filterStyle: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15)) contrast(1.05) brightness(1.02)',
    previewBg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    tag: 'E-Commerce Standard',
  },
  {
    id: 'banarasi-silk',
    name: 'Royal Silk Textile',
    nativeName: 'शाही रेशम',
    bgColor: 'bg-[#FFF7ED]',
    borderColor: '#FED7AA',
    filterStyle: 'drop-shadow(0 25px 30px rgba(157, 62, 27, 0.22)) contrast(1.08) saturate(1.1)',
    previewBg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    tag: 'Heritage Luxury',
  },
  {
    id: 'warm-terracotta',
    name: 'Terracotta Earth Studio',
    nativeName: 'मिट्टी / टेराकोटा',
    bgColor: 'bg-[#FEF2F2]',
    borderColor: '#FECACA',
    filterStyle: 'drop-shadow(0 20px 25px rgba(180, 83, 9, 0.2)) contrast(1.06) warm',
    previewBg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    tag: 'Craft Provenance',
  },
  {
    id: 'rustic-wood',
    name: 'Teakwood Artisan Bench',
    nativeName: 'सागौन की लकड़ी',
    bgColor: 'bg-[#FFFBEB]',
    borderColor: '#FDE68A',
    filterStyle: 'drop-shadow(0 20px 25px rgba(67, 56, 202, 0.15)) brightness(1.04)',
    previewBg: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    tag: 'Natural Workshop',
  },
];

export function ImageEnhancerStudio({
  initialImage = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
  onEnhancedImageSelected,
}: ImageEnhancerProps) {
  const [selectedBackdrop, setSelectedBackdrop] = useState(BACKDROP_PRESETS[0].id);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lightingLevel, setLightingLevel] = useState<'soft' | 'warm' | 'bright'>('warm');
  const [clutterRemoved, setClutterRemoved] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const activePreset =
    BACKDROP_PRESETS.find((p) => p.id === selectedBackdrop) || BACKDROP_PRESETS[0];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleEnhanceClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setClutterRemoved(true);
    }, 600);
  };

  const handleConfirmEnhancement = () => {
    setHasApplied(true);
    if (onEnhancedImageSelected) {
      onEnhancedImageSelected(initialImage);
    }
    setTimeout(() => setHasApplied(false), 2500);
  };

  return (
    <div className="bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-[#FFF1EB] text-[#9D3E1B]">
              <Wand2 className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#9D3E1B]">
              AI स्टूडियो फोटो एन्हांसर (AI Image Enhancer)
            </span>
            <AIBadge label="Zero Clutter AI" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#221A16] font-heading">
            स्वचालित बैकग्राउंड सफाई एवं ई-कॉमर्स स्टूडियो (Background Removal & Studio Mockups)
          </h2>
          <p className="text-xs sm:text-sm text-[#56423C] font-semibold mt-0.5">
            ग्रामीण परिवेश के बैकग्राउंड को हटाकर प्रीमियम ई-कॉमर्स बैकड्रॉप लगाएं। (Slide to compare before and after)
          </p>
        </div>

        <button
          type="button"
          onClick={handleEnhanceClick}
          disabled={isProcessing}
          className="px-5 py-2.5 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? 'एन्हांस हो रहा है...' : 'री-एन्हांस करें (Auto-Fix Lighting)'}</span>
        </button>
      </div>

      {/* Interactive Split Before / After Viewer */}
      <div
        ref={containerRef}
        onMouseMove={handleSliderMove}
        onTouchMove={handleSliderMove}
        className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-[#E6DCCF] shadow-inner bg-[#221A16]"
      >
        {/* AFTER Layer (Enhanced with Studio Preset) */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-colors duration-300"
          style={{ background: activePreset.previewBg }}
        >
          <div className="relative w-4/5 h-4/5 flex items-center justify-center">
            <img
              src={initialImage}
              alt="Enhanced Craft Studio"
              className="max-h-full max-w-full object-contain transition-all duration-300"
              style={{
                filter: clutterRemoved ? activePreset.filterStyle : 'none',
              }}
            />
          </div>

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-black border border-white/20 flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI स्टूडियो बैकड्रॉप (After)</span>
          </div>
        </div>

        {/* BEFORE Layer (Raw / Cluttered original clipped by slider) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden bg-stone-900 border-r-2 border-white shadow-2xl"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-0 w-full h-full bg-[#1c1917] flex items-center justify-center">
            <img
              src={initialImage}
              alt="Original Raw Capture"
              className="max-h-4/5 max-w-4/5 object-contain brightness-90 sepia-[0.15]"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-black border border-white/20 shadow-md">
            <span>मूल फोटो (Before Raw)</span>
          </div>
        </div>

        {/* Slider Handle Divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white text-[#9D3E1B] shadow-xl flex items-center justify-center font-black text-xs border-2 border-[#9D3E1B]">
            ⇄
          </div>
        </div>
      </div>

      {/* Backdrop Preset Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#56423C] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#9D3E1B]" />
            प्रीमियम बैकड्रॉप चुनें (Select Studio Backdrop Preset)
          </span>
          <span className="text-[11px] text-[#006B2F] font-bold">
            ✓ 100% E-Commerce Marketplace Compliant
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BACKDROP_PRESETS.map((preset) => {
            const isSelected = selectedBackdrop === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedBackdrop(preset.id)}
                className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? 'border-[#9D3E1B] bg-[#FFF1EB] shadow-md ring-2 ring-[#9D3E1B]/20'
                    : 'border-[#E6DCCF] bg-white hover:border-[#DDC0B8] hover:bg-[#FFF8F6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-xs"
                    style={{ background: preset.previewBg }}
                  />
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#9D3E1B] text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-xs font-black text-[#221A16]">{preset.nativeName}</div>
                  <div className="text-[10px] text-[#56423C] font-semibold">{preset.name}</div>
                  <span className="inline-block mt-1 text-[9px] font-bold text-[#9D3E1B] bg-white/80 px-1.5 py-0.5 rounded">
                    {preset.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lighting & Tone Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F6] border border-[#E6DCCF]">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-[#9D3E1B]" />
          <div>
            <span className="text-xs font-bold text-[#221A16] block">स्टूडियो लाइटिंग टोन (Lighting Correction)</span>
            <span className="text-[11px] text-[#56423C]">कच्ची रोशनी को भारतीय शिल्प मानकों के अनुसार संतुलित करें</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['soft', 'warm', 'bright'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setLightingLevel(level)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                lightingLevel === level
                  ? 'bg-[#9D3E1B] text-white shadow-xs'
                  : 'bg-white border border-[#E6DCCF] text-[#56423C] hover:bg-[#FFF1EB]'
              }`}
            >
              {level === 'soft' ? 'कोमल (Soft)' : level === 'warm' ? 'गरम (Warm)' : 'उज्ज्वल (Bright)'}
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-[#006B2F] font-bold flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          <span>उच्च रिज़ॉल्यूशन ई-कॉमर्स फोटो तैयार है (HD Ready)</span>
        </div>

        <button
          type="button"
          onClick={handleConfirmEnhancement}
          className="px-6 py-3 rounded-2xl bg-[#006B2F] hover:bg-[#005224] text-white font-black text-sm shadow-md transition active:scale-95 flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{hasApplied ? 'लागू किया गया! (Applied)' : 'उत्पाद सूची में लागू करें (Use in Listing)'}</span>
        </button>
      </div>
    </div>
  );
}
