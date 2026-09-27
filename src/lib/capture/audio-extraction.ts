// Audio Extraction and Voice Activity Detection (VAD) from Video (Doc 19)

/**
 * Extracts and decodes audio buffer from video blob using Web Audio API
 */
export async function extractAudioTrack(videoBlob: Blob): Promise<AudioBuffer | null> {
  try {
    const arrayBuffer = await videoBlob.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioCtx();
    return await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn('decodeAudioData failed, failing open (treating as no audio):', err);
    return null;
  }
}

/**
 * Energy-based Voice Activity Detection (RMS threshold over 100ms windows)
 */
export function hasSustainedSpeech(
  buffer: AudioBuffer | null,
  minMs = 6000,
  rmsThreshold = 0.02
): boolean {
  if (!buffer) return false;

  try {
    const data = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    const windowSize = Math.floor(sampleRate * 0.1); // 100ms window
    let sustainedMs = 0;

    for (let i = 0; i < data.length; i += windowSize) {
      const window = data.subarray(i, i + windowSize);
      let sumSq = 0;
      for (let j = 0; j < window.length; j++) {
        sumSq += (window[j] || 0) * (window[j] || 0);
      }
      const rms = Math.sqrt(sumSq / window.length);

      if (rms > rmsThreshold) {
        sustainedMs += 100;
        if (sustainedMs >= minMs) {
          return true;
        }
      } else {
        sustainedMs = Math.max(0, sustainedMs - 50); // decay slightly
      }
    }

    return sustainedMs >= minMs;
  } catch {
    return false;
  }
}
