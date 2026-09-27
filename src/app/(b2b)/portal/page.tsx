import React from 'react';
import Link from 'next/link';
import { Building2, FileText, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { productService } from '@/server/services/product-service';

export default async function B2BPortalPage() {
  const { items } = await productService.listProducts({ b2b: 'true', limit: 8 });

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* B2B Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#2B3A67] text-white p-6 sm:p-8 rounded-3xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> GST/Udyam Verified B2B Buyer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading">
              B2B Cluster Catalog & Wholesale RFQs
            </h1>
            <p className="text-xs sm:text-sm text-stone-200">
              Direct institutional order placement with minimum order quantities (MOQ)
            </p>
          </div>

          <Link
            href="/portal/rfq/new"
            className="px-6 py-3.5 rounded-2xl bg-[#C05A34] hover:bg-[#9A4526] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Create Custom RFQ</span>
          </Link>
        </div>

        {/* B2B Products Table / Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#22201D]">Available Wholesale Lots (MOQ Enabled)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => {
              const priceUnit = p.price_paise ? Math.round(p.price_paise / 100) : 1000;
              const moq = p.b2b_moq || 10;
              const lotTotal = priceUnit * moq;

              return (
                <div key={p.id} className="bg-white border border-[#E4DACE] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#2B3A67]/10 text-[#2B3A67] capitalize">
                        {p.tags[0] || 'Handicraft'}
                      </span>
                      <span className="text-xs font-bold text-stone-500">MOQ: {moq} Units</span>
                    </div>

                    <h3 className="font-bold text-base text-[#22201D] line-clamp-2">
                      {p.title.en}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#E4DACE] space-y-3">
                    <div className="flex justify-between items-baseline text-sm">
                      <span className="text-xs text-stone-500">Unit Price</span>
                      <span className="font-bold text-stone-800">₹{priceUnit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-stone-500 font-semibold">Min Lot Value ({moq} units)</span>
                      <span className="font-black text-lg text-[#C05A34]">₹{lotTotal.toLocaleString('en-IN')}</span>
                    </div>

                    <Link
                      href={`/portal/rfq/new?productId=${p.id}`}
                      className="block text-center py-2.5 rounded-xl bg-[#2B3A67] hover:bg-[#1E2A4D] text-white font-bold text-xs transition"
                    >
                      Request Formal Quote (RFQ)
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
