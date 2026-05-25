# ADR-011: REST CRUD under `/api/v1` for all server endpoints

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Engineering lead, product lead
- **Phase:** 3 — Design (recorded as an ADR after the API style decision)
- **Supersedes (in part):** ADR-003 (the "Server Actions for mutations" portion)

## Context

[ADR-003](./adr-003-backend-api.md) proposed Route Handlers for HTTP
endpoints and Server Actions for mutations triggered from React
components. During Phase 3 the team chose to standardise on **REST
CRUD-style endpoints under `/api/v1` for everything**, including
mutations. The OpenAPI contract is now the source of truth for the
backend surface.

Reasons for revisiting ADR-003:

- One uniform contract is easier to test, document (OpenAPI), and rate
  limit.
- Streaming SSE endpoints (`/ai/draft-*`) are most naturally REST.
- Server Actions can still be used internally for small in-app
  conveniences but should not replace the public API surface.

## Decision

All server-side functionality is exposed via REST endpoints under
`/api/v1/*` using Next.js Route Handlers. Mutations use the HTTP method
appropriate to their semantics (`POST`, `PUT`, `PATCH`, `DELETE`).
Server Actions are limited to:

- Form posts that map 1-to-1 to an existing REST endpoint when there is
  a meaningful progressive-enhancement win.

The canonical contract is [`api/openapi.yaml`](../../phase-3-design/api/openapi.yaml).

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Continue with mixed Route Handlers + Server Actions per ADR-003 | Fewer round-trips; built-in form ergonomics | Two contracts to test and document; harder to rate-limit and observe | Rejected |
| Pure tRPC | End-to-end types automatically | Diverges from OpenAPI; harder for external review | Rejected |
| Pure REST under `/api/v1` (chosen) | One uniform surface; OpenAPI source of truth; SSE fits naturally | A bit more wiring on the client compared to Server Actions | **Chosen** |

## Consequences

- **Positive:** OpenAPI YAML is the authoritative contract; types are
  generated from Zod schemas and validated against the YAML in CI.
- **Positive:** rate limiting, observability, and security headers
  apply uniformly to every endpoint.
- **Negative:** small UX wins from Server Actions (e.g., progressive
  forms) are forgone unless we add a thin wrapper.
- **Follow-ups:** generate the OpenAPI YAML from Zod schemas using
  `zod-to-openapi` and add a CI check.

## References

- [ADR-003](./adr-003-backend-api.md) (superseded in part)
- [OpenAPI spec](../../phase-3-design/api/openapi.yaml)
- [API conventions](../../phase-3-design/api/conventions.md)
