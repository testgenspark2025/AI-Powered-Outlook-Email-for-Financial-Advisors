# Sprint 1 — Inbox & Reading

**Branch:** `develop`
**Status:** Complete
**Date:** 2026-05-25
**Phase:** 4 — Implementation

Sprint 1 turns the foundation into a working Outlook-style inbox with
seeded data. No AI yet — that arrives in Sprint 3 (draft) and Sprint 4
(summarise / follow-ups).

## What shipped

| Workstream | Outcome |
|---|---|
| Data | 5 handcrafted clients (Sterling, Park, Martinez, O'Brien, Chen) spanning segments 1, 2, 3, 5, 6. Households with members, ages, occupations, and asset labels. |
| Data | 5 seeded inbound emails (one per client). Subjects map to Phase 1 user stories (Q4 review, RSU vesting, partnership offer, retirement planning, first home). |
| Persistence | Repos `lib/db/repos/{segments,clients,emails}.ts` are thin in-memory facades over the seeds. Call shapes are stable; we swap to D1 reads behind the same interface in a later sprint. |
| API | New REST endpoints, all Edge runtime: `GET /api/v1/segments`, `GET /api/v1/clients`, `GET /api/v1/clients/:id`, `GET /api/v1/emails`, `GET /api/v1/emails/:id`. `segmentId` / `folder` query params validated. |
| UI | Three-pane Outlook layout in `app/page.tsx` (server component): `RibbonBar` (top), `LeftRail` (folders + segments), `MessageList` (middle), `ReadingPane` (right). |
| UI | `ClientInsightsCard` shows segment, risk profile, household composition, and per-member assets in the reading pane. |
| UI | `ThemeToggle` writes `localStorage` and toggles `html.dark` (FR-SET-1). |
| UI | `MessageList` supports `ArrowDown` / `ArrowUp` / `Enter` keyboard navigation (FR-INB-4, US-1.3). Selection state lives in the URL (`?id=...`). |
| Tests | New Vitest suites: `repos.test.ts` (10 cases) and `handlers.test.ts` (10 cases). |
| CI | Existing `ci.yml` runs lint, typecheck, tests, build on `develop`. |

## Sprint 1 exit-gate checks

| Check | Result |
|---|---|
| `pnpm lint` | clean |
| `pnpm typecheck` | clean |
| `pnpm test:unit` | 31/31 passing (4 suites) |
| `pnpm build` | succeeds (12 routes + middleware) |
| Keyboard nav (Arrow/Enter) | wired via `window` listener in `MessageList` |
| Theme toggle | persists in `localStorage`, applies `html.dark` |
| Login gate still blocks anonymous traffic | yes — `middleware.ts` unchanged |

## Stories closed

- US-1.1 — Read an inbound email from a known client.
- US-1.2 — Filter inbox by client segment.
- US-1.3 — Navigate the message list with the keyboard.
- US-6.1 — Switch between light and dark themes.

Partial against:

- US-1.4 — Folder switching is rendered but only `Inbox` is wired this sprint.

## What is *not* in Sprint 1

- Compose / draft autosave / Sent Items (Sprint 2).
- AI draft replies and depth control (Sprint 3).
- Summarisation and follow-ups (Sprint 4).
- Pagination of message list (deferred; 5 seeded items fit one page).
- E2E flow tests (Playwright). The plan's "E2E for open and read" is
  carried into Sprint 5 alongside the Azure cutover; for Sprint 1 we
  exercise the route handlers directly with Vitest as integration
  tests.
- Real D1 binding at runtime. Repos remain in-memory facades pending
  the `next-on-pages` + Wrangler spike (carry-over from Sprint 0).

## Carry-over to Sprint 2

1. Wire `@cloudflare/next-on-pages` and the D1 binding into local dev.
2. Generate the first Drizzle migration and seed the local database.
3. Build the Outlook compose shell (W3 from the wireframes) and
   `/api/v1/drafts` endpoints (POST, PATCH, DELETE).
4. Sent Items folder backed by the existing `email_messages` schema.

## How to verify locally

```bash
cd app
cp .env.local.example .env.local       # set SESSION_SECRET and SHARED_PASSWORD
pnpm install
pnpm lint && pnpm typecheck && pnpm test:unit
SESSION_SECRET=dev SHARED_PASSWORD=dev pnpm dev
```

1. Visit http://localhost:3000 — you should be redirected to `/login`.
2. Enter the shared password.
3. The inbox renders with five messages; the first email is auto-selected.
4. Click another row, or press `ArrowDown` / `ArrowUp` / `Enter`.
5. The right panel shows household, risk profile, and per-member assets.
6. Click a segment in the left rail to filter the list; the URL
   updates with `?segmentId=...`.
7. Toggle the moon/sun button in the ribbon — the entire UI flips to
   dark mode and persists across reloads.

```bash
curl -s -b "fa_session=<copy from browser>" \
  http://localhost:3000/api/v1/clients | jq '.items | length'    # → 5

curl -s -b "fa_session=<copy from browser>" \
  http://localhost:3000/api/v1/emails?segmentId=6 | jq '.items[].subject'
```
