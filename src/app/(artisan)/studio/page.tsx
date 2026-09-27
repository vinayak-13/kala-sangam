'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, Package, TrendingUp, ShoppingBag, Plus, Sparkles, Volume2, ArrowRight, ShieldCheck, Landmark, Building2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { AIBadge } from '@/components/AIBadge';
import { VoiceGuideButton } from '@/components/VoiceGuideButton';
import { VirtualBusinessManager } from '@/components/artisan/VirtualBusinessManager';
import { OfflineSyncBadge } from '@/components/OfflineSyncBadge';
import { ALL_INDIC_LANGUAGES } from '@/lib/i18n/indic-languages';

export default function ArtisanStudioDashboard() {
  const [locale, setLocale] = useState('hi');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kala_preferred_language') || 'hi';
      setLocale(saved);

      const handleLocaleChange = () => {
        const updated = localStorage.getItem('kala_preferred_language') || 'hi';
        setLocale(updated);
      };

      window.addEventListener('storage', handleLocaleChange);
      window.addEventListener('kala_language_changed', handleLocaleChange);

      return () => {
        window.removeEventListener('storage', handleLocaleChange);
        window.removeEventListener('kala_language_changed', handleLocaleChange);
      };
    }
  }, []);

  const currentLangObj =
    ALL_INDIC_LANGUAGES.find((l) => l.code === locale) || ALL_INDIC_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col selection:bg-[#9D3E1B]/20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Artisan Header with Voice Capture CTA (Dual-Language) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E6DCCF] p-6 sm:p-8 rounded-3xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black px-3 py-0.5 rounded-full bg-[#F0FDF4] text-[#006B2F] border border-[#006B2F]/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#006B2F] animate-pulse"></span>
                सत्यापित शिल्पकार (ODOP & GI Verified Artisan)
              </span>
              <AIBadge label="22+ Indic Voice AI" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#221A16] font-heading">
              नमस्ते, सुनील ढनगर (Sunil Dhangar)
            </h1>
            <p className="text-sm text-[#56423C] font-semibold mt-0.5">
              पालघर वारली क्लस्टर (Palghar Warli Cluster) · UDYAM-MH-26-0014891
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <VoiceGuideButton pageKey="studio" locale={locale} />
            <Link
              href="/studio/capture"
              className="artisan-action-btn px-7 py-4 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 transition active:scale-95 shrink-0"
            >
              <Mic className="w-5 h-5 text-amber-200 animate-pulse" />
              <span>नया उत्पाद जोड़ें (Add Product by Voice)</span>
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards (Dual-Language) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[#E6DCCF] p-6 rounded-3xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#56423C] uppercase tracking-wider">कुल कमाई (Total Earnings)</span>
              <TrendingUp className="w-5 h-5 text-[#006B2F]" />
            </div>
            <div className="text-3xl font-black text-[#9D3E1B]">₹1,20,800</div>
            <span className="text-xs text-[#006B2F] font-bold block">12,080,000 paise · 100% Direct DBT Paid</span>
          </div>

          <Link
            href="/studio/orders"
            className="bg-white border-2 border-[#E6DCCF] hover:border-[#9D3E1B] p-6 rounded-3xl shadow-xs space-y-2 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#56423C] uppercase tracking-wider">सक्रिय ऑर्डर्स (Active Orders)</span>
              <ShoppingBag className="w-5 h-5 text-[#9D3E1B]" />
            </div>
            <div className="text-3xl font-black text-[#221A16] flex items-center gap-2">
              <span>6 Orders</span>
              <span className="text-xs font-bold text-[#904D00] px-2.5 py-0.5 bg-[#FFDCC3] rounded-full">
                1 New Bulk!
              </span>
            </div>
            <span className="text-xs text-[#9D3E1B] font-bold group-hover:underline flex items-center gap-1">
              ऑर्डर विवरण व आवाज़ सुनें (View Orders) →
            </span>
          </Link>

          <div className="bg-white border-2 border-[#E6DCCF] p-6 rounded-3xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#56423C] uppercase tracking-wider">प्रकाशित उत्पाद (Listed Crafts)</span>
              <Package className="w-5 h-5 text-[#904D00]" />
            </div>
            <div className="text-3xl font-black text-[#221A16]">4 Products</div>
            <span className="text-xs text-[#006B2F] font-bold block">100% with active voice story clips</span>
          </div>
        </div>

        {/* ── 2 NEW ADVANCED MODULE CARDS (G2C Concierge & Two-Channel B2B) ──── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* G2C Concierge Banner Card */}
          <Link
            href="/concierge"
            className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#E6DCCF] hover:border-[#9D3E1B] shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-[#9D3E1B] text-white">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                दिल्ली हाट आवेदन खुला!
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg text-[#221A16] group-hover:text-[#9D3E1B] transition">
                G2C सरकारी योजना एवं मेला सेवा (G2C Concierge)
              </h3>
              <p className="text-xs text-[#56423C] font-semibold mt-1">
                दिल्ली हाट, सूरजकुंड मेला और पीएम विश्वकर्मा योजना के ऑडियो अलर्ट्स सुनें और बोलकर आवेदन करें।
              </p>
            </div>
            <span className="text-xs font-bold text-[#9D3E1B] flex items-center gap-1 group-hover:underline">
              सरकारी मेले व योजनाएं देखें →
            </span>
          </Link>

          {/* Two-Channel B2B Linkage Card */}
          <Link
            href="/portal"
            className="p-6 rounded-3xl bg-gradient-to-br from-stone-50 to-amber-50 border-2 border-[#E6DCCF] hover:border-[#904D00] shadow-xs transition group flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-[#904D00] text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                सामूहिक क्षमता सक्रिय
              </span>
            </div>
            <div>
              <h3 className="font-black text-lg text-[#221A16] group-hover:text-[#904D00] transition">
                दोहरा B2B बाज़ार चैनल (Two-Channel B2B Linkage)
              </h3>
              <p className="text-xs text-[#56423C] font-semibold mt-1">
                विरासत 1-of-1 मास्टरपीस एवं क्लस्टर सामूहिक उत्पादन कोटा आवंटन।
              </p>
            </div>
            <span className="text-xs font-bold text-[#904D00] flex items-center gap-1 group-hover:underline">
              B2B चैनल व क्लस्टर कोटा देखें →
            </span>
          </Link>
        </div>

        {/* ── AI VIRTUAL BUSINESS MANAGER HUB (VOICE-FIRST) ────────────────── */}
        <VirtualBusinessManager locale={locale} />

        {/* Listed Products Table / Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#221A16]">आपके उत्पाद (Your Listed Products)</h2>
            <Link href="/studio/capture" className="text-xs font-bold text-[#9D3E1B] hover:underline flex items-center gap-1">
              <Plus className="w-4 h-4" /> नया रिकॉर्ड करें (Record New)
            </Link>
          </div>

          <div className="bg-white border-2 border-[#E6DCCF] rounded-3xl overflow-hidden shadow-xs divide-y divide-[#E6DCCF]">
            {[
              {
                id: 'e1111111-0000-0000-0000-000000000001',
                title: 'Traditional Tarpa Dance Festive Warli Canvas',
                price: '₹2,800',
                status: 'Published',
                views: 184,
                hasVoice: true,
              },
              {
                id: 'e1111111-0000-0000-0000-000000000002',
                title: 'Tree of Life Hand-painted Terracotta Plate',
                price: '₹850',
                status: 'Published',
                views: 92,
                hasVoice: true,
              },
              {
                id: 'e1111111-0000-0000-0000-000000000003',
                title: 'Hand-painted Warli Bamboo Pen & Utility Stand',
                price: '₹450',
                status: 'Published',
                views: 65,
                hasVoice: true,
              },
            ].map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FBEBE4] border border-[#E6DCCF] shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150"
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#221A16]">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#56423C] mt-0.5">
                      <span className="font-black text-[#9D3E1B]">{item.price}</span>
                      <span>·</span>
                      <span>{item.views} Views</span>
                      <span>·</span>
                      <span className="text-[#006B2F] font-bold">🔊 Voice Clip Active</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${item.id}`}
                    className="px-4 py-2 rounded-xl bg-[#FFF1EB] text-[#9D3E1B] hover:bg-[#9D3E1B] hover:text-white font-bold text-xs transition shadow-xs"
                  >
                    लाइव देखें (View Live)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <OfflineSyncBadge />
    </div>
  );
}

