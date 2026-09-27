-- ==============================================================================
-- KALA-SANGAM: Core Database Schema Migration (0001_init.sql)
-- PS 26090: AI-Driven Market Linkage & Smart Cataloging for Marginalized Artisans
-- ==============================================================================

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ── 1. ENUMS ─────────────────────────────────────────────────────────────────
create type user_role as enum ('artisan', 'customer', 'b2b_buyer', 'admin');
create type product_status as enum ('draft', 'processing', 'review', 'published', 'archived');
create type order_type as enum ('retail', 'bulk');
create type order_status as enum ('placed', 'accepted', 'in_production', 'shipped', 'delivered', 'cancelled');

-- ── 2. AUTOMATIC updated_at TRIGGER FUNCTION ─────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── 3. IDENTITY & PROFILES ───────────────────────────────────────────────────
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  role              user_role not null default 'customer',
  full_name         text not null,
  phone             text unique,
  preferred_locale  text not null default 'hi',   -- BCP-47: hi, mr, bn, ta, en
  avatar_url        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger tr_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ── 4. ARTISAN PROFILES ──────────────────────────────────────────────────────
create table artisan_profiles (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null unique references profiles(id) on delete cascade,
  craft_type        text not null,              -- 'warli_painting', 'blue_pottery', etc.
  cluster_name      text,                       -- e.g. 'Sawantwadi Lacquerware Cluster'
  district          text not null,
  state             text not null,
  years_of_practice integer,
  bio               jsonb default '{}'::jsonb,  -- AI-generated from voice, multilingual {"en":"","hi":"","mr":""}
  bio_audio_url     text,                       -- artisan's own voice introducing themselves
  odop_tagged       boolean default false,      -- One District One Product tagged
  udyam_number      text,
  is_verified       boolean default false,
  rating            numeric(2,1) default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_artisan_profiles_district_craft on artisan_profiles (district, craft_type);

create trigger tr_artisan_profiles_updated_at
  before update on artisan_profiles
  for each row execute function set_updated_at();

-- ── 5. B2B BUYER PROFILES ────────────────────────────────────────────────────
create table buyer_profiles (
  id                  uuid primary key default gen_random_uuid(),
  profile_id          uuid not null unique references profiles(id) on delete cascade,
  company_name        text not null,
  gstin               text,
  business_type       text,                     -- 'retailer', 'exporter', 'hotel', 'institutional'
  verification_status text not null default 'pending', -- pending | verified | rejected
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger tr_buyer_profiles_updated_at
  before update on buyer_profiles
  for each row execute function set_updated_at();

-- ── 6. PRODUCTS ──────────────────────────────────────────────────────────────
create table products (
  id                 uuid primary key default gen_random_uuid(),
  artisan_id         uuid not null references artisan_profiles(id) on delete cascade,
  status             product_status not null default 'draft',
  title              jsonb not null default '{}'::jsonb,        -- {"en": "...", "hi": "...", "mr": "..."}
  description        jsonb not null default '{}'::jsonb,        -- {"en": "...", "hi": "...", "mr": "..."}
  materials          text[] default '{}',
  dimensions         text,
  craft_technique    text,
  tags               text[] default '{}',
  price_paise        integer,                                   -- Integer paise (e.g. 150000 = ₹1,500.00)
  ai_price_min_paise integer,                                   -- AI-suggested lower bound
  ai_price_max_paise integer,                                   -- AI-suggested upper bound
  stock_quantity     integer default 1,
  b2b_available      boolean default false,
  b2b_moq            integer,                                   -- Minimum Order Quantity
  lead_time_days     integer,
  view_count         integer default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz
);

create index idx_products_status_created on products (status, created_at desc);
create index idx_products_tags on products using gin (tags);

create trigger tr_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ── 7. PRODUCT MEDIA ─────────────────────────────────────────────────────────
create table product_media (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  kind         text not null,                   -- 'photo' | 'video' | 'voice'
  storage_path text not null,
  sort_order   integer default 0,
  width        integer,
  height       integer,
  duration_ms  integer,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_product_media_product_kind on product_media (product_id, kind);

create trigger tr_product_media_updated_at
  before update on product_media
  for each row execute function set_updated_at();

-- ── 8. AI AUDIT TRAIL (VOICE CAPTURES) ───────────────────────────────────────
create table voice_captures (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid references products(id) on delete cascade,
  artisan_id      uuid not null references artisan_profiles(id) on delete cascade,
  audio_path      text not null,
  source_locale   text not null,                -- 'hi', 'mr', 'bn', etc.
  raw_transcript  text,                         -- Verbatim ASR output
  translated_text jsonb default '{}'::jsonb,    -- {"en": "...", "hi": "..."}
  asr_provider    text,                         -- 'bhashini' | 'sarvam' | 'groq-whisper'
  asr_confidence  numeric(4,3),
  llm_provider    text,                         -- 'gemini-flash' | 'groq-llama'
  processing_ms   integer,
  artisan_edited  boolean default false,        -- Did artisan adjust the AI draft?
  error           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger tr_voice_captures_updated_at
  before update on voice_captures
  for each row execute function set_updated_at();

-- ── 9. COMMERCE: ORDERS & ORDER ITEMS ────────────────────────────────────────
create table orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text unique not null,       -- e.g. 'KS-2026-000148'
  buyer_id          uuid not null references profiles(id),
  artisan_id        uuid not null references artisan_profiles(id),
  type              order_type not null default 'retail',
  status            order_status not null default 'placed',
  total_paise       integer not null,           -- Integer paise
  shipping_address  jsonb,
  expected_delivery date,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger tr_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references orders(id) on delete cascade,
  product_id       uuid not null references products(id),
  quantity         integer not null check (quantity > 0),
  unit_price_paise integer not null,            -- Integer paise
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger tr_order_items_updated_at
  before update on order_items
  for each row execute function set_updated_at();

-- ── 10. B2B RFQS (REQUEST FOR QUOTE) ─────────────────────────────────────────
create table rfqs (
  id               uuid primary key default gen_random_uuid(),
  buyer_id         uuid not null references profiles(id),
  artisan_id       uuid not null references artisan_profiles(id),
  product_id       uuid references products(id),
  quantity         integer not null check (quantity > 0),
  target_date      date,
  message          text,
  voice_reply_path text,                        -- Artisan can reply with a voice recording
  status           text not null default 'open', -- 'open' | 'accepted' | 'declined' | 'closed'
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger tr_rfqs_updated_at
  before update on rfqs
  for each row execute function set_updated_at();

-- ── 11. OFFLINE SYNC LEDGER ──────────────────────────────────────────────────
create table sync_events (
  id             uuid primary key default gen_random_uuid(),
  artisan_id     uuid not null references artisan_profiles(id) on delete cascade,
  client_temp_id text not null,                 -- Idempotency key from device IndexedDB
  payload_kind   text not null,                 -- e.g. 'product_capture'
  synced_at      timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (artisan_id, client_temp_id)
);

create trigger tr_sync_events_updated_at
  before update on sync_events
  for each row execute function set_updated_at();

-- ── 12. ROW-LEVEL SECURITY (RLS) POLICIES ────────────────────────────────────

-- Products RLS
alter table products enable row level security;

create policy "public reads published"
  on products for select
  using (status = 'published' and deleted_at is null);

create policy "artisan manages own"
  on products for all
  using (artisan_id in (
    select id from artisan_profiles where profile_id = auth.uid()
  ));

-- Product Media RLS
alter table product_media enable row level security;

create policy "public reads published product media"
  on product_media for select
  using (product_id in (
    select id from products where status = 'published' and deleted_at is null
  ));

create policy "artisan manages own product media"
  on product_media for all
  using (product_id in (
    select p.id from products p
    join artisan_profiles a on p.artisan_id = a.id
    where a.profile_id = auth.uid()
  ));

-- Voice Captures RLS
alter table voice_captures enable row level security;

create policy "artisan manages own voice captures"
  on voice_captures for all
  using (artisan_id in (
    select id from artisan_profiles where profile_id = auth.uid()
  ));

-- Orders RLS
alter table orders enable row level security;

create policy "buyer reads own orders"
  on orders for select
  using (buyer_id = auth.uid());

create policy "buyer inserts own orders"
  on orders for insert
  with check (buyer_id = auth.uid());

create policy "artisan reads and updates own orders"
  on orders for all
  using (artisan_id in (
    select id from artisan_profiles where profile_id = auth.uid()
  ));

-- Order Items RLS
alter table order_items enable row level security;

create policy "buyer reads own order items"
  on order_items for select
  using (order_id in (
    select id from orders where buyer_id = auth.uid()
  ));

create policy "artisan reads own order items"
  on order_items for select
  using (order_id in (
    select o.id from orders o
    join artisan_profiles a on o.artisan_id = a.id
    where a.profile_id = auth.uid()
  ));

-- RFQs RLS
alter table rfqs enable row level security;

create policy "buyer manages own rfqs"
  on rfqs for all
  using (buyer_id = auth.uid());

create policy "artisan manages received rfqs"
  on rfqs for all
  using (artisan_id in (
    select id from artisan_profiles where profile_id = auth.uid()
  ));

-- Sync Events RLS
alter table sync_events enable row level security;

create policy "artisan manages own sync events"
  on sync_events for all
  using (artisan_id in (
    select id from artisan_profiles where profile_id = auth.uid()
  ));

-- Profiles RLS
alter table profiles enable row level security;

create policy "public reads basic profiles"
  on profiles for select
  using (true);

create policy "users update own profile"
  on profiles for update
  using (id = auth.uid());

-- Artisan Profiles RLS
alter table artisan_profiles enable row level security;

create policy "public reads artisan profiles"
  on artisan_profiles for select
  using (true);

create policy "artisan updates own profile"
  on artisan_profiles for update
  using (profile_id = auth.uid());

-- Buyer Profiles RLS
alter table buyer_profiles enable row level security;

create policy "buyer manages own profile"
  on buyer_profiles for all
  using (profile_id = auth.uid());

-- ── 13. STORAGE BUCKETS SETUP (OPTIONAL / CONDITIONAL) ───────────────────────
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public) values
      ('product-photos', 'product-photos', true),
      ('product-voice', 'product-voice', true),
      ('artisan-avatars', 'artisan-avatars', true),
      ('rfq-voice', 'rfq-voice', false)
    on conflict (id) do nothing;
  end if;
end $$;
