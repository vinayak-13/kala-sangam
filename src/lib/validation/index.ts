import { z } from 'zod';

// ── AUTH VALIDATION ──────────────────────────────────────────────────────────
export const otpRequestSchema = z.object({
  phone: z.string().min(10, 'Valid Indian phone number required').max(15),
});

export const otpVerifySchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(6, 'OTP must be 6 digits'),
});

// ── PROFILE VALIDATION ───────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  preferred_locale: z.enum(['hi', 'mr', 'en', 'bn', 'ta', 'te', 'gu', 'kn', 'or', 'pa']).optional(),
  avatar_url: z.string().url().optional(),
});

export const createArtisanProfileSchema = z.object({
  craft_type: z.string().min(2, 'Craft type is required'),
  cluster_name: z.string().optional(),
  district: z.string().min(2, 'District is required'),
  state: z.string().min(2, 'State is required'),
  years_of_practice: z.number().int().nonnegative().optional(),
  bio: z.record(z.string(), z.string()).optional(),
  bio_audio_url: z.string().optional(),
  odop_tagged: z.boolean().default(false),
  udyam_number: z.string().optional(),
});

// ── PRODUCT VALIDATION ───────────────────────────────────────────────────────
export const productMediaUploadSchema = z.object({
  kind: z.enum(['photo', 'video', 'voice']),
  contentType: z.string().min(3),
  fileName: z.string().min(1),
});

export const updateProductSchema = z.object({
  title: z.record(z.string(), z.string()).optional(),
  description: z.record(z.string(), z.string()).optional(),
  materials: z.array(z.string()).optional(),
  dimensions: z.string().nullable().optional(),
  craft_technique: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  price_paise: z.number().int().positive('Price must be positive integer paise').optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
  b2b_available: z.boolean().optional(),
  b2b_moq: z.number().int().positive().nullable().optional(),
  lead_time_days: z.number().int().nonnegative().nullable().optional(),
});

export const productListQuerySchema = z.object({
  q: z.string().optional(),
  craft: z.string().optional(),
  state: z.string().optional(),
  lang: z.string().optional(),
  b2b: z.enum(['true', 'false']).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── COMMERCE VALIDATION ──────────────────────────────────────────────────────
export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const placeOrderSchema = z.object({
  artisanId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      unitPricePaise: z.number().int().positive(),
    })
  ).min(1, 'Order must contain at least one item'),
  type: z.enum(['retail', 'bulk']).default('retail'),
  shippingAddress: z.record(z.string(), z.unknown()),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['placed', 'accepted', 'in_production', 'shipped', 'delivered', 'cancelled']),
});

// ── B2B & RFQ VALIDATION ────────────────────────────────────────────────────
export const b2bVerifySchema = z.object({
  company_name: z.string().min(2),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format').optional(),
  business_type: z.enum(['retailer', 'exporter', 'hotel', 'institutional', 'other']).optional(),
  udyam_number: z.string().optional(),
});

export const createRfqSchema = z.object({
  artisanId: z.string().uuid(),
  productId: z.string().uuid().optional(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  targetDate: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export const rfqVoiceReplySchema = z.object({
  voicePath: z.string().min(1, 'Voice reply path required'),
});

// ── OFFLINE SYNC BATCH VALIDATION ───────────────────────────────────────────
export const syncEventPayloadSchema = z.object({
  clientTempId: z.string().min(1, 'clientTempId required'),
  kind: z.string().min(1),
  capturedAt: z.string(),
  payload: z.object({
    photos: z.array(z.string()).default([]),
    audio: z.string().min(1),
    draftTitle: z.string().optional(),
  }),
});

export const syncBatchSchema = z.object({
  events: z.array(syncEventPayloadSchema).min(1, 'Events array cannot be empty'),
});

// ── TTS VALIDATION ──────────────────────────────────────────────────────────
export const ttsRequestSchema = z.object({
  text: z.string().min(1).max(1000),
  locale: z.string().default('hi'),
});

// ── AI STRUCTURING VALIDATION ────────────────────────────────────────────────
export const listingDraftSchema = z.object({
  title: z.record(z.string(), z.string()),
  description: z.record(z.string(), z.string()),
  materials: z.array(z.string()).default([]),
  craft_technique: z.string().nullable().default(null),
  dimensions: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  price_min_inr: z.number().int().positive(),
  price_max_inr: z.number().int().positive(),
  confidence_notes: z.array(z.string()).default([]),
});

export type ListingDraft = z.infer<typeof listingDraftSchema>;
export type SyncBatchPayload = z.infer<typeof syncBatchSchema>;
export type PlaceOrderPayload = z.infer<typeof placeOrderSchema>;
