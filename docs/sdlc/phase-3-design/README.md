# Phase 3 — Design

**Status:** Approved
**Date:** 2026-05-24

## Deliverables

| Area | Folder | Contents |
|---|---|---|
| UX | [ux/](./ux/) | Information architecture, user flows, text wireframes (W1-W8), design system. |
| Architecture | [architecture/](./architecture/) | C4 levels 1-3 (context, container, component) + deployment view. |
| Data | [data/](./data/) | ERD + data conventions (IDs, timestamps, enums, indexes, seeds). |
| API | [api/](./api/) | OpenAPI 3.1 spec + API conventions (HTTP methods, errors, pagination, streaming, rate limits). |
| Security | [security/](./security/) | Lightweight threat model (OWASP Top 10 + LLM Top 10 + project-specific). |

## Phase 3 decisions (locked)

1. **Layout direction:** classic Outlook 3-pane (ribbon + nav + list + reading pane), popup compose.
2. **Threat model:** lightweight (OWASP Top 10 + prompt-injection notes). Full STRIDE deferred to V1+.
3. **Diagrams:** canonical in Figma / draw.io (links TBD); committed docs contain Mermaid drafts and text descriptions for review while the canonical files are produced.
4. **API style:** REST CRUD under `/api/v1` for everything ([ADR-011](../phase-2-planning/adrs/adr-011-rest-api-style.md)). Supersedes the Server-Actions part of ADR-003.

## Open items carried into Phase 4

- Publish canonical Figma file and link from each UX doc + diagram doc.
- Sprint 0 spike: validate SSE streaming via `next-on-pages`.
- Sprint 0 spike: validate D1 binding + Drizzle in local dev.
- Generate `openapi.yaml` from Zod schemas via `zod-to-openapi`; add CI check that the file is up to date.
- Decide on autocomplete library for the recipient combobox (likely `cmdk`).
