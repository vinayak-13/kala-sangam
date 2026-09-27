'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Volume2,
  Square,
  Sparkles,
  Info,
  Clock,
  Hammer,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio } from '@/lib/audio-utils';
import { AIBadge } from '@/components/AIBadge';

export interface PricingBreakdownProps {
  rawMaterialsPaise?: number;
  hoursSpent?: number;
  fairLaborRatePerHourPaise?: number;
  artisanMarginPaise?: number;
  packagingPaise?: number;
  craftName?: string;
  locale?: string;
  onPriceSelected?: (pricePaise: number) => void;
}

export function ExplainablePricingCard({
  rawMaterialsPaise = 45000, // ₹450
  hoursSpent = 16,
  fairLaborRatePerHourPaise = 9000, // ₹90 / hr
  artisanMarginPaise = 60000, // ₹600
  packagingPaise = 20000, // ₹200
  craftName = 'वारली हस्तकला (Warli Craft)',
  locale = 'hi',
  onPriceSelected,
}: PricingBreakdownProps) {
  const [hours, setHours] = useState(hoursSpent);
  const [rawCost, setRawCost] = useState(rawMaterialsPaise / 100);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Dynamic glass-box calculations
  const laborTotalPaise = hours * fairLaborRatePerHourPaise;
  const rawTotalPaise = rawCost * 100;
  const subtotalPaise = rawTotalPaise + laborTotalPaise + artisanMarginPaise + packagingPaise;

  const minFairPricePaise = Math.round(subtotalPaise * 0.95);
  const recommendedFairPricePaise = subtotalPaise;
  const maxPremiumPricePaise = Math.round(subtotalPaise * 1.35);

  const rawPercent = Math.round((rawTotalPaise / subtotalPaise) * 100);
  const laborPercent = Math.round((laborTotalPaise / subtotalPaise) * 100);
  const marginPercent = Math.round((artisanMarginPaise / subtotalPaise) * 100);
  const packPercent = Math.max(1, 100 - (rawPercent + laborPercent + marginPercent));

  const handleToggleVoiceExplanation = () => {
    if (isPlayingAudio) {
      stopAllAudio();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    playTanpuraChime(1.2);

    const spokenBreakdown = `पारदर्शी मूल्य निर्धारण: कच्चा माल ₹${rawCost}, शिल्प निर्माण में लगे ${hours} घंटे का उचित पारिश्रमिक ₹${(
      laborTotalPaise / 100
    ).toFixed(0)}, शिल्पकार का कौशल मुनाफा ₹${(artisanMarginPaise / 100).toFixed(
      0
    )}, और पैकेजिंग ₹${(packagingPaise / 100).toFixed(0)}। इस प्रकार आपके उत्पाद का उचित मूल्य ₹${(
      recommendedFairPricePaise / 100
    ).toFixed(0)} है।`;

    speakText(spokenBreakdown, locale, () => {
      setIsPlayingAudio(false);
    });
  };

  return (
    <div className="bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-[#FFF1EB] text-[#9D3E1B]">
              <Calculator className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#9D3E1B]">
              पारदर्शी डायनामिक मूल्य निर्धारण (Explainable Pricing)
            </span>
            <AIBadge label="Glass-Box Formula" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#221A16] font-heading">
            उचित मूल्य गणना एवं लागत विश्लेषण (Fair Value Calculator)
          </h2>
          <p className="text-xs sm:text-sm text-[#56423C] font-semibold mt-0.5">
            कच्चा माल + श्रम घंटे × राज्य न्यूनतम मजदूरी + शिल्पकार प्रीमियम = निष्पक्ष दाम
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleVoiceExplanation}
          className={`px-4 py-2.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition active:scale-95 shrink-0 ${
            isPlayingAudio
              ? 'bg-stone-900 border-stone-900 text-white animate-pulse'
              : 'bg-[#FFF1EB] hover:bg-[#FBEBE4] text-[#9D3E1B] border-[#DDC0B8]'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>रोकें (Stop Audio)</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#9D3E1B]" />
              <span>मूल्य विवरण सुनें (Listen Breakdown)</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Color-Coded Stacked Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-[#56423C]">लागत संरचना (Visual Cost Composition):</span>
          <span className="text-[#9D3E1B]">अनुशंसित दाम: ₹{(recommendedFairPricePaise / 100).toLocaleString('en-IN')}</span>
        </div>

        <div className="w-full h-7 rounded-2xl overflow-hidden flex shadow-inner border border-[#E6DCCF] p-0.5 bg-[#FAF5EF] gap-0.5">
          {/* Blue: Raw Materials */}
          <div
            className="h-full bg-blue-500 rounded-xl transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white px-1 truncate"
            style={{ width: `${rawPercent}%` }}
            title={`कच्चा माल: ₹${rawCost} (${rawPercent}%)`}
          >
            {rawPercent > 10 ? `कच्चा माल ${rawPercent}%` : ''}
          </div>

          {/* Green: Labor Wage */}
          <div
            className="h-full bg-emerald-600 rounded-xl transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white px-1 truncate"
            style={{ width: `${laborPercent}%` }}
            title={`श्रम मजदूरी: ₹${laborTotalPaise / 100} (${laborPercent}%)`}
          >
            {laborPercent > 12 ? `श्रम (${hours} घंटे) ${laborPercent}%` : ''}
          </div>

          {/* Amber: Artisan Skill Margin */}
          <div
            className="h-full bg-amber-500 rounded-xl transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white px-1 truncate"
            style={{ width: `${marginPercent}%` }}
            title={`शिल्पकार प्रीमियम: ₹${artisanMarginPaise / 100} (${marginPercent}%)`}
          >
            {marginPercent > 12 ? `कौशल प्रीमियम ${marginPercent}%` : ''}
          </div>

          {/* Purple: Packaging */}
          <div
            className="h-full bg-purple-500 rounded-xl transition-all duration-300 flex items-center justify-center text-[10px] font-black text-white px-1 truncate"
            style={{ width: `${packPercent}%` }}
            title={`पैकेजिंग: ₹${packagingPaise / 100} (${packPercent}%)`}
          >
            {packPercent > 8 ? `पैकिंग` : ''}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Raw Materials (Blue) */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-blue-900 text-xs font-black">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              कच्चा माल (Materials)
            </span>
            <span>{rawPercent}%</span>
          </div>
          <div className="text-xl font-black text-blue-950">₹{rawCost}</div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-800">लागत बदलें:</span>
            <input
              type="number"
              min="50"
              max="50000"
              step="50"
              value={rawCost}
              onChange={(e) => setRawCost(Number(e.target.value) || 0)}
              className="w-20 px-2 py-0.5 bg-white border border-blue-300 rounded-lg text-xs font-bold text-blue-950 outline-none"
            />
          </div>
        </div>

        {/* Card 2: Fair Labor Wage (Green) */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 space-y-2">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-black">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              श्रम मजदूरी (Fair Wage)
            </span>
            <span>{laborPercent}%</span>
          </div>
          <div className="text-xl font-black text-emerald-950">
            ₹{(laborTotalPaise / 100).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] font-bold text-emerald-800">श्रम घंटे:</span>
            <input
              type="number"
              min="1"
              max="200"
              value={hours}
              onChange={(e) => setHours(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 px-2 py-0.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950 outline-none"
            />
          </div>
        </div>

        {/* Card 3: Artisan Skill Margin (Amber) */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2">
          <div className="flex items-center justify-between text-amber-900 text-xs font-black">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              शिल्प कौशल (Artisan GI)
            </span>
            <span>{marginPercent}%</span>
          </div>
          <div className="text-xl font-black text-amber-950">
            ₹{(artisanMarginPaise / 100).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] font-bold text-amber-800 block">
            मास्टर कारीगर GI विरासत बोनस
          </span>
        </div>

        {/* Card 4: Packaging Buffer (Purple) */}
        <div className="p-4 rounded-2xl bg-purple-50/70 border-2 border-purple-200 space-y-2">
          <div className="flex items-center justify-between text-purple-900 text-xs font-black">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              सुरक्षित पैकिंग (Packaging)
            </span>
            <span>{packPercent}%</span>
          </div>
          <div className="text-xl font-black text-purple-950">
            ₹{(packagingPaise / 100).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] font-bold text-purple-800 block">
            पार्सल सुरक्षा एवं प्रत्यक्ष DBT
          </span>
        </div>
      </div>

      {/* Suggested Pricing Window & Acceptance */}
      <div className="p-5 rounded-2xl bg-[#FAF5EF] border border-[#E6DCCF] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#56423C] uppercase">
              अनुशंसित उचित मूल्य विंडो (Fair Price Window):
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              100% कारीगर हितैषी
            </span>
          </div>
          <div className="text-2xl font-black text-[#9D3E1B]">
            ₹{(minFairPricePaise / 100).toLocaleString('en-IN')} – ₹{(maxPremiumPricePaise / 100).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-[#56423C] font-semibold">
            इस विंडो में उत्पाद तुरंत बिकता है और शिल्पकार को उचित पारिश्रमिक सुनिश्चित होता है।
          </p>
        </div>

        <button
          type="button"
          onClick={() => onPriceSelected && onPriceSelected(recommendedFairPricePaise)}
          className="px-6 py-3 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-sm shadow-md transition active:scale-95 shrink-0"
        >
          ₹{(recommendedFairPricePaise / 100).toLocaleString('en-IN')} पर लॉक करें (Apply Price)
        </button>
      </div>
    </div>
  );
}
