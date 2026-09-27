import { describe, it, expect, vi } from 'vitest';
import {
  withTimeout,
  withFallback,
  StageTimeoutError,
} from '@/server/ai/resilience';
import {
  sanitizeListingText,
  applyGuardrails,
  createFallbackListingTemplate,
  parseAndValidateListingJson,
  BhashiniASR,
  GroqWhisperASR,
  GeminiFlashGenerator,
  GroqLlamaGenerator,
  aiStack,
} from '@/server/ai/providers';
import type { ListingDraft } from '@/lib/validation';

describe('AI Resilience Helpers', () => {
  it('withTimeout resolves successfully within threshold', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withTimeout(fn, 100, 'TEST_STAGE');
    expect(result).toBe('success');
  });

  it('withTimeout throws StageTimeoutError when execution exceeds threshold', async () => {
    const slowFn = () => new Promise((resolve) => setTimeout(() => resolve('slow'), 200));
    await expect(withTimeout(slowFn, 50, 'ASR_PRIMARY')).rejects.toThrowError(
      StageTimeoutError
    );
  });

  it('withFallback invokes secondary provider when primary fails', async () => {
    const primary = vi.fn().mockRejectedValue(new Error('Primary Down'));
    const secondary = vi.fn().mockResolvedValue({ text: 'fallback-text' });

    const result = await withFallback(primary, secondary);
    expect(primary).toHaveBeenCalledTimes(1);
    expect(secondary).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ text: 'fallback-text' });
  });

  it('withFallback returns primary result directly when primary succeeds', async () => {
    const primary = vi.fn().mockResolvedValue({ text: 'primary-text' });
    const secondary = vi.fn();

    const result = await withFallback(primary, secondary);
    expect(primary).toHaveBeenCalledTimes(1);
    expect(secondary).not.toHaveBeenCalled();
    expect(result).toEqual({ text: 'primary-text' });
  });
});

describe('AI Guardrails & Sanitization', () => {
  it('strips URLs, phone numbers, and emails from text', () => {
    const messyText =
      'Call me at +91 9876543210 or email artisan@crafts.in! Visit https://example.com/shop for more handmade Dhokra art.';
    const cleaned = sanitizeListingText(messyText);

    expect(cleaned).not.toContain('+91 9876543210');
    expect(cleaned).not.toContain('artisan@crafts.in');
    expect(cleaned).not.toContain('https://example.com/shop');
    expect(cleaned).toContain('Call me at');
    expect(cleaned).toContain('handmade Dhokra art');
  });

  it('price-band sanity check: rejects/clamps price_max > 8 × price_min', () => {
    const draftWithModelConfusion: ListingDraft = {
      title: { en: 'Warli Painting', hi: 'वारली पेंटिंग' },
      description: { en: 'Authentic Warli art made with rice paste.', hi: 'वारली पेंटिंग' },
      materials: ['Rice paste', 'Cow dung background'],
      craft_technique: 'Traditional tribal painting',
      dimensions: '12x12 inches',
      tags: ['warli', 'art', 'traditional'],
      price_min_inr: 500,
      price_max_inr: 50000, // 100x minimum -> model confusion!
      confidence_notes: [],
    };

    const guarded = applyGuardrails(draftWithModelConfusion, 'raw transcript');

    expect(guarded.price_min_inr).toBe(500);
    // price_max should be clamped to 3x price_min
    expect(guarded.price_max_inr).toBe(1500);
    expect(guarded.confidence_notes.some((n) => n.includes('exceeded 8x'))).toBe(true);
  });
});

describe('LLM JSON Parsing, Repair Retry & Fallback Template', () => {
  it('parses valid strict JSON on first attempt', async () => {
    const validJson = JSON.stringify({
      title: { en: 'Bidriware Vase', hi: 'बिदरी फूलदान' },
      description: { en: 'Pure zinc and copper alloy with silver inlay work from Bidar.', hi: 'बिदरी शिल्प' },
      materials: ['Zinc', 'Copper', 'Silver Inlay'],
      craft_technique: 'Damascening',
      dimensions: '8 inches height',
      tags: ['bidriware', 'metalcraft', 'karnataka', 'handicraft', 'odop'],
      price_min_inr: 1200,
      price_max_inr: 3000,
      confidence_notes: [],
    });

    const repairFn = vi.fn();
    const result = await parseAndValidateListingJson(validJson, repairFn, {
      transcript: 'Bidriware vase with silver inlay',
      locale: 'en',
      craftType: 'Bidriware',
      district: 'Bidar',
    });

    expect(repairFn).not.toHaveBeenCalled();
    expect(result.title.en).toBe('Bidriware Vase');
    expect(result.price_min_inr).toBe(1200);
  });

  it('retries with repair prompt ONCE when first attempt is malformed JSON, and succeeds', async () => {
    const malformedJson = '{ title: "Unquoted Bidriware", description: "Missing braces" ';
    const repairedJson = JSON.stringify({
      title: { en: 'Repaired Bidriware', hi: 'बिदरी' },
      description: { en: 'Handcrafted Bidriware with pure silver.', hi: 'बिदरी' },
      materials: ['Zinc alloy'],
      craft_technique: 'Bidri',
      dimensions: null,
      tags: ['bidri', 'metal'],
      price_min_inr: 900,
      price_max_inr: 1800,
      confidence_notes: [],
    });

    const repairFn = vi.fn().mockResolvedValue(repairedJson);

    const result = await parseAndValidateListingJson(malformedJson, repairFn, {
      transcript: 'raw artisan voice text',
      locale: 'en',
      craftType: 'Bidriware',
      district: 'Bidar',
    });

    expect(repairFn).toHaveBeenCalledTimes(1);
    expect(result.title.en).toBe('Repaired Bidriware');
    expect(result.price_min_inr).toBe(900);
  });

  it('falls back to raw transcript template when repair prompt also fails', async () => {
    const malformedJson = 'TOTAL_GARBAGE_OUTPUT_FROM_MODEL';
    const failingRepairFn = vi.fn().mockRejectedValue(new Error('LLM Repair Failure'));

    const result = await parseAndValidateListingJson(malformedJson, failingRepairFn, {
      transcript: 'हाताने बनवलेली बांबूची टोपली',
      locale: 'mr',
      craftType: 'Bamboo Craft',
      district: 'Gadchiroli',
    });

    expect(failingRepairFn).toHaveBeenCalledTimes(1);
    expect(result.title.en).toBe('Handcrafted Bamboo Craft');
    expect(result.description.mr).toBe('हाताने बनवलेली बांबूची टोपली');
    expect(result.confidence_notes[0]).toContain('Fallback template draft built from raw transcript');
  });
});

describe('ASR Provider Fallback & Timeout Simulation', () => {
  it('ASR primary times out -> switches to secondary GroqWhisperASR', async () => {
    // Mock Bhashini ASR timing out
    vi.spyOn(BhashiniASR.prototype, 'transcribe').mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { text: 'late', locale: 'hi', confidence: 0.5 };
    });

    vi.spyOn(GroqWhisperASR.prototype, 'transcribe').mockResolvedValue({
      text: 'Handcrafted terracotta pot from Gorakhpur',
      locale: 'hi',
      confidence: 0.92,
    });

    const input = {
      audio: Buffer.from('audio-bytes'),
      mimeType: 'audio/webm',
      localeHint: 'hi',
    };

    // Execute through composite ASR with 50ms primary timeout
    const result = await withFallback(
      () => withTimeout(() => new BhashiniASR().transcribe(input), 50, 'ASR_PRIMARY'),
      () => new GroqWhisperASR().transcribe(input)
    );

    expect(result.text).toBe('Handcrafted terracotta pot from Gorakhpur');
    expect(result.confidence).toBe(0.92);
  });
});
