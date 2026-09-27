// Real-Time Frame Analysis for AI-Guided Photo Capture (Doc 17)

export const BLUR_THRESHOLD = 80;
export const DARK_THRESHOLD = 60;
export const BRIGHT_THRESHOLD = 220;

export type FrameGuidance =
  | 'too_blurry'
  | 'too_dark'
  | 'too_bright'
  | 'not_centered'
  | 'ready';

export interface FrameAnalysisResult {
  variance: number;
  luminance: number;
  guidance: FrameGuidance;
  isReady: boolean;
}

/**
 * Computes Laplacian variance on grayscale pixel data (3x3 kernel)
 */
export function computeLaplacianVariance(imageData: ImageData): number {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = 0.299 * (data[i] || 0) + 0.587 * (data[i + 1] || 0) + 0.114 * (data[i + 2] || 0);
  }

  let sum = 0;
  let sumSq = 0;
  let n = 0;

  // 3x3 Laplacian kernel: [0 1 0 / 1 -4 1 / 0 1 0]
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const lap =
        (gray[idx - width] ?? 0) +
        (gray[idx + width] ?? 0) +
        (gray[idx - 1] ?? 0) +
        (gray[idx + 1] ?? 0) -
        4 * (gray[idx] ?? 0);
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }

  if (n === 0) return 100;
  const mean = sum / n;
  return Math.max(0, sumSq / n - mean * mean);
}

/**
 * Computes average pixel luminance (0–255)
 */
export function computeAverageLuminance(imageData: ImageData): number {
  const { data } = imageData;
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    total += 0.299 * (data[i] || 0) + 0.587 * (data[i + 1] || 0) + 0.114 * (data[i + 2] || 0);
  }
  return total / (data.length / 4 || 1);
}

/**
 * Evaluates frame against blur & luminance thresholds
 */
export function evaluateFrame(
  variance: number,
  luminance: number,
  centered = true
): FrameGuidance {
  if (variance < BLUR_THRESHOLD) return 'too_blurry';
  if (luminance < DARK_THRESHOLD) return 'too_dark';
  if (luminance > BRIGHT_THRESHOLD) return 'too_bright';
  if (!centered) return 'not_centered';
  return 'ready';
}

export function analyzeFrame(imageData: ImageData, centered = true): FrameAnalysisResult {
  const variance = computeLaplacianVariance(imageData);
  const luminance = computeAverageLuminance(imageData);
  const guidance = evaluateFrame(variance, luminance, centered);
  return {
    variance,
    luminance,
    guidance,
    isReady: guidance === 'ready',
  };
}

export const GUIDANCE_MESSAGES: Record<FrameGuidance, { hi: string; en: string }> = {
  too_blurry: {
    hi: 'फोटो धुंधली है। हाथ स्थिर रखें।',
    en: 'Image is blurry. Hold hands steady.',
  },
  too_dark: {
    hi: 'बहुत अंधेरा है। रोशनी में जाएं।',
    en: 'Too dark. Move closer to light.',
  },
  too_bright: {
    hi: 'बहुत तेज़ रोशनी है। थोड़ा हटें।',
    en: 'Too bright. Move back a little.',
  },
  not_centered: {
    hi: 'वस्तु को बीच में रखें।',
    en: 'Place the product in the center.',
  },
  ready: {
    hi: 'बढ़िया! फोटो लेने के लिए टैप करें।',
    en: 'Good! Tap to capture.',
  },
};
