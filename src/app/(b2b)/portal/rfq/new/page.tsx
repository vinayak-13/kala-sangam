'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, FileSpreadsheet, Building2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function NewRfqPage() {
  const [submitted, setSubmitted] = useState(false);
  const [quantity, setQuantity] = useState(50);
  const [message, setMessage] = useState('Looking for customized packaging for VIP guest gifting.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link href="/portal" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#C05A34]">
          <ArrowLeft className="w-4 h-4" /> Back to Wholesale Catalog
        </Link>

        <div className="bg-white border border-[#E4DACE] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-[#2B3A67] uppercase tracking-wider block mb-1">
              B2B Request for Quotation
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#22201D] font-heading">
              Submit Direct Cluster RFQ
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              The artisan cluster master will review specifications and can reply via audio recording.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h2 className="text-xl font-bold text-emerald-950">RFQ Dispatched to Artisan Guild!</h2>
              <p className="text-xs text-stone-600">
                You will receive a notification and voice reply once the cluster estimates batch timeline.
              </p>
              <Link href="/portal" className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#2B3A67] text-white text-xs font-bold">
                Return to B2B Catalog
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Select Craft Category / Product</label>
                <select className="w-full p-3 rounded-xl border border-[#E4DACE] text-sm bg-white focus:outline-none focus:border-[#2B3A67]">
                  <option>Warli Painting — Bamboo Stand & Wall Canvas (Palghar Cluster)</option>
                  <option>Jaipur Blue Pottery — Hexagonal Floral Vases (Kot Jewar Cluster)</option>
                  <option>Bidriware — Silver Inlaid Aftaba & Cases (Bidar Guild)</option>
                  <option>Channapatna Wooden Toys — Non-toxic Stacking Towers</option>
                  <option>Kutch Embroidered Heritage Bags (Bhujodi Collective)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    min="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-[#E4DACE] text-sm focus:outline-none focus:border-[#2B3A67]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    defaultValue="2026-10-15"
                    className="w-full p-3 rounded-xl border border-[#E4DACE] text-sm focus:outline-none focus:border-[#2B3A67]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Custom Requirements / Notes</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E4DACE] text-sm focus:outline-none focus:border-[#2B3A67]"
                  placeholder="Specify custom branding, packaging, or export certifications needed..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#2B3A67] hover:bg-[#1E2A4D] text-white font-bold text-base shadow-md transition active:scale-95"
              >
                Send Request for Quote to Artisan
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
