'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  ShoppingBag,
  Mic,
  Building2,
  Store,
  UserCircle2,
  Volume2,
  Globe,
  User,
} from 'lucide-react';
import { RoleGatekeeperModal } from '@/components/RoleGatekeeperModal';
import { WelcomeLanguageGateway } from '@/components/onboarding/WelcomeLanguageGateway';
import { VoiceGuideButton } from '@/components/VoiceGuideButton';
import { ALL_INDIC_LANGUAGES } from '@/lib/i18n/indic-languages';

export function Navbar() {
  const [openGatekeeper, setOpenGatekeeper] = useState(false);
  const [openLanguageModal, setOpenLanguageModal] = useState(false);
  const [activeLocale, setActiveLocale] = useState('hi');
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kala_preferred_language') || 'hi';
      setActiveLocale(saved);

      const handleLocaleChange = () => {
        const updated = localStorage.getItem('kala_preferred_language') || 'hi';
        setActiveLocale(updated);
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
    ALL_INDIC_LANGUAGES.find((l) => l.code === activeLocale) || ALL_INDIC_LANGUAGES[0];

  const getPageKey = () => {
    if (pathname?.startsWith('/studio/capture')) return 'capture';
    if (pathname?.startsWith('/studio')) return 'studio';
    if (pathname?.startsWith('/explore')) return 'explore';
    if (pathname?.startsWith('/portal')) return 'portal';
    return 'home';
  };

  return (
    <>
      <RoleGatekeeperModal forceOpen={openGatekeeper} onClose={() => setOpenGatekeeper(false)} />

      {/* Language Switcher Modal */}
      {openLanguageModal && (
        <WelcomeLanguageGateway
          isModal
          initialLocale={activeLocale}
          onClose={() => setOpenLanguageModal(false)}
          onComplete={(newLocale) => {
            setActiveLocale(newLocale);
            setOpenLanguageModal(false);
          }}
        />
      )}

      {/* ── TOP HEADER ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FFF8F6]/95 backdrop-blur-md border-b border-[#E6DCCF] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Bilingual Header */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-12 h-12 rounded-2xl bg-[#9D3E1B] text-white flex items-center justify-center font-black text-2xl shadow-[0_2px_8px_rgba(157,62,27,0.3)] group-hover:bg-[#802906] transition-all">
              क
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#221A16] leading-none">
                  कला-संगम
                </span>
                <span className="text-xs font-bold text-[#56423C] tracking-wide">
                  KALA-SANGAM
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#9D3E1B] tracking-wider uppercase">
                Voice-First Artisan Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 font-bold text-sm">
            <Link
              href="/explore"
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                pathname === '/explore'
                  ? 'bg-[#F5E5DE] text-[#9D3E1B]'
                  : 'text-[#56423C] hover:bg-[#FBEBE4] hover:text-[#221A16]'
              }`}
            >
              <Store className="w-4 h-4 text-[#9D3E1B]" />
              <span>बाज़ार / Marketplace</span>
            </Link>

            <Link
              href="/portal"
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                pathname?.startsWith('/portal')
                  ? 'bg-[#F5E5DE] text-[#9D3E1B]'
                  : 'text-[#56423C] hover:bg-[#FBEBE4] hover:text-[#221A16]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#904D00]" />
              <span>थोक व्यापार / Wholesale</span>
            </Link>

            <Link
              href="/studio"
              className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
                pathname === '/studio'
                  ? 'bg-[#F5E5DE] text-[#9D3E1B]'
                  : 'text-[#56423C] hover:bg-[#FBEBE4] hover:text-[#221A16]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#006B2F]" />
              <span>स्टूडियो / Studio</span>
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 1-Tap 22+ Languages Switcher Pill */}
            <button
              type="button"
              onClick={() => setOpenLanguageModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FFF1EB] text-[#9D3E1B] border border-[#DDC0B8] font-bold text-xs shadow-xs transition active:scale-95"
              title="भाषा बदलें / Change Language"
            >
              <Globe className="w-4 h-4 text-[#FE932C]" />
              <span className="font-black">{currentLangObj.nativeName}</span>
              <span className="text-[10px] text-[#56423C] hidden sm:inline">({currentLangObj.name})</span>
            </button>

            {/* Universal Spoken Voice Guide Button */}
            <VoiceGuideButton pageKey={getPageKey()} locale={activeLocale} />

            {/* Artisan Studio Direct CTA */}
            <Link
              href="/studio/capture"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition active:scale-95 min-h-[42px]"
            >
              <Mic className="w-4 h-4 animate-pulse text-amber-200" />
              <span className="whitespace-nowrap">बोलकर बेचें (Capture)</span>
            </Link>

            {/* Role Switcher Modal Button */}
            <button
              type="button"
              onClick={() => setOpenGatekeeper(true)}
              className="p-2.5 rounded-2xl border border-[#DDC0B8] bg-white hover:bg-[#FFF1EB] text-[#56423C] hover:text-[#9D3E1B] transition shadow-xs"
              title="भूमिका बदलें (Switch Role)"
            >
              <UserCircle2 className="w-5 h-5 text-[#9D3E1B]" />
            </button>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="p-2.5 rounded-2xl border border-[#DDC0B8] bg-white hover:bg-[#FFF1EB] text-[#221A16] transition relative shadow-xs"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9D3E1B] text-white text-[10px] font-black flex items-center justify-center">
                1
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#FFF8F6]/95 backdrop-blur-xl border-t border-[#E6DCCF] px-2 py-1.5 pb-safe shadow-2xl">
        <div className="grid grid-cols-4 gap-1 text-center">
          <Link
            href="/explore"
            className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-bold transition ${
              pathname === '/explore' ? 'text-[#9D3E1B] bg-[#FFF1EB]' : 'text-[#56423C]'
            }`}
          >
            <Store className="w-5 h-5 mb-0.5 text-[#9D3E1B]" />
            <span>बाज़ार</span>
          </Link>

          <Link
            href="/studio/capture"
            className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-bold transition ${
              pathname?.startsWith('/studio/capture') ? 'text-[#9D3E1B] bg-[#FFF1EB]' : 'text-[#56423C]'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-[#9D3E1B] text-white flex items-center justify-center -mt-1 shadow-sm">
              <Mic className="w-3.5 h-3.5" />
            </div>
            <span>स्टूडियो</span>
          </Link>

          <Link
            href="/studio/onboarding"
            className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-bold transition ${
              pathname?.startsWith('/studio/onboarding') ? 'text-[#9D3E1B] bg-[#FFF1EB]' : 'text-[#56423C]'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>प्रोफाइल</span>
          </Link>

          <Link
            href="/portal"
            className={`flex flex-col items-center py-2 rounded-xl text-[11px] font-bold transition ${
              pathname?.startsWith('/portal') ? 'text-[#904D00] bg-[#FFDCC3]/40' : 'text-[#56423C]'
            }`}
          >
            <Building2 className="w-5 h-5 mb-0.5 text-[#904D00]" />
            <span>B2B थोक</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

