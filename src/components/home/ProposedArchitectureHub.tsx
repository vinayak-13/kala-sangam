'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Wand2,
  Scan,
  Calculator,
  Volume2,
  Building2,
  Landmark,
  Mic,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  WifiOff,
  Layers,
  Award,
} from 'lucide-react';
import { ImageEnhancerStudio } from '@/components/studio/ImageEnhancerStudio';
import { ExplainablePricingCard } from '@/components/pricing/ExplainablePricingCard';
import { HumanInTheLoopAudioGate } from '@/components/studio/HumanInTheLoopAudioGate';
import { SmartOcrOnboarding } from '@/components/onboarding/SmartOcrOnboarding';
import { TwoChannelMarketplace } from '@/components/b2b/TwoChannelMarketplace';
import { G2CConciergeView } from '@/components/concierge/G2CConciergeView';
import { VirtualBusinessManager } from '@/components/artisan/VirtualBusinessManager';
import { AIBadge } from '@/components/AIBadge';

export function ProposedArchitectureHub({ locale = 'hi' }: { locale?: string }) {
  const [activeTab, setActiveTab] = useState<
    | 'manager'
    | 'enhancer'
    | 'ocr'
    | 'pricing'
    | 'audio_check'
    | 'two_channel'
    | 'g2c_concierge'
  >('manager');

  const MODULES = [
    {
      id: 'manager' as const,
      icon: Mic,
      labelHi: 'AI बिज़नेस मैनेजर',
      labelEn: 'AI Virtual Business Manager',
      tag: 'Zero-Typing Voice Hub',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'enhancer' as const,
      icon: Wand2,
      labelHi: 'AI इमेज एन्हांसर',
      labelEn: 'AI Image Enhancer & Studio',
      tag: 'Background Removal',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'ocr' as const,
      icon: Scan,
      labelHi: 'स्मार्ट OCR पहचान',
      labelEn: 'Smart OCR ID Onboarding',
      tag: 'ID Scan to Autofill',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      id: 'pricing' as const,
      icon: Calculator,
      labelHi: 'पारदर्शी मूल्य निर्धारण',
      labelEn: 'Explainable Dynamic Pricing',
      tag: 'Glass-Box Formula',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'audio_check' as const,
      icon: Volume2,
      labelHi: 'वॉइस सुधार गेट',
      labelEn: 'Human-in-the-Loop Audio Check',
      tag: 'Voice Micro-Corrections',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      id: 'two_channel' as const,
      icon: Building2,
      labelHi: 'दोहरा B2B चैनल',
      labelEn: 'Two-Channel B2B Linkage',
      tag: 'Heritage & Cluster Split',
      badgeColor: 'bg-amber-100 text-[#904D00] border-amber-300',
    },
    {
      id: 'g2c_concierge' as const,
      icon: Landmark,
      labelHi: 'G2C सरकारी योजनाएं',
      labelEn: 'G2C Resource Concierge',
      tag: 'Trade Fairs & Schemes',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-[#221A16] via-[#3B2923] to-[#221A16] text-white p-6 sm:p-10 rounded-3xl shadow-xl border-2 border-[#56423C] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-[#FE932C] text-stone-950 font-black text-xs uppercase tracking-wider shadow-md">
              ⚡ LIVE SYSTEM ARCHITECTURE
            </span>
            <AIBadge label="End-to-End Multimodal AI" />
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
              100% Deployed & Interactive
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight text-white leading-tight">
            प्रस्तावित समाधान निष्पादन योजना (Proposed Solution Architecture)
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed">
            ग्रामीण शिल्पकारों और B2B खरीदारों के लिए निर्मित सभी 7 उन्नत डिजिटल मॉड्यूल का सीधा परीक्षण करें। नीचे किसी भी मॉड्यूल पर टैप करके लाइव इंटरैक्ट करें:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/studio/capture"
            className="px-6 py-3.5 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition active:scale-95 text-center flex items-center justify-center gap-2"
          >
            <Mic className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>स्टूडियो में आज़माएं (Try in Studio)</span>
          </Link>
          <Link
            href="/concierge"
            className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition text-center"
          >
            मेला पोर्टल (G2C Hub)
          </Link>
        </div>
      </div>

      {/* Module Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {MODULES.map((m) => {
          const Icon = m.icon;
          const isSelected = activeTab === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveTab(m.id)}
              className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2.5 shrink-0 border-2 shadow-xs active:scale-95 ${
                isSelected
                  ? 'bg-[#9D3E1B] text-white border-[#9D3E1B] shadow-md ring-2 ring-[#9D3E1B]/30'
                  : 'bg-white hover:bg-[#FFF1EB] border-[#E6DCCF] text-[#56423C]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-[#9D3E1B]'}`} />
              <div className="flex flex-col text-left">
                <span>{m.labelHi}</span>
                <span className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-[#56423C]'}`}>
                  {m.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Interactive Component Viewer */}
      <div className="bg-[#FFF8F6] rounded-3xl border-2 border-[#E6DCCF] p-4 sm:p-6 shadow-sm">
        {activeTab === 'manager' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#9D3E1B]" />
                <span className="font-black text-sm text-[#221A16]">
                  1. AI Virtual Business Manager App (Zero Text Typing)
                </span>
              </div>
              <Link href="/studio" className="text-xs font-bold text-[#9D3E1B] hover:underline flex items-center gap-1">
                स्टूडियो डैशबोर्ड खोलें →
              </Link>
            </div>
            <VirtualBusinessManager locale={locale} />
          </div>
        )}

        {activeTab === 'enhancer' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#9D3E1B]" />
                <span className="font-black text-sm text-[#221A16]">
                  2. AI Image Enhancer & Studio (Background Removal & Lighting)
                </span>
              </div>
              <Link href="/studio/capture" className="text-xs font-bold text-[#9D3E1B] hover:underline flex items-center gap-1">
                कैप्चर में खोलें →
              </Link>
            </div>
            <ImageEnhancerStudio />
          </div>
        )}

        {activeTab === 'ocr' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-[#9D3E1B]" />
                <span className="font-black text-sm text-[#221A16]">
                  3. Smart OCR Onboarding (Photo ID Scan to Autofill)
                </span>
              </div>
              <Link href="/studio/onboarding" className="text-xs font-bold text-[#9D3E1B] hover:underline flex items-center gap-1">
                ऑनबोर्डिंग पेज पर जाएं →
              </Link>
            </div>
            <SmartOcrOnboarding
              locale={locale}
              onDataExtracted={(data) => {
                alert(`OCR Success! Detected: ${data.fullName} (${data.craftType}) - ${data.pehchanId}`);
              }}
            />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#9D3E1B]" />
                <span className="font-black text-sm text-[#221A16]">
                  4. Explainable Dynamic Pricing Engine (Glass-Box Formula & Audio Read-Back)
                </span>
              </div>
              <Link href="/studio/capture" className="text-xs font-bold text-[#9D3E1B] hover:underline flex items-center gap-1">
                मूल्य निर्धारण देखें →
              </Link>
            </div>
            <ExplainablePricingCard locale={locale} />
          </div>
        )}

        {activeTab === 'audio_check' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#9D3E1B]" />
                <span className="font-black text-sm text-[#221A16]">
                  5. Human-in-the-Loop Audio Check (One-Tap Voice Micro-Corrections)
                </span>
              </div>
              <Link href="/studio/capture" className="text-xs font-bold text-[#9D3E1B] hover:underline flex items-center gap-1">
                रिव्यू गेट देखें →
              </Link>
            </div>
            <HumanInTheLoopAudioGate locale={locale} />
          </div>
        )}

        {activeTab === 'two_channel' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#904D00]" />
                <span className="font-black text-sm text-[#221A16]">
                  6. Two-Channel B2B Marketplace Linkage (Heritage Masterpieces vs Bulk Village Cluster Capacity)
                </span>
              </div>
              <Link href="/portal" className="text-xs font-bold text-[#904D00] hover:underline flex items-center gap-1">
                B2B पोर्टल खोलें →
              </Link>
            </div>
            <TwoChannelMarketplace />
          </div>
        )}

        {activeTab === 'g2c_concierge' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#9D3E1B]" />
                <span className="font-black text-sm text-[#221A16]">
                  7. G2C Resource Concierge (Ministry Trade Fairs & Welfare Schemes with Voice Alerts)
                </span>
              </div>
              <Link href="/concierge" className="text-xs font-bold text-[#9D3E1B] hover:underline flex items-center gap-1">
                कंसीयज पेज खोलें →
              </Link>
            </div>
            <G2CConciergeView locale={locale} />
          </div>
        )}
      </div>
    </section>
  );
}
