'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  CheckCircle2,
  Edit3,
  Sparkles,
  Square,
  RefreshCw,
  HelpCircle,
  VolumeX,
} from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { AIBadge } from '@/components/AIBadge';

export interface ListingDraft {
  title: string;
  pricePaise: number;
  craftType: string;
  materials: string;
  story: string;
  stockQty: number;
}

interface HumanInTheLoopProps {
  initialListing?: ListingDraft;
  locale?: string;
  onListingApproved?: (listing: ListingDraft) => void;
}

export function HumanInTheLoopAudioGate({
  initialListing = {
    title: 'पारंपरिक वारली तारपा नृत्य कैनवास (Traditional Warli Canvas)',
    pricePaise: 280000, // ₹2,800
    craftType: 'वारली लोक चित्रकला (Warli Folk Art)',
    materials: 'गेरू लाल मिट्टी, चावल का प्राकृतिक लेप, बांस की तीली',
    story: 'यह पेंटिंग फसल उत्सव और तारपा नृत्य का उत्सव मनाती है। यह 100% पर्यावरण-अनुकूल प्राकृतिक रंगों से तैयार की गई है।',
    stockQty: 4,
  },
  locale = 'hi',
  onListingApproved,
}: HumanInTheLoopProps) {
  const [listing, setListing] = useState<ListingDraft>(initialListing);
  const [isPlayingFullAudio, setIsPlayingFullAudio] = useState(false);
  const [activeRecordingField, setActiveRecordingField] = useState<keyof ListingDraft | null>(null);
  const [lastCorrectionMessage, setLastCorrectionMessage] = useState<string | null>(null);

  // Full Voice Read-Back
  const handleReadFullListing = () => {
    if (isPlayingFullAudio) {
      stopAllAudio();
      setIsPlayingFullAudio(false);
      return;
    }

    setIsPlayingFullAudio(true);
    playTanpuraChime(1.5);

    const fullNarration = `उत्पाद विवरण समीक्षा: शीर्षक ${listing.title}। शिल्प विधा ${listing.craftType}। सामग्री ${listing.materials}। तय किया गया मूल्य ₹${(
      listing.pricePaise / 100
    ).toFixed(0)}। उपलब्ध मात्रा ${listing.stockQty} नग। यदि कोई बदलाव करना हो तो संबंधित माइक बटन दबाकर बोलें।`;

    speakText(fullNarration, locale, () => {
      setIsPlayingFullAudio(false);
    });
  };

  // Micro-Correction Voice Trigger
  const handleMicroCorrection = (field: keyof ListingDraft) => {
    stopAllAudio();
    setActiveRecordingField(field);
    playUiBeep('ready');

    // Simulate speech-to-intent parsing after 2s
    setTimeout(() => {
      setActiveRecordingField(null);
      playUiBeep('success');

      let updatedValue: any = listing[field];
      let confirmMsg = '';

      if (field === 'pricePaise') {
        const newPrice = listing.pricePaise === 280000 ? 320000 : 280000;
        updatedValue = newPrice;
        confirmMsg = `मूल्य बदलकर ₹${(newPrice / 100).toFixed(0)} कर दिया गया है।`;
      } else if (field === 'materials') {
        updatedValue = 'प्राकृतिक गेरू मिट्टी, चावल का लेप, और खादी कॉटन बेस (Organically Treated)';
        confirmMsg = `सामग्री विवरण अद्यतित कर दिया गया है।`;
      } else if (field === 'stockQty') {
        updatedValue = listing.stockQty + 2;
        confirmMsg = `उपलब्ध मात्रा ${updatedValue} नग कर दी गई है।`;
      } else if (field === 'title') {
        updatedValue = 'विरासत वारली तारपा नृत्य कैनवास - जीआई प्रमाणित (GI Verified)';
        confirmMsg = `शीर्षक सफलतापूर्वक संशोधित किया गया।`;
      } else {
        confirmMsg = `विवरण में संशोधन सहेज लिया गया।`;
      }

      setListing((prev) => ({ ...prev, [field]: updatedValue }));
      setLastCorrectionMessage(confirmMsg);

      // Speak confirmation
      speakText(confirmMsg, locale);
    }, 2000);
  };

  const handleApproveListing = () => {
    stopAllAudio();
    playTanpuraChime(2.0);
    if (onListingApproved) {
      onListingApproved(listing);
    }
  };

  return (
    <div className="bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-[#FFF1EB] text-[#9D3E1B]">
              <Volume2 className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#9D3E1B]">
              मानव-इन-द-लूप आवाज़ सत्यापन (Human-in-the-Loop Audio Check)
            </span>
            <AIBadge label="Voice Micro-Corrections" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#221A16] font-heading">
            बोलकर त्रुटि सुधारें (Zero-Typing Voice Correction Gate)
          </h2>
          <p className="text-xs sm:text-sm text-[#56423C] font-semibold mt-0.5">
            AI द्वारा तैयार लिस्टिंग को आवाज़ में सुनें और किसी भी त्रुटि को केवल बोलकर ठीक करें।
          </p>
        </div>

        <button
          type="button"
          onClick={handleReadFullListing}
          className={`px-5 py-2.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shrink-0 ${
            isPlayingFullAudio
              ? 'bg-stone-900 border-stone-900 text-white animate-pulse'
              : 'bg-[#9D3E1B] text-white hover:bg-[#802906]'
          }`}
        >
          {isPlayingFullAudio ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>रोकें (Stop Audio)</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>पूरी लिस्टिंग सुनें (Full Audio Readback)</span>
            </>
          )}
        </button>
      </div>

      {/* Spoken Feedback Alert */}
      {lastCorrectionMessage && (
        <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] text-[#006B2F] text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{lastCorrectionMessage}</span>
          </div>
          <span className="text-[10px] text-[#006B2F]/80">वॉइस अपडेटेड</span>
        </div>
      )}

      {/* Interactive Micro-Correction Fields */}
      <div className="space-y-3 divide-y divide-[#E6DCCF]">
        {/* Field 1: Title */}
        <div className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#56423C] uppercase">उत्पाद शीर्षक (Title)</span>
            <div className="text-sm font-black text-[#221A16]">{listing.title}</div>
          </div>

          <button
            type="button"
            onClick={() => handleMicroCorrection('title')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
              activeRecordingField === 'title'
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'bg-[#FAF5EF] hover:bg-[#F2E8DC] text-[#9D3E1B] border-[#E6DCCF]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{activeRecordingField === 'title' ? 'बोलें... (Listening)' : 'बोलकर सुधारें (Voice Edit)'}</span>
          </button>
        </div>

        {/* Field 2: Price (₹) */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#56423C] uppercase">तय किया गया मूल्य (Price)</span>
            <div className="text-base font-black text-[#9D3E1B]">
              ₹{(listing.pricePaise / 100).toLocaleString('en-IN')}
              <span className="text-xs text-[#56423C] font-normal ml-2">({listing.pricePaise} paise)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleMicroCorrection('pricePaise')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
              activeRecordingField === 'pricePaise'
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'bg-[#FAF5EF] hover:bg-[#F2E8DC] text-[#9D3E1B] border-[#E6DCCF]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{activeRecordingField === 'pricePaise' ? 'दाम बोलें...' : 'दाम बदलें (Voice Edit Price)'}</span>
          </button>
        </div>

        {/* Field 3: Materials */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#56423C] uppercase">प्राकृतिक सामग्री (Materials)</span>
            <div className="text-xs font-bold text-[#221A16]">{listing.materials}</div>
          </div>

          <button
            type="button"
            onClick={() => handleMicroCorrection('materials')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
              activeRecordingField === 'materials'
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'bg-[#FAF5EF] hover:bg-[#F2E8DC] text-[#9D3E1B] border-[#E6DCCF]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{activeRecordingField === 'materials' ? 'सामग्री बोलें...' : 'सामग्री सुधारें (Voice Edit)'}</span>
          </button>
        </div>

        {/* Field 4: Stock Quantity */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-[#56423C] uppercase">उपलब्ध स्टॉक मात्रा (Available Stock)</span>
            <div className="text-sm font-black text-[#006B2F]">{listing.stockQty} नग (Units in Stock)</div>
          </div>

          <button
            type="button"
            onClick={() => handleMicroCorrection('stockQty')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
              activeRecordingField === 'stockQty'
                ? 'bg-rose-600 border-rose-600 text-white animate-pulse'
                : 'bg-[#FAF5EF] hover:bg-[#F2E8DC] text-[#9D3E1B] border-[#E6DCCF]'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{activeRecordingField === 'stockQty' ? 'संख्या बोलें...' : 'स्टॉक बदलें (Voice Edit)'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleApproveListing}
          className="w-full py-4 rounded-2xl bg-[#006B2F] hover:bg-[#005224] text-white font-black text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>विवरण 100% सही है · प्रकाशित करें (Approve & Publish Listing)</span>
        </button>
      </div>
    </div>
  );
}
