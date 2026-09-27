'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Palette,
  Building2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Mic,
  CheckCircle2,
  X,
} from 'lucide-react';
import { playTanpuraChime, speakText, stopAllAudio } from '@/lib/audio-utils';

interface RoleGatekeeperModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function RoleGatekeeperModal({ forceOpen = false, onClose }: RoleGatekeeperModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('kala_user_role');
      if (!savedRole || forceOpen) {
        setIsOpen(true);
      }
    }
  }, [forceOpen]);

  if (!isOpen) return null;

  const handleSelectRole = (role: 'artisan' | 'b2b' | 'retail') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kala_user_role', role);
    }
    stopAllAudio();
    playTanpuraChime(1.5);
    setIsOpen(false);
    if (onClose) onClose();

    if (role === 'artisan') {
      router.push('/studio/onboarding');
    } else if (role === 'b2b') {
      router.push('/portal/onboarding');
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FBF8F3] text-[#22201D] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#E4DACE] space-y-6 my-auto animate-in fade-in zoom-in duration-200">
        {/* Header Badge & Welcome Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C05A34]/10 text-[#C05A34] text-xs font-bold border border-[#C05A34]/20">
            <Sparkles className="w-4 h-4 text-[#C05A34]" />
            <span>KALA-SANGAM · कला-संगम भारत</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#22201D] font-heading">
            आप वेबसाइट में कैसे प्रवेश करना चाहते हैं?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
            Please choose how you would like to enter the portal
          </p>
        </div>

        {/* ── 3 ROLE SELECTION CARDS ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: ARTISAN CREATOR (Primary Choice) */}
          <button
            type="button"
            onClick={() => handleSelectRole('artisan')}
            className="group relative p-5 rounded-3xl border-2 border-[#C05A34] bg-white hover:bg-[#FAF5EF] text-left transition-all duration-200 active:scale-95 shadow-md flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#C05A34] text-white flex items-center justify-center shadow-md">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black text-[#C05A34] uppercase tracking-wider block">
                  विक्रेता / कारीगर (Seller)
                </span>
                <h3 className="text-lg font-black text-[#22201D] group-hover:text-[#C05A34] transition">
                  कारीगर के रूप में प्रवेश करें
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                30 सेकंड में प्रोफ़ाइल बनाएं, बोलकर उत्पाद जोड़ें और सीधे ग्राहकों व एक्सपोर्टर्स को बेचें।
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-black text-[#C05A34]">
              <span>प्रोफाइल बनाएं (Create Profile)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: B2B BULK BUYER */}
          <button
            type="button"
            onClick={() => handleSelectRole('b2b')}
            className="group relative p-5 rounded-3xl border-2 border-[#2B3A67] bg-white hover:bg-slate-50 text-left transition-all duration-200 active:scale-95 shadow-md flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#2B3A67] text-white flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black text-[#2B3A67] uppercase tracking-wider block">
                  होलसेल / एक्सपोर्टर (Wholesale)
                </span>
                <h3 className="text-lg font-black text-[#22201D] group-hover:text-[#2B3A67] transition">
                  थोक खरीदार (Bulk Buyer)
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                कारीगरों के क्लस्टर से सीधे थोक भाव (MOQ) पर खरीदें। ONDC प्रोटोकॉल और RFQ सुविधा।
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-black text-[#2B3A67]">
              <span>B2B पोर्टल खोलें (B2B Portal)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Card 3: RETAIL EXPLORER / CUSTOMER */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleSelectRole('retail')}
            className="w-full py-3.5 px-5 rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#C05A34]" />
            <span>हस्तशिल्प बाज़ार देखना व खरीदना (Browse Marketplace as Customer) →</span>
          </button>
        </div>

        {/* Footer Trust Markers */}
        <div className="pt-2 border-t border-[#E4DACE] flex items-center justify-center gap-6 text-[11px] text-stone-500 font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ODOP GI Verified
          </span>
          <span className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-[#2B3A67]" /> 22+ Indic Languages
          </span>
          <span className="flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-[#C05A34]" /> Voice-First
          </span>
        </div>
      </div>
    </div>
  );
}
