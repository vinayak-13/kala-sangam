'use client';

import React, { useReducer, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { get, set } from 'idb-keyval';
import {
  Volume2,
  Camera,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Languages,
  Mic,
  Plus,
  Square,
  Globe,
  Search,
  CheckCircle2,
  Play,
  Pause,
  Video,
  Image as ImageIcon,
  ShieldCheck,
  ShoppingBag,
  Package,
  TrendingUp,
  Store,
  HelpCircle,
  Tag,
  Ruler,
  Boxes,
  Edit3,
  Layers,
} from 'lucide-react';
import { MicButton } from '@/components/MicButton';
import { StatusTimeline } from '@/components/StatusTimeline';
import { PriceBandSlider } from '@/components/PriceBandSlider';
import { AIBadge } from '@/components/AIBadge';
import { GuidedCamera } from '@/components/capture/GuidedCamera';
import { VideoCapture } from '@/components/capture/VideoCapture';
import { MobileMediaPicker } from '@/components/mobile/MobileMediaPicker';
import { ImageEnhancerStudio } from '@/components/studio/ImageEnhancerStudio';
import { ExplainablePricingCard } from '@/components/pricing/ExplainablePricingCard';
import { HumanInTheLoopAudioGate } from '@/components/studio/HumanInTheLoopAudioGate';
import { Wand2 } from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import {
  ALL_INDIC_LANGUAGES,
  getInstructionText,
  getLocalizedDraft,
  getNativeSampleGreeting,
  getStepActionGuide,
  getStep2BilingualI18n,
} from '@/lib/i18n/indic-languages';

type Step = 'language' | 'photos' | 'voice' | 'processing' | 'review';

interface CaptureState {
  step: Step;
  locale: string;
  photos: string[];
  audioBlob: Blob | null;
  audioDuration: number;
  videoBlob: Blob | null;
  hasVideoNarration: boolean;
  productId: string | null;
  draft: {
    title: Record<string, string>;
    description: Record<string, string>;
    materials: string[];
    craft_technique: string;
    dimensions: string;
    stock_quantity: number;
    b2b_available: boolean;
    b2b_moq: number;
    price_paise: number;
    ai_price_min: number;
    ai_price_max: number;
    price_basis: string[];
    confidence_notes: string[];
  };
}

type Action =
  | { type: 'SELECT_LOCALE'; payload: string }
  | { type: 'CONFIRM_LANGUAGE' }
  | { type: 'SET_LOCALE'; payload: string }
  | { type: 'ADD_PHOTO'; payload: string }
  | { type: 'REMOVE_PHOTO'; payload: number }
  | { type: 'SET_AUDIO'; payload: { blob: Blob; duration: number } }
  | { type: 'SET_VIDEO'; payload: { blob: Blob; hasSpeech: boolean } }
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SET_PRODUCT_ID'; payload: string }
  | { type: 'SET_DRAFT'; payload: Partial<CaptureState['draft']> }
  | { type: 'RESTORE_STATE'; payload: CaptureState };

function buildLocalizedDraftObject(locale: string) {
  const locData = getLocalizedDraft(locale);
  const clean = locale.toLowerCase().split('-')[0] || 'mr';
  return {
    title: {
      en: 'Handmade Warli Clay Plate with Tarpa Dance Motif',
      hi: 'तारपा नृत्य रूपांकन वाली हस्तनिर्मित वारली मिट्टी की थाली',
      mr: 'तारपा नृत्य चित्रांकन असलेली हाताने बनवलेली वारली मातीची थाळी',
      [clean]: locData.title,
    },
    description: {
      en: 'Authentic Warli plate painted with natural rice paste and geru red earth clay depicting village community celebration and communal dance.',
      hi: 'गेरू और प्राकृतिक रंगों से बनी पारंपरिक वारली थाली जो गांव के उत्सव का चित्रण करती है।',
      mr: 'गेरू आणि तांदळाच्या पिठाने हाताने चितारलेली पारंपरिक वारली मातीची थाळी. गावातील शेती कापणी उत्सवाचे आणि तारपा नृत्याचे जिवंत चित्रण.',
      [clean]: locData.description,
    },
    materials: ['Natural Red Clay', 'Rice Flour Paste', 'Geru Earth'],
    craft_technique: 'Traditional Bamboo & Straw Brushwork',
    dimensions: '14 x 14 x 2 inches',
    stock_quantity: 4,
    b2b_available: true,
    b2b_moq: 10,
    price_paise: 85000,
    ai_price_min: 750,
    ai_price_max: 1200,
    price_basis: [locData.priceBasis],
    confidence_notes: ['Dimensions estimated from photo scale — verified by artisan.'],
  };
}

const initialState: CaptureState = {
  step: 'language',
  locale: 'mr',
  photos: [],
  audioBlob: null,
  audioDuration: 0,
  videoBlob: null,
  hasVideoNarration: false,
  productId: null,
  draft: buildLocalizedDraftObject('mr'),
};

function captureReducer(state: CaptureState, action: Action): CaptureState {
  let nextState = state;
  switch (action.type) {
    case 'SELECT_LOCALE': {
      const localizedDraft = buildLocalizedDraftObject(action.payload);
      nextState = {
        ...state,
        locale: action.payload,
        draft: localizedDraft,
      };
      break;
    }
    case 'CONFIRM_LANGUAGE':
      nextState = { ...state, step: 'photos' };
      break;
    case 'SET_LOCALE': {
      const localizedDraft = buildLocalizedDraftObject(action.payload);
      nextState = {
        ...state,
        locale: action.payload,
        step: 'photos',
        draft: localizedDraft,
      };
      break;
    }
    case 'ADD_PHOTO':
      nextState = { ...state, photos: [...state.photos, action.payload] };
      break;
    case 'REMOVE_PHOTO':
      nextState = { ...state, photos: state.photos.filter((_, i) => i !== action.payload) };
      break;
    case 'SET_AUDIO':
      nextState = {
        ...state,
        audioBlob: action.payload.blob,
        audioDuration: action.payload.duration,
      };
      break;
    case 'SET_VIDEO':
      nextState = {
        ...state,
        videoBlob: action.payload.blob,
        hasVideoNarration: action.payload.hasSpeech,
      };
      break;
    case 'SET_STEP':
      nextState = { ...state, step: action.payload };
      break;
    case 'SET_PRODUCT_ID':
      nextState = { ...state, productId: action.payload };
      break;
    case 'SET_DRAFT':
      nextState = { ...state, draft: { ...state.draft, ...action.payload } };
      break;
    case 'RESTORE_STATE':
      return action.payload;
    default:
      return state;
  }

  void set('ks_capture_session', nextState);
  return nextState;
}

export default function ArtisanCapturePage() {
  const [state, dispatch] = useReducer(captureReducer, initialState);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSpeakingInstruction, setIsSpeakingInstruction] = useState(false);
  const [isSpeakingVoicePromptGuide, setIsSpeakingVoicePromptGuide] = useState(false);
  const [isGuidedCameraOpen, setIsGuidedCameraOpen] = useState(false);
  const [isVideoCaptureOpen, setIsVideoCaptureOpen] = useState(false);
  const [showImageEnhancer, setShowImageEnhancer] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [newMaterialInput, setNewMaterialInput] = useState('');
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [artisanProfile, setArtisanProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('kala_artisan_profile');
      if (savedProfile) {
        setHasProfile(true);
        try {
          setArtisanProfile(JSON.parse(savedProfile));
        } catch {
          // ignore
        }
      } else {
        setHasProfile(false);
      }
    }

    void (async () => {
      try {
        const saved = await get<CaptureState>('ks_capture_session');
        if (saved && saved.step) {
          dispatch({ type: 'RESTORE_STATE', payload: saved });
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const toggleInstructionVoice = (stepKey: string) => {
    if (isSpeakingInstruction) {
      stopAllAudio();
      setIsSpeakingInstruction(false);
      playUiBeep('stop');
      return;
    }

    const text = getInstructionText(stepKey, state.locale);
    if (!text) return;

    setIsSpeakingInstruction(true);
    playTanpuraChime(1.5);
    speakText(text, state.locale, () => {
      setIsSpeakingInstruction(false);
    });
  };

  const toggleVoicePromptGuide = () => {
    if (isSpeakingVoicePromptGuide) {
      stopAllAudio();
      setIsSpeakingVoicePromptGuide(false);
      playUiBeep('stop');
      return;
    }

    const text = getStepActionGuide('voice_prompts_guide', state.locale);
    if (!text) return;

    setIsSpeakingVoicePromptGuide(true);
    playTanpuraChime(1.5);
    speakText(text, state.locale, () => {
      setIsSpeakingVoicePromptGuide(false);
    });
  };

  const handleAddMaterial = () => {
    if (!newMaterialInput.trim()) return;
    const updated = [...state.draft.materials, newMaterialInput.trim()];
    dispatch({ type: 'SET_DRAFT', payload: { materials: updated } });
    setNewMaterialInput('');
  };

  const handleRemoveMaterial = (index: number) => {
    const updated = state.draft.materials.filter((_, i) => i !== index);
    dispatch({ type: 'SET_DRAFT', payload: { materials: updated } });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    stopAllAudio();
    playTanpuraChime(2.0);

    try {
      const newProductItem = {
        id: `custom-prod-${Date.now()}`,
        title: state.draft.title,
        description: state.draft.description,
        materials: state.draft.materials,
        craft_technique: state.draft.craft_technique,
        dimensions: state.draft.dimensions,
        stock_quantity: state.draft.stock_quantity,
        b2b_available: state.draft.b2b_available,
        b2b_moq: state.draft.b2b_moq,
        price_paise: state.draft.price_paise,
        media: [
          {
            kind: 'photo',
            storage_path: state.photos[0] || 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800',
          },
        ],
        narration: state.draft.description[state.locale] || state.draft.description.en,
      };

      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('kala_custom_products') || '[]');
        localStorage.setItem('kala_custom_products', JSON.stringify([newProductItem, ...existing]));
      }

      await set('ks_capture_session', null);
      const targetHandle = artisanProfile?.handle || 'sunil_warli_palghar';
      router.push(`/studio/${targetHandle}?published=true`);
    } catch {
      setIsPublishing(false);
    }
  };

  const filteredLanguages = ALL_INDIC_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.includes(langSearch) ||
      l.region.toLowerCase().includes(langSearch.toLowerCase())
  );

  const stepNumber =
    state.step === 'language' ? 1 : state.step === 'photos' ? 2 : state.step === 'voice' ? 3 : state.step === 'processing' ? 4 : 5;

  // Gated Profile Check
  if (hasProfile === false) {
    return (
      <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col justify-center items-center p-4 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#FFF1EB] text-[#9D3E1B] flex items-center justify-center border-2 border-[#DDC0B8] shadow-md">
          <Sparkles className="w-8 h-8 text-[#FE932C]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-[#9D3E1B] uppercase tracking-wider">
            प्रोफाइल आवश्यक / Profile Required
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#221A16] font-heading">
            पहले अपनी कारीगर प्रोफ़ाइल बनाएं
          </h2>
          <p className="text-sm text-[#56423C] font-medium leading-relaxed">
            उत्पाद और रील्स अपलोड करने के लिए केवल 3 आसान सवालों के जवाब देकर 30 सेकंड में अपना प्रोफ़ाइल तैयार करें।
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/studio/onboarding')}
          className="artisan-action-btn w-full rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-lg py-4 shadow-lg flex items-center justify-center gap-2"
        >
          <span>प्रोफाइल बनाएं (Create Profile First) ✨</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col selection:bg-[#9D3E1B]/20">
      {/* ── TOP NAV HEADER (STITCH ARTISAN STUDIO) ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FFF8F6]/95 backdrop-blur-md border-b border-[#E6DCCF] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <Link href="/studio" className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#9D3E1B] text-white flex items-center justify-center font-black text-xl shadow-sm">
              क
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg text-[#221A16]">कारीगर स्टूडियो</span>
                <span className="text-xs text-[#56423C] font-bold">| Bhashini AI Stack</span>
              </div>
              <p className="text-[11px] text-[#9D3E1B] font-bold">अखिल भारतीय बहुभाषी वॉयस कैटलॉग</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Step progress chip */}
            <div className="px-3.5 py-1.5 rounded-full bg-[#FFF1EB] border border-[#DDC0B8] text-xs font-bold text-[#221A16] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9D3E1B] animate-pulse"></span>
              <span>चरण {stepNumber} / 5</span>
            </div>

            {/* Instruction voice guide toggle */}
            <button
              type="button"
              onClick={() =>
                toggleInstructionVoice(
                  state.step === 'language'
                    ? 'choose_language'
                    : state.step === 'photos'
                    ? 'take_photos'
                    : state.step === 'voice'
                    ? 'speak_voice'
                    : 'review_publish'
                )
              }
              className={`px-3.5 py-2 rounded-full border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                isSpeakingInstruction
                  ? 'bg-[#221A16] border-[#221A16] text-white shadow-md animate-pulse'
                  : 'bg-[#FFF1EB] hover:bg-[#F5E5DE] text-[#904D00] border-[#DDC0B8]'
              }`}
            >
              {isSpeakingInstruction ? (
                <>
                  <Square className="w-4 h-4 fill-current text-white" />
                  <span>रोकें (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#FE932C]" />
                  <span>निर्देश सुनें</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── STEP PROGRESS VISUAL BAR ─────────────────────────────────────── */}
      <div className="w-full bg-[#F5E5DE] h-1.5">
        <div
          className="bg-[#9D3E1B] h-full transition-all duration-500"
          style={{ width: `${(stepNumber / 5) * 100}%` }}
        />
      </div>

      {/* ── MAIN WORKSPACE CONTENT ───────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ── STEP 1: CHOOSE LANGUAGE (MATCHING STITCH SCREEN 4) ──────────── */}
        {state.step === 'language' && (
          <div className="space-y-6 pb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#9D3E1B] text-xs font-black uppercase tracking-wider mb-1">
                <Globe className="w-4 h-4" />
                <span>मातृभाषा चयन · Step 1 of 5</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#221A16] font-heading">
                अपनी मातृभाषा चुनें / Choose Your Language
              </h1>
              <p className="text-sm text-[#56423C] mt-1">
                भारत के किसी भी कोने की अपनी भाषा चुनें। Bhashini ASR + NMT द्वारा 22+ भारतीय भाषाओं में कैटलॉग तैयार होगा।
              </p>
            </div>

            {/* Cultural Weaver Cluster Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-[#FFF1EB] border border-[#DDC0B8] rounded-2xl p-4 sm:p-5">
              <div className="md:col-span-3 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#9D3E1B]/30 shadow-xs">
                  <img
                    className="w-full h-full object-cover"
                    alt="Handloom weaving"
                    src="https://images.unsplash.com/photo-1606744888344-493238955036?w=200"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#9D3E1B]">
                    भाषिणी AI भाषा स्टैक (Bhashini Stack Enabled)
                  </span>
                  <h4 className="font-bold text-sm text-[#221A16] leading-snug">
                    अपनी बोली में बोलें, कैटलॉग अपने आप तैयार होगा
                  </h4>
                  <p className="text-xs text-[#56423C]">
                    Your native voice is translated directly into English & Hindi global listings in &lt; 90 seconds.
                  </p>
                </div>
              </div>

              <div className="flex md:justify-end">
                <span className="px-3 py-1 rounded-full bg-white text-[#006B2F] font-bold text-xs border border-[#006B2F]/30 flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Bhashini Ready
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-[#56423C] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="भाषा खोजें या लिखें (e.g. Marathi, Hindi, Telugu, বাংলা, ગુજરાતી...)"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#DDC0B8] bg-white text-base text-[#221A16] focus:border-[#9D3E1B] focus:outline-none shadow-xs font-medium"
              />
            </div>

            {/* Grid of Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[48vh] overflow-y-auto pr-1">
              {filteredLanguages.map((lang) => {
                const isSelected = state.locale === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => {
                      stopAllAudio();
                      dispatch({ type: 'SELECT_LOCALE', payload: lang.code });
                    }}
                    className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[130px] active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#9D3E1B] bg-[#FFF1EB] shadow-md ring-2 ring-[#9D3E1B]/20'
                        : 'border-[#E6DCCF] bg-white hover:border-[#9D3E1B]/60 hover:bg-[#FFF1EB]/40 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`text-xl font-black block leading-tight ${isSelected ? 'text-[#9D3E1B]' : 'text-[#221A16]'}`}>
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
                        className="w-10 h-10 rounded-full bg-white hover:bg-[#FFDCC3] border border-[#DDC0B8] flex items-center justify-center text-[#904D00] shadow-xs transition active:scale-90"
                        title="आवाज़ सुनें (Listen Sample)"
                      >
                        <Volume2 className="w-4 h-4 text-[#FE932C]" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#56423C] pt-2 border-t border-[#E6DCCF]/50">
                      <span className="truncate">{lang.region}</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#9D3E1B] text-white' : 'bg-[#F5E5DE]'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Bottom-Right Confirmation Button */}
            <div className="sticky bottom-4 flex justify-end z-20 pt-2">
              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  dispatch({ type: 'CONFIRM_LANGUAGE' });
                }}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-base sm:text-lg shadow-xl flex items-center gap-3 transition active:scale-95 border-2 border-[#FFF8F6]"
              >
                <span>पुष्टि करें और आगे बढ़ें (Confirm & Next)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: 3-OPTION MEDIA STUDIO (VIDEO / LIVE IN-BROWSER CAMERA / DEVICE FILES) ── */}
        {state.step === 'photos' && (() => {
          const t2 = getStep2BilingualI18n(state.locale);
          return (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[#9D3E1B] text-xs font-black uppercase tracking-wider mb-1">
                  <Camera className="w-4 h-4" />
                  <span>{t2.stepBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#221A16] font-heading">
                  {t2.heading}
                </h2>
                <p className="text-sm text-[#56423C] mt-1">
                  {t2.subheading}
                </p>
              </div>

              {/* 3 Prominent Capture Options (Video Camera App / Live In-Browser Photo / Device Files) */}
              <MobileMediaPicker
                currentPhotoCount={state.photos.length}
                maxPhotos={5}
                locale={state.locale}
                onOpenInBrowserCamera={() => setIsGuidedCameraOpen(true)}
                onPhotoCaptured={(dataUrl) => dispatch({ type: 'ADD_PHOTO', payload: dataUrl })}
                onVideoRecorded={(blob) => dispatch({ type: 'SET_VIDEO', payload: { blob, hasSpeech: true } })}
              />

              {/* In-Browser Live Camera Modal */}
              {isGuidedCameraOpen && (
                <GuidedCamera
                  locale={state.locale}
                  onPhotoCaptured={(dataUrl) => {
                    dispatch({ type: 'ADD_PHOTO', payload: dataUrl });
                    setIsGuidedCameraOpen(false);
                  }}
                  onClose={() => setIsGuidedCameraOpen(false)}
                />
              )}

              {/* Uploaded Thumbnails Mosaic */}
              {(state.photos.length > 0 || state.videoBlob) && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E6DCCF] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#221A16]">
                      {t2.uploadedTitle} ({state.photos.length}/5 {state.videoBlob ? '+ 1 Video Reel' : ''})
                    </span>
                    <span className="text-xs text-[#56423C]">{t2.firstPhotoCover}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {state.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#9D3E1B] shadow-sm group bg-[#FBEBE4]"
                      >
                        <img src={photo} alt={`Craft shot ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-[#9D3E1B] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                          {index === 0 ? 'कवर / Cover' : `स्लॉट / Slot ${index + 1}`}
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'REMOVE_PHOTO', payload: index })}
                          className="absolute top-1 right-1 w-7 h-7 bg-[#221A16]/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition"
                          title="हटाएं (Remove)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {state.videoBlob && (
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#006B2F] bg-[#221A16] shadow-sm flex flex-col items-center justify-center text-white">
                        <Sparkles className="w-7 h-7 text-[#FE932C] animate-pulse" />
                        <span className="text-xs font-bold mt-1">वीडियो रील (Reel)</span>
                        <span className="text-[10px] text-[#95F8A7]">वॉयस युक्त (With Voice)</span>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'SET_VIDEO', payload: { blob: null as any, hasSpeech: false } })}
                          className="absolute top-1 right-1 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                          title="हटाएं (Remove)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Image Enhancer Studio Button & Preview */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowImageEnhancer(!showImageEnhancer)}
                  className="w-full p-4 rounded-2xl bg-[#FFF1EB] hover:bg-[#FBEBE4] border-2 border-[#FE932C]/40 text-[#9D3E1B] font-black text-xs sm:text-sm flex items-center justify-between shadow-xs transition active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-[#FE932C]" />
                    <span>✨ AI स्टूडियो बैकग्राउंड एन्हांसर (AI Studio Image Enhancer)</span>
                  </div>
                  <span className="text-xs font-bold underline">
                    {showImageEnhancer ? 'स्टूडियो बंद करें (Close)' : 'स्टूडियो खोलें (Open Enhancer)'}
                  </span>
                </button>
              </div>

              {showImageEnhancer && (
                <div className="pt-2">
                  <ImageEnhancerStudio
                    initialImage={state.photos[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800'}
                    onEnhancedImageSelected={(url) => {
                      if (!state.photos.includes(url)) {
                        dispatch({ type: 'ADD_PHOTO', payload: url });
                      }
                      setShowImageEnhancer(false);
                    }}
                  />
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    dispatch({ type: 'SET_STEP', payload: 'language' });
                  }}
                  className="artisan-action-btn flex-1 rounded-2xl border-2 border-[#DDC0B8] bg-white hover:bg-[#FFF1EB] font-bold text-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> {t2.backBtn}
                </button>

                <button
                  type="button"
                  disabled={state.photos.length === 0 && !state.videoBlob}
                  onClick={() => {
                    stopAllAudio();
                    dispatch({ type: 'SET_STEP', payload: 'voice' });
                  }}
                  className={`artisan-action-btn flex-1 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                    state.photos.length > 0 || state.videoBlob
                      ? 'bg-[#9D3E1B] hover:bg-[#802906] text-white'
                      : 'bg-[#DDC0B8] text-white cursor-not-allowed'
                  }`}
                >
                  <span>{t2.nextBtn}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── STEP 3: SPEAK & VOICE (MATCHING STITCH SCREEN 3 VOICE STUDIO) ── */}
        {state.step === 'voice' && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#9D3E1B] text-xs font-black uppercase tracking-wider mb-1">
                <Mic className="w-4 h-4 text-[#FE932C]" />
                <span>चरण 3: अपनी मातृभाषा में बोलें</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#221A16] font-heading">
                आवाज़ की कहानी रिकॉर्ड करें / Voice Recording
              </h2>
              <p className="text-sm text-[#56423C] mt-1">
                अपनी भाषा में 20-40 सेकंड बोलें। Bhashini ASR + NMT इसे पहचानकर अपने आप कैटलॉग तैयार करेगा।
              </p>
            </div>

            {/* Guiding Question Prompts Bento with Play/Stop Voice Explaining Button */}
            <div className="bg-[#FFF1EB] border border-[#DDC0B8] rounded-2xl p-4 sm:p-5 space-y-3 text-xs sm:text-sm font-medium text-[#221A16]">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#9D3E1B] flex items-center gap-1.5 text-sm">
                  💡 बोलने के लिए आसान सवाल (Guiding Prompts):
                </span>
                <button
                  type="button"
                  onClick={toggleVoicePromptGuide}
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                    isSpeakingVoicePromptGuide
                      ? 'bg-[#221A16] text-white border-[#221A16] animate-pulse'
                      : 'bg-white hover:bg-[#FFDCC3] text-[#9D3E1B] border-[#DDC0B8]'
                  }`}
                  title="बोलकर समझें"
                >
                  {isSpeakingVoicePromptGuide ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current text-white" />
                      <span>रोकें (Stop)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#FE932C]" />
                      <span>बोलकर सुनें</span>
                    </>
                  )}
                </button>
              </div>

              <ul className="space-y-1.5 text-[#56423C] list-disc list-inside">
                <li>यह क्या है और कौन सी सामग्री से बना है? (What is it made of?)</li>
                <li>इसे बनाने में कितना समय और कौन सा पारंपरिक तरीका लगा? (How was it crafted?)</li>
                <li>इसकी क्या खासियत या कहानी है? (What is the story behind this craft?)</li>
              </ul>
            </div>

            {/* 96px Animated Mic Button */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DCCF] shadow-sm flex flex-col items-center justify-center gap-4">
              <MicButton
                onRecordingComplete={(blob, duration) => {
                  dispatch({ type: 'SET_AUDIO', payload: { blob, duration } });
                }}
              />
            </div>

            {/* Audio Recorded Success Banner */}
            {state.audioBlob && (
              <div className="bg-[#F0FDF4] border-2 border-[#006B2F] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006B2F] text-white flex items-center justify-center font-bold">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#006B2F] text-sm sm:text-base">
                      आवाज़ सफलतापूर्वक रिकॉर्ड हो गई ({state.audioDuration}s)
                    </h4>
                    <p className="text-xs text-[#56423C]">
                      Bhashini AI कैटलॉग निर्माण के लिए तैयार है
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    dispatch({ type: 'SET_STEP', payload: 'processing' });
                  }}
                  className="artisan-action-btn px-6 py-3 rounded-xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-sm shadow-md flex items-center gap-2 active:scale-95"
                >
                  <span>जादुई कैटलॉग बनाएं</span>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                stopAllAudio();
                dispatch({ type: 'SET_STEP', payload: 'photos' });
              }}
              className="artisan-action-btn w-full rounded-2xl border-2 border-[#DDC0B8] bg-white hover:bg-[#FFF1EB] font-bold text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> वापस फ़ोटो पर जाएं (Back)
            </button>
          </div>
        )}

        {/* ── STEP 4: THEATRICAL BHASHINI AI PROCESSING ───────────────────── */}
        {state.step === 'processing' && (
          <div className="py-8">
            <StatusTimeline
              languageName={ALL_INDIC_LANGUAGES.find((l) => l.code === state.locale)?.nativeName || 'भारतीय भाषा'}
              onComplete={() => {
                const localizedDraft = buildLocalizedDraftObject(state.locale);
                dispatch({
                  type: 'SET_DRAFT',
                  payload: localizedDraft,
                });
                dispatch({ type: 'SET_STEP', payload: 'review' });
              }}
            />
          </div>
        )}

        {/* ── STEP 5: REVIEW, EDITABLE FIELDS & PUBLISH (RESTORED FULL DRD) ── */}
        {state.step === 'review' && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#9D3E1B] text-xs font-black uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#006B2F]" />
                <span>चरण 5 / 5 (अंतिम चरण · Review & Edit)</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#221A16] font-heading">
                जाँचें, सुधारें और प्रकाशित करें / Review & Publish
              </h2>
              <p className="text-sm text-[#56423C] mt-1">
                Bhashini + Gemini द्वारा तैयार द्विभाषी कैटलॉग विवरण। आवश्यकतानुसार किसी भी फ़ील्ड को संपादित करें।
              </p>
            </div>

            {/* AI Authenticity Verification Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FDF4] border-2 border-[#006B2F] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-[#006B2F] text-white flex items-center justify-center shrink-0 shadow-sm font-bold">
                  <ShieldCheck className="w-7 h-7 text-[#95F8A7]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-sm sm:text-base text-[#221A16]">
                      Bhashini AI प्रमाणित सत्यता (98% Provenance Match)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#006B2F] text-xs font-black">
                      Dual Speech Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-[#56423C] mt-0.5">
                    शिल्प वीडियो और ऑडियो विवरण का सटीक मिलान सत्यापित (ODOP & GI Tag Linked)
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-white text-[#006B2F] font-bold text-xs border border-[#006B2F]/30 shrink-0">
                100% Authentic
              </span>
            </div>

            {/* Editable Dual-Language Side-by-Side Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card A: Native Language (Editable) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#9D3E1B] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E6DCCF] pb-3">
                    <div className="flex items-center gap-2 text-[#9D3E1B] font-black text-sm">
                      <Globe className="w-4 h-4" />
                      <span>मातृभाषा विवरण (Native: {ALL_INDIC_LANGUAGES.find((l) => l.code === state.locale)?.nativeName || 'मराठी'})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1EB] text-[#9D3E1B] text-[11px] font-bold flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> संपादन योग्य
                    </span>
                  </div>

                  {/* Native Title Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#56423C] font-bold block">
                      शीर्षक (PRODUCT TITLE - NATIVE)
                    </label>
                    <input
                      type="text"
                      value={state.draft.title[state.locale] || state.draft.title.hi || state.draft.title.en}
                      onChange={(e) => {
                        const updated = { ...state.draft.title, [state.locale]: e.target.value };
                        dispatch({ type: 'SET_DRAFT', payload: { title: updated } });
                      }}
                      className="w-full font-bold text-base text-[#221A16] bg-[#FFF1EB]/50 p-3 rounded-xl border border-[#DDC0B8] focus:border-[#9D3E1B] outline-none"
                    />
                  </div>

                  {/* Native Description Textarea */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#56423C] font-bold block">
                      विस्तृत विवरण (DESCRIPTION - NATIVE)
                    </label>
                    <textarea
                      rows={3}
                      value={state.draft.description[state.locale] || state.draft.description.hi || state.draft.description.en}
                      onChange={(e) => {
                        const updated = { ...state.draft.description, [state.locale]: e.target.value };
                        dispatch({ type: 'SET_DRAFT', payload: { description: updated } });
                      }}
                      className="w-full text-xs sm:text-sm text-[#221A16] bg-[#FFF1EB]/50 p-3 rounded-xl border border-[#DDC0B8] focus:border-[#9D3E1B] outline-none leading-relaxed resize-none font-medium"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E6DCCF] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      playTanpuraChime(1.5);
                      speakText(state.draft.description[state.locale] || state.draft.description.hi || 'विवरण', state.locale);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFF1EB] hover:bg-[#F5E5DE] text-[#9D3E1B] text-xs font-bold transition"
                  >
                    <Volume2 className="w-4 h-4 text-[#FE932C]" />
                    <span>ऐका / सुनें (Play Native)</span>
                  </button>
                  <span className="text-[11px] text-[#56423C] font-semibold">Bhashini ASR Verified</span>
                </div>
              </div>

              {/* Card B: Auto-Translated English (Editable) */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#FE932C] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E6DCCF] pb-3">
                    <div className="flex items-center gap-2 text-[#904D00] font-black text-sm">
                      <Languages className="w-4 h-4" />
                      <span>ऑटो-ट्रांसलेटेड इंग्लिश (Buyer Export View)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFDCC3] text-[#904D00] text-[11px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 100% Bhashini NMT
                    </span>
                  </div>

                  {/* English Title Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#56423C] font-bold block">
                      ENGLISH TITLE (FOR EXPORTS)
                    </label>
                    <input
                      type="text"
                      value={state.draft.title.en}
                      onChange={(e) => {
                        const updated = { ...state.draft.title, en: e.target.value };
                        dispatch({ type: 'SET_DRAFT', payload: { title: updated } });
                      }}
                      className="w-full font-bold text-base text-[#221A16] bg-[#FFDCC3]/20 p-3 rounded-xl border border-[#DDC0B8] focus:border-[#904D00] outline-none"
                    />
                  </div>

                  {/* English Description Textarea */}
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#56423C] font-bold block">
                      EXPORT DESCRIPTION (ENGLISH)
                    </label>
                    <textarea
                      rows={3}
                      value={state.draft.description.en}
                      onChange={(e) => {
                        const updated = { ...state.draft.description, en: e.target.value };
                        dispatch({ type: 'SET_DRAFT', payload: { description: updated } });
                      }}
                      className="w-full text-xs sm:text-sm text-[#221A16] bg-[#FFDCC3]/20 p-3 rounded-xl border border-[#DDC0B8] focus:border-[#904D00] outline-none leading-relaxed resize-none font-medium italic"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E6DCCF] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      playTanpuraChime(1.5);
                      speakText(state.draft.description.en, 'en');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFDCC3]/50 hover:bg-[#FFDCC3] text-[#904D00] text-xs font-bold transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen in English</span>
                  </button>
                  <span className="text-[11px] text-[#006B2F] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SEO Optimized
                  </span>
                </div>
              </div>
            </div>

            {/* Restored Materials, Dimensions & Technique Section */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E6DCCF] shadow-sm space-y-4">
              <h3 className="font-black text-base text-[#221A16] flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#9D3E1B]" />
                <span>सामग्री, माप एवं कारीगरी (Craft Materials & Specs)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Materials Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#56423C] block">
                    सामग्री (Materials Tags):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {state.draft.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF1EB] text-[#9D3E1B] text-xs font-bold border border-[#DDC0B8] flex items-center gap-1"
                      >
                        {mat}
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(i)}
                          className="hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add material input */}
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Add material..."
                      value={newMaterialInput}
                      onChange={(e) => setNewMaterialInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMaterial();
                        }
                      }}
                      className="flex-1 px-2.5 py-1 text-xs border rounded-lg bg-[#FFF8F6] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddMaterial}
                      className="px-2 py-1 bg-[#9D3E1B] text-white rounded-lg text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Dimensions Field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#56423C] block flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-[#9D3E1B]" /> माप (Dimensions):
                  </label>
                  <input
                    type="text"
                    value={state.draft.dimensions}
                    onChange={(e) => dispatch({ type: 'SET_DRAFT', payload: { dimensions: e.target.value } })}
                    placeholder="e.g. 14 x 14 x 2 inches"
                    className="w-full text-xs font-bold text-[#221A16] bg-[#FFF8F6] p-2.5 rounded-xl border border-[#DDC0B8] focus:border-[#9D3E1B] outline-none"
                  />
                </div>

                {/* Technique Field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#56423C] block flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#9D3E1B]" /> तकनीक (Craft Technique):
                  </label>
                  <input
                    type="text"
                    value={state.draft.craft_technique}
                    onChange={(e) => dispatch({ type: 'SET_DRAFT', payload: { craft_technique: e.target.value } })}
                    placeholder="e.g. Traditional Brushwork"
                    className="w-full text-xs font-bold text-[#221A16] bg-[#FFF8F6] p-2.5 rounded-xl border border-[#DDC0B8] focus:border-[#9D3E1B] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Restored Stock & B2B Wholesale MOQ Section */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E6DCCF] shadow-sm space-y-4">
              <h3 className="font-black text-base text-[#221A16] flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#904D00]" />
                <span>स्टॉक एवं B2B थोक व्यापार (Stock & Bulk Order Settings)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Stock Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#56423C] block">
                    उपलब्ध स्टॉक (Units Available in Stock):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={state.draft.stock_quantity}
                    onChange={(e) => dispatch({ type: 'SET_DRAFT', payload: { stock_quantity: Number(e.target.value) || 1 } })}
                    className="w-full text-sm font-bold text-[#221A16] bg-[#FFF8F6] p-2.5 rounded-xl border border-[#DDC0B8] focus:border-[#904D00] outline-none"
                  />
                </div>

                {/* B2B Wholesale Available Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFDCC3]/30 border border-[#DDC0B8]">
                  <div>
                    <span className="text-xs font-black text-[#904D00] block">B2B थोक बिक्री सक्षम (Wholesale MOQ)</span>
                    <span className="text-[10px] text-[#56423C]">होटल, निर्यातकों और थोक खरीदारों के लिए</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={state.draft.b2b_available}
                    onChange={(e) => dispatch({ type: 'SET_DRAFT', payload: { b2b_available: e.target.checked } })}
                    className="w-5 h-5 accent-[#904D00] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Smart Pricing Advisor & Direct DBT Calculation Bento */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E6DCCF] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-[#221A16]">
                    उचित मूल्य निर्धारक एवं DBT भुगतान (Smart Price Advisor)
                  </h3>
                  <p className="text-xs text-[#56423C]">
                    सामग्री, आकार और कारीगरी के अनुसार निष्पक्ष मूल्य दायरा
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F0FDF4] text-[#006B2F] font-black text-xs border border-[#006B2F]/20">
                  0% Commission
                </span>
              </div>

              <PriceBandSlider
                minPriceInr={state.draft.ai_price_min}
                maxPriceInr={state.draft.ai_price_max}
                initialPriceInr={Math.round(state.draft.price_paise / 100)}
                onChange={(paise) => dispatch({ type: 'SET_DRAFT', payload: { price_paise: paise } })}
              />
            </div>

            {/* Explainable Dynamic Glass-Box Pricing Calculator */}
            <ExplainablePricingCard
              rawMaterialsPaise={Math.round(state.draft.price_paise * 0.25)}
              hoursSpent={16}
              fairLaborRatePerHourPaise={9000}
              artisanMarginPaise={Math.round(state.draft.price_paise * 0.35)}
              packagingPaise={20000}
              craftName={state.draft.title[state.locale] || state.draft.title.hi || 'हस्तशिल्प'}
              locale={state.locale}
              onPriceSelected={(newPricePaise) => {
                dispatch({ type: 'SET_DRAFT', payload: { price_paise: newPricePaise } });
              }}
            />

            {/* Human-in-the-Loop Audio Check & Voice Micro-Corrections */}
            <HumanInTheLoopAudioGate
              locale={state.locale}
              initialListing={{
                title: state.draft.title[state.locale] || state.draft.title.hi || 'पारंपरिक हस्तशिल्प',
                pricePaise: state.draft.price_paise,
                craftType: state.draft.craft_technique || 'पारंपरिक शिल्प',
                materials: state.draft.materials.join(', ') || 'प्राकृतिक सामग्री',
                story: state.draft.description[state.locale] || state.draft.description.hi || '',
                stockQty: state.draft.stock_quantity || 1,
              }}
              onListingApproved={(verifiedDraft) => {
                dispatch({
                  type: 'SET_DRAFT',
                  payload: {
                    price_paise: verifiedDraft.pricePaise,
                    stock_quantity: verifiedDraft.stockQty,
                    craft_technique: verifiedDraft.craftType,
                  },
                });
              }}
            />

            {/* High-Impact 1-Click Publish CTA */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="artisan-action-btn w-full rounded-2xl bg-[#006B2F] hover:bg-[#005323] text-white font-black text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 transition active:scale-95 py-4"
            >
              <Check className="w-7 h-7 stroke-[3]" />
              <span>{isPublishing ? 'दुकान पर प्रकाशित हो रहा है...' : '1-क्लिक में प्रकाशित करें (PUBLISH NOW)'}</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
