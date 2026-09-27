'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { AIBadge } from '@/components/AIBadge';
import { VoicePlayer } from '@/components/VoicePlayer';
import { MicButton } from '@/components/MicButton';
import { OfflineChip } from '@/components/OfflineChip';
import { StatusTimeline } from '@/components/StatusTimeline';
import { PriceBandSlider } from '@/components/PriceBandSlider';

export default function StyleguidePage() {
  const mockProduct = {
    id: 'e1111111-0000-0000-0000-000000000001',
    artisan_id: 'c1111111-0000-0000-0000-000000000001',
    status: 'published' as const,
    title: { en: 'Traditional Tarpa Dance Festive Warli Canvas', hi: 'पारंपरिक वारली कैनवास' },
    description: { en: 'Handmade with natural pigments.', hi: 'प्राकृतिक रंगों से निर्मित।' },
    materials: ['Handspun Canvas', 'Rice Flour Paste'],
    dimensions: '24 x 18 inches',
    craft_technique: 'Bamboo brushwork',
    tags: ['warli', 'painting'],
    price_paise: 280000,
    ai_price_min_paise: 240000,
    ai_price_max_paise: 320000,
    stock_quantity: 4,
    b2b_available: true,
    b2b_moq: 10,
    lead_time_days: 14,
    view_count: 184,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div>
          <h1 className="text-3xl font-black text-[#22201D] font-heading">
            KALA-SANGAM Design System & Styleguide
          </h1>
          <p className="text-sm text-stone-600">Visual QA for earth-tone tokens and accessible components</p>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#22201D]">1. Design Tokens (Natural Dye Earth Palette)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center text-xs font-bold">
            <div className="p-4 rounded-xl bg-[#C05A34] text-white shadow-xs">Terracotta (#C05A34)</div>
            <div className="p-4 rounded-xl bg-[#9A4526] text-white shadow-xs">Terracotta Dark (#9A4526)</div>
            <div className="p-4 rounded-xl bg-[#2B3A67] text-white shadow-xs">Indigo (#2B3A67)</div>
            <div className="p-4 rounded-xl bg-[#E3A008] text-stone-900 shadow-xs">Haldi (#E3A008)</div>
            <div className="p-4 rounded-xl bg-[#FBF8F3] text-stone-900 border border-[#E4DACE]">Ivory (#FBF8F3)</div>
            <div className="p-4 rounded-xl bg-[#22201D] text-white shadow-xs">Charcoal (#22201D)</div>
            <div className="p-4 rounded-xl bg-[#6B7F5C] text-white shadow-xs">Sage (#6B7F5C)</div>
          </div>
        </section>

        {/* 2. AI Badges */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#22201D]">2. AI Badges (Transparency & Trust)</h2>
          <div className="flex gap-3 flex-wrap">
            <AIBadge label="AI Cataloged" />
            <AIBadge label="Indic LLM Draft" />
            <AIBadge label="Bhashini ASR Verified" />
          </div>
        </section>

        {/* 3. Hero Voice Provenance Player */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#22201D]">3. Hero Voice Player (Provenance Hero)</h2>
          <div className="max-w-xl">
            <VoicePlayer artisanName="Sunil Dhangar" />
          </div>
        </section>

        {/* 4. Price Band Slider */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#22201D]">4. Price Band Slider (Artisan Decides, AI Advises)</h2>
          <div className="max-w-lg">
            <PriceBandSlider minPriceInr={750} maxPriceInr={2400} />
          </div>
        </section>

        {/* 5. 96px Mic Button */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#22201D]">5. 96px Circular Mic Button (56px+ Target)</h2>
          <div className="max-w-md bg-white border border-[#E4DACE] rounded-2xl p-4">
            <MicButton onRecordingComplete={() => {}} />
          </div>
        </section>

        {/* 6. Product Card (4:5 Ratio) */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#22201D]">6. Product Card (4:5 Aspect Ratio)</h2>
          <div className="max-w-xs">
            <ProductCard product={mockProduct} />
          </div>
        </section>

        {/* 7. Theatrical Status Timeline */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#22201D]">7. Status Timeline (4-Stage Progress)</h2>
          <StatusTimeline />
        </section>
      </main>

      <OfflineChip />
    </div>
  );
}
