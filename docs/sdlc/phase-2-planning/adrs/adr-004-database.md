# ADR-004: Cloudflare D1 with Drizzle ORM

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Engineering lead
- **Phase:** 2 — Analysis & Planning

## Context

Phase 1 decision P-4 locked Cloudflare D1 (SQLite on the edge) as the
persistence layer. We still need to decide how the application code talks
to D1: raw SQL, a query builder, or an ORM. We also need a migration
strategy.

The data is modest: clients, households, members, emails, drafts, sent
items, follow-ups, settings, AI call logs. Joins are simple. Everything
fits comfortably in SQLite.

## Decision

We will use **Drizzle ORM** with the D1 driver, and **Drizzle Kit** for
migrations. Schema lives in `app/lib/db/schema.ts`. Migrations are
generated SQL files committed under `app/lib/db/migrations/` and applied
via Wrangler during deploy.

Conventions:

- All DB access goes through repository functions in
  `app/lib/db/repos/*.ts`. No raw Drizzle calls in React components or
  Route Handlers.
- All timestamps stored as ISO 8601 strings; D1 SQLite has no native
  timestamp type.
- All IDs are UUIDv7 strings unless they reference an external system.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Raw SQL via D1 binding | No abstraction; smallest bundle | Lose types; hand-maintained migrations; tedious | Rejected |
| Kysely (query builder) | Strong types, no ORM overhead | Migration story weaker than Drizzle Kit | Close second; Drizzle's migration ergonomics won |
| Prisma | Mature; great DX | Edge runtime support for D1 is limited; bundle size large | Rejected for Cloudflare target |
| Drizzle ORM | Edge-first, lean, great D1 support, generated migrations | Younger ecosystem than Prisma | **Chosen** |

## Consequences

- **Positive:** types flow from schema to queries to components.
- **Positive:** migrations are SQL we can review and audit.
- **Negative:** Drizzle's API churns occasionally; pin a minor version.
- **Risk:** D1 row-size and transaction limits constrain certain patterns
  (large draft bodies, batch inserts). Mitigation: keep email bodies under
  64 KB; chunk batch inserts.

## References

- [Drizzle ORM D1 docs](https://orm.drizzle.team/docs/get-started-sqlite#cloudflare-d1)
- Phase 1 PRD P-4
