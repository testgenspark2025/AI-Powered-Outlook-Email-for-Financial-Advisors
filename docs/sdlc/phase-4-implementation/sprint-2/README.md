# Sprint 2 — Compose & Sent Items

**Branch:** `develop`
**Status:** Complete
**Date:** 2026-05-25
**Phase:** 4 — Implementation

Sprint 2 adds the write side: compose, draft autosave, sending, and a
Sent Items view. No AI yet.

## What shipped

| Workstream | Outcome |
|---|---|
| Persistence | New `drafts` repo (`lib/db/repos/drafts.ts`) with a module-scoped mutable store. Holds both draft and sent records keyed by id. Repo exposes `create`, `update`, `get`, `list`, `listSent`, `delete`, and `sendDraft`. |
| REST API | `POST /api/v1/drafts` (create), `GET /api/v1/drafts` (list), `GET /api/v1/drafts/:id`, `PATCH /api/v1/drafts/:id` (autosave + manual save), `DELETE /api/v1/drafts/:id`. |
| REST API | `POST /api/v1/emails` (send): validates that the referenced draft is complete (`toAddress`, `subject`, `body` all non-empty), then transitions it to `status="sent"` and stamps `sentAt`. |
| REST API | `GET /api/v1/emails?folder=sent` returns sent drafts (segment filter still applies). |
| UI | New route `/compose` (server component) creates a draft on first hit and redirects to `/compose?draftId=...`; subsequent renders read the draft and mount the form. |
| UI | New client component `ComposeForm` with `to`, `subject`, `body`, an autosave-status indicator, Save / Send / Discard buttons. Autosave debounces dirty changes for 5 s and posts a `PATCH`. |
| UI | `Reply` ribbon button is enabled only when an inbox message is selected and links to `/compose?replyTo=<emailId>` — the compose page constructs a pre-filled draft (recipient, `RE: ` subject, quoted body) and redirects to that draft's id. |
| UI | `LeftRail` now navigates between folders (`?folder=inbox|drafts|sent|...`) with per-folder badge counts. |
| UI | New `DraftList` for the Drafts folder; clicking a row deep-links to `/compose?draftId=...`. |
| UI | `MessageList` was generalised to take a `MailRow[]` shape so the same list renders inbox emails and sent drafts. |
| UI | `ReadingPane` is now discriminated on `{kind: "email" | "sent" | "empty"}` and renders the appropriate header / body / client insights for each. |
| Tests | New Vitest suites: `drafts.test.ts` (8 cases — repo lifecycle, sort order, send-after-update guards) and `drafts-handlers.test.ts` (11 cases — happy path + 400/404 paths for every new endpoint plus the send → Sent Items flow). |

## Sprint 2 exit-gate checks

| Check | Result |
|---|---|
| `pnpm lint` | clean |
| `pnpm typecheck` | clean |
| `pnpm test:unit` | 50/50 across 6 suites |
| `pnpm build` | succeeds (15 routes + middleware) |
| Autosave PATCH fires after 5 s idle | yes (debounced in `ComposeForm`) |
| Sending an incomplete draft returns 400 | covered by handler test |
| Already-sent drafts cannot be re-sent or edited | covered by repo test |

## Stories closed

- US-2.1 — Compose a new email to a known client.
- US-2.2 — Save a draft automatically without losing work.
- US-2.3 — Reply to a client email with the conversation quoted.
- US-2.4 — See sent messages in a Sent Items folder.
- US-2.5 — Discard a draft before sending.

## What is *not* in Sprint 2

- AI draft generation and depth control (Sprint 3).
- Reply All, Forward (UI buttons present but disabled).
- Real persistence to D1. The drafts store is in-memory; state is lost
  on cold start. The repo API is shaped to make the swap to D1 a pure
  implementation change behind the same call sites.
- Pagination of the drafts or sent list (current count of seeded data
  fits one page comfortably).
- Conflict detection for two tabs editing the same draft (single-user
  prototype).

## Carry-over to Sprint 3

1. Wire `@cloudflare/next-on-pages` + the D1 binding so drafts and
   sent messages persist (still carried from Sprint 0).
2. AI draft replies via the existing `LlmProvider` interface — surface
   a "Draft with AI" button in the ribbon with the depth selector.
3. SSE-stream the generated draft into the compose body.
4. Promptfoo evals for the mock and Azure providers.

## How to verify locally

```bash
cd app
SESSION_SECRET=dev-session-secret-32-bytes-minimum-required \
SHARED_PASSWORD=dev pnpm dev
```

1. Sign in, then click **+ New Email** in the ribbon. You land on
   `/compose?draftId=df_...`.
2. Type something. After ~5 s of inactivity the status line shows
   "Saving…" then "Saved at …".
3. Hit **Send** — without `To`, you stay on the page and the status
   shows a 400. Fill in `To`, `Subject`, and a body, then click
   **Send**: you are redirected to `/?folder=sent` and the message
   appears at the top of the Sent Items list.
4. Open any inbox message and click **Reply** — a pre-filled draft is
   created and you can edit before sending.
5. Click **Drafts** in the left rail to see drafts in progress; click
   any row to resume editing.

```bash
# Smoke-test the API:
SID=$(curl -s -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:3000/api/v1/drafts -b "fa_session=…" | jq -r .id)
curl -s -X PATCH -H 'Content-Type: application/json' \
  -d '{"toAddress":"a@b.com","subject":"Hi","body":"There"}' \
  http://localhost:3000/api/v1/drafts/$SID -b "fa_session=…"
curl -s -X POST -H 'Content-Type: application/json' \
  -d "{\"draftId\":\"$SID\"}" http://localhost:3000/api/v1/emails -b "fa_session=…"
curl -s http://localhost:3000/api/v1/emails?folder=sent -b "fa_session=…" | jq '.items[].subject'
```
