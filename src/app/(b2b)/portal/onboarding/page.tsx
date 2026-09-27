'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mic, Check, ArrowRight, ShieldCheck, Volume2 } from 'lucide-react';
import { MicButton } from '@/components/MicButton';
import { speakText, playTanpuraChime } from '@/lib/audio-utils';

export default function B2BOnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [volume, setVolume] = useState<'<50' | '50-200' | '200-1000' | '1000+'>('200-1000');
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>(['Warli Painting', 'Dhokra']);
  const [businessDesc, setBusinessDesc] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const craftOptions = [
    'Warli Painting',
    'Blue Pottery',
    'Bidriware',
    'Channapatna Toys',
    'Dhokra',
    'Pattachitra',
    'Kutch Embroidery',
    'Sanjhi',
  ];

  const toggleCraft = (craft: string) => {
    setSelectedCrafts((prev) =>
      prev.includes(craft) ? prev.filter((c) => c !== craft) : [...prev, craft]
    );
  };

  const handleVoiceDescription = (blob: Blob) => {
    playTanpuraChime(1.5);
    setBusinessDesc('We are an authentic handicraft export and boutique hospitality sourcing house looking for regular bulk artisan supply.');
    setIsVoiceActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/portal?volume=${volume}&crafts=${encodeURIComponent(selectedCrafts.join(','))}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col justify-between p-4 sm:p-6 max-w-2xl mx-auto">
      <header className="flex items-center justify-between pb-4 border-b border-[#E4DACE]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#2B3A67] text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#22201D]">B2B थोक खरीदार खाता (Wholesale Buyer Account)</h1>
            <p className="text-xs text-stone-500">Direct artisan cluster procurement & verified MOQs</p>
          </div>
        </div>
      </header>

      <main className="my-auto py-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5 bg-white border-2 border-[#E4DACE] rounded-3xl p-6 shadow-sm">
          {/* Company Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700 uppercase">
              कंपनी का नाम / Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Heritage Hotels & Living Spaces Ltd."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm focus:border-[#2B3A67] outline-none"
            />
          </div>

          {/* GSTIN & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                GSTIN नंबर <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="27ABCDE1234F1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-xl border border-stone-300 font-mono text-sm uppercase focus:border-[#2B3A67] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                संपर्क फ़ोन / Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm focus:border-[#2B3A67] outline-none"
              />
            </div>
          </div>

          {/* Craft Interests Multi-Select */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase">
              किन शिल्पों में रुचि है? (Select Crafts of Interest)
            </label>
            <div className="flex flex-wrap gap-2">
              {craftOptions.map((craft) => (
                <button
                  key={craft}
                  type="button"
                  onClick={() => toggleCraft(craft)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedCrafts.includes(craft)
                      ? 'bg-[#2B3A67] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {craft}
                </button>
              ))}
            </div>
          </div>

          {/* Typical Order Volume */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase">
              अनुमानित ऑर्डर मात्रा / Typical Order Volume (Units)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['<50', '50-200', '200-1000', '1000+'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVolume(v)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-center border transition ${
                    volume === v
                      ? 'bg-[#FAF5EF] border-[#C05A34] text-[#C05A34] font-black'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {v} units
                </button>
              ))}
            </div>
          </div>

          {/* Business Description (Voice or Text) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 uppercase">
                व्यापार विवरण (About Your Business)
              </label>
              <button
                type="button"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className="text-xs font-bold text-[#C05A34] flex items-center gap-1 hover:underline"
              >
                <Mic className="w-3.5 h-3.5" /> 15s में बोलकर बताएं (Voice Input)
              </button>
            </div>

            {isVoiceActive ? (
              <div className="p-4 bg-[#FAF5EF] border border-[#E4DACE] rounded-2xl text-center space-y-2">
                <p className="text-xs font-semibold text-stone-700">
                  माइक दबाकर अपने व्यवसाय और आवश्यकताओं के बारे में बोलें
                </p>
                <MicButton onRecordingComplete={handleVoiceDescription} />
              </div>
            ) : (
              <textarea
                rows={2}
                placeholder="e.g. Sourcing authentic ODOP crafts for domestic hospitality & export"
                value={businessDesc}
                onChange={(e) => setBusinessDesc(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 font-medium text-sm focus:border-[#2B3A67] outline-none"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-[#2B3A67] hover:bg-[#1E2A4D] text-white font-black text-base shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>B2B पोर्टल खोलें (Open Personalized Portal)</span>
          </button>
        </form>
      </main>

      <footer className="pt-4 border-t border-[#E4DACE] text-center text-xs text-stone-500">
        KALA-SANGAM B2B · Bulk Cluster Linkage · PS 26090
      </footer>
    </div>
  );
}
