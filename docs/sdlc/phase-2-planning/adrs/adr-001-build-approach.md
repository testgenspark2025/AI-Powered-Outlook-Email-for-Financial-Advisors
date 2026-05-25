# ADR-001: Greenfield Rewrite, Same Repository

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Product lead, engineering lead
- **Phase:** 2 — Analysis & Planning

## Context

The existing repository contains a working prototype built on Hono + JSX
SSR + vanilla JavaScript with in-memory mock data. Phase 1 expanded scope
significantly (D1 persistence, configurable AI personalization,
summarization, follow-ups, Sent / Drafts views, settings). Continuing to
extend the existing code would entangle prototype shortcuts (CDN Tailwind,
single 1,100-line `app.js`, no module boundaries) with new structured
features and would slow every subsequent sprint.

We need a foundation that supports typed APIs, a real persistence layer,
component reuse, and automated tests — without throwing away the existing
UX work or the segment taxonomy.

## Decision

We will perform a **greenfield rewrite of the application code in the same
repository**, on a long-lived `develop` branch, while keeping the current
`main` branch intact as a reference. The new application will live under
a top-level `app/` directory. Once feature parity is reached, `develop`
will be merged into `main` and the old `src/` and `public/` directories
will be removed in a final cleanup commit.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Extend in place | Fastest start; no migration | Carries every prototype shortcut forward; vanilla JS will not scale to D1 + streaming + autosave + auth gate | Rejected: too much technical debt to absorb |
| Greenfield in a **new** repo | Cleanest break; no history confusion | Loses GitHub history, issues, stars; doubles the discovery surface for newcomers | Rejected: project sponsor wants continuity |
| Hybrid: keep Hono backend, replace only the frontend | Reuses existing Hono routes | Phase 1 added too much backend (D1 schema, LLM gateway, autosave, RAG retrieval) for the existing routes to be reusable | Rejected: backend rewrite is unavoidable |

## Consequences

- **Positive:** clear module boundaries, typed end-to-end, testable from
  day one, easy to onboard new engineers.
- **Positive:** old prototype remains browsable on `main` until cutover,
  useful as reference and for design demos.
- **Negative:** duplicated work during transition; reviewers must keep
  both versions in their head until cutover.
- **Risk:** "rewrite to nowhere" — features in the prototype get lost
  during the rewrite. Mitigation: feature parity checklist tied to PRD
  FR-IDs before cutover.
- **Follow-up:** define the cutover criteria in the sprint plan.

## References

- [Phase 0 charter](../../phase-0-scope.md)
- [Phase 1 PRD](../../phase-1-requirements/prd.md)
