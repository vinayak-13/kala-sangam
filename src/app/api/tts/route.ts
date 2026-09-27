import { NextRequest, NextResponse } from 'next/server';

// Map internal language codes to Google Translate TTS / Bhashini language tags
const TTS_LOCALE_MAP: Record<string, string> = {
  hi: 'hi',
  mr: 'mr',
  bn: 'bn',
  ta: 'ta',
  te: 'te',
  kn: 'kn',
  gu: 'gu',
  ml: 'ml',
  pa: 'pa',
  or: 'hi', // Odia falls to Indic phonetic if direct code unavailable
  as: 'bn', // Assamese Bengali script phonetics
  mai: 'hi',
  ks: 'hi',
  kok: 'mr',
  sd: 'hi',
  sa: 'hi',
  ur: 'ur',
  ne: 'ne',
  en: 'en-IN',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const locale = searchParams.get('locale') || 'hi';

    if (!text) {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
    }

    const ttsLang = TTS_LOCALE_MAP[locale.toLowerCase()] || 'hi';
    const cleanText = text.slice(0, 200).trim();

    // Fetch crystal-clear native speaker audio stream from Google Translate TTS
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText
    )}&tl=${ttsLang}&client=tw-ob`;

    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!audioRes.ok) {
      // Fallback empty response
      return new NextResponse(null, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err: any) {
    console.warn('TTS streaming error:', err);
    return NextResponse.json({ error: err?.message || 'TTS streaming failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, locale = 'hi' } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const ttsLang = TTS_LOCALE_MAP[locale.toLowerCase()] || 'hi';
    const cleanText = text.slice(0, 200).trim();

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText
    )}&tl=${ttsLang}&client=tw-ob`;

    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!audioRes.ok) {
      return NextResponse.json({ ok: false, error: 'TTS provider error' }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
