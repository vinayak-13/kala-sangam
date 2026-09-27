# 🇮🇳 KALA-SANGAM (कला संगम)
### *Voice-First Multilingual Artisan Marketplace & Digital Studio*

[![Next.js](https://img.shields.io/badge/Next.js-15.3+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Bhashini AI](https://img.shields.io/badge/Bhashini_AI-22+_Languages-FF9933?style=for-the-badge)](https://bhashini.gov.in/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-brightgreen?style=for-the-badge&logo=vitest)](https://vitest.dev/)

---

## 🌟 Overview

**KALA-SANGAM (कला संगम)** is a Next-Gen, voice-first e-commerce and cataloging platform engineered for India's traditional artisans and craftspersons. It bridges the digital literacy barrier by allowing artisans to list authentic handcrafted products, record craft stories in **22+ Scheduled Indian Languages**, and publish directly to an **Instagram-style creator storefront**.

Powered by Government of India's **Bhashini AI (ASR, NMT & TTS)** stack, multimodal computer vision, and offline-first edge architecture, KALA-SANGAM automates bilingual translation, provenance verification, fair-price estimation, and direct-to-buyer transactions.

---

## ✨ Key Features

### 🎙️ 1. 5-Step Artisan Capture Studio (`/studio/capture`)
- **Step 1: 22+ Native Language Selection**: Choose from 22+ Scheduled Indian Languages with native audio previews (Marathi, Hindi, Bengali, Telugu, Tamil, Kannada, Gujarati, Punjabi, Odia, etc.).
- **Step 2: 3-Option Media Studio**:
  1. 📹 **Video Camera**: Launches device camera in video mode (`capture="environment"`) to record live crafting videos.
  2. 📸 **Live In-Browser Camera**: Snaps photos directly inside the browser using interactive AR guides and live preview.
  3. 📁 **Device File Upload**: Uploads existing high-resolution photos and reels from device storage.
- **Step 3: Dual-Language Voice Guiding Prompts**: Interactive voice prompts guide artisans on what to say (materials, process, story) with 1-tap play/stop controls in their native tongue.
- **Step 4: Theatrical AI Processing**: Real-time multi-stage pipeline status visualization (Voice ASR → Multilingual Translation → Visual Craft Extraction → Fair Price Suggestion).
- **Step 5: Description Verification & Review**: Side-by-side bilingual editor (Native Language & Export English) with spoken audio verification, materials tagging, dimension estimation, stock quantity, and B2B wholesale MOQ settings.

### 📱 2. Instagram-Style Artisan Storefront & Profile (`/studio/[handle]`)
- **Visual Creator Profile**: Master Artisan badge, ODOP & GI verification, bio audio clip in 22+ languages, rating, and direct 1-tap WhatsApp connect.
- **Reels & Catalog Tabs**: 9:16 vertical video reel player with live voice narration and a 3-column product catalog.
- **✏️ Quick-Edit Price & Stock Quantity**: Real-time modal allowing artisans to update prices (₹) and available stock units directly from their profile grid with instant local storage persistence.

### 🛡️ 3. Robust AI Fallback & Offline Resilience
- Every AI stage has timeouts and graceful fallbacks; model failures never block or drop an artisan's upload.
- Full offline capture queue with IndexedDB persistence (`idb-keyval`).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling & Aesthetics** | Tailwind CSS v4, Lucide React, Terracotta / Sandalwood Heritage Color Palette |
| **Voice & Speech AI** | MeitY Bhashini AI Stack (ASR, NMT, TTS) + Web Speech Synthesis fallback |
| **State & Offline Storage** | IndexedDB (`idb-keyval`), LocalStorage, React Hooks (`useReducer`) |
| **Testing** | Vitest 5.0 (Unit, Integration & Resilience Pipelines) |
| **Database & Auth** | Supabase JS Client & Edge API Route Handlers |

```
src/
├── app/
│   ├── (artisan)/
│   │   ├── studio/
│   │   │   ├── [handle]/page.tsx      # Instagram-style creator profile & reels
│   │   │   ├── capture/page.tsx       # 5-step voice-first product capture studio
│   │   │   └── onboarding/page.tsx    # 30-second artisan onboarding
│   │   └── profile/
│   ├── api/products/                  # Lightweight API boundaries (< 25 lines)
│   └── page.tsx                       # Landing page & marketplace explorer
├── components/
│   ├── capture/GuidedCamera.tsx       # In-browser live camera with AR guide
│   ├── mobile/MobileMediaPicker.tsx   # 3-option media studio component
│   ├── profile/ArtisanInstagramFeed.tsx # Posts/Reels feed & Price/Stock editor
│   ├── profile/ArtisanProfileView.tsx # Full bilingual artisan profile view
│   ├── MicButton.tsx                  # 96px pulsating recording button
│   ├── PriceBandSlider.tsx            # Fair pricing & DBT calculator slider
│   └── StatusTimeline.tsx             # AI processing status stepper
├── lib/
│   ├── audio-utils.ts                 # Audio synthesizer, Tanpura chimes & stop controls
│   └── i18n/indic-languages.ts        # 22+ Indic languages dictionary & voice scripts
└── server/
    ├── ai/bhashini.ts                 # Bhashini ASR/NMT/TTS API integrations
    └── repos/product-repo.ts          # Database abstractions
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18.0 or higher
- **npm**: v9.0.0 or higher

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/kala-sangam.git

# Navigate to project directory
cd kala-sangam

# Install dependencies
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and add your Bhashini API keys (optional in development mode with built-in fallbacks):

```bash
cp .env.example .env.local
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the comprehensive Vitest test suite:

```bash
# Run unit & pipeline resilience tests
npm test

# Run TypeScript type check
npx tsc --noEmit
```

---

## 🌐 Key Routes

- **Studio Home**: `/studio`
- **Product Capture Studio**: `/studio/capture`
- **Artisan Creator Storefront**: `/studio/sunil_warli_palghar`
- **Marketplace Explore**: `/explore`
- **Onboarding**: `/studio/onboarding`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
