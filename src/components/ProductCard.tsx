'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, IndianRupee, MapPin, ShieldCheck, ArrowRight, Play, Pause } from 'lucide-react';
import type { Product } from '@/lib/db/types';
import { getProductById } from '@/lib/data/craft-catalog';
import { playTanpuraChime, speakText, stopAllAudio } from '@/lib/audio-utils';

interface ProductCardProps {
  product: Product;
  artisanName?: string;
  artisanDistrict?: string;
  imageUrl?: string;
  hasVoice?: boolean;
  locale?: string;
}

export function ProductCard({
  product,
  artisanName,
  artisanDistrict,
  imageUrl,
  hasVoice = true,
  locale = 'en',
}: ProductCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const catalogItem = getProductById(product.id);

  const finalArtisanName = artisanName || catalogItem?.artisan.name || 'Master Artisan';
  const finalDistrict = artisanDistrict || (catalogItem ? `${catalogItem.artisan.district}, ${catalogItem.artisan.state}` : 'India');
  const finalImage = imageUrl || catalogItem?.mainImage || (product as any).media?.[0]?.storage_path || 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800';
  const craft = catalogItem?.craftType || product.tags[0] || 'Handicraft';

  const priceRupees = product.price_paise
    ? Math.round(product.price_paise / 100)
    : catalogItem
    ? Math.round(catalogItem.pricePaise / 100)
    : 1200;

  const title =
    (locale === 'hi' ? (product.title.hi || catalogItem?.title.hi) : locale === 'mr' ? (product.title.mr || catalogItem?.title.mr) : (product.title.en || catalogItem?.title.en)) ||
    product.title.en ||
    catalogItem?.title.en ||
    'Handcrafted Artisan Item';

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }

    stopAllAudio();
    setIsPlaying(true);
    playTanpuraChime(1.5);
    const audioSnippet = (catalogItem as any)?.audioSnippet?.hi || `नमस्ते, मैं ${finalArtisanName} हूँ। यह हमारी हस्तनिर्मित कला है।`;
    speakText(audioSnippet, 'hi', () => {
      setIsPlaying(false);
    });
  };

  return (
    <div className="group flex flex-col bg-white border border-[#E6DCCF] hover:border-[#9D3E1B] rounded-3xl overflow-hidden shadow-[0_2px_8px_rgba(36,28,24,0.06)] hover:shadow-[0_12px_28px_rgba(36,28,24,0.12)] transition-all duration-300">
      {/* 4:5 Aspect Ratio Photo Container */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/5] bg-[#FBEBE4] overflow-hidden block">
        <img
          src={finalImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Voice Playback Chip */}
        {hasVoice && (
          <button
            type="button"
            onClick={handleAudioPlay}
            className={`absolute top-3 left-3 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95 z-10 ${
              isPlaying
                ? 'bg-[#9D3E1B] text-white border border-[#FFDBD0]'
                : 'bg-[#221A16]/85 text-[#FFDCC3] hover:bg-[#221A16]'
            }`}
            title="कारीगर की आवाज़ सुनें"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-white" />
                <span>सुन रहे हैं...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#FE932C] animate-pulse" />
                <span>कारीगर की आवाज़</span>
              </>
            )}
          </button>
        )}

        {/* ODOP / GI Tag */}
        <div className="absolute top-3 right-3 bg-[#006B2F] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 z-10">
          <ShieldCheck className="w-3 h-3 text-[#95F8A7]" />
          <span>GI Verified</span>
        </div>

        {/* B2B MOQ Badge */}
        {product.b2b_available && (
          <div className="absolute bottom-3 left-3 bg-[#904D00] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm">
            B2B MOQ: {product.b2b_moq || 10}
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Artisan line */}
          <div className="flex items-center gap-2 text-xs text-[#56423C] mb-1.5 font-bold">
            {catalogItem?.artisan.avatar && (
              <img
                src={catalogItem.artisan.avatar}
                alt={finalArtisanName}
                className="w-5 h-5 rounded-full object-cover border border-[#9D3E1B]"
              />
            )}
            <MapPin className="w-3.5 h-3.5 text-[#9D3E1B] shrink-0" />
            <span className="truncate">{finalArtisanName} · {finalDistrict}</span>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-base text-[#221A16] line-clamp-2 group-hover:text-[#9D3E1B] transition leading-snug">
              {title}
            </h3>
          </Link>
        </div>

        <div className="pt-3 border-t border-[#E6DCCF] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#56423C] block leading-none font-bold uppercase tracking-wider">
              सीधी कीमत (Direct DBT)
            </span>
            <span className="text-xl font-black text-[#9D3E1B] flex items-center mt-0.5">
              <IndianRupee className="w-4 h-4 -mr-0.5" />
              {priceRupees.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl bg-[#FFF1EB] text-[#9D3E1B] hover:bg-[#9D3E1B] hover:text-white transition shadow-xs"
          >
            <span>विवरण देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
