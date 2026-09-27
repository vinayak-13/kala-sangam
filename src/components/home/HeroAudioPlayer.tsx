'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Volume2, Play, Pause, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { playTanpuraChime, speakText, stopAllAudio } from '@/lib/audio-utils';

export function HeroAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleHeroAudio = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }

    stopAllAudio();
    setIsPlaying(true);
    playTanpuraChime(1.5);
    speakText(
      'मी सुनील ढनघर. पालघर मधील वारली पेंटिंग बनवतो. हा तारपा नाच आहे, जो आमच्या गावातील कापणी उत्सवात केला जातो.',
      'mr',
      () => {
        setIsPlaying(false);
      }
    );
  };

  return (
    <div className="relative w-full rounded-3xl bg-white p-4 sm:p-5 shadow-xl border border-[#E6DCCF] transition-transform hover:-translate-y-1 duration-300">
      {/* Image with craft badge & audio duration chip */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FBEBE4]">
        <img
          className="w-full h-full object-cover"
          alt="Traditional Warli Painting"
          src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800"
        />

        {/* Voice playback chip floating on image */}
        <div className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full bg-[#221A16]/85 backdrop-blur-md text-[#FFF8F6] flex items-center gap-2 shadow-md">
          <Volume2 className="w-4 h-4 text-[#FE932C] animate-pulse" />
          <span className="text-xs font-bold tracking-wide">सुनील बोलते हैं (Sunil speaks · 0:24)</span>
        </div>

        {/* ODOP GI Tag on image */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#006B2F] text-white flex items-center gap-1 shadow-sm text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#95F8A7]" />
          <span>GI Authenticated</span>
        </div>

        {/* Live waveform micro-player at bottom of photo */}
        <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-white/95 backdrop-blur-md shadow-lg flex items-center gap-3 border border-[#E6DCCF]/60">
          <button
            type="button"
            onClick={toggleHeroAudio}
            aria-label="Play artisan voice story"
            className="w-10 h-10 rounded-full bg-[#9D3E1B] hover:bg-[#802906] text-white flex items-center justify-center shrink-0 transition shadow-sm active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
            <div className="flex items-center justify-between text-[#221A16] text-xs">
              <span className="font-bold truncate">सुनील ढनघर · पालघर, महाराष्ट्र</span>
              <span className="text-[#9D3E1B] font-mono text-[11px] font-bold">
                {isPlaying ? '0:11 / 0:24' : '0:00 / 0:24'}
              </span>
            </div>

            {/* Waveform Graphic */}
            <div className="flex items-center gap-1 h-3 w-full">
              {[2, 3, 1.5, 2.5, 3, 2, 3, 1, 2, 3, 1.5, 2.5, 1, 2, 3, 1, 2, 1.5].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded transition-all duration-200 ${
                    isPlaying && i < 8 ? 'bg-[#9D3E1B] animate-pulse' : 'bg-[#DDC0B8]'
                  }`}
                  style={{ height: `${height * 4}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-col gap-2 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#9D3E1B] uppercase font-black tracking-wider">
            Live Cultural Provenance
          </span>
          <span className="text-xs text-[#006B2F] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Authentic
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#221A16]">
          Traditional Tarpa Dance Warli Canvas
        </h3>

        <p className="text-xs text-[#56423C] italic bg-[#FFF1EB] p-3 rounded-xl border border-[#DDC0B8]/40">
          &ldquo;गेरू आणि तांदळाच्या पिठाने हाताने चितारलेली पारंपरिक वारली थाळी. गावातील शेती कापणी उत्सवाचे आणि तारपा नृत्याचे जिवंत चित्रण...&rdquo;
        </p>

        <Link
          href="/product/e1111111-0000-0000-0000-000000000001"
          className="mt-1 w-full text-center py-2.5 rounded-xl bg-[#FFF1EB] hover:bg-[#9D3E1B] text-[#9D3E1B] hover:text-white font-bold text-xs transition flex items-center justify-center gap-1"
        >
          <span>पूरी कहानी और खरीदें (View Full Story)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
