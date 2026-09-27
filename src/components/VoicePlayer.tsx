'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Square, RotateCcw, Globe, Check, Search, ChevronDown } from 'lucide-react';
import { speakText, playTanpuraChime, stopAllAudio, playUiBeep } from '@/lib/audio-utils';
import { MULTILINGUAL_TRANSCRIPTS, ALL_INDIC_LANGUAGES } from '@/lib/i18n/indic-languages';

interface VoicePlayerProps {
  artisanName?: string;
  audioUrl?: string;
  transcriptOriginal?: string;
  transcriptHindi?: string;
  transcriptEnglish?: string;
  sourceLanguage?: string;
}

export function VoicePlayer({
  artisanName = 'Sunil Wagh',
  audioUrl = '/audio/seed/sunil_tarpa_explanation.wav',
  sourceLanguage = 'मराठी / Marathi',
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLangKey, setSelectedLangKey] = useState<string>('original');
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showAllLangModal, setShowAllLangModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeData = MULTILINGUAL_TRANSCRIPTS[selectedLangKey] || MULTILINGUAL_TRANSCRIPTS['original'];

  const stopPlayback = () => {
    playUiBeep('stop');
    setIsPlaying(false);
    setProgress(0);
    stopAllAudio();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      stopAllAudio();
      if (audioRef.current) audioRef.current.pause();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    setIsPlaying(true);
    setProgress(0);

    // Play resonant tanpura chime
    playTanpuraChime(3.0);

    // Speak the active transcript in the selected Indic language
    speakText(activeData?.text || '', activeData?.audioLocale || 'hi-IN', () => {
      setIsPlaying(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    });

    // Native audio play attempt
    if (audioRef.current && selectedLangKey === 'original') {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {});
    }

    // Animate waveform progress
    let current = 0;
    progressTimerRef.current = setInterval(() => {
      current += 2.2;
      setProgress(Math.min(100, current));
      if (current >= 100 && progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    }, 200);
  };

  const handleLanguageSelect = (langKey: string) => {
    setSelectedLangKey(langKey);
    setShowAllLangModal(false);
    const target = MULTILINGUAL_TRANSCRIPTS[langKey];
    if (isPlaying) {
      stopPlayback();
      setTimeout(() => {
        setIsPlaying(true);
        playTanpuraChime(2.5);
        speakText(target?.text || '', target?.audioLocale || 'hi-IN', () => {
          setIsPlaying(false);
          setProgress(0);
        });
      }, 100);
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  const filteredLangKeys = Object.entries(MULTILINGUAL_TRANSCRIPTS).filter(
    ([key, data]) =>
      data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FAF5EF] border-2 border-[#E4DACE] rounded-3xl p-5 shadow-sm space-y-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
      />

      {/* Header with Artisan Title & Speed Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#C05A34]/15 flex items-center justify-center text-[#C05A34] shadow-xs">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#22201D] flex items-center gap-1.5">
              <span>{artisanName} बोलताहेत</span>
              <span className="text-xs font-normal text-stone-500 italic">· Hear from the maker</span>
            </h4>
            <p className="text-xs text-stone-500 font-medium">Authentic Voice Provenance · 0:28</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <button
            onClick={cycleSpeed}
            type="button"
            className="text-xs font-bold px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-700 transition"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Audio Waveform & Player Controls (Play + Explicit STOP button) */}
      <div className="flex items-center gap-2.5">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          type="button"
          className="w-12 h-12 rounded-full bg-[#C05A34] hover:bg-[#9A4526] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
          aria-label={isPlaying ? 'Pause voice clip' : 'Play voice clip'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>

        {/* Dedicated STOP Button */}
        <button
          onClick={stopPlayback}
          type="button"
          disabled={!isPlaying && progress === 0}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-transform active:scale-95 shrink-0 ${
            isPlaying || progress > 0
              ? 'bg-stone-800 border-stone-800 hover:bg-stone-900 text-white shadow-md cursor-pointer'
              : 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed opacity-60'
          }`}
          aria-label="Stop audio"
          title="Stop Audio (आवाज़ बंद करें)"
        >
          <Square className="w-5 h-5 fill-current" />
        </button>

        {/* Animated Waveform Visualizer */}
        <div className="flex-1 flex items-center gap-1 h-9 px-2.5 bg-white border border-[#E4DACE] rounded-xl overflow-hidden relative shadow-inner">
          {Array.from({ length: 28 }).map((_, i) => {
            const height = isPlaying
              ? Math.sin(i * 0.5 + Date.now() * 0.005) * 12 + 16
              : (i % 5) * 4 + 8;
            const barFilled = (i / 28) * 100 <= progress;
            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  barFilled ? 'bg-[#C05A34]' : 'bg-stone-300'
                }`}
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>
      </div>

      {/* ── PAN-INDIA MULTILINGUAL LANGUAGE SELECTOR (22+ Indian Languages) ── */}
      <div className="pt-2 border-t border-[#E4DACE] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#C05A34]" />
            <span>अखिल भारतीय भाषाएँ / Pan-India Voice:</span>
          </span>
          <button
            type="button"
            onClick={() => setShowAllLangModal(!showAllLangModal)}
            className="text-xs font-bold text-[#C05A34] hover:underline flex items-center gap-0.5"
          >
            <span>22+ भाषाएँ (All Languages)</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Scrollable Language Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {Object.entries(MULTILINGUAL_TRANSCRIPTS).map(([key, data]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleLanguageSelect(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1 shrink-0 ${
                selectedLangKey === key
                  ? 'bg-[#C05A34] text-white shadow-xs'
                  : 'bg-white border border-[#E4DACE] text-stone-700 hover:bg-stone-100'
              }`}
            >
              {selectedLangKey === key && <Check className="w-3 h-3 stroke-[3]" />}
              <span>{data.label}</span>
            </button>
          ))}
        </div>

        {/* Expandable 22+ Language Modal/Drawer */}
        {showAllLangModal && (
          <div className="p-3 bg-white border border-[#E4DACE] rounded-2xl shadow-md space-y-2.5 animate-in fade-in duration-150">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="भाषा खोजें (Search 22+ Indic Languages)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF5EF] rounded-xl border border-stone-200 outline-none focus:border-[#C05A34]"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {filteredLangKeys.map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleLanguageSelect(key)}
                  className={`p-2 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                    selectedLangKey === key
                      ? 'bg-[#C05A34] text-white'
                      : 'hover:bg-[#FAF5EF] text-stone-800'
                  }`}
                >
                  <span className="truncate">{data.label}</span>
                  {selectedLangKey === key && <Check className="w-3 h-3 stroke-[3] shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Localized Spoken Transcript Container */}
      <div className="bg-white border border-[#E4DACE] rounded-2xl p-4 text-sm text-[#22201D] leading-relaxed shadow-xs space-y-1">
        <div className="flex items-center justify-between text-xs text-stone-400 font-medium border-b border-stone-100 pb-1">
          <span className="font-bold text-stone-600">{activeData?.label} अनुवाद / Spoken Transcript</span>
          <span>{isPlaying ? '🔴 बोल रहे हैं...' : '▶ सुनने के लिए प्ले करें'}</span>
        </div>
        <p className="italic pt-1 font-medium text-stone-800">&ldquo;{activeData?.text}&rdquo;</p>
      </div>
    </div>
  );
}
