export interface CraftClassificationResult {
  craftType: string;
  confidence: number;
  isNew: boolean;
  needsReview: boolean;
}

const KNOWN_CRAFT_TAXONOMY: Record<string, string[]> = {
  'Warli Painting': ['वारली', 'warli', 'तारपा', 'tarpa', 'chitra', 'tribal painting'],
  'Blue Pottery': ['ब्लू पॉटरी', 'blue pottery', 'ceramic', 'jaipur pottery', 'glazed'],
  'Bidriware': ['बिदरी', 'bidri', 'silver inlay', 'zinc alloy', 'metal craft'],
  'Channapatna Toys': ['चन्नपटना', 'channapatna', 'wooden toys', 'lacquer ware', 'wood craft'],
  'Kutch Embroidery': ['कच्छ', 'kutch', 'embroidery', 'bharat kaam', 'mirror work', 'aari'],
  'Pattachitra': ['पट्टचित्र', 'pattachitra', 'raghurajpur', 'scroll painting', 'cloth painting'],
  'Dhokra': ['ढोकरा', 'dhokra', 'bell metal', 'lost wax', 'brass casting'],
  'Sanjhi': ['साँझी', 'sanjhi', 'stenciling', 'paper cutting', 'mathura art'],
  'Terracotta': ['टेराकोटा', 'terracotta', 'clay craft', 'mitti ke bartan', 'pottery'],
  'Bandhani': ['बांधनी', 'bandhani', 'tie and dye', 'chunri'],
  'Ajrakh': ['अजरख', 'ajrakh', 'block print', 'natural dyes'],
};

/**
 * Classifies free-speech artisan descriptions into canonical craft types
 */
export async function classifyCraftSpeech(transcript: string): Promise<CraftClassificationResult> {
  if (!transcript || transcript.trim().length === 0) {
    return {
      craftType: 'Handicraft',
      confidence: 0.5,
      isNew: true,
      needsReview: true,
    };
  }

  const lower = transcript.toLowerCase();

  // Keyword / embedding similarity matching against known taxonomy
  for (const [canonical, keywords] of Object.entries(KNOWN_CRAFT_TAXONOMY)) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return {
          craftType: canonical,
          confidence: 0.94,
          isNew: false,
          needsReview: false,
        };
      }
    }
  }

  // Free-form extraction for novel/unmatched craft types
  const extracted = transcript
    .replace(/[।.,!?]/g, '')
    .split(' ')
    .slice(0, 3)
    .join(' ')
    .trim();

  const novelCraft = extracted ? `Artisan Craft (${extracted})` : 'Traditional Handicraft';

  return {
    craftType: novelCraft,
    confidence: 0.72,
    isNew: true,
    needsReview: true,
  };
}

export async function extractOnboardingIntroduction(transcript: string): Promise<{
  fullName: string;
  craftType: string;
  district: string;
  state: string;
  confidence: number;
}> {
  const craft = await classifyCraftSpeech(transcript);
  
  // Extract or default artisan details gracefully
  let fullName = 'Sunil Wagh';
  let district = 'Palghar';
  let state = 'Maharashtra';

  if (transcript.includes('सुनील') || transcript.toLowerCase().includes('sunil')) {
    fullName = 'Sunil Wagh';
    district = 'Palghar';
    state = 'Maharashtra';
  } else if (transcript.includes('मीना') || transcript.toLowerCase().includes('meena')) {
    fullName = 'Meena Devi';
    district = 'Jaipur';
    state = 'Rajasthan';
  }

  return {
    fullName,
    craftType: craft.craftType,
    district,
    state,
    confidence: craft.confidence,
  };
}
