'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Square, Sparkles } from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { getPageVoiceScript, ALL_INDIC_LANGUAGES } from '@/lib/i18n/indic-languages';

interface VoiceGuideButtonProps {
  pageKey: string;
  locale?: string;
  customText?: string;
  className?: string;
  label?: string;
}

export function VoiceGuideButton({
  pageKey,
  locale: propLocale,
  customText,
  className = '',
  label,
}: VoiceGuideButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLocale, setActiveLocale] = useState('hi');

  useEffect(() => {
    if (propLocale) {
      setActiveLocale(propLocale);
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kala_preferred_language') || 'hi';
      setActiveLocale(saved);
    }

    const handleLocaleChange = () => {
      const saved = localStorage.getItem('kala_preferred_language') || 'hi';
      setActiveLocale(saved);
    };

    window.addEventListener('storage', handleLocaleChange);
    window.addEventListener('kala_language_changed', handleLocaleChange);

    return () => {
      window.removeEventListener('storage', handleLocaleChange);
      window.removeEventListener('kala_language_changed', handleLocaleChange);
      stopAllAudio();
    };
  }, [propLocale]);

  const toggleVoiceGuide = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      playUiBeep('stop');
      return;
    }

    const textToSpeak = customText || getPageVoiceScript(pageKey, activeLocale);
    if (!textToSpeak) return;

    setIsPlaying(true);
    playTanpuraChime(1.5);
    speakText(textToSpeak, activeLocale, () => {
      setIsPlaying(false);
    });
  };

  const currentLangObj =
    ALL_INDIC_LANGUAGES.find((l) => l.code === activeLocale) || ALL_INDIC_LANGUAGES[0];

  return (
    <button
      type="button"
      onClick={toggleVoiceGuide}
      aria-label="Play Voice Guide"
      className={`artisan-touch-target inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-200 active:scale-95 shadow-xs font-bold text-xs ${
        isPlaying
          ? 'bg-[#221A16] text-white border-[#221A16] shadow-md animate-pulse ring-2 ring-[#9D3E1B]'
          : 'bg-[#FFF1EB] hover:bg-[#F5E5DE] text-[#904D00] border-[#DDC0B8]'
      } ${className}`}
      title={isPlaying ? 'रोकें / Stop Guide' : `आवाज़ में सुनें (${currentLangObj.nativeName})`}
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current text-white" />
          <span>रोकें (Stop Audio)</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-[#FE932C]" />
          <span>{label || `बोलकर समझें (${currentLangObj.nativeName})`}</span>
        </>
      )}
    </button>
  );
}
