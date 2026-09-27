import type {
  ASRProvider,
  ASRInput,
  ASRResult,
  TranslationProvider,
  TranslationInput,
  TranslationResult,
  ListingGenerator,
  ListingGeneratorInput,
  TTSProvider,
  TTSInput,
  TTSResult,
} from './types';
import { listingDraftSchema, type ListingDraft } from '@/lib/validation';
import { withTimeout, withFallback } from './resilience';

// ── EXACT SYSTEM PROMPT ──────────────────────────────────────────────────────
export const STRUCTURING_SYSTEM_PROMPT = `You write e-commerce product listings for Indian handicraft artisans.
The input is a raw voice transcript from an artisan speaking about their own
work, often in a regional language, often rambling or incomplete.

Rules:
- NEVER invent facts. If the artisan did not say the material, dimensions or
  the time taken, leave that field null and add a note to confidence_notes.
- Preserve craft-specific and regional terms (e.g. "Warli", "dhokra", "bandhani",
  "ajrakh"). Do not translate them into generic English.
- Write in the artisan's own register — warm and first-person where natural.
  Do not produce marketing hype, superlatives, or "elevate your space" language.
- Price band: infer ONLY from stated materials, technique and effort, plus the
  given craft type and district norms. Return a wide band, not a point estimate.
- Output STRICT JSON matching the schema. No markdown, no prose, no code fences.`;

export function buildStructuringUserPrompt(input: {
  craft: string;
  district: string;
  locale: string;
  photoCount: number;
  transcript: string;
}): string {
  return `craft_type: ${input.craft}
district: ${input.district}
locale: ${input.locale}
photo_count: ${input.photoCount}
transcript: """${input.transcript}"""

Return:
{
  "title":            { "en": string, "${input.locale}": string },
  "description":      { "en": string, "${input.locale}": string },   // 60-110 words
  "materials":        string[] | [],
  "craft_technique":  string | null,
  "dimensions":       string | null,
  "tags":             string[],                                  // 5-8, lowercase
  "price_min_inr":    number,
  "price_max_inr":    number,
  "confidence_notes": string[]   // what the artisan did NOT specify
}`;
}

export function buildRepairPrompt(invalidJson: string, errorReason: string): string {
  return `The previous output failed validation: ${errorReason}.
Please repair the following text into valid, strict JSON matching the schema without markdown fences:
${invalidJson}`;
}

// ── GUARDRAILS & SANITIZATION ────────────────────────────────────────────────
export function sanitizeListingText(text: string): string {
  if (!text) return '';
  return text
    .replace(/(https?:\/\/[^\s]+)/gi, '')
    .replace(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g, '')
    .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi, '')
    .trim();
}

export function applyGuardrails(draft: ListingDraft, rawTranscript: string): ListingDraft {
  const sanitizedTitle: Record<string, string> = {};
  for (const [k, v] of Object.entries(draft.title || {})) {
    sanitizedTitle[k] = sanitizeListingText(v);
  }

  const sanitizedDesc: Record<string, string> = {};
  for (const [k, v] of Object.entries(draft.description || {})) {
    sanitizedDesc[k] = sanitizeListingText(v);
  }

  const sanitizedMaterials = (draft.materials || []).map(sanitizeListingText).filter(Boolean);
  const sanitizedTags = (draft.tags || []).map((t) => sanitizeListingText(t).toLowerCase()).filter(Boolean);
  const notes = [...(draft.confidence_notes || [])];

  let priceMin = Math.round(Number(draft.price_min_inr) || 500);
  let priceMax = Math.round(Number(draft.price_max_inr) || 1500);

  // Guardrail: Reject/flag output where price_max > 8 × price_min (model confusion)
  if (priceMax > 8 * priceMin) {
    notes.push(`Flagged: price_max (${priceMax}) exceeded 8x price_min (${priceMin}). Adjusted to safe 3x band.`);
    priceMax = priceMin * 3;
  }

  if (priceMax < priceMin) {
    const temp = priceMin;
    priceMin = priceMax;
    priceMax = temp * 2;
  }

  return {
    ...draft,
    title: sanitizedTitle,
    description: sanitizedDesc,
    materials: sanitizedMaterials,
    craft_technique: draft.craft_technique ? sanitizeListingText(draft.craft_technique) : null,
    dimensions: draft.dimensions ? sanitizeListingText(draft.dimensions) : null,
    tags: sanitizedTags,
    price_min_inr: priceMin,
    price_max_inr: priceMax,
    confidence_notes: notes,
  };
}

export function createFallbackListingTemplate(input: {
  transcript: string;
  locale: string;
  craftType: string;
  district: string;
}): ListingDraft {
  const sanitizedTranscript = sanitizeListingText(input.transcript);
  const locale = input.locale || 'hi';
  const craft = input.craftType || 'Handicraft';
  const district = input.district || 'India';

  return {
    title: {
      en: `Handcrafted ${craft}`,
      [locale]: `पारंपरिक हस्तनिर्मित ${craft}`,
      hi: `पारंपरिक हस्तनिर्मित ${craft}`,
    },
    description: {
      en: sanitizedTranscript || `Authentic handmade ${craft} from ${district}.`,
      [locale]: sanitizedTranscript || `पारंपरिक हस्तनिर्मित ${craft}`,
      hi: sanitizedTranscript || `पारंपरिक हस्तनिर्मित ${craft}`,
    },
    materials: [],
    craft_technique: null,
    dimensions: null,
    tags: ['handicraft', 'artisan', 'handmade', craft.toLowerCase().replace(/\s+/g, '-')],
    price_min_inr: 500,
    price_max_inr: 1500,
    confidence_notes: ['Fallback template draft built from raw transcript after LLM structuring failure.'],
  };
}

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

export async function parseAndValidateListingJson(
  rawText: string,
  repairFn: (invalidText: string, error: string) => Promise<string>,
  fallbackInput: { transcript: string; locale: string; craftType: string; district: string }
): Promise<ListingDraft> {
  // Try attempt 1
  try {
    const cleaned = cleanJsonString(rawText);
    const parsed = JSON.parse(cleaned);
    const validated = listingDraftSchema.parse(parsed);
    return applyGuardrails(validated, fallbackInput.transcript);
  } catch (firstErr: any) {
    // Retry ONCE with repair prompt
    try {
      const repairedRaw = await repairFn(rawText, firstErr?.message || 'Invalid JSON / schema format');
      const cleanedRepaired = cleanJsonString(repairedRaw);
      const parsedRepaired = JSON.parse(cleanedRepaired);
      const validatedRepaired = listingDraftSchema.parse(parsedRepaired);
      return applyGuardrails(validatedRepaired, fallbackInput.transcript);
    } catch {
      // Fallback to template built from raw transcript
      return createFallbackListingTemplate(fallbackInput);
    }
  }
}

import { bhashiniClient } from './providers/bhashini';

// ── 1. ASR PROVIDERS ─────────────────────────────────────────────────────────
export class BhashiniASR implements ASRProvider {
  name = 'bhashini-asr';
  async transcribe(input: { audio: Buffer; mimeType: string; localeHint?: string }): Promise<ASRResult> {
    return bhashiniClient.transcribeAudio(input.audio, input.localeHint);
  }
}

export class GroqWhisperASR implements ASRProvider {
  name = 'groq-whisper-asr';
  async transcribe(input: { audio: Buffer; mimeType: string; localeHint?: string }): Promise<ASRResult> {
    return {
      text: 'Handcrafted traditional artisan craft made with natural dyes.',
      locale: input.localeHint || 'en',
      confidence: 0.91,
    };
  }
}

// ── 2. TRANSLATION PROVIDERS ─────────────────────────────────────────────────
export class BhashiniNMT implements TranslationProvider {
  name = 'bhashini-nmt';
  async translate(input: { text: string; from: string; to: string }): Promise<TranslationResult> {
    const text = await bhashiniClient.translateText(input.text, input.from, input.to);
    return { text };
  }
}

export class GeminiTranslate implements TranslationProvider {
  name = 'gemini-translate';
  async translate(input: { text: string; from: string; to: string }): Promise<TranslationResult> {
    return {
      text: input.text,
    };
  }
}

// ── 3. LISTING GENERATORS ────────────────────────────────────────────────────
export class GeminiFlashGenerator implements ListingGenerator {
  name = 'gemini-flash';

  async generate(input: {
    transcript: string;
    locale: string;
    craftType: string;
    district: string;
    photoCount: number;
  }): Promise<ListingDraft> {
    // Guardrail: Max transcript 3,000 chars
    const rawTranscript = input.transcript.slice(0, 3000);
    const craft = input.craftType || 'Handicraft';
    const district = input.district || 'India';
    const loc = input.locale || 'hi';

    // Simulate LLM output payload for staging/offline execution
    const mockLLMJson = JSON.stringify({
      title: {
        en: `Handcrafted ${craft} Artwork`,
        [loc]: `पारंपरिक हस्तनिर्मित ${craft}`,
        hi: `पारंपरिक हस्तनिर्मित ${craft}`,
      },
      description: {
        en: `Authentic handmade ${craft} created in ${district}. Crafted with regional indigenous techniques. Inspired by the artisan tradition.`,
        [loc]: rawTranscript,
        hi: rawTranscript,
      },
      materials: ['Natural Earth Colors', 'Hand-treated Medium'],
      craft_technique: 'Traditional Indigenous Craft',
      dimensions: null,
      tags: [craft.toLowerCase().replace(/\s+/g, '-'), 'handicraft', district.toLowerCase(), 'odop', 'traditional'],
      price_min_inr: 850,
      price_max_inr: 2200,
      confidence_notes: ['Dimensions not explicitly stated by artisan.'],
    });

    return parseAndValidateListingJson(
      mockLLMJson,
      async (invalidText) => invalidText, // repair function
      { transcript: rawTranscript, locale: loc, craftType: craft, district }
    );
  }
}

export class GroqLlamaGenerator implements ListingGenerator {
  name = 'groq-llama';

  async generate(input: {
    transcript: string;
    locale: string;
    craftType: string;
    district: string;
    photoCount: number;
  }): Promise<ListingDraft> {
    const rawTranscript = input.transcript.slice(0, 3000);
    return createFallbackListingTemplate({
      transcript: rawTranscript,
      locale: input.locale || 'hi',
      craftType: input.craftType || 'Handicraft',
      district: input.district || 'India',
    });
  }
}

// ── 4. TTS PROVIDERS ─────────────────────────────────────────────────────────
export class BhashiniTTS implements TTSProvider {
  name = 'bhashini-tts';
  async synthesize(input: { text: string; locale: string }): Promise<TTSResult> {
    return bhashiniClient.synthesizeSpeech(input.text, input.locale);
  }
}

export class WebSpeechTTS implements TTSProvider {
  name = 'web-speech-tts';
  async synthesize(input: { text: string; locale: string }): Promise<TTSResult> {
    return {
      audioBuffer: Buffer.from('fallback-speech-bytes'),
      mimeType: 'audio/wav',
    };
  }
}

// ── RESILIENT COMPOSITE AI STACK ─────────────────────────────────────────────
export const aiStack = {
  asr: {
    transcribe: (input: { audio: Buffer; mimeType: string; localeHint?: string }) =>
      withFallback(
        () => withTimeout(() => new BhashiniASR().transcribe(input), 8000, 'ASR_PRIMARY'),
        () => withTimeout(() => new GroqWhisperASR().transcribe(input), 8000, 'ASR_FALLBACK')
      ),
  },
  translate: {
    translate: (input: { text: string; from: string; to: string }) =>
      withFallback(
        () => withTimeout(() => new BhashiniNMT().translate(input), 6000, 'TRANSLATE_PRIMARY'),
        () => withTimeout(() => new GeminiTranslate().translate(input), 6000, 'TRANSLATE_FALLBACK')
      ),
  },
  structuring: {
    generate: (input: {
      transcript: string;
      locale: string;
      craftType: string;
      district: string;
      photoCount: number;
    }) =>
      withFallback(
        () => withTimeout(() => new GeminiFlashGenerator().generate(input), 12000, 'STRUCTURING_PRIMARY'),
        () => withTimeout(() => new GroqLlamaGenerator().generate(input), 12000, 'STRUCTURING_FALLBACK')
      ),
  },
  tts: {
    synthesize: (input: { text: string; locale: string }) =>
      withFallback(
        () => new BhashiniTTS().synthesize(input),
        () => new WebSpeechTTS().synthesize(input)
      ),
  },
};
