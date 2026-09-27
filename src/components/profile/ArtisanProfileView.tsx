'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Star,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Globe,
  Sparkles,
  Award,
  Languages,
  Check,
  Volume2,
} from 'lucide-react';
import { VoicePlayer } from '@/components/VoicePlayer';
import { ArtisanInstagramFeed } from '@/components/profile/ArtisanInstagramFeed';
import { ALL_INDIC_LANGUAGES, MULTILINGUAL_TRANSCRIPTS } from '@/lib/i18n/indic-languages';

interface ArtisanProfileViewProps {
  handle: string;
  initialProducts: any[];
}

const PROFILE_I18N: Record<
  string,
  {
    studioBack: string;
    odopBadge: string;
    posts: string;
    rating: string;
    sales: string;
    bioVoiceTitle: string;
    craftStoryTitle: string;
    englishStoryTitle: string;
    newPostBtn: string;
    langSelectTitle: string;
  }
> = {
  hi: {
    studioBack: 'स्टूडियो (Studio)',
    odopBadge: 'ODOP & GI प्रमाणित (Verified)',
    posts: 'पोस्ट (Posts)',
    rating: 'रेटिंग (Rating)',
    sales: 'बिक्री (Sales)',
    bioVoiceTitle: 'परिचय आवाज़ सुनें (Bio Voice Clip)',
    craftStoryTitle: 'कला एवं शिल्पकला कहानी (Artisan Story)',
    englishStoryTitle: 'English Translation / विवरण',
    newPostBtn: '+ नया पोस्ट बनाएं (New Post / Reel)',
    langSelectTitle: 'भाषा बदलें (Change Language)',
  },
  mr: {
    studioBack: 'स्टुडिओ (Studio)',
    odopBadge: 'ODOP व GI प्रमाणित (Verified)',
    posts: 'पोस्ट (Posts)',
    rating: 'रेटिंग (Rating)',
    sales: 'विक्री (Sales)',
    bioVoiceTitle: 'परिचय आवाज ऐका (Bio Voice Clip)',
    craftStoryTitle: 'कला आणि हस्तकलेची गोष्ट (Artisan Story)',
    englishStoryTitle: 'English Translation / भाषांतर',
    newPostBtn: '+ नवीन पोस्ट तयार करा (New Post / Reel)',
    langSelectTitle: 'भाषा बदला (Change Language)',
  },
  bn: {
    studioBack: 'স্টুডিও (Studio)',
    odopBadge: 'ODOP ও GI সার্টিফাইড',
    posts: 'পোস্ট (Posts)',
    rating: 'রেটিং (Rating)',
    sales: 'বিক্রয় (Sales)',
    bioVoiceTitle: 'ভয়েস পরিচিতি শুনুন (Bio Voice)',
    craftStoryTitle: 'শিল্পী ও শিল্পের গল্প (Artisan Story)',
    englishStoryTitle: 'English Translation / অনুবাদ',
    newPostBtn: '+ নতুন পোস্ট তৈরি করুন (New Post)',
    langSelectTitle: 'ভাষা পরিবর্তন করুন',
  },
  te: {
    studioBack: 'స్టూడియో (Studio)',
    odopBadge: 'ODOP & GI ధృవీకరించబడింది',
    posts: 'పోస్ట్‌లు (Posts)',
    rating: 'రేటింగ్ (Rating)',
    sales: 'విక్రయాలు (Sales)',
    bioVoiceTitle: 'వాయిస్ పరిచయం వినండి (Bio Voice)',
    craftStoryTitle: 'కళ మరియు కళాకారుడి కథ (Artisan Story)',
    englishStoryTitle: 'English Translation / ఆంగ్ల అనువాదం',
    newPostBtn: '+ కొత్త పోస్ట్ సృష్టించండి (New Post)',
    langSelectTitle: 'భాషను మార్చండి',
  },
  ta: {
    studioBack: 'ஸ்டுடியோ (Studio)',
    odopBadge: 'ODOP & GI சான்றளிக்கப்பட்டது',
    posts: 'பதிவுகள் (Posts)',
    rating: 'மதிப்பீடு (Rating)',
    sales: 'விற்பனை (Sales)',
    bioVoiceTitle: 'குரல் அறிமுகம் கேளுங்கள் (Bio Voice)',
    craftStoryTitle: 'கைவினைஞரின் கதை (Artisan Story)',
    englishStoryTitle: 'English Translation / ஆங்கில விளக்கம்',
    newPostBtn: '+ புதிய பதிவு உருவாக்கவும் (New Post)',
    langSelectTitle: 'மொழியை மாற்றவும்',
  },
  kn: {
    studioBack: 'ಸ್ಟುಡಿಯೋ (Studio)',
    odopBadge: 'ODOP & GI ಪ್ರಮಾಣೀಕರಿಸಲಾಗಿದೆ',
    posts: 'ಪೋಸ್ಟ್‌ಗಳು (Posts)',
    rating: 'ರೇಟಿಂಗ್ (Rating)',
    sales: 'ಮಾರಾಟ (Sales)',
    bioVoiceTitle: 'ಧ್ವನಿ ಪರಿಚಯ ಆಲಿಸಿ (Bio Voice)',
    craftStoryTitle: 'ಕಲೆ ಮತ್ತು ಕಲಾಕಾರನ ಕಥೆ (Artisan Story)',
    englishStoryTitle: 'English Translation / ಇಂಗ್ಲಿಷ್ ವಿವರಣೆ',
    newPostBtn: '+ ಹೊಸ ಪೋಸ್ಟ್ ರಚಿಸಿ (New Post)',
    langSelectTitle: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
  },
  gu: {
    studioBack: 'સ્ટુડિયો (Studio)',
    odopBadge: 'ODOP અને GI પ્રમાણિત',
    posts: 'પોસ્ટ (Posts)',
    rating: 'રેટિંગ (Rating)',
    sales: 'વેચાણ (Sales)',
    bioVoiceTitle: 'ઓડિયો પરિચય સાંભળો (Bio Voice)',
    craftStoryTitle: 'કારીગર અને કળાની વાત (Artisan Story)',
    englishStoryTitle: 'English Translation / અંગ્રેજી વિવરણ',
    newPostBtn: '+ નવી પોસ્ટ બનાવો (New Post)',
    langSelectTitle: 'ભાષા બદલો',
  },
  en: {
    studioBack: 'Studio Home',
    odopBadge: 'ODOP & GI Verified',
    posts: 'Posts',
    rating: 'Rating',
    sales: 'Sales',
    bioVoiceTitle: 'Listen to Voice Bio Clip',
    craftStoryTitle: 'Artisan Heritage & Craft Story',
    englishStoryTitle: 'English Story & Overview',
    newPostBtn: '+ Create New Post / Reel',
    langSelectTitle: 'Language',
  },
};

export function ArtisanProfileView({ handle, initialProducts }: ArtisanProfileViewProps) {
  const [locale, setLocale] = useState('hi');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Sunil Wagh (सुनील वाघ)',
    handle: handle || 'sunil_warli_palghar',
    avatarUrl: '',
    craftType: 'वारली चित्रकला (Warli Folk Painting)',
    craftDescription:
      'हम प्राकृतिक गेरू लाल मिट्टी और चावल के लेप से बांस की तीली द्वारा सदियों पुरानी वारली लोक चित्रकला बनाते हैं। इसमें तारपा नृत्य और ग्रामीण उत्सवों की सजीव आकृतियाँ उकेरी जाती हैं।',
    district: 'पालघर (Palghar)',
    state: 'महाराष्ट्र (Maharashtra)',
    experienceYears: 24,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kala_artisan_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile((prev) => ({
            ...prev,
            fullName: parsed.fullName || prev.fullName,
            handle: parsed.handle || prev.handle,
            avatarUrl: parsed.avatarUrl || prev.avatarUrl,
            craftType: parsed.craftType || prev.craftType,
            craftDescription: parsed.craftDescription || prev.craftDescription,
            district: parsed.district || prev.district,
            state: parsed.state || prev.state,
          }));
          if (parsed.preferredLocale) {
            setLocale(parsed.preferredLocale);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [handle]);

  const cleanLang = locale.toLowerCase().split('-')[0] || 'hi';
  const t = PROFILE_I18N[cleanLang] || PROFILE_I18N['hi'] || PROFILE_I18N['en'];
  const currentLangObj =
    ALL_INDIC_LANGUAGES.find((l) => l.code === locale) || ALL_INDIC_LANGUAGES[0];

  const localizedStory = MULTILINGUAL_TRANSCRIPTS[cleanLang]?.text || profile.craftDescription;
  const englishStory =
    MULTILINGUAL_TRANSCRIPTS['en']?.text ||
    'Traditional Warli hand painting crafted using natural red clay and organic rice flour paste depicting communal celebration and village harmony.';

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col">
      {/* ── TOP NAVIGATION BAR ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FFF8F6]/95 backdrop-blur-md border-b border-[#E6DCCF] px-4 py-3">
        <div className="max-w-xl mx-auto w-full flex items-center justify-between">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#56423C] hover:text-[#9D3E1B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.studioBack}</span>
          </Link>

          <span className="font-mono text-xs font-bold text-[#56423C]">@{profile.handle}</span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#006B2F] border border-[#006B2F]/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.odopBadge}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-5 space-y-4">
        {/* ── MULTI-LANGUAGE SWITCHER CHIP BAR ─────────────────────────────── */}
        <div className="bg-white border border-[#E6DCCF] rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#9D3E1B]" />
            <span className="text-xs font-bold text-[#56423C]">भाषा (Language):</span>
            <span className="text-xs font-black text-[#9D3E1B] bg-[#FFF1EB] px-2 py-0.5 rounded-lg border border-[#DDC0B8]">
              {currentLangObj.nativeName} ({currentLangObj.name})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#FFF1EB] hover:bg-[#F5E5DE] text-[#9D3E1B] flex items-center gap-1 border border-[#DDC0B8] transition"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isLangMenuOpen ? 'बंद (Close)' : '22+ भाषाएँ'}</span>
          </button>
        </div>

        {/* Expandable Language Dropdown Grid */}
        {isLangMenuOpen && (
          <div className="bg-white border-2 border-[#9D3E1B] rounded-2xl p-3 shadow-lg max-h-56 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 animate-in fade-in duration-200">
            {ALL_INDIC_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLocale(lang.code);
                  setIsLangMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                  locale === lang.code
                    ? 'bg-[#9D3E1B] text-white shadow-xs'
                    : 'hover:bg-[#FFF1EB] text-[#221A16]'
                }`}
              >
                <span>{lang.nativeName}</span>
                {locale === lang.code && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            ))}
          </div>
        )}

        {/* ── 1. ARTISAN IDENTITY & BILINGUAL STORY CARD ───────────────── */}
        <section className="bg-white border-2 border-[#E6DCCF] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          {/* Avatar & Main Identity */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#FFF1EB] to-[#FFDCC3] border-3 border-[#9D3E1B] flex items-center justify-center text-[#9D3E1B] text-3xl font-black shadow-md overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  profile.fullName.slice(0, 1) || 'स'
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#006B2F] text-white rounded-full p-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#221A16] leading-tight truncate">
                  {profile.fullName}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Master Artisan
                </span>
              </div>

              <p className="text-sm font-bold text-[#9D3E1B] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FE932C]" />
                <span>{profile.craftType}</span>
              </p>

              <p className="text-xs text-[#56423C] flex items-center gap-1 font-medium pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#9D3E1B] shrink-0" />
                <span>{profile.district}, {profile.state} · 24 yrs Heritage</span>
              </p>
            </div>
          </div>

          {/* Metrics Row: Posts · Rating · Sales */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E6DCCF] text-center bg-[#FFF1EB]/40 rounded-2xl">
            <div>
              <span className="text-xl font-black text-[#221A16]">9</span>
              <span className="block text-xs font-bold text-[#56423C]">{t.posts}</span>
            </div>
            <div>
              <span className="text-xl font-black text-[#221A16] flex items-center justify-center gap-0.5 text-amber-600">
                <Star className="w-4 h-4 fill-current text-amber-500" /> 4.9
              </span>
              <span className="block text-xs font-bold text-[#56423C]">{t.rating}</span>
            </div>
            <div>
              <span className="text-xl font-black text-[#006B2F]">28</span>
              <span className="block text-xs font-bold text-[#56423C]">{t.sales}</span>
            </div>
          </div>

          {/* BILINGUAL CRAFT STORY (SELECTED LANGUAGE + ENGLISH) */}
          <div className="space-y-3 bg-[#FFF1EB] border border-[#DDC0B8] rounded-2xl p-4 text-xs sm:text-sm">
            {/* Native Story */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#9D3E1B] uppercase tracking-wide">
                <Award className="w-4 h-4 text-[#FE932C]" />
                <span>{t.craftStoryTitle} ({currentLangObj.nativeName}):</span>
              </div>
              <p className="text-[#221A16] leading-relaxed font-semibold text-sm">
                "{localizedStory}"
              </p>
            </div>

            {/* English Parallel Subtitle / Summary */}
            <div className="pt-2.5 border-t border-[#DDC0B8]/60 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#904D00] block">
                {t.englishStoryTitle}:
              </span>
              <p className="text-[#56423C] leading-relaxed font-medium italic text-xs">
                "{englishStory}"
              </p>
            </div>
          </div>

          {/* Bio Voice Player (22+ Indic Languages Speech Provenance) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-[#56423C] block flex items-center gap-1">
              <span>🎙️ {t.bioVoiceTitle} (22+ Languages):</span>
            </span>
            <VoicePlayer
              artisanName={profile.fullName.split(' ')[0] || 'Sunil'}
              sourceLanguage="मराठी"
            />
          </div>

          {/* + New Post Action Button */}
          <Link
            href="/studio/capture"
            className="artisan-action-btn w-full rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2 py-3.5 transition active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>{t.newPostBtn}</span>
          </Link>
        </section>

        {/* ── 2. INSTAGRAM REELS & POSTS GRID ───────────────────────────── */}
        <section className="space-y-3">
          <ArtisanInstagramFeed
            products={initialProducts}
            artisanName={profile.fullName}
            artisanHandle={profile.handle}
          />
        </section>
      </main>
    </div>
  );
}
