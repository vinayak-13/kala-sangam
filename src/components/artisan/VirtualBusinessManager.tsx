'use client';

import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Square,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Landmark,
  Plus,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  X,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { AIBadge } from '@/components/AIBadge';

interface BusinessManagerProps {
  locale?: string;
  isFloating?: boolean;
}

export function VirtualBusinessManager({ locale = 'hi', isFloating = false }: BusinessManagerProps) {
  const [isOpen, setIsOpen] = useState(!isFloating);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  const [activeReply, setActiveReply] = useState<{
    textHi: string;
    textEn: string;
    metric?: string;
    actionLink?: string;
    actionLabel?: string;
  } | null>(null);

  const QUICK_INTENTS = [
    {
      id: 'orders',
      titleHi: '📦 आज के नए ऑर्डर्स (Today’s Orders)',
      spokenQuery: 'आज कितने ऑर्डर्स आए हैं?',
      replyHi:
        'नमस्ते सुनील जी! आज आपके पास 6 सक्रिय ऑर्डर्स हैं। इनमें 1 नया थोक ऑर्डर ₹45,000 का कॉरपोरेट गिफ्टिंग के लिए प्राप्त हुआ है।',
      replyEn: 'Hello Sunil! You have 6 active orders today, including 1 new bulk order worth ₹45,000.',
      metric: '6 Active Orders (₹45,000)',
      actionLink: '/studio/orders',
      actionLabel: 'ऑर्डर देखें (View Orders)',
    },
    {
      id: 'payouts',
      titleHi: '💰 DBT बैंक भुगतान स्थिति (Payment Status)',
      spokenQuery: 'मेरा बैंक भुगतान कब आएगा?',
      replyHi:
        'आपकी कुल कमाई ₹1,20,800 है। आपका पिछला ₹28,000 का DBT भुगतान सीधे आपके बैंक खाते में सफलतापूर्वक क्रेडिट हो चुका है। कोई बकाया लंबित नहीं है।',
      replyEn: 'Your total earnings are ₹1,20,800. ₹28,000 DBT transfer was credited to your bank account.',
      metric: '₹1,20,800 DBT Settled',
      actionLink: '/studio',
      actionLabel: 'कमाई विवरण (Earnings)',
    },
    {
      id: 'trade_fair',
      titleHi: '🎪 दिल्ली हाट स्टॉल स्थिति (Trade Fair Status)',
      spokenQuery: 'दिल्ली हाट मेले का क्या हुआ?',
      replyHi:
        'दिल्ली हाट राष्ट्रीय मेले के लिए आपका आवेदन स्वीकृत हो चुका है। वस्त्र मंत्रालय द्वारा स्टॉल नंबर 42 आवंटित किया गया है।',
      replyEn: 'Your application for Dilli Haat is approved. Stall No. 42 has been allotted.',
      metric: 'Stall #42 Confirmed',
      actionLink: '/concierge',
      actionLabel: 'मेला पास देखें (Trade Fair Pass)',
    },
    {
      id: 'add_product',
      titleHi: '🎙️ नया उत्पाद जोड़ें (Add Product by Voice)',
      spokenQuery: 'नया उत्पाद जोड़ना है',
      replyHi: 'कैमरा और माइक्रोफ़ोन तैयार है। चलिए आपके नए शिल्प का वीडियो और आवाज़ रिकॉर्ड करते हैं।',
      replyEn: 'Camera and microphone are ready. Let us record your craft video and voice story.',
      metric: 'Ready to Record',
      actionLink: '/studio/capture',
      actionLabel: 'कैमरा खोलें (Start Capture)',
    },
  ];

  const handleTriggerIntent = (intent: (typeof QUICK_INTENTS)[0]) => {
    stopAllAudio();
    setCurrentQuery(intent.spokenQuery);
    setIsListening(true);
    playUiBeep('ready');

    setTimeout(() => {
      setIsListening(false);
      setActiveReply({
        textHi: intent.replyHi,
        textEn: intent.replyEn,
        metric: intent.metric,
        actionLink: intent.actionLink,
        actionLabel: intent.actionLabel,
      });

      setIsSpeaking(true);
      playTanpuraChime(1.2);
      const textToSpeak = locale === 'en' ? intent.replyEn : intent.replyHi;
      speakText(textToSpeak, locale, () => {
        setIsSpeaking(false);
      });
    }, 1200);
  };

  const handleCustomMicClick = () => {
    // Randomly pick or cycle through intents
    const sample = QUICK_INTENTS[Math.floor(Math.random() * QUICK_INTENTS.length)];
    handleTriggerIntent(sample);
  };

  const handleStopSpeech = () => {
    stopAllAudio();
    setIsSpeaking(false);
    setIsListening(false);
  };

  if (isFloating && !isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 z-40 p-4 rounded-full bg-gradient-to-tr from-[#9D3E1B] to-[#FE932C] text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border-2 border-white/50"
      >
        <Mic className="w-6 h-6 animate-pulse text-amber-200" />
        <span className="font-black text-xs hidden sm:inline">AI बिज़नेस मैनेजर (Voice Manager)</span>
      </button>
    );
  }

  return (
    <div
      className={`bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 ${
        isFloating ? 'fixed bottom-20 right-4 sm:right-8 z-50 max-w-lg w-full shadow-2xl border-[#9D3E1B]' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9D3E1B] to-[#FE932C] text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#9D3E1B]">
                AI वर्चुअल बिज़नेस मैनेजर (AI Business Manager)
              </span>
              <AIBadge label="Zero Text Typing" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#221A16] font-heading">
              बोलकर व्यापार संभालें (Voice Business Hub)
            </h2>
          </div>
        </div>

        {isFloating && (
          <button
            type="button"
            onClick={() => {
              stopAllAudio();
              setIsOpen(false);
            }}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Large Pulsing Central Conversational Sphere */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#FFF8F6] to-[#FFF1EB] border-2 border-[#E6DCCF] text-center space-y-4">
        <div className="relative inline-block">
          <button
            type="button"
            onClick={isSpeaking ? handleStopSpeech : handleCustomMicClick}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 shadow-xl ${
              isSpeaking
                ? 'bg-stone-900 ring-8 ring-stone-900/20 animate-pulse'
                : isListening
                ? 'bg-rose-600 ring-8 ring-rose-500/30 animate-ping'
                : 'bg-gradient-to-tr from-[#9D3E1B] to-[#FE932C] hover:scale-105 ring-8 ring-[#FE932C]/20'
            }`}
          >
            {isSpeaking ? (
              <Square className="w-8 h-8 fill-current" />
            ) : (
              <Mic className="w-10 h-10 animate-pulse text-amber-200" />
            )}
          </button>
        </div>

        <div>
          <span className="text-xs font-bold text-[#56423C] block">
            {isSpeaking
              ? 'आवाज़ में उत्तर दे रहे हैं (Speaking Response)...'
              : isListening
              ? 'आपकी आवाज़ सुनी जा रही है (Listening)...'
              : 'माइक दबाएं और कुछ भी पूछें (Tap Mic & Speak)'}
          </span>
          {currentQuery && (
            <div className="mt-1 text-xs font-black text-[#9D3E1B] bg-white/80 py-1 px-3 rounded-full inline-block border border-[#DDC0B8]">
              &ldquo;{currentQuery}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Active Spoken Reply Card */}
      {activeReply && (
        <div className="p-5 rounded-2xl bg-[#F0FDF4] border-2 border-[#86EFAC] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#006B2F]">
              <CheckCircle2 className="w-5 h-5 fill-current text-[#006B2F]" />
              <span className="font-black text-sm">{activeReply.metric || 'उत्तर प्राप्त हुआ'}</span>
            </div>

            {isSpeaking && (
              <button
                type="button"
                onClick={handleStopSpeech}
                className="text-[11px] font-bold text-[#006B2F] bg-white px-2 py-0.5 rounded-lg border border-[#86EFAC]"
              >
                रोकें (Stop)
              </button>
            )}
          </div>

          <p className="text-sm font-bold text-[#221A16] leading-relaxed">
            {activeReply.textHi}
          </p>
          <p className="text-xs text-[#56423C] font-semibold">
            {activeReply.textEn}
          </p>

          {activeReply.actionLink && (
            <Link
              href={activeReply.actionLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006B2F] hover:bg-[#005224] text-white font-black text-xs shadow-xs transition"
            >
              <span>{activeReply.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Quick Voice Intent Buttons */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#56423C]">
          त्वरित आवाज़ प्रश्न (Quick Spoken Voice Queries):
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_INTENTS.map((intent) => (
            <button
              key={intent.id}
              type="button"
              onClick={() => handleTriggerIntent(intent)}
              className="p-3 rounded-2xl bg-[#FAF5EF] hover:bg-[#F2E8DC] hover:border-[#9D3E1B] border border-[#E6DCCF] text-left transition active:scale-95 flex items-center justify-between group"
            >
              <div className="text-xs font-black text-[#221A16] group-hover:text-[#9D3E1B]">
                {intent.titleHi}
              </div>
              <Mic className="w-3.5 h-3.5 text-[#9D3E1B] shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
