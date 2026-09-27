import React from 'react';
import Link from 'next/link';
import { Building2, FileText, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { VoiceGuideButton } from '@/components/VoiceGuideButton';
import { TwoChannelMarketplace } from '@/components/b2b/TwoChannelMarketplace';
import { productService } from '@/server/services/product-service';

export default async function B2BPortalPage() {
  const { items } = await productService.listProducts({ b2b: 'true', limit: 8 });

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#221A16] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Two-Channel B2B Marketplace Linkage (Heritage vs Bulk Cluster) */}
        <TwoChannelMarketplace />

        {/* B2B Header (Dual-Language) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#221A16] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[#56423C]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> GST / Udyam सत्यापित थोक बाज़ार (Verified B2B)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading">
              कारीगर क्लस्टर थोक व्यापार (B2B Wholesale Portal & RFQs)
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              होटल, निर्यातकों और थोक खरीदारों के लिए 0% कमीशन सीधे क्लस्टर ऑर्डर · Direct institutional orders with MOQ
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <VoiceGuideButton pageKey="portal" />
            <Link
              href="/portal/rfq/new"
              className="px-6 py-3.5 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>कोटेशन अनुरोध / Create RFQ</span>
            </Link>
          </div>
        </div>

        {/* B2B Products Table / Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#221A16]">उपलब्ध थोक लॉट / Available Wholesale Lots (MOQ Enabled)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const priceUnit = p.price_paise ? Math.round(p.price_paise / 100) : 1000;
              const moq = p.b2b_moq || 10;
              const lotTotal = priceUnit * moq;

              return (
                <div key={p.id} className="bg-white border-2 border-[#E6DCCF] rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1EB] text-[#9D3E1B] capitalize border border-[#DDC0B8]">
                        {p.tags[0] || 'Handicraft'}
                      </span>
                      <span className="text-xs font-bold text-[#56423C]">न्यूनतम मात्रा (MOQ): {moq} Units</span>
                    </div>

                    <h3 className="font-bold text-base text-[#221A16] line-clamp-2">
                      {p.title.hi || p.title.en}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#E6DCCF] space-y-3">
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-xs text-[#56423C]">प्रति नग दर / Unit Price</span>
                      <span className="font-bold text-[#221A16]">₹{priceUnit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-[#56423C] font-semibold">न्यूनतम लॉट मूल्य ({moq} नग)</span>
                      <span className="font-black text-lg text-[#9D3E1B]">₹{lotTotal.toLocaleString('en-IN')}</span>
                    </div>

                    <Link
                      href={`/portal/rfq/new?productId=${p.id}`}
                      className="block text-center py-2.5 rounded-xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-bold text-xs transition shadow-xs"
                    >
                      कोटेशन मांगें (Request Formal RFQ)
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

