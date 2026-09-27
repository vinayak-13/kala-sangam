'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Volume2,
  Package,
  Check,
  ArrowLeft,
  Building2,
  Truck,
  CheckCircle2,
  Globe,
  Square,
  Play,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { ALL_INDIC_LANGUAGES, getOrderAlert } from '@/lib/i18n/indic-languages';

export default function ArtisanOrdersPage() {
  const [selectedLocale, setSelectedLocale] = useState('mr');
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  const [orders, setOrders] = useState([
    {
      id: 'h1111111-0000-0000-0000-000000000005',
      orderNumber: 'KS-2026-000105',
      buyer: 'Heritage Hotels & Resorts India (B2B Bulk)',
      product: 'Warli Bamboo Pen Stands (Bulk Order)',
      units: 40,
      totalPaise: 7000000,
      status: 'in_production',
      alertKey: 'bulk_order_40',
    },
    {
      id: 'h1111111-0000-0000-0000-000000000001',
      orderNumber: 'KS-2026-000101',
      buyer: 'Aarav Mehta (Retail)',
      product: 'Traditional Tarpa Dance Festive Warli Canvas',
      units: 1,
      totalPaise: 280000,
      status: 'delivered',
      alertKey: 'retail_order_1',
    },
  ]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const toggleSpeech = (key: string, text: string) => {
    if (playingKey === key) {
      stopAllAudio();
      setPlayingKey(null);
      playUiBeep('stop');
      return;
    }

    stopAllAudio();
    setPlayingKey(key);
    playTanpuraChime(1.5);
    speakText(text, selectedLocale, () => {
      setPlayingKey(null);
    });
  };

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const generalAnnouncement = getOrderAlert('general_announcement', selectedLocale);

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#C05A34] transition"
          >
            <ArrowLeft className="w-4 h-4" /> स्टूडियो पर वापस जाएं (Back to Studio)
          </Link>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>लाइव वॉयस डिस्पैच (Voice Dispatch Active)</span>
          </span>
        </div>

        {/* ── 1. PAN-INDIA LANGUAGE SWITCHER ─────────────────────────────── */}
        <div className="bg-white border-2 border-[#E4DACE] rounded-3xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-[#22201D]">
              <Globe className="w-4 h-4 text-[#C05A34]" />
              <span>ऑर्डर की भाषा चुनें / Choose Orders Language (22+ Indic Languages):</span>
            </div>
            <span className="text-[11px] text-[#C05A34] font-bold">
              {ALL_INDIC_LANGUAGES.find((l) => l.code === selectedLocale)?.name || 'Language'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {ALL_INDIC_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  stopAllAudio();
                  setPlayingKey(null);
                  setSelectedLocale(lang.code);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 flex items-center gap-1.5 shrink-0 ${
                  selectedLocale === lang.code
                    ? 'bg-[#C05A34] text-white shadow-xs'
                    : 'bg-[#FAF5EF] hover:bg-stone-200 border border-[#E4DACE] text-stone-700'
                }`}
              >
                {selectedLocale === lang.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{lang.nativeName}</span>
                <span className="text-[10px] opacity-75 font-normal">({lang.name})</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 2. GENERAL ORDERS VOICE ANNOUNCEMENT ──────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-[#E4DACE] p-6 rounded-3xl shadow-sm">
          <div className="space-y-1 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-[#22201D] font-heading flex items-center gap-2">
              <span>ऑर्डर व्यवस्थापन (Artisan Orders)</span>
            </h1>
            <p className="text-sm text-stone-600 font-medium">
              {generalAnnouncement}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleSpeech('general', generalAnnouncement)}
            className={`artisan-action-btn px-5 py-3 rounded-2xl border font-black text-sm flex items-center gap-2 transition active:scale-95 shrink-0 shadow-sm ${
              playingKey === 'general'
                ? 'bg-stone-900 border-stone-900 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
            }`}
          >
            {playingKey === 'general' ? (
              <Square className="w-5 h-5 fill-current text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-[#C05A34]" />
            )}
            <span>{playingKey === 'general' ? 'रोकें (Stop Audio)' : 'नवीन ऑर्डर ऐका (Listen)'}</span>
          </button>
        </div>

        {/* ── 3. ORDERS LIST WITH LOCALIZED VOICE NOTIFICATIONS ───────────── */}
        <div className="space-y-4">
          {orders.map((order) => {
            const isBulk = order.units > 1;
            const orderVoiceAlert = getOrderAlert(order.alertKey, selectedLocale);
            const isPlayingThis = playingKey === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border-2 border-[#E4DACE] hover:border-[#C05A34]/60 rounded-3xl p-6 shadow-sm space-y-4 transition"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-500 font-mono">
                        {order.orderNumber}
                      </span>
                      {isBulk && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#2B3A67] text-white flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> B2B Bulk Order ({order.units} Units)
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#22201D]">{order.product}</h3>
                    <p className="text-xs text-stone-600">Buyer: {order.buyer}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-[#C05A34]">
                      ₹{(order.totalPaise / 100).toLocaleString('en-IN')}
                    </span>
                    <span className="block text-xs font-bold uppercase text-emerald-700">
                      Status: {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Localized Voice Read-Aloud Notification with Play & Stop Button */}
                <div className="bg-[#FAF5EF] border border-[#E4DACE] rounded-2xl p-3.5 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 max-w-lg">
                    <Volume2 className="w-4 h-4 text-[#C05A34] shrink-0" />
                    <span>ऑर्डर सूचना (TTS Voice Alert):</span>
                    <span className="italic font-bold text-[#22201D]">&ldquo;{orderVoiceAlert}&rdquo;</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSpeech(order.id, orderVoiceAlert)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                      isPlayingThis
                        ? 'bg-stone-900 text-white animate-pulse'
                        : 'bg-white hover:bg-amber-50 border border-stone-300 text-stone-800'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current text-white" />
                        <span>रोकें (Stop)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#C05A34]" />
                        <span>बोलवून दाखवा (Play TTS)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Update Actions */}
                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => updateStatus(order.id, 'in_production')}
                    className={`artisan-touch-target px-4 py-2 rounded-xl border text-xs font-bold transition active:scale-95 ${
                      order.status === 'in_production'
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-black'
                        : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    उत्पादन सुरू (In Production)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(order.id, 'shipped')}
                    className={`artisan-touch-target px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                      order.status === 'shipped'
                        ? 'bg-[#2B3A67] text-white font-black'
                        : 'border border-[#2B3A67] text-[#2B3A67] hover:bg-[#2B3A67]/10'
                    }`}
                  >
                    <Truck className="w-4 h-4 inline mr-1" /> पाठवले (Mark Shipped)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(order.id, 'delivered')}
                    className={`artisan-touch-target px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                      order.status === 'delivered'
                        ? 'bg-emerald-700 text-white font-black'
                        : 'border border-emerald-700 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 inline mr-1" /> पोहोचले (Delivered)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
