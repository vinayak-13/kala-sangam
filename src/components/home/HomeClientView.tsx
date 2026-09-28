'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mic,
  Sparkles,
  Store,
  ShieldCheck,
  ArrowRight,
  Globe2,
  Building2,
  Award,
  Volume2,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { HeroAudioPlayer } from '@/components/home/HeroAudioPlayer';
import { WelcomeLanguageGateway } from '@/components/onboarding/WelcomeLanguageGateway';
import { ProposedArchitectureHub } from '@/components/home/ProposedArchitectureHub';
import { VoiceGuideButton } from '@/components/VoiceGuideButton';
import { getHomePageI18n, ALL_INDIC_LANGUAGES } from '@/lib/i18n/indic-languages';

interface HomeClientViewProps {
  products: any[];
}

export function HomeClientView({ products }: HomeClientViewProps) {
  const [locale, setLocale] = useState<string | null>(null);
  const [showLanguageGateway, setShowLanguageGateway] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kala_preferred_language');
      if (!saved) {
        setShowLanguageGateway(true);
      } else {
        setLocale(saved);
      }

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

  const handleLanguageComplete = (selectedLocale: string) => {
    setLocale(selectedLocale);
    setShowLanguageGateway(false);
  };

  // If first-time visitor with no language chosen yet, show full-screen language gateway
  if (showLanguageGateway) {
    return <WelcomeLanguageGateway onComplete={handleLanguageComplete} />;
  }

  const activeLocale = locale || 'hi';
  const t = getHomePageI18n(activeLocale);
  const currentLangObj =
    ALL_INDIC_LANGUAGES.find((l) => l.code === activeLocale) || ALL_INDIC_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col selection:bg-[#9D3E1B]/20">
      <Navbar />

      <main className="flex-1">
        {/* ── 1. TOP ANNOUNCE & TRUST BAR (DUAL-LANGUAGE) ──────────────────── */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-3.5 pb-2 border-b border-[#E6DCCF]/60 bg-[#FFF1EB]/40">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5E5DE] text-[#904D00] border border-[#DDC0B8]">
              <Sparkles className="w-4 h-4 text-[#FE932C]" />
              <span className="text-xs font-bold">
                {t.trustBarTag}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-[#56423C]">
              <span className="flex items-center gap-1.5 text-[#006B2F]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006B2F] inline-block animate-pulse"></span>
                {t.trustBarOnline}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[#56423C]">
                <ShieldCheck className="w-4 h-4 text-[#006B2F]" />
                {t.trustBarGov}
              </span>
            </div>
          </div>
        </section>

        {/* ── 2. HERO SECTION (DUAL-LANGUAGE HEADINGS & CALLOUTS) ───────────── */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Dual-Language Heading & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs sm:text-sm uppercase tracking-wider text-[#9D3E1B] font-black">
                  {t.heroTag}
                </span>

                {/* Primary Native Language Heading */}
                <h1 className="text-4xl sm:text-6xl font-black text-[#221A16] font-heading tracking-tight leading-[1.1]">
                  {t.heroHeading}<br />
                  <span className="text-[#9D3E1B] underline decoration-[#FE932C] decoration-wavy decoration-3 underline-offset-8">
                    {t.heroHighlight}
                  </span>
                </h1>

                {/* English Parallel Subtitle */}
                <p className="text-lg sm:text-xl text-[#904D00] font-bold mt-2 italic">
                  &ldquo;{t.heroSub}&rdquo;
                </p>
              </div>

              {/* Native Description */}
              <p className="text-base sm:text-lg text-[#56423C] max-w-2xl leading-relaxed font-medium">
                {t.heroDesc}
              </p>

              {/* Big Tactile Triggers (Dual-Language Buttons) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                <Link
                  href="/studio/capture"
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 min-h-[58px]"
                >
                  <Mic className="w-6 h-6 text-amber-200 group-hover:scale-110 transition-transform animate-pulse" />
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-base sm:text-lg font-black">{t.artisanBtnTitle}</span>
                    <span className="text-xs text-[#FFDBD0] font-medium mt-1">{t.artisanBtnSub}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/explore"
                  className="group flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-white hover:bg-[#FFF1EB] text-[#221A16] border-2 border-[#E6DCCF] hover:border-[#9D3E1B] transition-all duration-200 shadow-sm min-h-[58px]"
                >
                  <Store className="w-6 h-6 text-[#904D00]" />
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-base font-black">{t.buyerBtnTitle}</span>
                    <span className="text-xs text-[#56423C] font-medium mt-1">{t.buyerBtnSub}</span>
                  </div>
                </Link>
              </div>

              {/* Trust Badges Row (Dual-Language) */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 w-full max-w-xl">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FFF1EB] border border-[#DDC0B8]">
                  <ShieldCheck className="w-6 h-6 text-[#006B2F] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-[#221A16]">{t.badge1Title}</span>
                    <span className="text-[10px] text-[#56423C] font-bold truncate">{t.badge1Sub}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FFF1EB] border border-[#DDC0B8]">
                  <Globe2 className="w-6 h-6 text-[#9D3E1B] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-[#221A16]">{t.badge2Title}</span>
                    <span className="text-[10px] text-[#56423C] font-bold truncate">{t.badge2Sub}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FFF1EB] border border-[#DDC0B8]">
                  <Award className="w-6 h-6 text-[#904D00] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-[#221A16]">{t.badge3Title}</span>
                    <span className="text-[10px] text-[#56423C] font-bold truncate">{t.badge3Sub}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Live Voice Provenance Player */}
            <div className="lg:col-span-5 flex flex-col">
              <HeroAudioPlayer />
            </div>
          </div>
        </section>

        {/* ── 2.5 INTERACTIVE PROPOSED ARCHITECTURE & SOLUTION HUB ─────────── */}
        <ProposedArchitectureHub locale={activeLocale} />

        {/* ── 3. MASTERPIECES SHOWCASE (GI & ODOP CRAFTS) ─────────────────── */}
        <section id="masterpieces" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-[#9D3E1B] uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-[#006B2F]" />
                <span>Authentic GI & ODOP Masterpieces</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#221A16] font-heading">
                {t.craftsHeading}
              </h2>
              <p className="text-sm text-[#56423C] mt-1">
                {t.craftsSub}
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#9D3E1B] hover:text-[#802906] hover:underline"
            >
              <span>{t.viewAllCrafts}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── 4. HOW IT WORKS / DUAL-LANGUAGE 3-STEP FLOW ──────────────────── */}
        <section className="bg-[#FFF1EB]/60 border-y border-[#E6DCCF] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-black text-[#9D3E1B] uppercase tracking-wider">
                {t.howItWorksTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#221A16] font-heading">
                {t.howItWorksHeading}
              </h2>
              <p className="text-base text-[#56423C]">
                {t.howItWorksSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1EB] text-[#9D3E1B] flex items-center justify-center font-black text-xl">
                  1
                </div>
                <h3 className="text-lg font-bold text-[#221A16]">{t.step1Title}</h3>
                <p className="text-xs text-[#56423C] leading-relaxed">
                  {t.step1Desc}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFDCC3] text-[#904D00] flex items-center justify-center font-black text-xl">
                  2
                </div>
                <h3 className="text-lg font-bold text-[#221A16]">{t.step2Title}</h3>
                <p className="text-xs text-[#56423C] leading-relaxed">
                  {t.step2Desc}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-3xl border border-[#E6DCCF] shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#006B2F] flex items-center justify-center font-black text-xl">
                  3
                </div>
                <h3 className="text-lg font-bold text-[#221A16]">{t.step3Title}</h3>
                <p className="text-xs text-[#56423C] leading-relaxed">
                  {t.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. ARE YOU AN ARTISAN? BANNER ──────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#9D3E1B] to-[#802906] text-white py-16">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>कारीगर सशक्तिकरण मंच · 100% Free & Open Access</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-heading leading-tight">
              {t.ctaHeading}
            </h2>

            <p className="text-base sm:text-xl text-[#FFDBD0] max-w-2xl mx-auto leading-relaxed">
              {t.ctaSub}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/studio/capture"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#9D3E1B] hover:bg-[#FFF8F6] font-black text-lg shadow-2xl transition active:scale-95"
              >
                <Mic className="w-6 h-6 text-[#9D3E1B] animate-pulse" />
                <span>{t.ctaBtn}</span>
              </Link>

              <Link
                href="/portal"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base backdrop-blur-md border border-white/20 transition"
              >
                <Building2 className="w-5 h-5 text-amber-200" />
                <span>{t.b2bBtn}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#221A16] text-[#DDC0B8] py-12 text-center text-xs space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#56423C] pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#9D3E1B] text-white flex items-center justify-center font-bold">
              क
            </div>
            <span className="font-bold text-white text-sm">कला-संगम KALA-SANGAM</span>
          </div>

          <div className="flex gap-6 text-xs text-[#DDC0B8]">
            <Link href="/explore" className="hover:text-white transition">Marketplace</Link>
            <Link href="/portal" className="hover:text-white transition">B2B Wholesale</Link>
            <Link href="/studio/capture" className="hover:text-white transition">Artisan Studio</Link>
            <Link href="/cart" className="hover:text-white transition">Cart</Link>
          </div>
        </div>

        <p>© 2026 KALA-SANGAM · Voice-First Multilingual Artisan Marketplace · Smart India Hackathon PS 26090</p>
      </footer>
    </div>
  );
}
