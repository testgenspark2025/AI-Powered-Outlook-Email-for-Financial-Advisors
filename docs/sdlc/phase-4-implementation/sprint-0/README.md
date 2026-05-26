# Sprint 0 — Foundation

**Branch:** `develop` (per ADR-001)
**Status:** Complete
**Date:** 2026-05-24
**Phase:** 4 — Implementation

Sprint 0 establishes the new application skeleton on `develop` without
disturbing the prototype on `main`. See
[sprint-plan.md](../../phase-2-planning/sprint-plan.md) for the full
Sprint 0 goals.

## What shipped

| Workstream | Outcome |
|---|---|
| Repo | `app/` directory: Next.js 15 + TypeScript + Tailwind, pnpm, ESLint flat config, Vitest. |
| Auth (ADR-007) | HMAC-signed cookie helpers (`lib/auth/session.ts`), middleware that redirects unauthenticated requests to `/login`, login page, and `POST /api/v1/auth/login` + `POST /api/v1/auth/logout`. |
| Persistence (ADR-004) | Drizzle schema for all 10 tables from the Phase 3 ERD (`lib/db/schema.ts`). Drizzle Kit config. Segment seed data ported from the prototype. |
| AI gateway (ADR-005) | `LlmProvider` interface (`lib/ai/types.ts`), a deterministic `MockProvider` covering draftReply / draftNew / summarize / suggestFollowUps, and an `AzureProvider` stub that throws until Sprint 5. Resolver in `lib/ai/gateway.ts` chooses by `LLM_PROVIDER` env var. |
| REST API (ADR-011) | `GET /api/v1/health`, `POST /api/v1/ai/draft-reply` SSE demo, both on the Edge runtime. Problem Details helpers in `lib/api/problems.ts`. |
| UI | Minimal `app/layout.tsx`, home page placeholder, and `/login` page (client component) that posts to the login route and redirects. |
| Tests | 11 Vitest unit tests across session HMAC and the mock provider. |
| CI | `.github/workflows/ci.yml` runs install, lint, typecheck, unit tests, and build on PRs and pushes to `main` / `develop`. |

## Sprint 0 exit gate checks

| Check | Result |
|---|---|
| `pnpm install` | OK |
| `pnpm lint` | clean |
| `pnpm typecheck` | clean |
| `pnpm test:unit` | 11/11 passing |
| `pnpm build` | succeeds (7 routes built; middleware compiles) |
| Login gate blocks unauthenticated requests | yes (middleware verified by inspection) |

## What is *not* in Sprint 0

Per the sprint plan and ADR-005, the following are deliberately deferred:

- D1 binding at runtime and seed loading.
- Real Azure OpenAI calls (provider stub throws).
- Inbox, reading pane, compose, summarisation UI, follow-ups, sent
  items, drafts views, settings page.
- E2E tests (Playwright) and prompt evals (Promptfoo).
- `@cloudflare/next-on-pages` adapter wiring (a Sprint 0 spike topic;
  not blocking).

## Open items for Sprint 1

- Wire `@cloudflare/next-on-pages` and the D1 binding into local dev.
- Validate SSE streaming on Cloudflare Workers (R-005, R-006 in the
  risk register).
- Generate and commit the first migration via Drizzle Kit.
- Seed the 10 segments and 5 handcrafted clients (Phase 1 P-1).
- Build the three-pane Outlook shell from W2 in the wireframes.

## How to verify locally

```bash
cd app
cp .env.local.example .env.local       # set SESSION_SECRET and SHARED_PASSWORD
pnpm install
pnpm lint && pnpm typecheck && pnpm test:unit
SESSION_SECRET=dev SHARED_PASSWORD=dev pnpm dev
```

Visit http://localhost:3000 — you should be redirected to `/login`.
After entering the password set in `.env.local`, the home placeholder
renders.

Test the streaming endpoint (mock provider) from the placeholder app
once you are logged in:

```bash
curl -N http://localhost:3000/api/v1/ai/draft-reply \
  -H 'Content-Type: application/json' \
  -b "fa_session=<copy from browser>" \
  -d '{"emailId":"demo","depth":"medium"}'
```
