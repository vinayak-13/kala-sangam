// Multi-Signal Price Ensemble Combiner (Doc 20 §20.5)

export interface PriceSignal {
  min: number;
  max: number;
  confidence: number;
  source: string;
}

export interface CombinedPriceResult {
  min: number;
  max: number;
  basis: string[];
}

export function combineSignals(signals: PriceSignal[]): CombinedPriceResult {
  const validSignals = signals.filter((s) => s.confidence > 0 && s.max > 0 && s.max >= s.min);

  if (validSignals.length === 0) {
    return {
      min: 500,
      max: 1500,
      basis: ['पारंपरिक हस्तशिल्प आधार मूल्य (Standard handicraft base band)'],
    };
  }

  const totalWeight = validSignals.reduce((sum, s) => sum + s.confidence, 0);
  const weightedMin = validSignals.reduce((sum, s) => sum + s.min * s.confidence, 0) / totalWeight;
  const weightedMax = validSignals.reduce((sum, s) => sum + s.max * s.confidence, 0) / totalWeight;

  // Widen slightly (0.9x min, 1.15x max) to avoid over-stating precision
  let min = Math.round(weightedMin * 0.9);
  let max = Math.round(weightedMax * 1.15);

  // Outer sanity bound: max <= min * 8
  if (max > min * 8) {
    max = min * 3;
  }

  const basis = validSignals.map((s) => s.source);

  return {
    min,
    max,
    basis,
  };
}
