import type { ListingDraft } from '@/lib/validation';

export interface ASRInput {
  audio: Buffer;
  mimeType: string;
  localeHint?: string;
}

export interface ASRResult {
  text: string;
  locale: string;
  confidence: number;
}

export interface ASRProvider {
  name: string;
  transcribe(input: {
    audio: Buffer;
    mimeType: string;
    localeHint?: string;
  }): Promise<{ text: string; locale: string; confidence: number }>;
}

export interface TranslationInput {
  text: string;
  from: string;
  to: string;
}

export interface TranslationResult {
  text: string;
}

export interface TranslationProvider {
  name: string;
  translate(input: { text: string; from: string; to: string }): Promise<{ text: string }>;
}

export interface ListingGeneratorInput {
  transcript: string;
  locale: string;
  craftType: string;
  district: string;
  photoCount: number;
}

export interface ListingGenerator {
  name: string;
  generate(input: {
    transcript: string;
    locale: string;
    craftType: string;
    district: string;
    photoCount: number;
  }): Promise<ListingDraft>;
}

export interface TTSInput {
  text: string;
  locale: string;
}

export interface TTSResult {
  audioBuffer: Buffer;
  mimeType: string;
}

export interface TTSProvider {
  name: string;
  synthesize(input: { text: string; locale: string }): Promise<{ audioBuffer: Buffer; mimeType: string }>;
}
