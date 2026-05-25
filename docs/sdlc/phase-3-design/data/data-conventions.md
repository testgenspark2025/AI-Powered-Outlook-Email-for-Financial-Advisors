# Data Conventions

**Phase:** 3 — Design (Data)
**Status:** Approved
**Date:** 2026-05-24

Companion to [erd.md](./erd.md). These conventions apply to schema,
queries, and migrations.

## IDs

- Primary keys are **UUIDv7** strings except for `segments` (small,
  stable integer enum) and `settings` (singleton `"singleton"`).
- UUIDv7 chosen for time-ordering benefits (paginate by `id` ≈
  paginate by creation time).

## Timestamps

- All timestamps are TEXT in **ISO 8601 UTC** form
  (`2026-05-24T18:00:00.000Z`).
- No D1 native datetime; ISO strings sort correctly lexicographically.
- All writes go through a helper `nowIso()`; no `new Date().toISOString()`
  scattered in repos.

## Money

- Store integer **cents** in `*_cents` columns.
- Keep the human label (`*_label`) for display fidelity from seed data
  (e.g., `"$72.3M"`).
- Never compute totals at MVP scale; trust denormalised label.

## Booleans

- D1 SQLite has no native boolean. Use `INTEGER` with `0` / `1`.
- Drizzle column helper wraps this and exposes JS `boolean`.

## Enums

- Stored as TEXT, validated at the boundary with Zod.
- Reference table (`enums.md` if needed) is not maintained in the DB at
  MVP scale; enums live in TS.

| Enum | Values |
|---|---|
| `folder` | `inbox` `junk` `archive` `deleted` `sent` `drafts` |
| `draft.kind` | `reply` `reply_all` `forward` `new` |
| `draft.status` | `open` `sent` `discarded` |
| `follow_up.action_type` | `schedule_meeting` `send_brief` `reminder` |
| `follow_up.status` | `open` `done` `snoozed` |
| `ai_calls.operation` | `draft_reply` `draft_new` `summarize` `suggest_follow_ups` |
| `ai_calls.outcome` | `success` `error` |
| `depth` | `light` `medium` `deep` |

## Soft delete vs hard delete

- Drafts: hard delete on Discard; row gone from D1.
- Sent items: never deleted.
- Follow-ups: status flip to `done`; row remains.
- Emails: `folder = 'deleted'` (soft); a periodic cron in a later phase
  could prune. Out of scope now.

## Pagination

- Default page size 50.
- Cursor-based using `id` (UUIDv7 is monotonic enough).
- API contract: `?cursor=<id>&limit=<n>`; response includes
  `nextCursor` if more rows exist.

## Indexes

Listed per table in `erd.md`. Rule of thumb: index every column used in
a `WHERE` filter at MVP traffic; revisit if scale demands.

## Full-text search

- D1 supports SQLite FTS5 (`virtual table`).
- A `emails_fts` virtual table mirrors `subject`, `body`, `from_email`,
  `preview`.
- Search API joins FTS hits with `clients` to surface client names too.
- Reindex via trigger or batch on seed.

## Constraints

- Foreign keys ON.
- All FK columns indexed.
- `NOT NULL` enforced wherever the column is required by business logic.

## JSON columns

- `segments.characteristics` and `segments.challenges` are TEXT
  containing JSON arrays.
- Validated with Zod on read; never queried server-side.
- Avoid JSON columns elsewhere unless the alternative is too painful.

## Seed data

- Lives in `app/lib/db/seed/`. Three modules:
  - `segments.seed.ts` — the 10 segments from the prototype.
  - `clients.seed.ts` — 5 handcrafted clients, households, members.
  - `emails.seed.ts` — at least 1 email per client; 1-2 long-form emails
    to exercise summarization (R-002).
- Seed is idempotent: it computes whether rows exist by natural keys
  (segment name, client email) before inserting.

## Backups (prototype scope)

- D1 daily snapshot via Wrangler script as a chore (manual cron is fine
  at MVP scale).
- Migrations are versioned in Git so the schema is reproducible from
  zero.

## What's intentionally absent

- No audit log of mutations beyond `ai_calls`. The prototype is
  single-user; revisit at V1.
- No row-level security; single-user app.
- No tenants. Adding a `tenant_id` column on every table is reserved
  for V2.
