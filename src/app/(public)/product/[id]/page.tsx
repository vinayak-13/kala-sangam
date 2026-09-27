import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  ShieldCheck,
  Truck,
  IndianRupee,
  ShoppingBag,
  Building2,
  Sparkles,
  ArrowLeft,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { productService } from '@/server/services/product-service';
import { VoicePlayer } from '@/components/VoicePlayer';
import { AIBadge } from '@/components/AIBadge';
import { Navbar } from '@/components/Navbar';
import { getProductById, CRAFT_CATALOG } from '@/lib/data/craft-catalog';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalogItem = getProductById(id) || CRAFT_CATALOG[0];

  let data;
  try {
    data = await productService.getProductDetail(id);
  } catch {
    data = {
      product: {
        id: catalogItem.id,
        artisan_id: catalogItem.artisanId,
        status: 'published' as const,
        title: catalogItem.title,
        description: catalogItem.description,
        materials: catalogItem.materials,
        dimensions: catalogItem.dimensions,
        craft_technique: catalogItem.craftTechnique,
        tags: catalogItem.tags,
        price_paise: catalogItem.pricePaise,
        ai_price_min_paise: catalogItem.aiPriceMinPaise,
        ai_price_max_paise: catalogItem.aiPriceMaxPaise,
        stock_quantity: catalogItem.stockQuantity,
        b2b_available: catalogItem.b2bAvailable,
        b2b_moq: catalogItem.b2bMoq,
        lead_time_days: catalogItem.leadTimeDays,
        view_count: 240,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      },
      media: [],
      voice: null,
    };
  }

  const { product } = data;
  const artisan = catalogItem.artisan;
  const priceRupees = product.price_paise ? Math.round(product.price_paise / 100) : Math.round(catalogItem.pricePaise / 100);

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col selection:bg-[#9D3E1B]/20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#56423C] mb-6">
          <Link href="/explore" className="hover:text-[#9D3E1B] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Crafts
          </Link>
          <span>/</span>
          <span>{artisan.state}</span>
          <span>/</span>
          <span className="text-[#221A16] capitalize font-black">{catalogItem.craftType}</span>
        </div>

        {/* ── PRODUCT HERO: SPLIT GRID ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Product Photography (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#FBEBE4] border border-[#E6DCCF] shadow-sm relative">
              <img
                src={catalogItem.mainImage}
                alt={product.title.en || 'Artisan product'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#006B2F] text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#95F8A7]" />
                <span>★ {artisan.odopTag}</span>
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="grid grid-cols-4 gap-2.5">
              {catalogItem.galleryImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-[#E6DCCF] hover:border-[#9D3E1B] transition cursor-pointer shadow-xs bg-[#FBEBE4]">
                  <img
                    src={img}
                    alt={`Angle ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Voice Provenance Player + Product Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. HERO VOICE PROVENANCE PLAYER */}
            <VoicePlayer
              artisanName={artisan.name}
              sourceLanguage={artisan.state}
            />

            {/* 2. Product Title & Artisan Meta */}
            <div className="space-y-2 pt-2 border-t border-[#E6DCCF]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#FFF1EB] text-xs font-black text-[#9D3E1B] capitalize border border-[#DDC0B8]">
                  {catalogItem.craftType}
                </span>
                <AIBadge label="AI Cataloged" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#221A16] font-heading leading-tight">
                {product.title.en}
              </h1>
              <p className="text-sm font-bold text-[#56423C]">
                {product.title.hi} · {product.title.mr}
              </p>

              {/* Artisan Profile Link Card */}
              <Link
                href={`/studio/${artisan.handle}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E6DCCF] hover:border-[#9D3E1B] transition mt-3 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 shrink-0 border-2 border-[#9D3E1B]">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-[#221A16] group-hover:text-[#9D3E1B] transition truncate">
                      {artisan.name}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#006B2F] shrink-0" />
                  </div>
                  <p className="text-xs text-[#56423C] flex items-center gap-1 truncate font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#9D3E1B]" />
                    {artisan.district}, {artisan.state} · {artisan.experienceYears} yrs master artisan
                  </p>
                </div>
              </Link>
            </div>

            {/* 3. Pricing & Purchase Bar */}
            <div className="bg-white border border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-[#56423C] uppercase tracking-wider block">
                    Direct Artisan Price (100% DBT)
                  </span>
                  <span className="text-3xl font-black text-[#9D3E1B] flex items-center">
                    <IndianRupee className="w-7 h-7 -mr-1" />
                    {priceRupees.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#006B2F] font-bold">✓ 100% Proceeds go to Sunil's Bank Account</span>
                </div>

                <div className="text-right text-xs text-[#56423C]">
                  <span className="font-black text-[#221A16] block">In Stock: {product.stock_quantity} units</span>
                  <span>Ships within 48 hours</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/cart"
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-base shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" /> Buy Single Unit
                </Link>

                {product.b2b_available && (
                  <Link
                    href={`/portal/rfq/new?productId=${product.id}`}
                    className="py-4 px-6 rounded-2xl border-2 border-[#904D00] bg-[#FFDCC3]/30 hover:bg-[#904D00] text-[#904D00] hover:text-white font-black text-sm flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <Building2 className="w-4 h-4" /> B2B Bulk Order (MOQ {product.b2b_moq || 10})
                  </Link>
                )}
              </div>
            </div>

            {/* 4. Craft Specifications & Provenance Detail */}
            <div className="space-y-3 pt-2">
              <h3 className="font-black text-base text-[#221A16]">Craft Details & Technique</h3>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-white rounded-2xl border border-[#E6DCCF]">
                  <span className="text-[#56423C] block font-medium">Materials</span>
                  <span className="font-black text-[#221A16]">{product.materials.join(', ') || 'Natural Elements'}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-[#E6DCCF]">
                  <span className="text-[#56423C] block font-medium">Dimensions</span>
                  <span className="font-black text-[#221A16]">{product.dimensions || '24 x 18 inches'}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-[#E6DCCF]">
                  <span className="text-[#56423C] block font-medium">Technique</span>
                  <span className="font-black text-[#221A16]">{product.craft_technique || 'Traditional Brushwork'}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-[#E6DCCF]">
                  <span className="text-[#56423C] block font-medium">Dispatch Logistics</span>
                  <span className="font-black text-[#221A16]">India Post Speed Post</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
