'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Grid3X3,
  Play,
  Volume2,
  Heart,
  Eye,
  ShoppingBag,
  Sparkles,
  Share2,
  Check,
  MessageCircle,
  Edit3,
  Boxes,
  IndianRupee,
  Save,
  X,
} from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';

interface ReelItem {
  id: string;
  title: string;
  videoUrl?: string;
  thumbnail: string;
  views: number;
  duration: string;
  narrationSnippet: string;
  priceInr: number;
  likes: number;
}

interface ProductItem {
  id: string;
  title: { en?: string; hi?: string; mr?: string; [key: string]: string | undefined };
  price_paise: number;
  stock_quantity?: number;
  media?: Array<{ kind: string; storage_path: string }>;
  description?: Record<string, string>;
  narration?: string;
}

interface ArtisanInstagramFeedProps {
  products: ProductItem[];
  artisanName?: string;
  artisanHandle?: string;
}

const SAMPLE_REELS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'वारली तारपा नृत्य कैनवास बनाने की विधि (Making of Tarpa Canvas)',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600',
    views: 4230,
    duration: '0:32',
    narrationSnippet: 'यह प्राकृतिक गेरू मिट्टी और चावल के लेप से बनी पारंपरिक वारली पेंटिंग है...',
    priceInr: 2800,
    likes: 852,
  },
  {
    id: 'reel-2',
    title: 'बांस की कलम और प्राकृतिक रंग तैयार करना (Preparing Natural Colors)',
    thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
    views: 8910,
    duration: '0:24',
    narrationSnippet: 'जंगल से लाई गई जड़ी-बूटियों और मिट्टी से हम यह स्थायी लाल रंग तैयार करते हैं...',
    priceInr: 1500,
    likes: 1240,
  },
  {
    id: 'reel-3',
    title: 'वारली दीया और क्ले प्लेट नक्काशी (Warli Clay Plate Crafting)',
    thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600',
    views: 3120,
    duration: '0:45',
    narrationSnippet: 'चाक पर मिट्टी को आकार देकर धूप में सुखाया जाता है, फिर बारीक आकृतियाँ बनाई जाती हैं...',
    priceInr: 850,
    likes: 490,
  },
];

export function ArtisanInstagramFeed({
  products: initialProducts,
  artisanName = 'Sunil Wagh',
  artisanHandle = 'sunil_warli_palghar',
}: ArtisanInstagramFeedProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const [activeReelModal, setActiveReelModal] = useState<ReelItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductItem[]>(initialProducts);
  const [allReels, setAllReels] = useState<ReelItem[]>(SAMPLE_REELS);

  // Edit Price & Quantity Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editPriceInr, setEditPriceInr] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(1);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const customProds = JSON.parse(localStorage.getItem('kala_custom_products') || '[]');
        if (Array.isArray(customProds) && customProds.length > 0) {
          const mergedProducts = [...customProds, ...initialProducts];
          setAllProducts(mergedProducts);

          const customReels: ReelItem[] = customProds.map((cp: any, idx: number) => ({
            id: `custom-reel-${cp.id || idx}`,
            title: cp.title?.hi || cp.title?.en || 'हस्तशिल्प उत्पाद (Handicraft Artwork)',
            thumbnail: cp.media?.[0]?.storage_path || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600',
            views: 120 + idx * 45,
            duration: '0:35',
            narrationSnippet: cp.narration || 'कारीगर द्वारा हस्तनिर्मित उत्कृष्ट कलाकृति।',
            priceInr: Math.round((cp.price_paise || 120000) / 100),
            likes: 42 + idx * 8,
          }));

          setAllReels([...customReels, ...SAMPLE_REELS]);
        }
      } catch {
        // ignore
      }
    }
  }, [initialProducts]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const playReelNarration = (text: string) => {
    stopAllAudio();
    playTanpuraChime(1.5);
    speakText(text, 'hi');
  };

  const openEditModal = (product: ProductItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingProduct(product);
    setEditPriceInr(Math.round((product.price_paise || 120000) / 100));
    setEditStock(product.stock_quantity ?? 5);
    setSaveSuccessMsg(false);
  };

  const handleSavePriceAndStock = () => {
    if (!editingProduct) return;

    const newPricePaise = Math.max(1, editPriceInr) * 100;
    const newStock = Math.max(0, editStock);

    // Update in allProducts
    const updatedProducts = allProducts.map((p) => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          price_paise: newPricePaise,
          stock_quantity: newStock,
        };
      }
      return p;
    });
    setAllProducts(updatedProducts);

    // Update in localStorage
    if (typeof window !== 'undefined') {
      try {
        const customProds = JSON.parse(localStorage.getItem('kala_custom_products') || '[]');
        if (Array.isArray(customProds)) {
          const updatedCustom = customProds.map((cp: any) => {
            if (cp.id === editingProduct.id) {
              return {
                ...cp,
                price_paise: newPricePaise,
                stock_quantity: newStock,
              };
            }
            return cp;
          });
          localStorage.setItem('kala_custom_products', JSON.stringify(updatedCustom));
        }
      } catch {
        // ignore
      }
    }

    playUiBeep('start');
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setEditingProduct(null);
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* ── ACTION BAR (FOLLOW / WHATSAPP / SHARE) ──────────────────────── */}
      <div className="flex items-center gap-2">
        <a
          href={`https://wa.me/919876543210?text=Hello%20${encodeURIComponent(artisanName)},%20I%20saw%20your%20craft%20on%20KALA-SANGAM`}
          target="_blank"
          rel="noopener noreferrer"
          className="artisan-touch-target flex-1 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 py-2.5"
        >
          <MessageCircle className="w-4 h-4" />
          <span>व्हाट्सएप पर संपर्क (WhatsApp Direct)</span>
        </a>

        <button
          type="button"
          onClick={handleShare}
          className="artisan-touch-target px-3.5 py-2.5 rounded-2xl bg-white border border-[#E4DACE] text-stone-700 hover:bg-[#FAF5EF] text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-[#C05A34]" />}
          <span>{copied ? 'लिंक कॉपी हो गया!' : 'शेयर (Share)'}</span>
        </button>
      </div>

      {/* ── INSTAGRAM TABS (POSTS vs REELS) ─────────────────────────────── */}
      <div className="flex border-b-2 border-[#E4DACE] bg-white rounded-2xl p-1 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'posts'
              ? 'bg-[#9D3E1B] text-white shadow-xs'
              : 'text-stone-600 hover:text-[#221A16]'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          <span>कैटलॉग / All Products ({allProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'reels'
              ? 'bg-[#9D3E1B] text-white shadow-xs'
              : 'text-stone-600 hover:text-[#221A16]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>रील्स / Videos ({allReels.length})</span>
        </button>
      </div>

      {/* ── 1. POSTS TAB CONTENT (INSTAGRAM GRID WITH EDIT PRICE & QUANTITY) ─────────────────── */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allProducts.map((product) => {
            const photo = product.media?.find((m) => m.kind === 'photo')?.storage_path;
            const pricePaise = product.price_paise ?? 120000;
            const stock = product.stock_quantity ?? 5;
            const title = product.title?.hi || product.title?.en || 'Handicraft Item';

            return (
              <div
                key={product.id}
                className="relative rounded-2xl overflow-hidden bg-white border-2 border-[#E6DCCF] shadow-sm hover:shadow-md transition flex flex-col group"
              >
                {/* Product Image Thumbnail */}
                <Link href={`/product/${product.id}`} className="relative aspect-square block bg-stone-100 overflow-hidden">
                  <img
                    src={photo || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Stock Badge Overlay */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Boxes className="w-3 h-3 text-[#FE932C]" />
                    <span>स्टॉक: {stock}</span>
                  </div>
                </Link>

                {/* Product Info & Price */}
                <div className="p-2.5 flex flex-col justify-between flex-1 bg-white space-y-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#221A16] line-clamp-1 leading-snug">
                      {title}
                    </h4>
                    <span className="text-sm font-black text-[#9D3E1B] block mt-0.5">
                      ₹{(pricePaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Edit Price & Quantity Button */}
                  <button
                    type="button"
                    onClick={(e) => openEditModal(product, e)}
                    className="w-full py-1.5 px-2 rounded-xl bg-[#FFF1EB] hover:bg-[#FFDCC3] text-[#9D3E1B] text-[11px] font-black flex items-center justify-center gap-1.5 border border-[#DDC0B8] transition active:scale-95 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FE932C]" />
                    <span>मूल्य व स्टॉक बदलें (Edit)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 2. REELS TAB CONTENT (9:16 VERTICAL VIDEO CARDS) ─────────────── */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {allReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => {
                setActiveReelModal(reel);
                playReelNarration(reel.narrationSnippet);
              }}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-stone-900 border-2 border-stone-200 shadow-sm cursor-pointer group active:scale-95 transition-transform"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />

              {/* Top Reel Overlay (Duration & Video Icon) */}
              <div className="absolute top-2 inset-x-2 flex items-center justify-between text-white drop-shadow-md">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs flex items-center gap-1">
                  <Film className="w-3 h-3 text-[#FE932C]" /> {reel.duration}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 flex items-center gap-0.5">
                  <Eye className="w-3 h-3" /> {reel.views.toLocaleString()}
                </span>
              </div>

              {/* Center Play Button Pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-[#9D3E1B]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>

              {/* Bottom Gradient with Title & Price Tag */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 text-white space-y-1">
                <p className="text-xs font-bold line-clamp-2 leading-tight drop-shadow-xs">
                  {reel.title}
                </p>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-xs font-black text-amber-300">
                    ₹{reel.priceInr.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold flex items-center gap-0.5 text-rose-300">
                    <Heart className="w-3 h-3 fill-current" /> {reel.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── QUICK EDIT PRICE & QUANTITY MODAL ────────────────────────────── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#FFF8F6] text-[#221A16] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#9D3E1B] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DCCF] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#9D3E1B]" />
                <h3 className="font-black text-base text-[#221A16]">
                  मूल्य और स्टॉक बदलें
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-[#FFF1EB] hover:bg-[#FFDCC3] text-[#56423C] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#56423C] font-semibold line-clamp-1">
              {editingProduct.title?.hi || editingProduct.title?.en || 'हस्तशिल्प उत्पाद'}
            </p>

            {/* Price Input Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#56423C] flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#9D3E1B]" />
                <span>नया विक्रय मूल्य (Selling Price in ₹):</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-base text-[#9D3E1B]">₹</span>
                <input
                  type="number"
                  min={1}
                  value={editPriceInr}
                  onChange={(e) => setEditPriceInr(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-[#DDC0B8] bg-white font-black text-lg text-[#221A16] focus:border-[#9D3E1B] outline-none"
                />
              </div>
            </div>

            {/* Stock Quantity Input Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#56423C] flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5 text-[#9D3E1B]" />
                <span>उपलब्ध स्टॉक (Units in Stock):</span>
              </label>
              <input
                type="number"
                min={0}
                max={1000}
                value={editStock}
                onChange={(e) => setEditStock(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DDC0B8] bg-white font-bold text-base text-[#221A16] focus:border-[#9D3E1B] outline-none"
              />
            </div>

            {saveSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#006B2F] text-[#006B2F] text-xs font-bold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>सफलतापूर्वक अपडेट हो गया! (Updated)</span>
              </div>
            )}

            {/* Save Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="flex-1 py-3 rounded-xl border border-[#DDC0B8] bg-white font-bold text-xs text-[#56423C] hover:bg-[#FFF1EB]"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSavePriceAndStock}
                className="flex-1 py-3 rounded-xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <Save className="w-4 h-4" />
                <span>सुरक्षित करें (Save)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REEL PLAYER MODAL OVERLAY ────────────────────────────────────── */}
      {activeReelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-[#1E1E1E] text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col">
            {/* Modal Reel Header */}
            <div className="p-3 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9D3E1B] text-white flex items-center justify-center font-bold text-xs">
                  {artisanName.slice(0, 1)}
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{artisanName}</h4>
                  <p className="text-[10px] text-stone-400 font-mono">@{artisanHandle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  setActiveReelModal(null);
                }}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Video / Visual Simulation Area */}
            <div className="relative aspect-[9/14] bg-stone-950 flex items-center justify-center overflow-hidden">
              <img
                src={activeReelModal.thumbnail}
                alt="Reel Preview"
                className="w-full h-full object-cover opacity-85 animate-pulse"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

              {/* Live Audio Narration Badge */}
              <div className="absolute top-3 left-3 bg-[#9D3E1B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-bounce">
                <Volume2 className="w-4 h-4 text-[#FE932C]" />
                <span>कारीगर की आवाज़ (Live Voice Narration)</span>
              </div>
            </div>

            {/* Modal Bottom Detail & 1-Tap Buy */}
            <div className="p-4 space-y-3 bg-stone-900 border-t border-stone-800">
              <div>
                <h3 className="text-sm font-bold">{activeReelModal.title}</h3>
                <p className="text-xs text-stone-300 italic mt-1 leading-relaxed">
                  &ldquo;{activeReelModal.narrationSnippet}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">कीमत (Price)</span>
                  <span className="text-xl font-black text-amber-400">
                    ₹{activeReelModal.priceInr.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  href="/explore"
                  onClick={() => {
                    stopAllAudio();
                    setActiveReelModal(null);
                  }}
                  className="artisan-action-btn px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" /> अभी खरीदें (Buy Now)
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
