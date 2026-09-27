# KALA-SANGAM System Context & Non-Negotiable Boundaries

## Non-Negotiable Rules
- Strict adherence to `/docs/DRD.md`.
- All client/server types must come directly from database types or Zod schemas.
- Route handlers must NOT exceed 25 lines. Repositories handle database calls.
- Money is ALWAYS integer paise. Never float.
- Never write mock/placeholder code unless explicitly marked as staged.

## Architecture Layering
- `src/app/api/**` — HTTP boundary only. Parse, authorize, call service, map errors (max 25 lines per handler).
- `src/server/services/**` — Business logic. Pure-ish, testable, no Request/Response objects.
- `src/server/repos/**` — The ONLY place that touches Supabase/SQL.
- `src/server/ai/**` — Provider adapters behind interfaces.
- `src/lib/` — Shared validation schemas (zod), constants, utils.

## AI Pipeline & Offline First
- A failed model call must NEVER delete or block the artisan's upload.
- POST `/api/products/:id/voice` returns in < 400ms.
- Every AI stage has timeouts and graceful fallbacks.
- Offline capture queue with idempotent batch sync on reconnect.
- No AI keys in any `NEXT_PUBLIC_` variables.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
