# Phase 3 — API Design

| Document | Purpose |
|---|---|
| [openapi.yaml](./openapi.yaml) | OpenAPI 3.1 spec; canonical contract for all REST endpoints. |
| [conventions.md](./conventions.md) | HTTP methods, status codes, error format, pagination, streaming, rate limits. |

## Generating types

Zod schemas in `app/lib/api/schemas/` are the source of truth for
request/response shapes. The OpenAPI YAML in this folder is generated
from those schemas via `zod-to-openapi` and committed for review and
external consumers.

If the YAML and the Zod schemas disagree, the Zod schemas win and the
YAML must be regenerated.
