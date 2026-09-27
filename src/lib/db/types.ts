// ==============================================================================
// KALA-SANGAM: Database TypeScript Definitions
// Strictly derived from /supabase/migrations/0001_init.sql
// Rules:
// - Money is strictly integer paise, never float
// - Multilingual text is typed as MultilingualText {"en", "hi", "mr"}
// - All tables include created_at and updated_at
// ==============================================================================

export type UserRole = 'artisan' | 'customer' | 'b2b_buyer' | 'admin';
export type ProductStatus = 'draft' | 'processing' | 'review' | 'published' | 'archived';
export type OrderType = 'retail' | 'bulk';
export type OrderStatus = 'placed' | 'accepted' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
export type ProductMediaKind = 'photo' | 'video' | 'voice';
export type BuyerVerificationStatus = 'pending' | 'verified' | 'rejected';
export type RFQStatus = 'open' | 'accepted' | 'declined' | 'closed';

/**
 * Standard representation for multilingual localized strings
 */
export interface MultilingualText {
  en?: string;
  hi?: string;
  mr?: string;
  [locale: string]: string | undefined;
}

/**
 * User profile extending auth.users
 */
export interface Profile {
  id: string; // references auth.users(id)
  role: UserRole;
  full_name: string;
  phone: string | null;
  preferred_locale: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Dedicated artisan profile
 */
export interface ArtisanProfile {
  id: string;
  profile_id: string;
  craft_type: string;
  cluster_name: string | null;
  district: string;
  state: string;
  years_of_practice: number | null;
  bio: MultilingualText;
  bio_audio_url: string | null;
  odop_tagged: boolean;
  udyam_number: string | null;
  is_verified: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

/**
 * Verified B2B institutional/wholesale buyer
 */
export interface BuyerProfile {
  id: string;
  profile_id: string;
  company_name: string;
  gstin: string | null;
  business_type: string | null;
  verification_status: BuyerVerificationStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Core product entity
 */
export interface Product {
  id: string;
  artisan_id: string;
  status: ProductStatus;
  title: MultilingualText;
  description: MultilingualText;
  materials: string[];
  dimensions: string | null;
  craft_technique: string | null;
  tags: string[];
  price_paise: number | null;         // Integer in paise
  ai_price_min_paise: number | null;  // Suggested minimum in paise
  ai_price_max_paise: number | null;  // Suggested maximum in paise
  stock_quantity: number;
  b2b_available: boolean;
  b2b_moq: number | null;
  lead_time_days: number | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Photos, videos, and voice recordings attached to a product
 */
export interface ProductMedia {
  id: string;
  product_id: string;
  kind: ProductMediaKind;
  storage_path: string;
  sort_order: number;
  width: number | null;
  height: number | null;
  duration_ms: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Full AI audit trail for artisan voice recordings
 */
export interface VoiceCapture {
  id: string;
  product_id: string | null;
  artisan_id: string;
  audio_path: string;
  source_locale: string;
  raw_transcript: string | null;
  translated_text: MultilingualText;
  asr_provider: string | null;
  asr_confidence: number | null;
  llm_provider: string | null;
  processing_ms: number | null;
  artisan_edited: boolean;
  error: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Commerce order
 */
export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  artisan_id: string;
  type: OrderType;
  status: OrderStatus;
  total_paise: number; // Integer in paise
  shipping_address: Record<string, unknown> | null;
  expected_delivery: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Individual line items in an order
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_paise: number; // Integer in paise
  created_at: string;
  updated_at: string;
}

/**
 * B2B Request for Quote
 */
export interface RFQ {
  id: string;
  buyer_id: string;
  artisan_id: string;
  product_id: string | null;
  quantity: number;
  target_date: string | null;
  message: string | null;
  voice_reply_path: string | null;
  status: RFQStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Idempotent offline sync queue ledger
 */
export interface SyncEvent {
  id: string;
  artisan_id: string;
  client_temp_id: string;
  payload_kind: string;
  synced_at: string;
  created_at: string;
  updated_at: string;
}

// ── SUPABASE CLIENT DATABASE TYPE SHAPE ──────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      artisan_profiles: {
        Row: ArtisanProfile;
        Insert: Omit<ArtisanProfile, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ArtisanProfile, 'id'>>;
      };
      buyer_profiles: {
        Row: BuyerProfile;
        Insert: Omit<BuyerProfile, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<BuyerProfile, 'id'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Product, 'id'>>;
      };
      product_media: {
        Row: ProductMedia;
        Insert: Omit<ProductMedia, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProductMedia, 'id'>>;
      };
      voice_captures: {
        Row: VoiceCapture;
        Insert: Omit<VoiceCapture, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<VoiceCapture, 'id'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Order, 'id'>>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<OrderItem, 'id'>>;
      };
      rfqs: {
        Row: RFQ;
        Insert: Omit<RFQ, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<RFQ, 'id'>>;
      };
      sync_events: {
        Row: SyncEvent;
        Insert: Omit<SyncEvent, 'id' | 'synced_at' | 'created_at' | 'updated_at'> & {
          id?: string;
          synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<SyncEvent, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: {
      user_role: UserRole;
      product_status: ProductStatus;
      order_type: OrderType;
      order_status: OrderStatus;
    };
  };
}
