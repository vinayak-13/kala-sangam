// Cost & Effort Heuristic Price Estimator (Doc 20 §20.3)

export interface CostInputs {
  materialCostEstimate: number | null; // INR
  hoursToMake: number | null;
  skillTier: 1 | 2 | 3; // 1=basic, 2=intermediate, 3=master
  yearsOfPractice: number | null;
}

export interface HeuristicEstimateResult {
  min: number;
  max: number;
  confidence: number;
}

// Deliberate policy choice: fair living-wage floor (~₹500 / 8hr day in INR = ₹62.5/hr)
export const HOURLY_RATE_FLOOR_INR = 500 / 8;
export const SKILL_MULTIPLIER: Record<1 | 2 | 3, number> = {
  1: 1.0,
  2: 1.4,
  3: 2.0,
};

/**
 * Calculates fair price floor based on materials, labour effort, and artisan skill tier
 */
export function heuristicEstimate(inputs: CostInputs): HeuristicEstimateResult {
  const materials = inputs.materialCostEstimate ?? 150; // default modest material baseline
  const hours = inputs.hoursToMake ?? 6; // default 6h if unstated
  const skillMult = SKILL_MULTIPLIER[inputs.skillTier] || 1.0;
  const experienceBonus = inputs.yearsOfPractice
    ? Math.min(0.3, inputs.yearsOfPractice * 0.015)
    : 0.1;

  const labour = hours * HOURLY_RATE_FLOOR_INR * skillMult * (1 + experienceBonus);
  const base = materials + labour;

  // Band: base cost recovery to base + 40% margin
  return {
    min: Math.round(base),
    max: Math.round(base * 1.4),
    confidence: inputs.materialCostEstimate && inputs.hoursToMake ? 0.65 : 0.35,
  };
}
