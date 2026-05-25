# API Conventions

**Phase:** 3 — Design (API)
**Status:** Approved
**Date:** 2026-05-24

Companion to [openapi.yaml](./openapi.yaml). These conventions apply to
every endpoint under `/api/v1/`.

## 1. Style

- REST. CRUD-style resources. JSON in, JSON out. SSE only for streaming
  AI endpoints. See [ADR-011](../../phase-2-planning/adrs/adr-011-rest-api-style.md).
- All endpoints live under `/api/v1/`. The version number is the URL
  segment; we do not negotiate via headers.

## 2. HTTP methods

| Method | Use |
|---|---|
| `GET` | Reads, idempotent. May not have a request body. |
| `POST` | Create or non-idempotent action (login, AI generation, mock send). |
| `PUT` | Full replacement of a resource (used for draft autosave). |
| `PATCH` | Partial update. |
| `DELETE` | Remove a resource. |

## 3. Status codes

| Code | When |
|---|---|
| `200` | Successful GET / PATCH / PUT returning a body. |
| `201` | Successful POST that created a resource. |
| `204` | Successful action with no body (autosave, logout, mark read). |
| `400` | Request body fails Zod validation. |
| `401` | Missing or invalid session cookie. |
| `404` | Resource not found. |
| `409` | Conflict (e.g., autosave overwriting a newer draft). |
| `429` | Rate limited. |
| `500` | Unhandled error. |
| `502` | Upstream provider (Azure) failure. |
| `504` | Upstream timeout. |

## 4. Error format

All non-2xx responses use RFC 7807 Problem Details:

```json
{
  "type": "https://faopo.example/errors/validation",
  "title": "Validation failed",
  "status": 400,
  "detail": "depth must be one of light, medium, deep",
  "instance": "/api/v1/ai/draft-reply"
}
```

A small library of stable `type` URIs lives in
`app/lib/api/problems.ts`.

## 5. Pagination

- Cursor-based: `?cursor=<id>&limit=<n>`.
- Responses return `{ items: [...], nextCursor: string | null }`.
- Max `limit` is 200.
- Cursor is opaque to clients; never reuse last id as cursor unless the
  server documents it.

## 6. Sorting

- Default sort is server-chosen (typically reverse chronological).
- Custom sort is not in MVP scope. Add `?sort=` when needed in V1.

## 7. Validation

- Every request body is validated with Zod on the server.
- The same Zod schema generates the TypeScript request and response
  types consumed by the client.
- Schemas live in `app/lib/api/schemas/` and are imported by both the
  Route Handler and the client fetch wrapper.

## 8. Naming

- URLs: kebab-case for paths (`/follow-ups`), camelCase for query
  params (`?segmentId=2`).
- JSON keys: camelCase.
- Enums: snake_case in the database, camelCase in the API.

## 9. Streaming (SSE)

- Endpoints that stream tokens (`/ai/draft-*`) return
  `Content-Type: text/event-stream`.
- Each `data:` line is a JSON object with one of:
  - `{ "type": "token", "value": "..." }`
  - `{ "type": "done", "meta": { "operation": "draft_reply", "depth": "medium", "tokensIn": 1500, "tokensOut": 250, "latencyMs": 4200 } }`
  - `{ "type": "error", "message": "..." }`
- Client uses `EventSource` (server-side rendered) or `fetch` + a
  reader, depending on the call site.
- Server flushes after every token chunk to keep the stream live.

## 10. Idempotency

- Autosave (`PUT /drafts/:id`) is fully idempotent — same body produces
  the same result.
- Send (`POST /sent`) is idempotent on `draftId`: re-sending the same
  draft returns the existing sent item with `200` instead of `201`.

## 11. Rate limits

| Endpoint | Limit |
|---|---|
| `POST /auth/login` | 10 per IP per 10 minutes |
| `POST /ai/*` | 60 per session per minute |
| Everything else | 600 per session per minute |

Limits are enforced at the Cloudflare edge (Workers Rate Limiting API or
WAF rules).

## 12. Caching

- `GET /clients`, `GET /clients/:id`, `GET /emails`, `GET /emails/:id`,
  `GET /settings` set `Cache-Control: private, max-age=10`.
- AI streaming endpoints set `Cache-Control: no-store`.

## 13. CORS

- Same-origin only. CORS headers are not set; the API is for our
  frontend only.

## 14. Versioning

- Breaking changes go to `/api/v2`.
- Within `v1`, we may add fields and new endpoints. Removing fields is
  a breaking change.

## 15. Trace and debugging

- Every response carries `X-Request-Id` (UUIDv7).
- Server logs include the request id and the user (none beyond
  "authenticated" for MVP).
- AI calls additionally log `tokensIn`, `tokensOut`, `latencyMs` to D1
  `ai_calls`.

## 16. What's intentionally out

- API keys for third parties.
- Webhooks.
- Public discoverability (no `swagger-ui` route in production at MVP).
