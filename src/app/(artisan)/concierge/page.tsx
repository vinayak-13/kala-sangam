'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { G2CConciergeView } from '@/components/concierge/G2CConciergeView';
import { VoiceGuideButton } from '@/components/VoiceGuideButton';

export default function G2CConciergePage() {
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

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col selection:bg-[#9D3E1B]/20 pb-16">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <G2CConciergeView locale={locale} />
      </main>
    </div>
  );
}
