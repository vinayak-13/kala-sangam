import type { TranslationProvider, TranslationInput, TranslationResult } from '../types';

// In-memory lookup for craft terms across languages (loaded from glossary TSVs)
const craftGlossaryMap: Record<string, Record<string, string>> = {
  hi: {
    warli: 'वारली',
    dhokra: 'ढोकरा',
    bidri: 'बिदरी',
    channapatna: 'चन्नपटना',
    bandhani: 'बांधनी',
    ajrakh: 'अजरख',
    pattachitra: 'पट्टचित्र',
    madhubani: 'मधुबनी',
    kalamkari: 'कलमकारी',
    sanjhi: 'साँझी',
    phulkari: 'फुलकारी',
    kutch: 'कच्छ',
    odop: 'ओडीओपी',
    terracotta: 'टेराकोटा',
    'blue pottery': 'ब्लू पॉटरी',
  },
  mr: {
    warli: 'वारली',
    dhokra: 'ढोकरा',
    bidri: 'बिदरी',
    channapatna: 'चन्नपटना',
    bandhani: 'बांधणी',
    ajrakh: 'अजरख',
    pattachitra: 'पट्टचित्र',
    madhubani: 'मधुबनी',
    kalamkari: 'कलमकारी',
    sanjhi: 'सांझी',
    phulkari: 'फुलकारी',
    kutch: 'कच्छ',
    odop: 'ओडीओपी',
    terracotta: 'टेराकोटा',
    'blue pottery': 'ब्लू पॉटरी',
  },
};

export function applyGlossaryPreservation(text: string, toLocale: string): string {
  const glossary = craftGlossaryMap[toLocale];
  if (!glossary) return text;

  let preserved = text;
  for (const [term, translatedTerm] of Object.entries(glossary)) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    preserved = preserved.replace(regex, translatedTerm);
  }
  return preserved;
}

export const googleTranslateProvider: TranslationProvider = {
  name: 'google-translate',

  async translate(input: TranslationInput): Promise<TranslationResult> {
    const { text, from, to } = input;
    if (!text || from === to) {
      return { text };
    }

    // In production with live GCP service account credentials:
    // const client = new TranslationServiceClient({ credentials: ... });
    // const [response] = await client.translateText({ ... });

    // Staging & test execution with craft-glossary preservation:
    let translated = text;
    if (from === 'en' && (to === 'hi' || to === 'mr')) {
      translated = applyGlossaryPreservation(text, to);
    } else if (to === 'en') {
      // Preserve craft proper nouns directly in English
      translated = text;
    }

    return {
      text: translated,
    };
  },
};

export async function detectLanguage(text: string): Promise<{ locale: string; confidence: number }> {
  if (!text) return { locale: 'en', confidence: 1.0 };
  // Check for Devanagari script (Hindi / Marathi)
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) {
    // Check for Marathi-specific words
    const isMarathi = /\b(आहे|नाही|झाले|केले|होते|माझे|हाताने|चित्रकला)\b/i.test(text);
    return { locale: isMarathi ? 'mr' : 'hi', confidence: 0.95 };
  }
  return { locale: 'en', confidence: 0.92 };
}
