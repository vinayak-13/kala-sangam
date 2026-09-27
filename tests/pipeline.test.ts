import { describe, it, expect, vi } from 'vitest';
import { voicePipelineService } from '@/server/services/voice-pipeline-service';
import { productRepo } from '@/server/repos/product-repo';
import { aiStack } from '@/server/ai/providers';

describe('Voice Pipeline Resilience & Failure Paths', () => {
  it('Failure Path 1: ASR times out/fails -> audio preserved, status is review with error banner', async () => {
    const draft = await productRepo.createDraft('c1111111-0000-0000-0000-000000000001');
    const captureId = crypto.randomUUID();

    await productRepo.createVoiceCapture({
      id: captureId,
      product_id: draft.id,
      artisan_id: 'c1111111-0000-0000-0000-000000000001',
      audio_path: `/storage/product-voice/${captureId}.webm`,
      source_locale: 'hi',
      raw_transcript: null,
      translated_text: {},
      asr_provider: null,
      asr_confidence: null,
      llm_provider: null,
      processing_ms: null,
      artisan_edited: false,
      error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Mock ASR failure
    vi.spyOn(aiStack.asr, 'transcribe').mockRejectedValueOnce(new Error('ASR Timeout'));

    await voicePipelineService.executePipelineStages({
      captureId,
      productId: draft.id,
      artisanId: 'c1111111-0000-0000-0000-000000000001',
      audioBuffer: Buffer.from('mock-audio-data'),
      mimeType: 'audio/webm',
      startTime: Date.now(),
    });

    const product = await productRepo.findById(draft.id);
    const capture = await productRepo.findVoiceCaptureByProductId(draft.id);

    // Assert product is NOT lost and status transitioned to review
    expect(product).toBeDefined();
    expect(product?.status).toBe('review');
    expect(capture?.error).toBeDefined();
    expect(capture?.error).toContain("We couldn't hear that clearly");
  });

  it('Failure Path 2: LLM structuring fails -> fallback to template built from raw transcript', async () => {
    const draft = await productRepo.createDraft('c1111111-0000-0000-0000-000000000001');
    const captureId = crypto.randomUUID();

    await productRepo.createVoiceCapture({
      id: captureId,
      product_id: draft.id,
      artisan_id: 'c1111111-0000-0000-0000-000000000001',
      audio_path: `/storage/product-voice/${captureId}.webm`,
      source_locale: 'mr',
      raw_transcript: null,
      translated_text: {},
      asr_provider: null,
      asr_confidence: null,
      llm_provider: null,
      processing_ms: null,
      artisan_edited: false,
      error: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // ASR succeeds
    vi.spyOn(aiStack.asr, 'transcribe').mockResolvedValueOnce({
      text: 'हाताने बनवलेली वारली थाळी',
      locale: 'mr',
      confidence: 0.95,
    });

    // LLM structuring fails
    vi.spyOn(aiStack.structuring, 'generate').mockRejectedValueOnce(new Error('LLM rate limit / timeout'));

    await voicePipelineService.executePipelineStages({
      captureId,
      productId: draft.id,
      artisanId: 'c1111111-0000-0000-0000-000000000001',
      audioBuffer: Buffer.from('mock-audio-data'),
      mimeType: 'audio/webm',
      startTime: Date.now(),
    });

    const product = await productRepo.findById(draft.id);

    // Assert listing was populated with transcript fallback
    expect(product?.status).toBe('review');
    expect(product?.price_paise).toBe(50000); // fallback price
    expect(product?.description.mr).toBe('हाताने बनवलेली वारली थाळी');
  });

  it('Failure Path 3: Total pipeline crash -> listing still exists and is never deleted', async () => {
    const draft = await productRepo.createDraft('c1111111-0000-0000-0000-000000000001');
    const captureId = crypto.randomUUID();

    // Total AI failure
    vi.spyOn(aiStack.asr, 'transcribe').mockRejectedValueOnce(new Error('Total Network Down'));
    vi.spyOn(aiStack.structuring, 'generate').mockRejectedValueOnce(new Error('Total LLM Down'));

    await voicePipelineService.executePipelineStages({
      captureId,
      productId: draft.id,
      artisanId: 'c1111111-0000-0000-0000-000000000001',
      audioBuffer: Buffer.from('mock-audio-data'),
      mimeType: 'audio/webm',
      startTime: Date.now(),
    });

    const product = await productRepo.findById(draft.id);
    expect(product).not.toBeNull();
    expect(product?.id).toBe(draft.id);
  });
});
