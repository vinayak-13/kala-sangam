'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, IndianRupee, ShieldCheck, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function CartPage() {
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const item = {
    title: 'Traditional Tarpa Dance Festive Warli Canvas',
    artisan: 'Sunil Dhangar · Palghar, Maharashtra',
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
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <h1 className="text-3xl font-black text-[#22201D] font-heading">
          खरीदारी की टोकरी (Your Cart & Checkout)
        </h1>

        {isOrdered ? (
          <div className="bg-white border border-[#E4DACE] rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-[#22201D]">Order Placed Successfully!</h2>
            <p className="text-sm text-stone-600">
              Order ID: <span className="font-mono font-bold text-stone-900">KS-2026-981240</span>.
              The artisan Sunil Dhangar has received a voice alert on their phone.
            </p>
            <div className="pt-2">
              <Link
                href="/explore"
                className="inline-flex px-6 py-3 rounded-xl bg-[#C05A34] text-white font-bold text-sm"
              >
                Continue Exploring Crafts
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Cart Items (7 cols) */}
            <div className="md:col-span-7 bg-white border border-[#E4DACE] rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-lg text-[#22201D]">Order Summary</h2>

              <div className="flex items-center gap-4 py-4 border-y border-[#E4DACE]">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300"
                    alt="Product item"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-sm text-[#22201D]">{item.title}</h3>
                  <p className="text-xs text-stone-500">{item.artisan}</p>
                  <span className="text-base font-black text-[#C05A34]">
                    ₹{priceRupees.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Secure & Direct Artisan Remittance</span>
              </div>
            </div>

            {/* Payment & Checkout (5 cols) */}
            <div className="md:col-span-5 bg-white border border-[#E4DACE] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4DACE]">
                <h2 className="font-bold text-lg text-[#22201D]">Payment Details</h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Razorpay Sandbox (Mock)
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{priceRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping (India Post)</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between font-black text-lg text-[#22201D] pt-2 border-t border-[#E4DACE]">
                  <span>Total Amount</span>
                  <span className="text-[#C05A34]">₹{priceRupees.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-[#C05A34] hover:bg-[#9A4526] text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Pay & Place Order'}</span>
              </button>

              <p className="text-[11px] text-center text-stone-500">
                Demonstration checkout. No real card charge will be made.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
