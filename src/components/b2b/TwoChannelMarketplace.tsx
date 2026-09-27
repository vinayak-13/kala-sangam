'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Award,
  Lock,
  Download,
  Clock,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { AIBadge } from '@/components/AIBadge';
import { ClusterCapacityService, ClusterMatchingResult } from '@/server/services/cluster-capacity.service';

export function TwoChannelMarketplace() {
  const [activeChannel, setActiveChannel] = useState<'heritage' | 'bulk'>('heritage');
  const [bulkQuantity, setBulkQuantity] = useState(250);
  const [selectedClusterType, setSelectedClusterType] = useState<'warli' | 'pashmina'>('warli');

  const clusterResult = ClusterCapacityService.calculateClusterSplit(
    bulkQuantity,
    180000, // ₹1,800 unit price
    selectedClusterType
  );

  return (
    <div className="space-y-6">
      {/* Channel Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-[#E6DCCF] p-4 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#904D00]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#904D00]">
              दोहरा B2B बाज़ार चैनल (Two-Channel B2B Marketplace)
            </span>
            <AIBadge label="Fair Trade B2B" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#221A16] font-heading">
            विरासत मास्टरपीस बनाम क्लस्टर सामूहिक उत्पादन (Heritage vs Bulk Cluster)
          </h2>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#FAF5EF] border border-[#E6DCCF] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveChannel('heritage')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeChannel === 'heritage'
                ? 'bg-[#9D3E1B] text-white shadow-md'
                : 'text-[#56423C] hover:text-[#221A16]'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>विरासत चैनल (Heritage Channel)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('bulk')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeChannel === 'bulk'
                ? 'bg-[#904D00] text-white shadow-md'
                : 'text-[#56423C] hover:text-[#221A16]'
            }`}
          >
            <Users className="w-4 h-4 text-amber-200" />
            <span>थोक क्लस्टर चैनल (Bulk Cluster)</span>
          </button>
        </div>
      </div>

      {/* CHANNEL 1: HERITAGE EXCLUSIVE MASTERPIECES */}
      {activeChannel === 'heritage' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-[#FFF8F6] to-amber-50/40 border-2 border-[#E6DCCF] p-6 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-[#9D3E1B]">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">
                बौद्धिक संपदा संरक्षण एवं व्यक्तिगत मास्टर कारीगर प्रमाणीकरण (IP Provenance Seal)
              </span>
            </div>
            <h3 className="text-xl font-black text-[#221A16]">
              अनन्य मास्टरपीस कलाकृतियां (1-of-1 Verified Masterpieces)
            </h3>
            <p className="text-xs sm:text-sm text-[#56423C] font-semibold">
              प्रत्येक कलाकृति राष्ट्रीय पुरस्कार प्राप्त कारीगर द्वारा हस्तनिर्मित है। पहचान पत्र (Pehchan ID) और ब्लॉकचेन आधारित GI टैग द्वारा बौद्धिक संपदा चोरी से 100% सुरक्षित।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: 'hm-1',
                title: 'Celebration of Life - Grand Mahadev Warli Mural',
                artisan: 'Sunil Wagh (Master Craftsman)',
                pehchan: 'PEHCHAN-MH-04-1849',
                giTag: 'GI-372 (Palghar Warli)',
                price: '₹48,000',
                hours: '120 Hours Handcrafted',
                image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600',
                ipProtected: true,
              },
              {
                id: 'hm-2',
                title: 'Royal Mughal Paisley Needle-Work Cashmere Stole',
                artisan: 'Ghulam Nabi (National Awardee)',
                pehchan: 'PEHCHAN-JK-01-0921',
                giTag: 'GI-46 (Kashmir Pashmina)',
                price: '₹85,000',
                hours: '240 Hours Sozni Needlework',
                image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600',
                ipProtected: true,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-[#E6DCCF] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative h-64 bg-stone-900">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-amber-300 text-[11px] font-black border border-amber-400/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.giTag}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                    {item.hours}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-black text-lg text-[#221A16]">{item.title}</h4>
                    <p className="text-xs text-[#56423C] font-bold mt-1 flex items-center gap-2">
                      <span>{item.artisan}</span>
                      <span>·</span>
                      <span className="font-mono text-[#9D3E1B]">{item.pehchan}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E6DCCF]">
                    <div>
                      <span className="text-[11px] text-[#56423C] font-bold uppercase block">
                        कलाकृति मूल्य (Acquisition Price)
                      </span>
                      <span className="text-2xl font-black text-[#9D3E1B]">{item.price}</span>
                    </div>

                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-2xl bg-[#9D3E1B] hover:bg-[#802906] text-white font-black text-xs shadow-md transition active:scale-95"
                    >
                      सत्यापन प्रमाण-पत्र व अधिग्रहण (Acquire Masterpiece)
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHANNEL 2: BULK CLUSTER CAPACITY MATCHING CHANNEL */}
      {activeChannel === 'bulk' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Controls: Target Quantity & Cluster */}
          <div className="bg-white border-2 border-[#E6DCCF] p-6 rounded-3xl shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#904D00]">
                  सामूहिक क्षमता मिलान एल्गोरिदम (Collective Capacity Matching)
                </span>
                <h3 className="text-xl font-black text-[#221A16]">
                  कॉर्पोरेट एवं निर्यात थोक ऑर्डर (Enterprise Bulk Procurement)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClusterType('warli')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedClusterType === 'warli'
                      ? 'bg-[#904D00] text-white'
                      : 'bg-[#FAF5EF] text-[#56423C] hover:bg-[#F2E8DC]'
                  }`}
                >
                  वारली क्लस्टर (Maharashtra)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedClusterType('pashmina')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedClusterType === 'pashmina'
                      ? 'bg-[#904D00] text-white'
                      : 'bg-[#FAF5EF] text-[#56423C] hover:bg-[#F2E8DC]'
                  }`}
                >
                  पश्मीना वीवर्स (Kashmir)
                </button>
              </div>
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2 pt-2 border-t border-[#E6DCCF]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#56423C] uppercase">
                  वांछित ऑर्डर मात्रा (Target Bulk Order Quantity):
                </label>
                <span className="text-lg font-black text-[#904D00]">{bulkQuantity} Units</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={bulkQuantity}
                onChange={(e) => setBulkQuantity(Number(e.target.value))}
                className="w-full h-2.5 bg-[#FAF5EF] rounded-lg appearance-none cursor-pointer accent-[#904D00]"
              />
              <div className="flex justify-between text-[11px] text-[#56423C] font-bold">
                <span>50 Pieces</span>
                <span>500 Pieces (Standard Batch)</span>
                <span>1,000 Pieces (Enterprise Export)</span>
              </div>
            </div>
          </div>

          {/* Real-Time Cluster Capacity Forecast Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAF5EF] border border-[#E6DCCF] p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-[#56423C] uppercase">दैनिक सामूहिक क्षमता (Daily Cluster Output)</span>
              <div className="text-2xl font-black text-[#221A16]">
                {clusterResult.collectiveDailyCapacityUnits} Units / Day
              </div>
              <span className="text-[11px] text-[#006B2F] font-bold">
                {clusterResult.artisanAllocations.length} सत्यापित शिल्पकार सक्रिय
              </span>
            </div>

            <div className="bg-[#FAF5EF] border border-[#E6DCCF] p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-[#56423C] uppercase">अनुमानित डिलीवरी समय (Lead Time)</span>
              <div className="text-2xl font-black text-[#904D00]">
                {clusterResult.estimatedLeadDays} Days
              </div>
              <span className="text-[11px] text-[#56423C] font-semibold">
                गुणवत्ता जांच (QC) एवं पैकेजिंग सहित
              </span>
            </div>

            <div className="bg-[#FAF5EF] border border-[#E6DCCF] p-5 rounded-3xl space-y-1">
              <span className="text-xs font-bold text-[#56423C] uppercase">कुल ऑर्डर मूल्य (Order Value)</span>
              <div className="text-2xl font-black text-[#9D3E1B]">
                ₹{(clusterResult.totalOrderValuePaise / 100).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-[#006B2F] font-bold">
                30% एस्क्रो अग्रिम: ₹{(clusterResult.escrowDepositRequiredPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Artisan Quota Allocation Table */}
          <div className="bg-white border-2 border-[#E6DCCF] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-base text-[#221A16] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#904D00]" />
                <span>क्लस्टर कारीगर कोटा आवंटन (Artisan Quota Split Matrix)</span>
              </h4>
              <span className="text-xs font-bold text-[#006B2F] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Direct DBT Payout
              </span>
            </div>

            <div className="divide-y divide-[#E6DCCF] overflow-x-auto">
              {clusterResult.artisanAllocations.map((artisan) => (
                <div key={artisan.id} className="py-3.5 flex items-center justify-between gap-4 min-w-[500px]">
                  <div>
                    <div className="font-black text-sm text-[#221A16]">{artisan.name}</div>
                    <div className="text-xs text-[#56423C] font-mono">Pehchan: {artisan.pehchanId} · Rating: ⭐ {artisan.qualityRating}</div>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">आवंटित कोटा</span>
                    <span className="font-black text-sm text-[#904D00]">{artisan.allocatedQuota} Units</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">प्रत्यक्ष भुगतान</span>
                    <span className="font-black text-sm text-[#006B2F]">
                      ₹{(artisan.payoutPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full py-4 rounded-2xl bg-[#904D00] hover:bg-[#723c00] text-white font-black text-base shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              <span>थोक ऑर्डर अनुबंध जारी करें (Initiate Cluster Contract with 30% Escrow)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
