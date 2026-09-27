import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Truck, ArrowRight, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function B2BLandingPage() {
  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#2B3A67] text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>B2B Institutional & Export Procurement</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-heading leading-tight">
              Direct Cluster Procurement from Certified Indian Artisans
            </h1>

            <p className="text-lg text-stone-200 leading-relaxed">
              Source GI-tagged ODOP handicrafts directly from artisan SHGs and master craftsmen. Tiered MOQ wholesale pricing, customized RFQs with voice replies, and GST-compliant invoicing.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/portal"
                className="px-8 py-4 rounded-2xl bg-[#C05A34] hover:bg-[#9A4526] text-white font-bold text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Browse B2B Wholesale Catalog</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/portal/rfq/new"
                className="px-8 py-4 rounded-2xl border-2 border-white/40 hover:bg-white/10 text-white font-bold text-base transition flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Submit Custom RFQ</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E4DACE] p-8 rounded-3xl shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2B3A67]/10 flex items-center justify-center text-[#2B3A67]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#22201D]">Udyam & GST Verified</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Direct transactions with government-registered artisan clusters with legitimate GSTIN and Udyam credentials.
              </p>
            </div>

            <div className="bg-white border border-[#E4DACE] p-8 rounded-3xl shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C05A34]/10 flex items-center justify-center text-[#C05A34]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#22201D]">Standardized Quality & Lead Times</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Strict batch quality inspection, standardized packaging for hospitality, corporate gifting, and international export.
              </p>
            </div>

            <div className="bg-white border border-[#E4DACE] p-8 rounded-3xl shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#22201D]">Voice-Enabled RFQ Replies</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Send quote requests and receive recorded voice responses directly from the cluster master artisan in their native tongue.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
