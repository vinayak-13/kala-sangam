import { productRepo } from '@/server/repos/product-repo';
import { profileRepo } from '@/server/repos/profile-repo';
import { aiStack } from '@/server/ai/providers';
import { AppError } from '@/lib/errors/api-response';

export interface StartVoiceUploadResult {
  captureId: string;
  productId: string;
}

export const voicePipelineService = {
  /**
   * Must return in < 400ms: validates, stores initial record, sets status to processing,
   * returns IDs, and triggers async pipeline without awaiting completion.
   */
  async startVoiceUpload(params: {
    productId: string;
    artisanId: string;
    audioBuffer: Buffer;
    mimeType: string;
    localeHint?: string;
  }): Promise<StartVoiceUploadResult> {
    const { productId, artisanId, audioBuffer, mimeType, localeHint } = params;

    // 1. Validate audio (<= 2MB)
    if (audioBuffer.length > 2 * 1024 * 1024) {
      throw new AppError('AUDIO_TOO_LARGE', 'Audio recording must be 2MB or less', 400);
    }

    // 2. Storage path reference
    const captureId = crypto.randomUUID();
    const audioPath = `/storage/product-voice/${captureId}.webm`;

    // 3. Insert voice_captures & set products.status = 'processing'
    await productRepo.createVoiceCapture({
      id: captureId,
      product_id: productId,
      artisan_id: artisanId,
      audio_path: audioPath,
      source_locale: localeHint || 'hi',
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

    await productRepo.update(productId, { status: 'processing' });

    // 4. Attach audio media to product
    await productRepo.addMedia({
      id: crypto.randomUUID(),
      product_id: productId,
      kind: 'voice',
      storage_path: audioPath,
      sort_order: 10,
      width: null,
      height: null,
      duration_ms: 30000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // 5. Fire pipeline asynchronously (await-less in development/serverless trigger)
    const runAsyncPipeline = async () => {
      const startTime = Date.now();
      try {
        await this.executePipelineStages({
          captureId,
          productId,
          artisanId,
          audioBuffer,
          mimeType,
          localeHint,
          startTime,
        });
      } catch (err) {
        console.error('Pipeline failed gracefully:', err);
      }
    };

    // Non-blocking invocation
    void runAsyncPipeline();

    // Return under 400ms
    return { captureId, productId };
  },

  /**
   * Resilient 5-stage pipeline executor with strict fallbacks
   */
  async executePipelineStages(params: {
    captureId: string;
    productId: string;
    artisanId: string;
    audioBuffer: Buffer;
    mimeType: string;
    localeHint?: string;
    startTime: number;
  }) {
    const { captureId, productId, artisanId, audioBuffer, mimeType, localeHint, startTime } = params;
    const artisan = await profileRepo.findArtisanById(artisanId);
    const craft = artisan?.craft_type || 'Handicraft';
    const district = artisan?.district || 'India';

    let rawTranscript = '';
    let sourceLocale = localeHint || 'hi';
    let asrConfidence = 0.9;
    let asrFailed = false;

    // Stage a: ASR
    try {
      const asr = await aiStack.asr.transcribe({
        audio: audioBuffer,
        mimeType,
        localeHint,
      });
      rawTranscript = asr.text;
      sourceLocale = asr.locale;
      asrConfidence = asr.confidence;
    } catch {
      asrFailed = true;
      // Fallback 1: ASR fails -> keep audio, set status='review' with banner note
      await productRepo.updateVoiceCapture(captureId, {
        error: "We couldn't hear that clearly — record again, or type a short title.",
        processing_ms: Date.now() - startTime,
      });
      await productRepo.update(productId, { status: 'review' });
      return;
    }

    // Stage b: Translation
    const translatedText: Record<string, string> = {};
    try {
      const transEn = await aiStack.translate.translate({
        text: rawTranscript,
        from: sourceLocale,
        to: 'en',
      });
      translatedText.en = transEn.text;
      if (sourceLocale !== 'hi') {
        const transHi = await aiStack.translate.translate({
          text: rawTranscript,
          from: sourceLocale,
          to: 'hi',
        });
        translatedText.hi = transHi.text;
      }
    } catch {
      translatedText.en = rawTranscript;
    }

    // Stage c & d: Structuring & Localization
    try {
      const draft = await aiStack.structuring.generate({
        transcript: rawTranscript,
        locale: sourceLocale,
        craftType: craft,
        district,
        photoCount: 1,
      });

      // Update voice captures audit trail
      await productRepo.updateVoiceCapture(captureId, {
        raw_transcript: rawTranscript,
        translated_text: translatedText,
        source_locale: sourceLocale,
        asr_provider: 'bhashini',
        asr_confidence: asrConfidence,
        llm_provider: 'gemini-flash',
        processing_ms: Date.now() - startTime,
      });

      // Stage e: Update product to review with AI draft and price band in paise
      await productRepo.update(productId, {
        status: 'review',
        title: draft.title,
        description: draft.description,
        materials: draft.materials,
        craft_technique: draft.craft_technique,
        dimensions: draft.dimensions,
        tags: draft.tags,
        price_paise: draft.price_min_inr * 100, // converted to integer paise
        ai_price_min_paise: draft.price_min_inr * 100,
        ai_price_max_paise: draft.price_max_inr * 100,
      });
    } catch {
      // Fallback 2: LLM structuring fails -> fallback to template built from raw transcript
      await productRepo.updateVoiceCapture(captureId, {
        raw_transcript: rawTranscript,
        translated_text: translatedText,
        processing_ms: Date.now() - startTime,
        error: 'LLM structuring fallback applied',
      });

      await productRepo.update(productId, {
        status: 'review',
        title: { en: `Handmade ${craft}`, [sourceLocale]: `हस्तनिर्मित ${craft}` },
        description: { en: rawTranscript, [sourceLocale]: rawTranscript },
        price_paise: 50000,
        ai_price_min_paise: 35000,
        ai_price_max_paise: 90000,
      });
    }
  },
};
