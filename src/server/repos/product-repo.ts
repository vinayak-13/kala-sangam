import { supabase, isSupabaseConfigured } from './supabase-client';
import type { Product, ProductMedia, VoiceCapture } from '@/lib/db/types';
import { CRAFT_CATALOG } from '@/lib/data/craft-catalog';

const memoryProducts = new Map<string, Product>();
const memoryMedia = new Map<string, ProductMedia[]>();
const memoryCaptures = new Map<string, VoiceCapture>();

// Initialize memory repo with all diverse Pan-India craft items
CRAFT_CATALOG.forEach((item) => {
  const prod: Product = {
    id: item.id,
    artisan_id: item.artisanId,
    status: 'published',
    title: item.title,
    description: item.description,
    materials: item.materials,
    dimensions: item.dimensions,
    craft_technique: item.craftTechnique,
    tags: item.tags,
    price_paise: item.pricePaise,
    ai_price_min_paise: item.aiPriceMinPaise,
    ai_price_max_paise: item.aiPriceMaxPaise,
    stock_quantity: item.stockQuantity,
    b2b_available: item.b2bAvailable,
    b2b_moq: item.b2bMoq,
    lead_time_days: item.leadTimeDays,
    view_count: 240,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };
  memoryProducts.set(item.id, prod);

  const mediaList: ProductMedia[] = [
    {
      id: `${item.id}-m1`,
      product_id: item.id,
      kind: 'photo',
      storage_path: item.mainImage,
      sort_order: 0,
      width: 800,
      height: 1000,
      duration_ms: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    ...item.galleryImages.map((img, idx) => ({
      id: `${item.id}-m${idx + 2}`,
      product_id: item.id,
      kind: 'photo' as const,
      storage_path: img,
      sort_order: idx + 1,
      width: 600,
      height: 600,
      duration_ms: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
  ];
  memoryMedia.set(item.id, mediaList);
});

export const productRepo = {
  async createDraft(artisanId: string): Promise<Product> {
    const id = crypto.randomUUID();
    const draft: Product = {
      id,
      artisan_id: artisanId,
      status: 'draft',
      title: {},
      description: {},
      materials: [],
      dimensions: null,
      craft_technique: null,
      tags: [],
      price_paise: null,
      ai_price_min_paise: null,
      ai_price_max_paise: null,
      stock_quantity: 1,
      b2b_available: false,
      b2b_moq: null,
      lead_time_days: null,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('products') as any).insert(draft).select().single();
        if (!error && data) return data as unknown as Product;
      } catch {
        // fallback
      }
    }
    memoryProducts.set(id, draft);
    return draft;
  },

  async findById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('products') as any).select('*').eq('id', id).single();
        if (!error && data) return data as unknown as Product;
      } catch {
        // fallback
      }
    }
    return memoryProducts.get(id) || null;
  },

  async update(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: Product = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('products') as any).update(updates).eq('id', id).select().single();
        if (!error && data) return data as unknown as Product;
      } catch {
        // fallback
      }
    }
    memoryProducts.set(id, updated);
    return updated;
  },

  async list(filter: {
    q?: string;
    craft?: string;
    state?: string;
    lang?: string;
    b2b?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{ items: Product[]; nextCursor: string | null }> {
    const limit = filter.limit || 20;
    if (isSupabaseConfigured && supabase) {
      try {
        let query = (supabase.from('products') as any).select('*').eq('status', 'published').is('deleted_at', null);
        if (filter.b2b === 'true') query = query.eq('b2b_available', true);
        const { data, error } = await query.limit(limit);
        if (!error && data) {
          return { items: data as unknown as Product[], nextCursor: null };
        }
      } catch {
        // fallback
      }
    }

    let items = Array.from(memoryProducts.values()).filter((p) => p.status === 'published' && !p.deleted_at);
    if (filter.b2b === 'true') items = items.filter((p) => p.b2b_available);
    if (filter.q) {
      const query = filter.q.toLowerCase();
      items = items.filter(
        (p) =>
          JSON.stringify(p.title).toLowerCase().includes(query) ||
          JSON.stringify(p.description).toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return { items: items.slice(0, limit), nextCursor: null };
  },

  async incrementViewCount(id: string): Promise<void> {
    const product = await this.findById(id);
    if (product) {
      await this.update(id, { view_count: (product.view_count || 0) + 1 });
    }
  },

  async addMedia(media: ProductMedia): Promise<ProductMedia> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('product_media') as any).insert(media).select().single();
        if (!error && data) return data as unknown as ProductMedia;
      } catch {
        // fallback
      }
    }
    const existing = memoryMedia.get(media.product_id) || [];
    existing.push(media);
    memoryMedia.set(media.product_id, existing);
    return media;
  },

  async findMediaByProductId(productId: string): Promise<ProductMedia[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('product_media') as any)
          .select('*')
          .eq('product_id', productId)
          .order('sort_order', { ascending: true });
        if (!error && data) return data as unknown as ProductMedia[];
      } catch {
        // fallback
      }
    }
    return memoryMedia.get(productId) || [];
  },

  async createVoiceCapture(capture: VoiceCapture): Promise<VoiceCapture> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('voice_captures') as any).insert(capture).select().single();
        if (!error && data) return data as unknown as VoiceCapture;
      } catch {
        // fallback
      }
    }
    memoryCaptures.set(capture.id, capture);
    return capture;
  },

  async updateVoiceCapture(id: string, updates: Partial<Omit<VoiceCapture, 'id'>>): Promise<VoiceCapture | null> {
    const existing = memoryCaptures.get(id);
    const updated: VoiceCapture = {
      ...(existing || {
        id,
        product_id: null,
        artisan_id: '',
        audio_path: '',
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
      }),
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('voice_captures') as any).update(updates).eq('id', id).select().single();
        if (!error && data) return data as unknown as VoiceCapture;
      } catch {
        // fallback
      }
    }
    memoryCaptures.set(id, updated);
    return updated;
  },

  async findVoiceCaptureByProductId(productId: string): Promise<VoiceCapture | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await (supabase.from('voice_captures') as any)
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (!error && data) return data as unknown as VoiceCapture;
      } catch {
        // fallback
      }
    }
    for (const capture of memoryCaptures.values()) {
      if (capture.product_id === productId) return capture;
    }
    return null;
  },
};
