import crypto from 'crypto';

export interface TranslationCacheRow {
  text_hash: string;
  source_locale: string;
  target_locale: string;
  translated: string;
  created_at: string;
}

// In-memory cache fallback for fast local execution + test isolation
const memoryTranslationCache = new Map<string, string>();

export function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export const translationCacheRepo = {
  async get(textHash: string, sourceLocale: string, targetLocale: string): Promise<string | null> {
    const key = `${textHash}:${sourceLocale}:${targetLocale}`;
    return memoryTranslationCache.get(key) || null;
  },

  async set(textHash: string, sourceLocale: string, targetLocale: string, translated: string): Promise<void> {
    const key = `${textHash}:${sourceLocale}:${targetLocale}`;
    memoryTranslationCache.set(key, translated);
  },

  async clear(): Promise<void> {
    memoryTranslationCache.clear();
  },
};

export async function translateCached(
  text: string,
  from: string,
  to: string,
  translateFn: (params: { text: string; from: string; to: string }) => Promise<{ text: string }>
): Promise<{ text: string; cached: boolean }> {
  if (!text || from === to) {
    return { text, cached: true };
  }

  const hash = sha256(text);
  const cached = await translationCacheRepo.get(hash, from, to);
  if (cached) {
    return { text: cached, cached: true };
  }

  const result = await translateFn({ text, from, to });
  await translationCacheRepo.set(hash, from, to, result.text);
  return { text: result.text, cached: false };
}
