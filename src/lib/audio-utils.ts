// Multi-Tiered Universal Pan-India & Mobile-Optimized Audio Engine for KALA-SANGAM

let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let currentAudioElement: HTMLAudioElement | null = null;
let isMobileAudioUnlocked = false;

/**
 * Mobile-First Audio Context Initializer & Touch Gesture Unlocker
 * Automatically un-suspends AudioContext and warms up HTML5 Audio on mobile devices (iOS Safari & Android Chrome)
 */
export function unlockMobileAudio(): void {
  if (typeof window === 'undefined' || isMobileAudioUnlocked) return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (AudioContextClass && !audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }

    // Warm up HTML5 Audio object with a 0.01s silent sound for iOS Safari
    if (!currentAudioElement) {
      currentAudioElement = new Audio();
      currentAudioElement.preload = 'auto';
      (currentAudioElement as any).playsinline = true;
      (currentAudioElement as any).webkitPlaysInline = true;
    }

    isMobileAudioUnlocked = true;
  } catch {
    // ignore
  }
}

// Attach auto-unlocker to first mobile touch/click
if (typeof window !== 'undefined') {
  const unlockEvents = ['touchstart', 'touchend', 'click', 'pointerdown'];
  const unlockHandler = () => {
    unlockMobileAudio();
    unlockEvents.forEach((evt) => window.removeEventListener(evt, unlockHandler));
  };
  unlockEvents.forEach((evt) => window.addEventListener(evt, unlockHandler, { once: true, passive: true }));
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeEndCallback: (() => void) | null = null;

/**
 * Instantly stops all playing audio, speech streams, oscillators, and speech synthesis
 */
export function stopAllAudio(): void {
  activeEndCallback = null;

  // 1. Stop streaming HTML5 Audio
  if (currentAudioElement) {
    try {
      currentAudioElement.onended = null;
      currentAudioElement.onerror = null;
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement.src = '';
    } catch {
      // ignore
    }
  }

  // 2. Stop browser speech synthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      if (currentUtterance) {
        currentUtterance.onend = null;
        currentUtterance.onerror = null;
        currentUtterance = null;
      }
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  // 3. Stop Web Audio oscillators
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // ignore
    }
  });
  activeOscillators = [];
}

/**
 * Generates an acoustic folk tanpura/chime tone using Web Audio API
 */
export function playTanpuraChime(duration = 2.5): void {
  try {
    unlockMobileAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [146.83, 220.0, 293.66, 440.0];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 0.1 * (idx + 1));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
      activeOscillators.push(osc);
    });
  } catch (err) {
    console.warn('Tanpura chime error:', err);
  }
}

/**
 * Plays a quick UI feedback beep/tone
 */
export function playUiBeep(type: 'start' | 'stop' | 'success' = 'start'): void {
  try {
    unlockMobileAudio();
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'start') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    } else if (type === 'stop') {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
    } else {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
    }

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (type === 'success' ? 0.35 : 0.18));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (type === 'success' ? 0.35 : 0.18));
  } catch {
    // ignore
  }
}

/**
 * Universal Mobile-Ready Pan-India Voice Engine
 * Level 1: Server-Side TTS WAV Stream (/api/tts) with direct Audio Element (100% works on iOS Safari, Android Chrome, Samsung Internet)
 * Level 2: Web Speech Synthesis fallback if offline
 */
export function speakText(
  text: string,
  preferredLocale = 'hi',
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !text) {
    return false;
  }

  unlockMobileAudio();
  stopAllAudio();

  const cleanLocale = preferredLocale.toLowerCase().split('-')[0] || 'hi';
  const cleanText = text.trim();
  activeEndCallback = onEnd || null;

  // ── LEVEL 1: DIRECT STREAMING AUDIO VIA /api/tts ─────────────────────────
  try {
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&locale=${encodeURIComponent(cleanLocale)}`;
    
    if (!currentAudioElement) {
      currentAudioElement = new Audio();
    }
    
    const audio = currentAudioElement;
    audio.src = ttsUrl;
    audio.preload = 'auto';
    (audio as any).playsinline = true;
    (audio as any).webkitPlaysInline = true;

    audio.onended = () => {
      const cb = activeEndCallback;
      activeEndCallback = null;
      if (cb) cb();
    };

    audio.onerror = () => {
      // Fallback to Level 2 (Browser Web Speech) if network stream fails
      fallbackToWebSpeech(cleanText, cleanLocale, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay policy interrupted, try Web Speech fallback
        fallbackToWebSpeech(cleanText, cleanLocale, onEnd);
      });
    }

    return true;
  } catch {
    return fallbackToWebSpeech(cleanText, cleanLocale, onEnd);
  }
}

function fallbackToWebSpeech(
  text: string,
  cleanLocale: string,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();

    let matchedVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(cleanLocale) ||
        v.name.toLowerCase().includes(cleanLocale)
    );

    if (!matchedVoice) {
      matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('in') ||
          v.name.toLowerCase().includes('hindi') ||
          v.lang.toLowerCase().startsWith('hi')
      );
    }

    if (!matchedVoice && voices.length > 0) {
      matchedVoice = voices[0];
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = `${cleanLocale}-IN`;
    }

    utterance.onend = () => {
      currentUtterance = null;
      const cb = activeEndCallback;
      activeEndCallback = null;
      if (cb) cb();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      const cb = activeEndCallback;
      activeEndCallback = null;
      if (cb) cb();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    if (onEnd) onEnd();
    return false;
  }
}

