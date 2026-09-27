'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Camera,
  MapPin,
  Palette,
  Phone,
  Globe,
  Volume2,
  Square,
  ShieldCheck,
  Mic,
  MessageSquare,
  Languages,
} from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { ALL_INDIC_LANGUAGES, getOnboardingI18n } from '@/lib/i18n/indic-languages';

export default function ArtisanOnboardingPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSpeechSimulating, setIsSpeechSimulating] = useState(false);

  // Form State (3 Questions)
  const [formData, setFormData] = useState({
    fullName: 'सुनील वाघ (Sunil Wagh)',
    handle: 'sunil_warli_palghar',
    avatarUrl: '',
    craftType: 'पारंपरिक वारली चित्रकला (Warli Painting)',
    craftDescription:
      'हम प्राकृतिक गेरू लाल मिट्टी और चावल के लेप से बांस की तीली द्वारा सदियों पुरानी वारली लोक चित्रकला बनाते हैं। इसमें तारपा नृत्य और ग्रामीण उत्सवों की सजीव आकृतियाँ उकेरी जाती हैं।',
    district: 'पालघर (Palghar)',
    state: 'महाराष्ट्र (Maharashtra)',
    preferredLocale: 'hi',
    phone: '9876543210',
  });

  const router = useRouter();
  const i18n = getOnboardingI18n(formData.preferredLocale);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const toggleStepAudio = (text: string, locale: string) => {
    if (isPlayingVoice) {
      stopAllAudio();
      setIsPlayingVoice(false);
      playUiBeep('stop');
      return;
    }

    setIsPlayingVoice(true);
    playTanpuraChime(1.5);
    speakText(text, locale, () => {
      setIsPlayingVoice(false);
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({ ...prev, avatarUrl: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeechToTextBio = () => {
    setIsSpeechSimulating(true);
    playTanpuraChime(1.0);
    setTimeout(() => {
      setIsSpeechSimulating(false);
      setFormData((prev) => ({
        ...prev,
        craftDescription:
          prev.craftDescription ||
          'हम प्राकृतिक रंगों एवं पर्यावरण-अनुकूल स्थानीय सामग्री से हस्तशिल्प तैयार करते हैं, जो हमारी प्राचीन सांस्कृतिक विरासत का प्रतीक है।',
      }));
    }, 1500);
  };

  const handleFinishOnboarding = () => {
    setIsCreating(true);
    stopAllAudio();
    playTanpuraChime(2.0);

    // Persist artisan profile in localStorage for instant access across studio and profile
    if (typeof window !== 'undefined') {
      localStorage.setItem('kala_artisan_profile', JSON.stringify(formData));
    }

    setTimeout(() => {
      router.push(`/studio/${formData.handle || 'sunil-warli-palghar'}`);
    }, 900);
  };

  const currentLangObj =
    ALL_INDIC_LANGUAGES.find((l) => l.code === formData.preferredLocale) || ALL_INDIC_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col justify-between p-4 sm:p-6 max-w-xl mx-auto">
      {/* ── TOP HEADER & MULTILINGUAL SWITCHER ──────────────────────────── */}
      <header className="pb-4 border-b border-[#E4DACE] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#C05A34] to-rose-600 text-white flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-lg text-[#22201D] flex items-center gap-1.5">
                <span>{i18n.headerTitle}</span>
              </h1>
              <p className="text-xs text-stone-500 font-medium">{i18n.headerSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-white px-3 py-1.5 rounded-full border border-stone-200">
            <span>{i18n.stepCount} {currentStep}</span>
            <span>/ 3</span>
          </div>
        </div>

        {/* ── 22+ INDIC LANGUAGE BAR (ACCESSIBLE PAN-INDIA SWITCHER) ───────── */}
        <div className="flex items-center justify-between bg-white border border-[#E4DACE] rounded-2xl px-3 py-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C05A34]" />
            <span className="text-xs font-bold text-stone-700">भाषा / Language:</span>
            <span className="text-xs font-black text-[#C05A34] bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              {currentLangObj.nativeName} ({currentLangObj.name})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#FAF5EF] hover:bg-stone-200 text-stone-800 flex items-center gap-1 border border-stone-200 transition"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isLangMenuOpen ? 'बंद करें (Close)' : 'बदलें (Change)'}</span>
          </button>
        </div>

        {/* Language Selection Grid Dropdown */}
        {isLangMenuOpen && (
          <div className="bg-white border-2 border-[#C05A34] rounded-2xl p-3 shadow-lg max-h-56 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-in fade-in duration-200">
            {ALL_INDIC_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  stopAllAudio();
                  setFormData((prev) => ({ ...prev, preferredLocale: lang.code }));
                  setIsLangMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                  formData.preferredLocale === lang.code
                    ? 'bg-[#C05A34] text-white shadow-xs'
                    : 'hover:bg-[#FAF5EF] text-stone-800'
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className="text-[10px] opacity-75 font-normal">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── PROGRESS BAR ────────────────────────────────────────────────── */}
      <div className="w-full bg-stone-200 h-1.5 rounded-full my-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-500 to-[#C05A34] h-full transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      {/* ── QUESTION 1: NAME, HANDLE & AVATAR ───────────────────────────── */}
      {currentStep === 1 && (
        <main className="my-auto space-y-5 py-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#C05A34] uppercase tracking-wider">
                {i18n.stepCount} 1 / Question 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#22201D] font-heading">
                {i18n.q1Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                {i18n.q1Sub}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleStepAudio(i18n.q1ListenText, formData.preferredLocale)}
              className={`artisan-touch-target px-3.5 py-2 rounded-2xl border flex items-center gap-1.5 shrink-0 ${
                isPlayingVoice
                  ? 'bg-stone-900 border-stone-900 text-white animate-pulse'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {isPlayingVoice ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4 text-[#C05A34]" />}
              <span className="text-xs font-bold">{isPlayingVoice ? 'रोकें (Stop)' : 'सुनें (Listen)'}</span>
            </button>
          </div>

          {/* Avatar Upload / Preview */}
          <div className="flex flex-col items-center justify-center gap-2 py-1">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#C05A34] bg-[#FAF5EF] flex items-center justify-center text-3xl font-black text-[#C05A34] shadow-md">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  formData.fullName.slice(0, 1) || 'क'
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#C05A34] hover:bg-[#9A4526] text-white flex items-center justify-center shadow-lg cursor-pointer transition active:scale-90">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <span className="text-xs text-stone-500 font-medium">{i18n.photoLabel}</span>
          </div>

          {/* Full Name & Handle Inputs */}
          <div className="space-y-3.5 bg-white border-2 border-[#E4DACE] rounded-3xl p-5 shadow-sm">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 block">
                {i18n.nameLabel}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullName: e.target.value,
                    handle: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20) || 'artisan',
                  })
                }
                placeholder={i18n.namePlaceholder}
                className="w-full font-bold text-base text-[#22201D] bg-[#FAF5EF] p-3 rounded-2xl border border-stone-300 focus:border-[#C05A34] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 block">
                {i18n.handleLabel}
              </label>
              <div className="flex items-center bg-[#FAF5EF] rounded-2xl border border-stone-300 px-3 py-2.5 focus-within:border-[#C05A34]">
                <span className="text-sm font-black text-[#C05A34] mr-1">@</span>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  className="w-full font-bold text-sm bg-transparent outline-none text-[#22201D]"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopAllAudio();
              setIsPlayingVoice(false);
              setCurrentStep(2);
            }}
            className="artisan-action-btn w-full rounded-2xl bg-[#C05A34] hover:bg-[#9A4526] text-white font-black text-lg shadow-md flex items-center justify-center gap-2"
          >
            <span>{i18n.nextBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </main>
      )}

      {/* ── QUESTION 2: UNLIMITED CUSTOM CRAFT DESCRIPTION & LOCATION ───── */}
      {currentStep === 2 && (
        <main className="my-auto space-y-5 py-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#C05A34] uppercase tracking-wider">
                {i18n.stepCount} 2 / Question 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#22201D] font-heading">
                {i18n.q2Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                {i18n.q2Sub}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleStepAudio(i18n.q2ListenText, formData.preferredLocale)}
              className={`artisan-touch-target px-3.5 py-2 rounded-2xl border flex items-center gap-1.5 shrink-0 ${
                isPlayingVoice
                  ? 'bg-stone-900 border-stone-900 text-white animate-pulse'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {isPlayingVoice ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4 text-[#C05A34]" />}
              <span className="text-xs font-bold">{isPlayingVoice ? 'रोकें (Stop)' : 'सुनें (Listen)'}</span>
            </button>
          </div>

          {/* Full Custom Craft Description & Story Area (Replaced rigid options) */}
          <div className="space-y-4 bg-white border-2 border-[#E4DACE] rounded-3xl p-5 shadow-sm">
            {/* Craft Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#C05A34]" />
                <span>{i18n.craftNameLabel}</span>
              </label>
              <input
                type="text"
                value={formData.craftType}
                onChange={(e) => setFormData({ ...formData, craftType: e.target.value })}
                placeholder={i18n.craftNamePlaceholder}
                className="w-full font-bold text-sm text-[#22201D] bg-[#FAF5EF] p-3 rounded-2xl border border-stone-300 focus:border-[#C05A34] outline-none"
              />
            </div>

            {/* Open Multi-line Craft Story & Materials Textbox */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 block flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#C05A34]" />
                  <span>{i18n.craftDescLabel}</span>
                </label>

                {/* Voice Assist Button */}
                <button
                  type="button"
                  onClick={handleSpeechToTextBio}
                  className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1 border border-amber-300 active:scale-95 transition"
                >
                  <Mic className="w-3 h-3 text-[#C05A34]" />
                  <span>{isSpeechSimulating ? 'सुन रहे हैं...' : 'बोलकर लिखें (Voice Typing)'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={formData.craftDescription}
                onChange={(e) => setFormData({ ...formData, craftDescription: e.target.value })}
                placeholder={i18n.craftDescPlaceholder}
                className="w-full font-medium text-xs sm:text-sm text-[#22201D] bg-[#FAF5EF] p-3.5 rounded-2xl border border-stone-300 focus:border-[#C05A34] outline-none leading-relaxed resize-none"
              />
              <p className="text-[11px] text-stone-500 font-medium">
                {i18n.craftDescHint}
              </p>
            </div>

            {/* District & State */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C05A34]" /> {i18n.districtLabel}
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full font-bold text-sm text-[#22201D] bg-[#FAF5EF] p-2.5 rounded-xl border border-stone-300 focus:border-[#C05A34] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">
                  {i18n.stateLabel}
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full font-bold text-sm text-[#22201D] bg-[#FAF5EF] p-2.5 rounded-xl border border-stone-300 focus:border-[#C05A34] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                stopAllAudio();
                setIsPlayingVoice(false);
                setCurrentStep(1);
              }}
              className="artisan-action-btn flex-1 rounded-2xl border border-stone-300 bg-white font-bold flex items-center justify-center gap-1.5 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {i18n.backBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                stopAllAudio();
                setIsPlayingVoice(false);
                setCurrentStep(3);
              }}
              className="artisan-action-btn flex-1 rounded-2xl bg-[#C05A34] hover:bg-[#9A4526] text-white font-bold flex items-center justify-center gap-1.5 text-sm shadow-md"
            >
              {i18n.nextBtn} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      )}

      {/* ── QUESTION 3: MOTHER TONGUE & MOBILE PHONE ────────────────────── */}
      {currentStep === 3 && (
        <main className="my-auto space-y-5 py-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#C05A34] uppercase tracking-wider">
                {i18n.stepCount} 3 / Question 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#22201D] font-heading">
                {i18n.q3Title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                {i18n.q3Sub}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleStepAudio(i18n.q3ListenText, formData.preferredLocale)}
              className={`artisan-touch-target px-3.5 py-2 rounded-2xl border flex items-center gap-1.5 shrink-0 ${
                isPlayingVoice
                  ? 'bg-stone-900 border-stone-900 text-white animate-pulse'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {isPlayingVoice ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4 text-[#C05A34]" />}
              <span className="text-xs font-bold">{isPlayingVoice ? 'रोकें (Stop)' : 'सुनें (Listen)'}</span>
            </button>
          </div>

          {/* Language Selection Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#C05A34]" /> {i18n.languageLabel}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto scrollbar-thin">
              {ALL_INDIC_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredLocale: lang.code })}
                  className={`p-2.5 rounded-2xl border text-left text-xs font-bold transition active:scale-95 flex items-center justify-between ${
                    formData.preferredLocale === lang.code
                      ? 'bg-[#C05A34] text-white border-[#C05A34] shadow-xs'
                      : 'bg-white hover:bg-[#FAF5EF] border-[#E4DACE] text-stone-800'
                  }`}
                >
                  <div>
                    <span className="block">{lang.nativeName}</span>
                    <span className="text-[10px] opacity-75 font-normal">{lang.name}</span>
                  </div>
                  {formData.preferredLocale === lang.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Phone Input */}
          <div className="space-y-1.5 bg-white border-2 border-[#E4DACE] rounded-3xl p-5 shadow-sm">
            <label className="text-xs font-bold text-stone-600 block flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#C05A34]" /> {i18n.phoneLabel}
            </label>
            <div className="flex items-center bg-[#FAF5EF] rounded-2xl border border-stone-300 px-3.5 py-3 focus-within:border-[#C05A34]">
              <span className="text-sm font-bold text-stone-500 mr-2">+91</span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                placeholder="10 digit phone number"
                className="w-full font-bold text-base bg-transparent outline-none text-[#22201D]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                stopAllAudio();
                setIsPlayingVoice(false);
                setCurrentStep(2);
              }}
              className="artisan-action-btn flex-1 rounded-2xl border border-stone-300 bg-white font-bold flex items-center justify-center gap-1.5 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {i18n.backBtn}
            </button>
            <button
              type="button"
              onClick={handleFinishOnboarding}
              disabled={isCreating}
              className="artisan-action-btn flex-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-black flex items-center justify-center gap-2 text-base shadow-lg transition active:scale-95"
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              <span>{isCreating ? i18n.creatingBtn : i18n.submitBtn}</span>
            </button>
          </div>
        </main>
      )}

      <footer className="pt-4 border-t border-[#E4DACE] text-center text-xs text-stone-500">
        KALA-SANGAM · Instagram-Style Simple Artisan Creator Portal · 22+ Indic Languages
      </footer>
    </div>
  );
}
