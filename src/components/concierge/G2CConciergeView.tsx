'use client';

import React, { useState } from 'react';
import {
  Landmark,
  Calendar,
  Volume2,
  Square,
  Sparkles,
  ExternalLink,
  Mic,
  CheckCircle2,
  Bell,
  MapPin,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { AIBadge } from '@/components/AIBadge';

interface G2CResource {
  id: string;
  type: 'trade_fair' | 'welfare_scheme';
  titleHi: string;
  titleEn: string;
  ministry: string;
  deadlineOrDates: string;
  location: string;
  benefits: string;
  audioBroadcastHi: string;
  audioBroadcastEn: string;
  isUrgent?: boolean;
}

const G2C_RESOURCES: G2CResource[] = [
  {
    id: 'fair-dilli-haat',
    type: 'trade_fair',
    titleHi: 'दिल्ली हाट राष्ट्रीय हस्तशिल्प मेला (दिवाली उत्सव)',
    titleEn: 'Dilli Haat National Handicrafts Fair (Diwali Utsav)',
    ministry: 'वस्त्र मंत्रालय (Ministry of Textiles, DC Handicrafts)',
    deadlineOrDates: '15 अक्टूबर – 30 अक्टूबर 2026',
    location: 'आईएनए, नई दिल्ली (INA, New Delhi)',
    benefits: 'स्टॉल किराया 70% सब्सिडी युक्त + ₹3,000 यात्रा भत्ता (TA/DA)',
    audioBroadcastHi:
      'दिल्ली हाट राष्ट्रीय हस्तशिल्प मेले के लिए स्टॉल आवेदन शुरू हो गए हैं। वस्त्र मंत्रालय द्वारा चयनित शिल्पकारों को 70% किराया सब्सिडी और यात्रा भत्ता दिया जाएगा। आवेदन करने हेतु नीचे माइक बटन दबाएं।',
    audioBroadcastEn:
      'Stall applications for Dilli Haat National Crafts Fair are now open. Selected artisans receive 70% stall subsidy and travel allowance. Tap voice button to apply.',
    isUrgent: true,
  },
  {
    id: 'scheme-pm-vishwakarma',
    type: 'welfare_scheme',
    titleHi: 'प्रधानमंत्री विश्वकर्मा योजना (PM Vishwakarma Scheme)',
    titleEn: 'PM Vishwakarma Yojana - Modern Toolkit & Collateral-Free Credit',
    ministry: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME)',
    deadlineOrDates: 'सदा खुला (Year-Round Enrollment)',
    location: 'अखिल भारतीय (Pan-India)',
    benefits: '₹15,000 निःशुल्क टूलकिट अनुदान + ₹3,00,000 का 5% रियायती ऋण',
    audioBroadcastHi:
      'पीएम विश्वकर्मा योजना के तहत सभी पारंपरिक शिल्पकारों को आधुनिक औजार खरीदने के लिए ₹15,000 का अनुदान और 5% ब्याज दर पर ₹3 लाख तक का बिना गारंटी ऋण उपलब्ध है।',
    audioBroadcastEn:
      'Under PM Vishwakarma Yojana, traditional artisans get ₹15,000 free toolkit grant and up to ₹3 Lakh collateral-free loan at 5% interest.',
  },
  {
    id: 'fair-surajkund',
    type: 'trade_fair',
    titleHi: 'सूरजकुंड अंतर्राष्ट्रीय शिल्प मेला 2027 (Surajkund Mela)',
    titleEn: 'Surajkund International Crafts Mela 2027',
    ministry: 'पर्यटन एवं संस्कृति मंत्रालय (Ministry of Tourism & Culture)',
    deadlineOrDates: '1 फरवरी – 15 फरवरी 2027 (आवेदन अंतिम तिथि: 30 नव.)',
    location: 'फरीदाबाद, हरियाणा (Surajkund, Haryana)',
    benefits: 'अंतर्राष्ट्रीय खरीदारों से सीधा संपर्क + निःशुल्क आवास व्यवस्था',
    audioBroadcastHi:
      'विश्व प्रसिद्ध सूरजकुंड अंतर्राष्ट्रीय शिल्प मेले के लिए मास्टर शिल्पकारों के आवेदन आमंत्रित हैं। अंतर्राष्ट्रीय खरीदारों से जुड़ने और अपनी कला प्रदर्शित करने का स्वर्णिम अवसर।',
    audioBroadcastEn:
      'Applications invited for world-renowned Surajkund International Crafts Mela. Direct access to international buyers and free lodging.',
  },
  {
    id: 'scheme-pehchan-card',
    type: 'welfare_scheme',
    titleHi: 'पहचान शिल्पकार आईडी कार्ड डिजिटल नवीनीकरण (Pehchan ID)',
    titleEn: 'Digital Pehchan Artisan ID Card & Health Insurance Coverage',
    ministry: 'विकास आयुक्त (हस्तशिल्प) (DC Handicrafts)',
    deadlineOrDates: 'निःशुल्क डिजिटल सत्यापन',
    location: 'ऑनलाइन / निकटतम हस्तशिल्प सेवा केंद्र',
    benefits: '₹5 लाख निःशुल्क कारीगर स्वास्थ्य बीमा + सरकारी प्रदर्शनियों में प्राथमिकता',
    audioBroadcastHi:
      'पहचान कार्ड धारक सभी कारीगरों को ₹5 लाख का स्वास्थ्य बीमा और राष्ट्रीय मेलों में निःशुल्क स्टॉल आवंटन में प्राथमिकता मिलती है। अपने कार्ड का नवीनीकरण कराएं।',
    audioBroadcastEn:
      'Pehchan card holders receive ₹5 Lakh health insurance cover and priority allotment in national exhibitions.',
  },
];

export function G2CConciergeView({ locale = 'hi' }: { locale?: string }) {
  const [filter, setFilter] = useState<'all' | 'trade_fair' | 'welfare_scheme'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [applyingResource, setApplyingResource] = useState<G2CResource | null>(null);
  const [isApplyingWithVoice, setIsApplyingWithVoice] = useState(false);
  const [appliedReceipt, setAppliedReceipt] = useState<string | null>(null);

  const handlePlayAudio = (resource: G2CResource) => {
    if (playingId === resource.id) {
      stopAllAudio();
      setPlayingId(null);
      return;
    }

    stopAllAudio();
    setPlayingId(resource.id);
    playTanpuraChime(1.2);

    const message = locale === 'en' ? resource.audioBroadcastEn : resource.audioBroadcastHi;
    speakText(message, locale, () => {
      setPlayingId(null);
    });
  };

  const handleStartVoiceApply = (resource: G2CResource) => {
    setApplyingResource(resource);
    setIsApplyingWithVoice(true);
    playUiBeep('ready');

    setTimeout(() => {
      setIsApplyingWithVoice(false);
      const receiptNo = `G2C-${Math.floor(100000 + Math.random() * 900000)}`;
      setAppliedReceipt(receiptNo);
      playUiBeep('success');

      const msg = `बधाई हो, आपका ${resource.titleHi} के लिए आवेदन सफलतापूर्वक दर्ज हो गया है। रसीद संख्या ${receiptNo} है।`;
      speakText(msg, locale);
    }, 2400);
  };

  const filtered = G2C_RESOURCES.filter((r) => filter === 'all' || r.type === filter);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-[#E6DCCF] p-6 sm:p-8 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-[#9D3E1B] text-white">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#9D3E1B]">
              G2C सरकारी योजना एवं मेला सेवा (G2C Resource Concierge)
            </span>
            <AIBadge label="Voice Broadcast Alerts" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#221A16] font-heading">
          मंत्रालय व्यापार मेले एवं कल्याणकारी योजनाएं (Ministry Trade Fairs & Schemes)
        </h2>
        <p className="text-xs sm:text-sm text-[#56423C] font-semibold">
          जटिल सरकारी अधिसूचनाओं को सरल प्रादेशिक आवाज़ में सुनें और 1-टैप बोलकर स्टॉल एवं वित्तीय सहायता के लिए आवेदन करें।
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'सभी सूचनाएं (All Alerts)' },
          { id: 'trade_fair', label: '🎪 राष्ट्रीय व्यापार मेले (Trade Fairs)' },
          { id: 'welfare_scheme', label: '🏛️ सरकारी कल्याण योजनाएं (Govt Schemes)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition active:scale-95 ${
              filter === tab.id
                ? 'bg-[#9D3E1B] text-white shadow-md'
                : 'bg-white border border-[#E6DCCF] text-[#56423C] hover:bg-[#FFF8F6]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((resource) => {
          const isPlaying = playingId === resource.id;
          return (
            <div
              key={resource.id}
              className="bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      resource.type === 'trade_fair'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {resource.type === 'trade_fair' ? 'मेला / Exhibition' : 'कल्याणकारी योजना / Scheme'}
                  </span>

                  {resource.isUrgent && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                      आवेदन खुला है (Open Now)
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#221A16]">{resource.titleHi}</h3>
                  <div className="text-xs text-[#56423C] font-semibold">{resource.titleEn}</div>
                </div>

                <div className="space-y-1.5 text-xs text-[#56423C] font-medium bg-[#FAF5EF] p-3.5 rounded-2xl border border-[#E6DCCF]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#9D3E1B]" />
                    <span><strong>तिथियां / अवधि:</strong> {resource.deadlineOrDates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#904D00]" />
                    <span><strong>स्थान:</strong> {resource.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#006B2F] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{resource.benefits}</span>
                  </div>
                </div>
              </div>

              {/* Actions: Audio Listen + 1-Tap Voice Apply */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#E6DCCF]">
                <button
                  type="button"
                  onClick={() => handlePlayAudio(resource)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
                    isPlaying
                      ? 'bg-stone-900 text-white animate-pulse'
                      : 'bg-[#FFF1EB] hover:bg-[#FBEBE4] text-[#9D3E1B] border border-[#DDC0B8]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>रोकें (Stop)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>आवाज़ में सुनें (Listen)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleStartVoiceApply(resource)}
                  className="flex-1 py-2.5 rounded-xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Mic className="w-3.5 h-3.5 text-amber-200" />
                  <span>बोलकर आवेदन करें (Voice Apply)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice Application Modal */}
      {applyingResource && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#E6DCCF] shadow-2xl space-y-5 text-center">
            {isApplyingWithVoice ? (
              <div className="py-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#FFF1EB] text-[#9D3E1B] mx-auto flex items-center justify-center animate-pulse border-4 border-[#9D3E1B]/30">
                  <Mic className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="font-black text-lg text-[#221A16]">
                  आपकी आवाज़ सुनी जा रही है... (Processing Voice Request)
                </h3>
                <p className="text-xs text-[#56423C]">
                  {applyingResource.titleHi} के लिए आपकी पहचान एवं प्रोफाइल विवरण स्वतः संलग्न किया जा रहा है।
                </p>
              </div>
            ) : appliedReceipt ? (
              <div className="py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] text-[#006B2F] mx-auto flex items-center justify-center border-2 border-[#86EFAC]">
                  <CheckCircle2 className="w-8 h-8 fill-current" />
                </div>
                <h3 className="font-black text-xl text-[#221A16]">आवेदन सफल रहा! (Applied Successfully)</h3>
                <div className="p-3 bg-[#FAF5EF] rounded-2xl border border-[#E6DCCF] text-xs font-mono font-bold text-[#9D3E1B]">
                  रसीद सं. (Receipt ID): {appliedReceipt}
                </div>
                <p className="text-xs text-[#56423C]">
                  मंत्रालय नोडल अधिकारी द्वारा सत्यापन के पश्चात SMS और वॉइस कॉल द्वारा सूचित किया जाएगा।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setApplyingResource(null);
                    setAppliedReceipt(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-[#006B2F] text-white font-black text-sm shadow-md"
                >
                  ठीक है (Done)
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
