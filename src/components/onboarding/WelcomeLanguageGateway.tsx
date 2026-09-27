'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Volume2,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Square,
  X,
} from 'lucide-react';
import {
  ALL_INDIC_LANGUAGES,
  getNativeSampleGreeting,
  IndicLanguage,
} from '@/lib/i18n/indic-languages';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';

interface WelcomeLanguageGatewayProps {
  onComplete: (selectedLocale: string) => void;
  isModal?: boolean;
  onClose?: () => void;
  initialLocale?: string;
}

export function WelcomeLanguageGateway({
  onComplete,
  isModal = false,
  onClose,
  initialLocale = 'hi',
}: WelcomeLanguageGatewayProps) {
  const [selectedLocale, setSelectedLocale] = useState(initialLocale);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kala_preferred_language');
      if (saved) {
        setSelectedLocale(saved);
      }
    }
  }, []);

  const filteredLanguages = ALL_INDIC_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleScreenGuide = () => {
    if (isSpeakingGuide) {
      stopAllAudio();
      setIsSpeakingGuide(false);
      playUiBeep('stop');
      return;
    }

    const currentLang = ALL_INDIC_LANGUAGES.find((l) => l.code === selectedLocale) || ALL_INDIC_LANGUAGES[0];
    const guideText = `${currentLang.nativeName} में कला-संगम में आपका स्वागत है। कृपया अपनी मातृभाषा चुनें और नीचे दिए गए बटन पर पुष्टि करें।`;

    setIsSpeakingGuide(true);
    playTanpuraChime(1.5);
    speakText(guideText, selectedLocale, () => {
      setIsSpeakingGuide(false);
    });
  };

  const handleSelectLanguage = (lang: IndicLanguage) => {
    stopAllAudio();
    setSelectedLocale(lang.code);
    playTanpuraChime(1.2);
    speakText(getNativeSampleGreeting(lang.code), lang.code);
  };

  const handleConfirm = () => {
    stopAllAudio();
    playUiBeep('start');
    if (typeof window !== 'undefined') {
      localStorage.setItem('kala_preferred_language', selectedLocale);
      window.dispatchEvent(new Event('kala_language_changed'));
    }
    onComplete(selectedLocale);
  };

  const activeLangObj =
    ALL_INDIC_LANGUAGES.find((l) => l.code === selectedLocale) || ALL_INDIC_LANGUAGES[0];

  return (
    <div
      className={
        isModal
          ? 'fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200'
          : 'min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col justify-between selection:bg-[#9D3E1B]/20 p-4 sm:p-6 md:p-8'
      }
    >
      <div
        className={
          isModal
            ? 'relative w-full max-w-4xl bg-[#FFF8F6] border-2 border-[#9D3E1B] rounded-3xl shadow-2xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 flex flex-col'
            : 'max-w-5xl mx-auto w-full space-y-6'
        }
      >
        {/* ── HEADER & TRUST CHIP ────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1EB] text-[#9D3E1B] text-xs font-black uppercase tracking-wider border border-[#DDC0B8]">
              <Globe className="w-3.5 h-3.5" />
              <span>मातृभाषा चयन · Select Your Mother Tongue</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#221A16] font-heading tracking-tight">
              अपनी भाषा चुनें / Choose Your Language
            </h1>
            <p className="text-xs sm:text-sm text-[#56423C] font-medium leading-relaxed">
              भारत के किसी भी राज्य की अपनी बोली चुनें। पूरा कैटलॉग और आवाज़ आपकी भाषा और अंग्रेजी दोनों में दिखेगा।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Guide Toggle */}
            <button
              type="button"
              onClick={toggleScreenGuide}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                isSpeakingGuide
                  ? 'bg-[#221A16] text-white border-[#221A16] shadow-md animate-pulse'
                  : 'bg-[#FFF1EB] hover:bg-[#F5E5DE] text-[#904D00] border-[#DDC0B8]'
              }`}
              title="निर्देश बोलकर समझें"
            >
              {isSpeakingGuide ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current text-white" />
                  <span>रोकें (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#FE932C]" />
                  <span>निर्देश सुनें</span>
                </>
              )}
            </button>

            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white hover:bg-[#FFF1EB] text-[#56423C] flex items-center justify-center border border-[#DDC0B8] shadow-xs transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ── SEARCH BAR ─────────────────────────────────────────────────── */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#56423C] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="भाषा खोजें (e.g. Hindi, Marathi, Telugu, தமிழ், বাংলা, ગુજરાતી, Kannada...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#DDC0B8] bg-white text-sm sm:text-base text-[#221A16] focus:border-[#9D3E1B] focus:ring-2 focus:ring-[#9D3E1B]/20 outline-none shadow-xs font-semibold"
          />
        </div>

        {/* ── 22+ LANGUAGES INTERACTIVE GRID ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLocale === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => handleSelectLanguage(lang)}
                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[120px] active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#9D3E1B] bg-[#FFF1EB] shadow-md ring-2 ring-[#9D3E1B]/30'
                    : 'border-[#E6DCCF] bg-white hover:border-[#9D3E1B]/60 hover:bg-[#FFF1EB]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-xl sm:text-2xl font-black block leading-tight ${
                        isSelected ? 'text-[#9D3E1B]' : 'text-[#221A16]'
                      }`}
                    >
                      {lang.nativeName}
                    </span>
                    <span className="text-xs font-bold text-[#9D3E1B]">{lang.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      stopAllAudio();
                      playTanpuraChime(1.5);
                      speakText(getNativeSampleGreeting(lang.code), lang.code);
                    }}
                    className="w-9 h-9 rounded-full bg-white hover:bg-[#FFDCC3] border border-[#DDC0B8] flex items-center justify-center text-[#904D00] shadow-xs transition active:scale-90"
                    title={`आवाज़ सुनें (${lang.nativeName})`}
                  >
                    <Volume2 className="w-4 h-4 text-[#FE932C]" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#56423C] pt-2 border-t border-[#E6DCCF]/50">
                  <span className="truncate text-[11px]">{lang.region}</span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#9D3E1B] text-white shadow-xs' : 'bg-[#F5E5DE]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SELECTED LANGUAGE BANNER & CONFIRM BUTTON ────────────────────── */}
        <div className="bg-[#FFF1EB] border-2 border-[#DDC0B8] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#9D3E1B] text-white flex items-center justify-center font-black text-xl shadow-xs">
              {activeLangObj.nativeName.slice(0, 1)}
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#9D3E1B] block">
                चयनित भाषा (Selected Language)
              </span>
              <h4 className="font-black text-base sm:text-lg text-[#221A16] leading-tight">
                {activeLangObj.nativeName} ({activeLangObj.name})
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-3 transition active:scale-95 border-2 border-[#FFF8F6]"
          >
            <span>पुष्टि करें और आगे बढ़ें (Confirm & Continue)</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
