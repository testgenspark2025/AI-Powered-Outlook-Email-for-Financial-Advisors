# app/

Next.js 15 application (App Router) for the Financial Advisor Outlook
prototype. See `docs/sdlc/` at the repo root for the full design pack.

## Sprint 0 status

This is the Phase 4, Sprint 0 foundation. Implemented:

- Next.js + TypeScript + Tailwind project scaffold (pnpm, ADR-010).
- Drizzle schema for D1 with all 10 tables from
  `docs/sdlc/phase-3-design/data/erd.md`.
- Shared-password auth (ADR-007): HMAC-signed cookie, middleware,
  `/login` page, `/api/v1/auth/login` and `/api/v1/auth/logout`.
- LLM gateway abstraction (`src/lib/ai/`) with a deterministic mock
  provider and a not-yet-implemented Azure provider stub.
- REST endpoints: `GET /api/v1/health`, `POST /api/v1/ai/draft-reply`
  (SSE streaming demo using the mock provider).
- Vitest unit tests for session HMAC and the mock provider.
- GitHub Actions CI: lint, typecheck, unit, build.

## Not yet implemented

Inbox, compose, summarization, follow-ups, sent items, drafts, the
Azure provider, D1 wiring at runtime, and seed loading. These land in
Sprint 1-6 (see `docs/sdlc/phase-2-planning/sprint-plan.md`).

## Local development

```bash
cd app
cp .env.local.example .env.local       # fill in SESSION_SECRET + SHARED_PASSWORD
pnpm install
pnpm dev
```

Generate a session secret with `openssl rand -hex 32`.

## Useful commands

```bash
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm test:unit      # vitest run
pnpm build          # next build
pnpm db:generate    # drizzle-kit generate migrations
```

## Layout

```
app/
  src/
    app/                 # Next.js routes (UI + REST API under /api/v1)
    lib/
      auth/              # session HMAC + cookies
      ai/                # gateway, providers (mock, azure stub), types
      db/                # Drizzle schema, seeds (segments)
      api/               # problem details helpers
    styles/              # globals.css (Tailwind)
    middleware.ts        # auth gate
  tests/unit/            # Vitest tests
```

## Conventions

- Module aliases: `@/lib/...`, `@/styles/...` map to `app/src/...`.
- All routes use the Edge runtime.
- All API responses for errors use RFC 7807 Problem Details.
- See `docs/sdlc/phase-3-design/api/conventions.md` for the API contract.
