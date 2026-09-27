'use client';

import React, { useState } from 'react';
import { Search, Filter, Volume2, Sparkles, MapPin, Globe, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { CRAFT_CATALOG } from '@/lib/data/craft-catalog';
import type { Product } from '@/lib/db/types';

const CATALOG_AS_PRODUCTS: Product[] = CRAFT_CATALOG.map((c) => ({
  id: c.id,
  artisan_id: c.artisanId,
  status: 'published' as const,
  title: c.title,
  description: c.description,
  materials: c.materials,
  dimensions: c.dimensions,
  craft_technique: c.craftTechnique,
  tags: c.tags,
  price_paise: c.pricePaise,
  ai_price_min_paise: c.aiPriceMinPaise,
  ai_price_max_paise: c.aiPriceMaxPaise,
  stock_quantity: c.stockQuantity,
  b2b_available: c.b2bAvailable,
  b2b_moq: c.b2bMoq,
  lead_time_days: c.leadTimeDays,
  view_count: 240,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
}));

export default function ExploreMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('all');
  const [b2bOnly, setB2bOnly] = useState(false);

  const crafts = [
    'all',
    'warli',
    'blue pottery',
    'bidriware',
    'channapatna',
    'kutch',
    'pashmina',
    'dhokra',
    'terracotta',
    'madhubani',
  ];

  const filtered = CATALOG_AS_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.title.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.hi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCraft =
      selectedCraft === 'all' || p.tags.some((t) => t.toLowerCase().includes(selectedCraft.toLowerCase()));
    const matchesB2b = !b2bOnly || p.b2b_available;
    return matchesSearch && matchesCraft && matchesB2b;
  });

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col selection:bg-[#9D3E1B]/20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header & Filter Controls */}
        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#9D3E1B] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#006B2F]" />
              <span>Authentic Cultural Provenance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#221A16] font-heading">
              हस्तशिल्प बाज़ार (Artisan Marketplace)
            </h1>
            <p className="text-sm text-[#56423C]">
              Browse authentic Indic crafts with live voice provenance recorded by master artisans across 8 states
            </p>
          </div>

          {/* Search Bar & B2B Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#56423C]" />
              <input
                type="text"
                placeholder="Search by craft, state, or material (e.g., Warli, Blue Pottery, Silver)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-[#E6DCCF] text-sm text-[#221A16] focus:outline-none focus:border-[#9D3E1B] shadow-xs font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => setB2bOnly(!b2bOnly)}
              className={`px-5 py-3.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition shadow-xs ${
                b2bOnly
                  ? 'bg-[#904D00] text-white border-[#904D00]'
                  : 'bg-white text-[#56423C] border-[#E6DCCF] hover:bg-[#FFF1EB]'
              }`}
            >
              <span>B2B Wholesale MOQ Only</span>
            </button>
          </div>

          {/* Craft Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-none">
            {crafts.map((craft) => (
              <button
                key={craft}
                type="button"
                onClick={() => setSelectedCraft(craft)}
                className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition ${
                  selectedCraft === craft
                    ? 'bg-[#9D3E1B] text-white shadow-xs'
                    : 'bg-white text-[#56423C] border border-[#E6DCCF] hover:bg-[#FFF1EB]'
                }`}
              >
                {craft === 'all' ? 'All Indian Crafts' : craft}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
