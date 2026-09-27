// Statistical Comparable Price Estimator (Doc 20 §20.2)

export interface ComparableEstimateResult {
  min: number;
  max: number;
  n: number;
  confidence: number;
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const index = Math.floor((arr.length - 1) * p);
  return arr[index] || 0;
}

/**
 * Computes percentile-based price band from comparable published listings
 */
export function comparableEstimate(prices: number[]): ComparableEstimateResult {
  if (!prices || prices.length < 3) {
    return {
      min: 0,
      max: 0,
      n: prices ? prices.length : 0,
      confidence: 0,
    };
  }

  const sorted = [...prices].sort((a, b) => a - b);
  const p25 = percentile(sorted, 0.25);
  const p75 = percentile(sorted, 0.75);

  // Confidence grows with sample size (3 is weak, 20+ saturates to 1.0)
  const confidence = Math.min(1, Math.log10(prices.length + 1) / Math.log10(21));

  return {
    min: Math.round(p25),
    max: Math.round(p75),
    n: prices.length,
    confidence,
  };
}

export async function getComparablePrices(
  craftType: string,
  district?: string,
  state?: string
): Promise<number[]> {
  // Pre-seeded prices across crafts in INR
  const SEED_PRICES: Record<string, number[]> = {
    'Warli Painting': [650, 850, 1200, 1800, 2400, 3500],
    'Blue Pottery': [450, 650, 950, 1400, 2200],
    'Bidriware': [1200, 1800, 2500, 4200, 6800],
    'Channapatna Toys': [350, 550, 850, 1200],
    'Dhokra': [950, 1500, 2800, 4500, 8500],
    'Pattachitra': [1500, 2800, 4500, 9000],
    'Terracotta': [350, 550, 850, 1400],
  };

  return SEED_PRICES[craftType] || [500, 850, 1400, 2200];
}
