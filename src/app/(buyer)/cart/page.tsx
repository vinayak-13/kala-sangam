'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, IndianRupee, ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { VoiceGuideButton } from '@/components/VoiceGuideButton';
import { ALL_INDIC_LANGUAGES } from '@/lib/i18n/indic-languages';

export default function CartPage() {
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const item = {
    title: 'पारंपरिक वारली तारपा नृत्य कैनवास (Warli Festive Canvas)',
    artisan: 'सुनील वाघ (Sunil Wagh) · पालघर, महाराष्ट्र',
    pricePaise: 280000,
    shippingPaise: 0,
    quantity: 1,
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrdered(true);
    }, 1200);
  };

  const priceRupees = item.pricePaise / 100;

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#221A16] font-heading">
              खरीदारी की टोकरी (Your Cart & Checkout)
            </h1>
            <p className="text-sm text-[#56423C] mt-0.5 font-medium">
              सीधे कारीगर को 100% भुगतान एवं सुरक्षित डिलीवरी · 100% Direct Artisan Remittance
            </p>
          </div>

          <VoiceGuideButton
            pageKey="cart"
            locale={locale}
            customText="यह आपकी खरीदारी की टोकरी है। यहाँ से आप सीधे कारीगर के खाते में भुगतान करके प्रामाणिक हस्तशिल्प खरीद सकते हैं।"
          />
        </div>

        {isOrdered ? (
          <div className="bg-white border-2 border-[#006B2F] rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-[#221A16]">ऑर्डर सफलतापूर्वक दर्ज हो गया! (Order Placed)</h2>
            <p className="text-sm text-[#56423C]">
              ऑर्डर संख्या: <span className="font-mono font-black text-[#221A16]">KS-2026-981240</span>.
              कारीगर सुनील वाघ को उनके फ़ोन पर बोलती वॉयस सूचना भेज दी गई है।
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex px-8 py-3.5 rounded-2xl bg-[#9D3E1B] text-white font-black text-sm shadow-md hover:bg-[#802906] transition"
              >
                और हस्तशिल्प देखें (Explore More Crafts)
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Cart Items (7 cols) */}
            <div className="md:col-span-7 bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="font-black text-lg text-[#221A16]">ऑर्डर सारांश / Order Summary</h2>

              <div className="flex items-center gap-4 py-4 border-y border-[#E6DCCF]">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300"
                    alt="Product item"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-sm text-[#221A16]">{item.title}</h3>
                  <p className="text-xs text-[#56423C]">{item.artisan}</p>
                  <span className="text-base font-black text-[#9D3E1B]">
                    ₹{priceRupees.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#006B2F]">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>100% सुरक्षित भुगतान एवं सीधा कारीगर बैंक ट्रांसफ़र (0% Commission)</span>
              </div>
            </div>

            {/* Payment & Checkout (5 cols) */}
            <div className="md:col-span-5 bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6DCCF]">
                <h2 className="font-black text-lg text-[#221A16]">भुगतान विवरण / Payment</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  100% DBT Safe
                </span>
              </div>

              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between text-[#56423C]">
                  <span>मूल्य (Subtotal)</span>
                  <span>₹{priceRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#56423C]">
                  <span>डिलीवरी (India Post Delivery)</span>
                  <span className="text-[#006B2F] font-black">मुफ़्त / FREE</span>
                </div>
                <div className="flex justify-between font-black text-lg text-[#221A16] pt-2 border-t border-[#E6DCCF]">
                  <span>कुल देय राशि (Total)</span>
                  <span className="text-[#9D3E1B]">₹{priceRupees.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-[#006B2F] hover:bg-[#005323] text-white font-black text-base shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'प्रक्रिया चल रही है...' : 'सुरक्षित भुगतान करें (Pay & Place Order)'}</span>
              </button>

              <p className="text-[11px] text-center text-[#56423C]">
                प्रदर्शन चेकआउट (Demo Checkout). कोई वास्तविक कार्ड चार्ज नहीं काटा जाएगा।
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

