import { aiStack } from '@/server/ai/providers';

export const ttsService = {
  async speakText(text: string, locale = 'hi'): Promise<{ audioUrl: string; locale: string }> {
    await aiStack.tts.synthesize({ text, locale });
    return {
      audioUrl: `/audio/synthesized/tts_${locale}_${Buffer.from(text.slice(0, 10)).toString('hex')}.mp3`,
      locale,
    };
  },
};
