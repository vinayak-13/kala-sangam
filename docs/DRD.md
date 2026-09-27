# KALA-SANGAM — Design & Requirements Document (DRD)

**Team AROHAN · Smart India Hackathon 2026 · PS 26090**
**AI-Driven Market Linkage and Smart Cataloging for Marginalized Artisans**

> **How to use this document with Antigravity:** do not paste the whole file as one prompt. Create the repo, drop this file in as `/docs/DRD.md`, then work section by section — start with §3 (Database), then §4 (Backend/API), then §5 (Frontend), then §6 (AI), then §7 (UI). Each section ends with a **BUILD PROMPT** block written to be pasted directly. Antigravity degrades badly when asked to build everything in one shot; it does very well when given one bounded contract at a time with the schema already fixed.

---

## 1. Product definition

### 1.1 One-line

A **web-first, voice-first marketplace** where an artisan with a ₹6,000 phone and patchy 3G can photograph a product, speak about it in their own language, and get a publish-ready multilingual listing in under 90 seconds — which retail customers and verified B2B buyers can then buy from.

### 1.2 Why web, not a native app (state this explicitly in the pitch)

| Constraint | Native app | Web (PWA) |
|---|---|---|
| Device cost | Needs a mid-range Android, 2–3 GB install footprint after updates | Runs on any browser, ~1 MB first load |
| Install friction | Play Store account, storage anxiety, updates over metered data | A link shared on WhatsApp opens it |
| Onboarding at a cluster camp | Install 40 phones one by one | Scan one QR code |
| Offline | Possible | Also possible — service worker + IndexedDB |
| Reach for buyers | Separate build | Same codebase |

**Design principle:** the artisan surface must work as a plain HTML form with JavaScript disabled or broken. Progressive enhancement is not optional here — it is the accessibility story the judges are grading.

### 1.3 Three roles

1. **Artisan** — creates profile, captures product, speaks description, publishes, receives orders.
2. **Customer (B2C)** — browses, views product with the artisan's *actual voice clip* playing, buys single units.
3. **B2B Buyer** — verified via GST/Udyam number, browses by cluster/craft/volume, places bulk orders, sends RFQs.

---

## 2. Scope: what you build vs. what you stage

Be ruthless. A prototype that does five things flawlessly beats one that half-does fifteen.

### 2.1 MUST BUILD (this is the demo)
- Artisan signup + profile (phone OTP or magic link)
- Product capture: 1–5 photos + one 20–40s voice recording, **in-browser**
- Offline capture queue that visibly syncs when connection returns
- AI pipeline: audio → transcript (Indic) → English translation → structured listing (title, description, materials, tags, suggested price band)
- Artisan reviews/edits the AI draft, then publishes
- Public marketplace: grid, search, filter by craft/state/language
- Product detail page with **playable original voice clip** + "Listen in Hindi/Marathi/English" toggle
- Cart + single-unit checkout (mock payment)
- B2B portal: verification form, bulk order with tiered quantity, RFQ to artisan
- Artisan order dashboard with voice-notification (TTS reads out "You have a new order for 40 units")

### 2.2 SHOULD BUILD if time allows
- AI photo enhancement (background cleanup / white-background variant)
- Artisan analytics: views, saves, top-searched craft in their district
- Multilingual UI (Hindi + Marathi + English toggle)
- Admin/cluster-coordinator view for NGO or SHG onboarding drives

### 2.3 EXPLICITLY STAGED (say so on the slide — honesty scores)
- Real payment settlement → mock gateway with a "Razorpay sandbox" label
- KYC / Udyam verification → form + mocked verification response
- Logistics pickup → static partner list
- Demand-analytics ML → seeded dashboard marked "illustrative"

---

## 3. DATABASE DRD

**Engine:** PostgreSQL via Supabase (free tier: 500 MB DB, 1 GB storage, auth included, RLS built in).
**Why:** auth + object storage + Postgres + row-level security in one free service means you spend hackathon hours on the demo, not on plumbing.

### 3.1 Conventions
- All tables `snake_case`, plural.
- Primary keys: `uuid` default `gen_random_uuid()`.
- Every table: `created_at timestamptz default now()`, `updated_at timestamptz default now()`.
- Soft delete via `deleted_at timestamptz null` — never hard-delete in a demo, you will need to undo things on stage.
- Money stored as `integer` **in paise**. Never float.
- All user-facing text columns that can be multilingual are `jsonb` shaped `{"en": "...", "hi": "...", "mr": "..."}`.

### 3.2 Schema

```sql
-- ── IDENTITY ──────────────────────────────────────────────
create type user_role as enum ('artisan', 'customer', 'b2b_buyer', 'admin');

create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  role              user_role not null default 'customer',
  full_name         text not null,
  phone             text unique,
  preferred_locale  text not null default 'hi',   -- BCP-47: hi, mr, bn, ta, en
  avatar_url        text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ── ARTISAN ──────────────────────────────────────────────
create table artisan_profiles (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null unique references profiles(id) on delete cascade,
  craft_type        text not null,              -- 'warli_painting', 'blue_pottery', ...
  cluster_name      text,                       -- e.g. 'Sawantwadi Lacquerware Cluster'
  district          text not null,
  state             text not null,
  years_of_practice integer,
  bio               jsonb default '{}'::jsonb,  -- AI-generated from voice, multilingual
  bio_audio_url     text,                       -- artisan's own voice introducing themselves
  odop_tagged       boolean default false,      -- is their craft an ODOP product for the district
  udyam_number      text,
  is_verified       boolean default false,
  rating            numeric(2,1) default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);
create index on artisan_profiles (district, craft_type);

-- ── B2B ──────────────────────────────────────────────────
create table buyer_profiles (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null unique references profiles(id) on delete cascade,
  company_name   text not null,
  gstin          text,
  business_type  text,                          -- 'retailer','exporter','hotel','institutional'
  verification_status text not null default 'pending', -- pending|verified|rejected
  created_at     timestamptz default now()
);

-- ── PRODUCTS ─────────────────────────────────────────────
create type product_status as enum ('draft','processing','review','published','archived');

create table products (
  id                uuid primary key default gen_random_uuid(),
  artisan_id        uuid not null references artisan_profiles(id) on delete cascade,
  status            product_status not null default 'draft',
  title             jsonb not null default '{}'::jsonb,
  description       jsonb not null default '{}'::jsonb,
  materials         text[] default '{}',
  dimensions        text,
  craft_technique   text,
  tags              text[] default '{}',
  price_paise       integer,
  ai_price_min_paise integer,                   -- AI-suggested band, artisan may override
  ai_price_max_paise integer,
  stock_quantity    integer default 1,
  b2b_available     boolean default false,
  b2b_moq           integer,                    -- minimum order quantity
  lead_time_days    integer,
  view_count        integer default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  deleted_at        timestamptz
);
create index on products (status, created_at desc);
create index on products using gin (tags);

create table product_media (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references products(id) on delete cascade,
  kind         text not null,                   -- 'photo' | 'video' | 'voice'
  storage_path text not null,
  sort_order   integer default 0,
  width        integer,
  height       integer,
  duration_ms  integer,
  created_at   timestamptz default now()
);
create index on product_media (product_id, kind);

-- ── THE AI AUDIT TRAIL (judges love this table) ──────────
create table voice_captures (
  id                uuid primary key default gen_random_uuid(),
  product_id        uuid references products(id) on delete cascade,
  artisan_id        uuid not null references artisan_profiles(id) on delete cascade,
  audio_path        text not null,
  source_locale     text not null,              -- detected or declared
  raw_transcript    text,                       -- verbatim ASR output
  translated_text   jsonb default '{}'::jsonb,  -- {"en": "...", "hi": "..."}
  asr_provider      text,                       -- 'bhashini' | 'sarvam' | 'groq-whisper'
  asr_confidence    numeric(4,3),
  llm_provider      text,
  processing_ms     integer,
  artisan_edited    boolean default false,      -- did the human change the AI draft?
  error             text,
  created_at        timestamptz default now()
);

-- ── COMMERCE ─────────────────────────────────────────────
create type order_type   as enum ('retail','bulk');
create type order_status as enum ('placed','accepted','in_production','shipped','delivered','cancelled');

create table orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text unique not null,          -- 'KS-2026-000148'
  buyer_id       uuid not null references profiles(id),
  artisan_id     uuid not null references artisan_profiles(id),
  type           order_type not null default 'retail',
  status         order_status not null default 'placed',
  total_paise    integer not null,
  shipping_address jsonb,
  expected_delivery date,
  notes          text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references orders(id) on delete cascade,
  product_id        uuid not null references products(id),
  quantity          integer not null check (quantity > 0),
  unit_price_paise  integer not null
);

create table rfqs (                              -- B2B request for quote
  id            uuid primary key default gen_random_uuid(),
  buyer_id      uuid not null references profiles(id),
  artisan_id    uuid not null references artisan_profiles(id),
  product_id    uuid references products(id),
  quantity      integer not null,
  target_date   date,
  message       text,
  voice_reply_path text,                         -- artisan can answer by voice
  status        text default 'open',
  created_at    timestamptz default now()
);

-- ── OFFLINE SYNC LEDGER ──────────────────────────────────
create table sync_events (
  id             uuid primary key default gen_random_uuid(),
  artisan_id     uuid not null references artisan_profiles(id),
  client_temp_id text not null,                  -- idempotency key from IndexedDB
  payload_kind   text not null,
  synced_at      timestamptz default now(),
  unique (artisan_id, client_temp_id)
);
```

### 3.3 Row-Level Security (do this, it is a 10-minute win and a real talking point)

```sql
alter table products enable row level security;

create policy "public reads published"
  on products for select
  using (status = 'published' and deleted_at is null);

create policy "artisan manages own"
  on products for all
  using (artisan_id in (
    select id from artisan_profiles where profile_id = auth.uid()
  ));
```
Apply the same shape to `product_media`, `orders`, `voice_captures`.

### 3.4 Storage buckets
| Bucket | Public | Contents |
|---|---|---|
| `product-photos` | yes | originals + a 400px webp derivative |
| `product-voice` | yes | webm/opus, ~30s, ≤ 300 KB |
| `artisan-avatars` | yes | |
| `rfq-voice` | no | signed URLs only |

### 3.5 Seed data requirement
Seed **12 artisans across 8 states, 3 languages, 30 products, 6 orders**, with real-looking craft names (Warli, Sanjhi, Bidriware, Channapatna, Kutch embroidery, Pattachitra, Dhokra, Blue Pottery). A marketplace with 4 items looks like a school project. This is the single highest-leverage hour of work you will do.

---

### BUILD PROMPT — Database

```
Create a Supabase project schema for KALA-SANGAM.

Produce these files:
1. supabase/migrations/0001_init.sql — the full schema exactly as specified below,
   including enums, tables, indexes, foreign keys and RLS policies.
2. supabase/migrations/0002_seed.sql — seed data: 12 artisans across 8 Indian
   states covering Warli painting, Blue Pottery, Bidriware, Channapatna toys,
   Kutch embroidery, Pattachitra, Dhokra and Sanjhi; 30 products with realistic
   Hindi/Marathi/English jsonb titles and descriptions, prices in paise between
   ₹350 and ₹18,000; 6 orders (4 retail, 2 bulk); 3 RFQs.
3. src/lib/db/types.ts — TypeScript types generated to match the schema exactly.

[PASTE §3.2 SCHEMA HERE]

Rules:
- money is integer paise, never float
- multilingual text is jsonb {"en","hi","mr"}
- every table gets created_at/updated_at
- write an updated_at trigger function and attach it to every table
Do not create any application code yet.
```

---

## 4. BACKEND DRD

**Runtime:** Next.js 15 App Router Route Handlers + Server Actions (TypeScript, Node runtime).
**Why not a separate Express/FastAPI service:** one deployable, one env file, zero CORS, Vercel free tier. For a 36-hour prototype a separate backend is pure tax. (If a judge asks "does this scale?" — the answer is that each route handler is a stateless serverless function and the AI pipeline is already queue-shaped; you'd lift it to a worker unchanged.)

### 4.1 Layering — enforce this or Antigravity will write spaghetti

```
src/
  app/api/**          → HTTP boundary only. Parse, authorize, call service, map errors.
  server/services/**  → business logic. Pure-ish, testable, no Request/Response objects.
  server/repos/**     → the ONLY place that touches Supabase/SQL.
  server/ai/**        → provider adapters behind interfaces.
  lib/                → shared validation schemas (zod), constants, utils.
```
**Rule: a route handler is never more than 25 lines.**

### 4.2 API contract

All responses: `{ ok: true, data: T }` or `{ ok: false, error: { code, message, field? } }`.
All bodies validated with zod. All mutating routes require auth. All list routes paginate with `?cursor=&limit=`.

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/api/auth/otp/request` | public | send OTP to phone |
| POST | `/api/auth/otp/verify` | public | verify, create session |
| GET | `/api/me` | any | current profile + role |
| PATCH | `/api/me` | any | update profile, locale |
| POST | `/api/artisans` | artisan | create artisan profile |
| GET | `/api/artisans/:id` | public | public artisan page |
| POST | `/api/products/draft` | artisan | create empty draft, returns `productId` |
| POST | `/api/products/:id/media` | artisan | signed upload URL for photo/video |
| POST | `/api/products/:id/voice` | artisan | **upload audio → kicks off AI pipeline** |
| GET | `/api/products/:id/processing` | artisan | poll pipeline status |
| PATCH | `/api/products/:id` | artisan | artisan edits AI draft |
| POST | `/api/products/:id/publish` | artisan | validate + publish |
| GET | `/api/products` | public | list: `?q=&craft=&state=&lang=&b2b=` |
| GET | `/api/products/:id` | public | detail (increments view_count) |
| POST | `/api/cart` | customer | add/update line |
| POST | `/api/orders` | customer/b2b | place order |
| GET | `/api/orders` | any | role-scoped list |
| PATCH | `/api/orders/:id/status` | artisan | accept / in_production / shipped |
| POST | `/api/b2b/verify` | b2b | submit GSTIN/Udyam |
| POST | `/api/rfqs` | b2b | create RFQ |
| POST | `/api/rfqs/:id/voice-reply` | artisan | reply by voice |
| POST | `/api/sync/batch` | artisan | **offline queue flush, idempotent** |
| POST | `/api/tts` | any | text → speech for the target locale |

### 4.3 The voice pipeline — the heart of the product

`POST /api/products/:id/voice` must return in **under 400 ms**. It does not do the work.

```
1. Validate audio (≤ 60s, ≤ 2 MB, webm/opus|mp4|wav)
2. Upload to Supabase Storage
3. INSERT voice_captures (status implicit), set products.status = 'processing'
4. Return { captureId, productId } immediately
5. Fire the pipeline (await-less in dev; a /api/internal/process call in prod)

Pipeline stages, each recorded to voice_captures:
  a. ASR        → raw_transcript, asr_confidence, source_locale
  b. Translate  → translated_text.en (+ hi if source ≠ hi)
  c. Structure  → LLM returns STRICT JSON: title, description, materials[],
                  craft_technique, dimensions, tags[], price_min, price_max,
                  confidence_notes[]
  d. Localize   → title/description rendered into en + hi + source locale
  e. UPDATE products, set status = 'review'
```

**Failure policy — non-negotiable for a demo.** Every stage has a timeout (8s ASR, 6s translate, 12s LLM) and a fallback:
- ASR fails → keep the audio, set `products.status='review'` with an empty draft and a banner: *"We couldn't hear that clearly — record again, or type a short title."* The product is never lost.
- LLM fails → fall back to a template built from the raw transcript.
- Everything fails → the listing still exists with photos + the voice clip. **The artisan's work is never discarded because a model timed out.** Say this sentence out loud during the demo.

### 4.4 Offline sync contract

`POST /api/sync/batch`
```jsonc
{
  "events": [
    {
      "clientTempId": "uuid-generated-on-device",   // idempotency key
      "kind": "product_capture",
      "capturedAt": "2026-03-14T09:12:04Z",
      "payload": { "photos": ["<blob-ref>"], "audio": "<blob-ref>", "draftTitle": "..." }
    }
  ]
}
```
Server inserts into `sync_events` with the unique constraint on `(artisan_id, client_temp_id)`. A duplicate flush is a no-op that returns the original result. Response reports per-event `{ clientTempId, status: 'created'|'duplicate'|'failed', productId? }`.

### 4.5 Non-functional
- Rate limit: 20 voice uploads/hour/artisan (in-memory LRU is fine for the demo).
- Structured logs: `{ requestId, route, userId, ms }`.
- All AI keys server-side only. Never a `NEXT_PUBLIC_` AI key — a judge *will* open devtools.
- Cost ceiling: use free tiers only; log token spend per capture to a `processing_ms`/cost note.

---

### BUILD PROMPT — Backend

```
Implement the KALA-SANGAM backend in the existing Next.js 15 App Router project.

Architecture (enforce strictly):
  src/app/api/**        HTTP boundary only, max 25 lines per handler
  src/server/services/  business logic, no Request/Response types
  src/server/repos/     the only files importing the Supabase client
  src/server/ai/        provider adapters behind interfaces
  src/lib/validation/   zod schemas shared by client and server

Response envelope: { ok: true, data } | { ok: false, error: { code, message, field? } }

Implement these routes: [PASTE §4.2 TABLE]

Then implement the voice pipeline exactly as specified: [PASTE §4.3]

Requirements:
- POST /api/products/:id/voice must return within 400ms; processing happens after.
- Every AI stage has the specified timeout and the specified fallback. A failed
  model call must NEVER delete or block the artisan's upload.
- POST /api/sync/batch is idempotent on (artisan_id, client_temp_id).
- Write vitest unit tests for the pipeline's three failure paths.
- No AI keys in any NEXT_PUBLIC_ variable.
```

---

## 5. FRONTEND DRD

**Stack:** Next.js 15 App Router · TypeScript strict · Tailwind CSS · shadcn/ui · `next-intl` · TanStack Query for client cache · `idb-keyval` for the offline queue · `next-pwa` (or a hand-written service worker) for offline shell.

### 5.1 The performance budget — this *is* the accessibility argument

| Surface | JS budget | LCP target on 3G |
|---|---|---|
| Artisan capture flow | ≤ 120 KB gzipped | < 2.5 s |
| Marketplace listing | ≤ 180 KB | < 3.0 s |
| B2B dashboard | ≤ 250 KB | — |

Enforced by: Server Components by default, `'use client'` only on the recorder, camera input, cart and filters. Images via `next/image` with AVIF/WebP. No heavy UI library beyond shadcn (which is copy-paste, not a runtime dep).

**Put the Lighthouse score on a slide.** "Runs in 2.1s on a simulated 3G ₹6,000 device" is a claim judges can verify in ten seconds, and almost no team makes it.

### 5.2 Route map

```
/(public)
  /                          hero + featured crafts + "Are you an artisan?" CTA
  /explore                   marketplace grid, filters, search
  /product/[id]              detail + VOICE PLAYER + language toggle
  /artisan/[id]              public artisan story page
  /b2b                       B2B landing + value prop
/(artisan)                   protected, role=artisan
  /studio                    dashboard: products, orders, earnings
  /studio/capture            ⭐ THE CAPTURE FLOW (see 5.3)
  /studio/product/[id]/review  AI draft review & edit
  /studio/orders             orders + voice notifications
/(buyer)
  /cart, /checkout, /orders
/(b2b)                       protected, role=b2b_buyer
  /portal                    catalog by cluster/craft/MOQ
  /portal/rfq/new
  /portal/orders
/(admin)
  /cluster                   onboarding drive view (stretch)
```

### 5.3 The capture flow — build this first, polish it hardest

Five full-screen steps, one action each, giant targets, and **every screen has a speaker icon that reads the instruction aloud in the chosen language.**

```
STEP 1  भाषा चुनें / Choose language
        4 big flag-less language cards. Sets locale for the whole session.

STEP 2  फ़ोटो लें / Take photos
        <input type="file" accept="image/*" capture="environment">  ← works everywhere
        Up to 5. Thumbnails with a big × to remove. Compress client-side to
        ≤ 1600px / 250KB before upload (canvas or browser-image-compression).

STEP 3  बोलिए / Speak about your product   ⭐ THE MOMENT
        One huge circular mic button. Press and hold, or tap to start/stop.
        Live waveform + a rising ring timer (20s suggested, 60s max).
        On-screen prompt, also spoken: "What is it? What is it made of?
        How long did it take? What makes it special?"
        Playback before continuing. "Record again" always available.

STEP 4  बन रहा है / Creating your listing
        Not a spinner. A visible 4-stage progress list:
          ✓ Heard your voice
          ✓ Understood Marathi
          ⋯ Writing your product description
          ○ Setting a suggested price
        (This is theatre, and it is correct theatre — it makes the AI legible
        instead of magic. Judges remember it.)

STEP 5  जाँचें / Check and publish
        The AI draft, every field editable. Each AI-written field carries a
        small ✨ badge and a one-tap "🔁 rewrite" / "🎤 say it differently".
        Price shown as a BAND with a slider, not a fixed number — the artisan
        decides, the AI advises. Big green PUBLISH.
```

**Accessibility requirements (these are graded, explicitly or not):**
- Minimum tap target 56×56 px on the artisan flow.
- Minimum body text 18 px; primary actions 20 px semibold.
- Contrast ≥ 7:1 on all artisan-facing text.
- Every icon paired with a text label — never an icon alone.
- Full keyboard operability + visible focus rings.
- `aria-live="polite"` on the processing stage list.
- No step ever requires typing. Typing is always available, never required.

### 5.4 Offline behaviour

- Service worker caches the app shell + the capture route.
- A persistent connectivity chip: **Online** / **Offline — saved on this phone**.
- Captures made offline go to IndexedDB with a `clientTempId`, photos and audio as blobs.
- A queue badge shows "3 products waiting to upload".
- On reconnect, auto-flush to `/api/sync/batch`, with a toast per success.
- **Demo move:** turn on airplane mode on stage, record a product, show it queued, turn wifi back on, watch it sync and the AI draft appear. That's your 20-second showstopper.

### 5.5 Product detail page — the differentiator

Above the fold, next to the photos:
> **🔊 Sunil bolte hain** — *Hear it from the maker* — [▶ 0:24]
> with the transcript below in the buyer's chosen language, and a toggle: *मूल आवाज़ | हिंदी | English*.

This single component is your whole thesis made visible: the artisan's voice is not a data-entry mechanism, it is the product's provenance. Nobody else in the room will have it.

### 5.6 State management
- Server state: React Server Components + TanStack Query where interactive.
- Cart: `localStorage` + context, hydrated server-side on checkout.
- Capture flow: one `useReducer` machine with states `idle → photos → recording → uploading → processing → review`, persisted to IndexedDB after every transition so a browser crash never loses a capture.

---

### BUILD PROMPT — Frontend

```
Build the KALA-SANGAM frontend: Next.js 15 App Router, TypeScript strict,
Tailwind, shadcn/ui, next-intl (en, hi, mr), TanStack Query, idb-keyval.

Route map: [PASTE §5.2]

Build the artisan capture flow FIRST and completely, exactly as specified:
[PASTE §5.3]

Hard constraints:
- Server Components by default; 'use client' only on the recorder, camera input,
  cart and filter components.
- Artisan capture route must ship ≤ 120 KB gzipped JS. Verify with
  @next/bundle-analyzer and report the number.
- Minimum tap target 56px, minimum body text 18px, contrast >= 7:1 on all
  artisan screens. Every icon has a visible text label.
- No step in the capture flow may require typing.
- Photo compression happens client-side before upload (max 1600px, ~250KB).
- The capture state machine persists to IndexedDB on every transition.
- Offline: service worker caches the shell and /studio/capture; captures queue
  in IndexedDB with a clientTempId and flush to /api/sync/batch on reconnect,
  with a visible "N waiting to upload" badge.

Then build the public product detail page with the voice-provenance player
described in [PASTE §5.5].
```

---

## 6. AI SERVICES DRD

### 6.1 Provider strategy — and why this wins points

| Stage | Primary | Fallback | Cost |
|---|---|---|---|
| ASR (Indic) | **Bhashini ASR** (govt, MeitY) | Sarvam AI Saarika, or Groq `whisper-large-v3` | free tiers |
| Translation | **Bhashini NMT** | Google Translate free tier / LLM | free |
| Structuring | **Gemini 2.0/2.5 Flash** free tier | Groq `llama-3.3-70b` | free |
| TTS (notifications, read-aloud) | **Bhashini TTS** | Web Speech API `speechSynthesis` | free / on-device |

**Lead with Bhashini in the pitch.** Your deck already cites it. A team that actually integrates the Government of India's own language stack, rather than shipping an OpenAI wrapper, is demonstrably building for the Indian public-digital-infrastructure ecosystem. That's a judging criterion in everything but name. Keep Groq/Gemini behind an interface as the reliability fallback, and *say* that you did — "government stack primary, commercial fallback for uptime" is a mature answer.

### 6.2 Adapter interface

```ts
// src/server/ai/types.ts
export interface ASRProvider {
  name: string;
  transcribe(input: {
    audio: Buffer; mimeType: string; localeHint?: string;
  }): Promise<{ text: string; locale: string; confidence: number }>;
}

export interface TranslationProvider {
  name: string;
  translate(input: { text: string; from: string; to: string }): Promise<{ text: string }>;
}

export interface ListingGenerator {
  name: string;
  generate(input: {
    transcript: string; locale: string; craftType: string;
    district: string; photoCount: number;
  }): Promise<ListingDraft>;
}
```
Every provider wrapped in `withTimeout(ms)` and `withFallback(primary, secondary)`. This is ~40 lines and it is what stops your demo dying on stage when a government API rate-limits you.

### 6.3 The structuring prompt (use close to verbatim)

```
SYSTEM:
You write e-commerce product listings for Indian handicraft artisans.
The input is a raw voice transcript from an artisan speaking about their own
work, often in a regional language, often rambling or incomplete.

Rules:
- NEVER invent facts. If the artisan did not say the material, dimensions or
  the time taken, leave that field null and add a note to confidence_notes.
- Preserve craft-specific and regional terms (e.g. "Warli", "dhokra", "bandhani",
  "ajrakh"). Do not translate them into generic English.
- Write in the artisan's own register — warm and first-person where natural.
  Do not produce marketing hype, superlatives, or "elevate your space" language.
- Price band: infer ONLY from stated materials, technique and effort, plus the
  given craft type and district norms. Return a wide band, not a point estimate.
- Output STRICT JSON matching the schema. No markdown, no prose, no code fences.

USER:
craft_type: {{craft}}
district: {{district}}
locale: {{locale}}
photo_count: {{n}}
transcript: """{{transcript}}"""

Return:
{
  "title":            { "en": string, "{{locale}}": string },
  "description":      { "en": string, "{{locale}}": string },   // 60-110 words
  "materials":        string[] | [],
  "craft_technique":  string | null,
  "dimensions":       string | null,
  "tags":             string[],                                  // 5-8, lowercase
  "price_min_inr":    number,
  "price_max_inr":    number,
  "confidence_notes": string[]   // what the artisan did NOT specify
}
```

The `confidence_notes` field is the detail that separates a serious build from a demo. Surface it in the review screen as: *"You didn't mention the size — want to add it?"* with a mic button next to it. That's a feedback loop, and it's a slide.

### 6.4 Guardrails
- Max transcript 3,000 chars.
- Reject/flag output where `price_max > 8 × price_min` (model confusion).
- Strip any URL, phone number or email the model emits.
- Always store the raw transcript alongside the generated text — provenance, and it makes `artisan_edited` a measurable metric ("artisans accepted the AI draft unedited 71% of the time").

---

### BUILD PROMPT — AI

```
Implement src/server/ai/ for KALA-SANGAM.

Create adapters behind these interfaces: [PASTE §6.2]

Providers:
  ASR:        BhashiniASR (primary), GroqWhisperASR (fallback)
  Translate:  BhashiniNMT (primary), GeminiTranslate (fallback)
  Listing:    GeminiFlashGenerator (primary), GroqLlamaGenerator (fallback)
  TTS:        BhashiniTTS (primary), WebSpeech (client-side fallback)

Also implement:
- withTimeout(fn, ms) and withFallback(primary, secondary) composable helpers
- a zod schema for ListingDraft, and parse the LLM output through it; on parse
  failure, retry ONCE with a repair prompt, then fall back to a template draft
  built from the raw transcript
- the structuring prompt exactly as given: [PASTE §6.3]
- guardrails: [PASTE §6.4]

Write vitest tests with mocked providers covering: ASR timeout, malformed LLM
JSON, and the price-band sanity check.
```

---

## 7. UI / DESIGN SYSTEM DRD

### 7.1 Direction

Not another marketplace template. The visual language should read as **handmade, earthen, Indian-craft-adjacent — but restrained.** The mistake every team makes is dumping Rajasthani pattern borders on everything. Use *one* craft motif, small, as a texture — and let whitespace and photography carry it.

### 7.2 Tokens

```css
:root {
  /* Earth palette — from natural dyes */
  --terracotta:   #C05A34;   /* primary action */
  --terracotta-d: #9A4526;
  --indigo:       #2B3A67;   /* B2B surfaces, headers */
  --haldi:        #E3A008;   /* highlights, AI badges */
  --ivory:        #FBF8F3;   /* page background */
  --charcoal:     #22201D;   /* body text */
  --sage:         #6B7F5C;   /* success, verified, online */
  --clay-border:  #E4DACE;

  --radius: 14px;
  --shadow-card: 0 1px 2px rgba(34,32,29,.05), 0 8px 24px rgba(34,32,29,.06);
}
```
Dark mode: keep it, but the artisan flow stays light — high-contrast dark text on ivory is more legible in sunlight on a cheap LCD, which is the actual use context.

### 7.3 Typography
- Headings: **Fraunces** or **Bricolage Grotesque** (character without costume).
- Body + all Devanagari: **Noto Sans / Noto Sans Devanagari** — non-negotiable, it is the only stack that renders every Indic script you claim to support. Nothing looks worse in a demo than tofu boxes in the Marathi toggle.
- Artisan flow: body 18px/1.6, actions 20px semibold.

### 7.4 Component notes
- **ProductCard** — photo 4:5, craft chip, artisan name + district, price, and a small 🔊 badge if a voice clip exists. Make the voice badge visually distinctive; it's your brand.
- **AIBadge** — subtle haldi-tinted pill with ✨, on every AI-generated field. *Always disclose what the machine wrote.* Trust is the whole thesis.
- **VoicePlayer** — waveform, play/pause, speed, and the language toggle. Give it real design love; it's the hero component.
- **MicButton** — 96px circle, terracotta, press-and-hold with a haptic-feel scale animation and a live amplitude ring.
- **OfflineChip** — fixed bottom-left, sage when online, haldi when queued.
- **StatusTimeline** — the 4-stage AI processing list from §5.3.

### 7.5 Anti-patterns (also applies to your slides)
- No decorative accent bars under headings.
- No stock "diverse team smiling at laptop" photography — use real craft photography (Wikimedia Commons, Unsplash, or photograph objects yourself).
- No purple/blue SaaS gradient. It signals "generic AI project" and judges have seen forty of them by lunch.
- No loading spinners where a labelled progress list will do.

---

### BUILD PROMPT — UI

```
Create the KALA-SANGAM design system in the Next.js project.

1. Write src/app/globals.css with these CSS custom properties: [PASTE §7.2]
   and wire them into tailwind.config.ts as semantic colour names
   (terracotta, indigo, haldi, ivory, charcoal, sage, clay-border).
2. Load Fraunces (headings) and Noto Sans + Noto Sans Devanagari (body/Indic)
   via next/font. All Devanagari and Indic text must use the Noto stack.
3. Build these components with shadcn/ui primitives, in src/components/:
   ProductCard, AIBadge, VoicePlayer, MicButton, OfflineChip, StatusTimeline,
   LanguageToggle, PriceBandSlider.
   Specs: [PASTE §7.4]
4. Build a /styleguide route rendering every component in every state
   (loading, empty, error, populated) for visual QA.

Constraints:
- No accent bars or decorative stripes under headings.
- No blue/purple gradients anywhere.
- Artisan-facing surfaces: 18px minimum body text, 56px minimum tap targets,
  contrast >= 7:1, every icon paired with a visible text label.
- Light theme only on the artisan capture flow.
```

---

## 8. Build order (36–48 hours, two to four people)

| Block | Hours | Work |
|---|---|---|
| 0 | 0–2 | Repo, Next.js + Tailwind + shadcn, Supabase project, deploy a hello-world to Vercel **on hour one**. Deploy early, deploy always. |
| 1 | 2–5 | Schema + seed (§3). Get 30 real-looking products in the DB before any UI exists. |
| 2 | 5–9 | Design tokens + components + /styleguide (§7). |
| 3 | 9–16 | **Capture flow end to end with a MOCKED AI** that returns a canned draft after 3s. The full journey must work before any model is called. |
| 4 | 16–22 | Real AI pipeline (§6). Swap the mock out behind the same interface. |
| 5 | 22–27 | Marketplace + product detail + voice player + cart + mock checkout. |
| 6 | 27–31 | B2B portal + RFQ + artisan order dashboard + TTS notification. |
| 7 | 31–35 | Offline/PWA queue + sync demo. |
| 8 | 35–40 | Seed the demo, rehearse, fix the three things that break, record a backup video. |
| 9 | 40–44 | Lighthouse, a11y pass, README, architecture diagram, slide updates. |

**Parallelisation:** person A = backend + AI, person B = capture flow, person C = marketplace + B2B, person D = design system + seed data + deck. Agree the API contract (§4.2) in hour two and never renegotiate it verbally — change the file.

---

## 9. Demo script (6 minutes — rehearse it ten times)

1. **[0:00]** *"Meet Sunil. Warli painter, Palghar district. He has a ₹6,000 phone and no reliable internet."* Open the site on an actual budget phone if you can borrow one.
2. **[0:40]** Switch to Marathi. Photograph a real object you brought into the room.
3. **[1:10]** Hold the mic. **Speak in Marathi or Hindi, live.** Do not play a recording. The room will go quiet.
4. **[1:40]** Show the 4-stage processing list. Narrate what each stage is doing.
5. **[2:10]** The draft appears. Point at the ✨ badges: *"Everything the AI wrote is labelled. Sunil edits the price band — the machine advises, the artisan decides."* Publish.
6. **[2:50]** Switch to the buyer view. Open the product. **Press play on Sunil's actual voice.** Toggle to English. *"This is provenance no marketplace in India offers."*
7. **[3:40]** B2B buyer places a 40-unit bulk order.
8. **[4:00]** Back to the artisan phone — the order arrives and the phone **speaks**: *"तुम्हाला ४० नगांची नवीन ऑर्डर आली आहे."*
9. **[4:30]** Airplane mode on. Record another product. Show it queued. Wifi back on. Watch it sync.
10. **[5:10]** Lighthouse score, then the architecture slide, then Bhashini. *"Built on the government's own language stack."*
11. **[5:40]** *"What's real, what's mocked"* — say it yourself before they ask. This buys you enormous credibility.

**Bring:** the laptop, a real budget Android, a mobile hotspot (never trust venue wifi), a physical handicraft object, and a recorded backup video of the full flow.

---

## 10. Slide-deck improvements (small, surgical — the deck structure stays)

You said you don't want to rewrite the deck. Good — the structure is fine and it follows the template. These are edits inside the existing slides.

### Slide 1 — Title
- Fill in the **Team ID**. It's blank right now. Judges notice.
- Add a two-line positioning statement under the title: *"Voice-first. Web-first. Works on a ₹6,000 phone, on 2G, offline."* Right now the title slide says nothing a hundred other decks don't.

### Slide 2 — Proposed solution / execution plan
- The two parallel flowcharts (Artisan / B2B Buyer) are text-heavy and the bullets duplicate them. **Cut the bullets down to four**, and let the flow diagram carry the process.
- Add one line that does not currently appear anywhere and should: **"Web-first PWA — no app install, works on any browser, offline capture."** This is a genuine differentiator and it's invisible in the current deck.
- Replace "AI Processing (Speech-to-Text + Translation)" with **"Bhashini ASR → NMT → AI listing draft"**. Naming the government stack in the flow, not just in references, is worth real credibility.

### Slide 3 — Technical approach
- This slide is the most overloaded. There are ~28 icons. **Cut it to three labelled columns: Capture → Intelligence → Market**, and delete at least a third of the icons. Density reads as noise, not rigour.
- Name actual technologies instead of categories: *Next.js · Supabase (Postgres + Storage) · Bhashini · Gemini Flash · Vercel.* Your own footnote already hedges this — but a named, defensible stack beats a hedged generic one every time.
- Add one small line: **"Offline-first: IndexedDB capture queue with idempotent sync."** Engineers on the panel will latch onto it.

### Slide 4 — Feasibility & viability
- Strongest slide already. Two edits:
  - Under Challenges → Network Connectivity, append the mitigation inline: *"→ solved by offline capture queue."* Pairing each challenge with its answer, on the same line, converts a risk list into a competence list.
  - Under Business Potential, add one concrete number: an addressable figure from your own ODOP reference (1,244 products across 773 districts). A single real number makes the whole slide land differently.

### Slide 5 — Impact & benefits
- This slide has four category headers (Social/Economic/Environmental/Technological) *and* a separate "Benefits" cluster *and* an "Anticipated Impact" list. It's three slides of content in one frame. **Cut the Environmental bullets** — "reduces travel to fairs" is the weakest claim on the page and invites a skeptical question.
- Add, in place of it, the one measurable: **"Listing time: ~45 minutes of typing and photography → under 90 seconds of speaking."** That's the whole product in one line and it's currently missing from the entire deck.

### Slide 6 — Research & references
- Fine as-is. One fix: the fourth link points at a news site, not the GeM–ODOP source it's labelled with. Swap in the primary gem.gov.in or PIB source — a judge who clicks it and lands on a trade-news aggregator will discount your other citations too.
- Delete the hedging note at the bottom once slide 3 names a real stack.

### Slide 7
- Delete before upload, as the template instructs. Export to PDF and check the Devanagari renders — embedded font failures on export are a classic silent disaster.

### Cross-deck
- The deck never shows **what the product looks like**. If you can fit even one small phone-frame screenshot of the capture screen onto slide 2 or 3, do it. A committee reading forty text decks will stop at the one with a real interface in it.
