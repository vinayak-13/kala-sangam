import { describe, it, expect } from 'vitest';
import { applyGlossaryPreservation, detectLanguage } from '@/server/ai/providers/google-translate';
import { translateCached, translationCacheRepo } from '@/server/repos/translation-cache-repo';
import { classifyCraftSpeech } from '@/server/services/craft-classifier';
import { computeLaplacianVariance, computeAverageLuminance, evaluateFrame } from '@/lib/capture/frame-analysis';
import { hasSustainedSpeech } from '@/lib/capture/audio-extraction';
import { reconcileDescriptions } from '@/server/ai/reconciliation';
import { comparableEstimate } from '@/server/pricing/comparables';
import { heuristicEstimate, HOURLY_RATE_FLOOR_INR } from '@/server/pricing/heuristic';
import { combineSignals } from '@/server/pricing/combine';
import { productToBecknItem, mapCraftTypeToOndcCategory } from '@/server/beckn/catalog-mapper';

describe('Doc 15: Google Translate & Glossary Preservation', () => {
  it('preserves craft terms when translating English to Hindi and Marathi', () => {
    const enText = 'Authentic Warli Painting and Dhokra bell metal craft from India.';
    const hiText = applyGlossaryPreservation(enText, 'hi');
    const mrText = applyGlossaryPreservation(enText, 'mr');

    expect(hiText).toContain('वारली');
    expect(hiText).toContain('ढोकरा');
    expect(mrText).toContain('वारली');
    expect(mrText).toContain('ढोकरा');
  });

  it('translation cache returns cached result on repeated calls without invoking translateFn', async () => {
    await translationCacheRepo.clear();
    let apiCalls = 0;
    const fakeTranslate = async ({ text }: { text: string }) => {
      apiCalls++;
      return { text: `[HI] ${text}` };
    };

    const first = await translateCached('Handmade pot', 'en', 'hi', fakeTranslate);
    expect(first.cached).toBe(false);
    expect(apiCalls).toBe(1);

    const second = await translateCached('Handmade pot', 'en', 'hi', fakeTranslate);
    expect(second.cached).toBe(true);
    expect(apiCalls).toBe(1); // not called again
  });
});

describe('Doc 16: Instagram-Style Craft Classifier', () => {
  it('matches spoken descriptions to known craft taxonomy', async () => {
    const warliResult = await classifyCraftSpeech('मी वारली पेंटिंग बनवतो');
    expect(warliResult.craftType).toBe('Warli Painting');
    expect(warliResult.needsReview).toBe(false);

    const dhokraResult = await classifyCraftSpeech('हम बस्तर का ढोकरा शिल्प बनाते हैं');
    expect(dhokraResult.craftType).toBe('Dhokra');
    expect(dhokraResult.needsReview).toBe(false);
  });

  it('accepts novel craft types gracefully without blocking signup', async () => {
    const novelResult = await classifyCraftSpeech('मैं जूट की टोकरी बुनता हूँ');
    expect(novelResult.isNew).toBe(true);
    expect(novelResult.needsReview).toBe(true);
  });
});

describe('Doc 17: AI-Guided Photo Frame Analysis', () => {
  it('evaluates blur and luminance thresholds correctly', () => {
    expect(evaluateFrame(50, 100, true)).toBe('too_blurry');
    expect(evaluateFrame(120, 30, true)).toBe('too_dark');
    expect(evaluateFrame(120, 240, true)).toBe('too_bright');
    expect(evaluateFrame(120, 120, false)).toBe('not_centered');
    expect(evaluateFrame(120, 120, true)).toBe('ready');
  });
});

describe('Doc 19: Dual-Voice Description Reconciliation', () => {
  it('flags conflict when transcripts disagree on core materials', async () => {
    const t1 = 'यह लाल मिट्टी की बनी थाली है';
    const t2 = 'यह शीशम की लकड़ी की थाली है';
    const result = await reconcileDescriptions(t1, t2);

    expect(result.agreement).toBe('conflict');
    expect(result.discrepancyNotes.length).toBeGreaterThan(0);
  });

  it('passes as consistent when transcripts corroborate each other', async () => {
    const t1 = 'वारली पेंटिंग तारपा नृत्य';
    const t2 = 'वारली पेंटिंग';
    const result = await reconcileDescriptions(t1, t2);

    expect(result.agreement).toBe('consistent');
  });
});

describe('Doc 20: Price Recommendation Engine', () => {
  it('computes comparable percentiles with scaling confidence', () => {
    const prices = [500, 700, 850, 1200, 1500, 2200];
    const estimate = comparableEstimate(prices);

    expect(estimate.min).toBeGreaterThanOrEqual(500);
    expect(estimate.max).toBeLessThanOrEqual(2200);
    expect(estimate.confidence).toBeGreaterThan(0.5);
  });

  it('applies fair living-wage floor in heuristic calculation', () => {
    const result = heuristicEstimate({
      materialCostEstimate: 200,
      hoursToMake: 8,
      skillTier: 2,
      yearsOfPractice: 10,
    });

    expect(HOURLY_RATE_FLOOR_INR).toBeCloseTo(62.5, 1);
    expect(result.min).toBeGreaterThan(600);
    expect(result.max).toBeGreaterThan(result.min);
  });

  it('combines multiple signals into a balanced price band with human-readable basis', () => {
    const signals = [
      { min: 800, max: 1800, confidence: 0.8, source: '6 comparable products in Palghar' },
      { min: 900, max: 1600, confidence: 0.6, source: 'Estimated from materials and time' },
    ];

    const combined = combineSignals(signals);
    expect(combined.min).toBeGreaterThanOrEqual(600);
    expect(combined.max).toBeLessThanOrEqual(2500);
    expect(combined.basis).toHaveLength(2);
  });
});

describe('Doc 21: Beckn / ONDC Catalog Mapper', () => {
  it('maps craft types to explicit ONDC retail categories', () => {
    expect(mapCraftTypeToOndcCategory('Warli Painting')).toBe('ONDC:RET10-PAINTING');
    expect(mapCraftTypeToOndcCategory('Dhokra')).toBe('ONDC:RET10-BELLMETAL');
  });

  it('formats products into valid Beckn item schema', () => {
    const item = productToBecknItem({
      id: 'prod-001',
      title: { en: 'Handmade Warli Plate' },
      description: { en: 'Authentic Warli plate painted with natural rice paste.' },
      price_paise: 120000,
      craft_type: 'Warli Painting',
      stock_quantity: 15,
      media: [{ storage_path: 'https://example.com/photo.jpg', kind: 'photo' }],
      district: 'Palghar',
    });

    expect(item.id).toBe('prod-001');
    expect(item.price.value).toBe('1200.00');
    expect(item.price.currency).toBe('INR');
    expect(item.category_id).toBe('ONDC:RET10-PAINTING');
  });
});
