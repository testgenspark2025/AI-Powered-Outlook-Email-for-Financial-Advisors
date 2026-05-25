# ADR-003: Next.js Route Handlers + Server Actions for the Backend

- **Status:** Superseded in part by [ADR-011](./adr-011-rest-api-style.md) (Server Actions are no longer the recommended mutation path)
- **Date:** 2026-05-24
- **Deciders:** Engineering lead
- **Phase:** 2 — Analysis & Planning

## Context

ADR-002 chose Next.js for the frontend. The prototype's backend is a Hono
app with a handful of REST endpoints. We need to decide whether to keep a
separate Hono service for the API or consolidate the backend inside the
Next.js application.

The prototype is a single-user, single-tenant tool deployed on Cloudflare;
there is no second client (mobile app, third-party integration) that needs
a public API surface.

## Decision

We will implement all backend logic inside the Next.js application using
**Route Handlers** (`app/api/.../route.ts`) for HTTP endpoints and
**Server Actions** for mutations triggered from React components. There
will be no separate Hono service.

API conventions:

- All HTTP endpoints under `/api/v1/...`.
- JSON request/response, validated with Zod schemas shared with the client.
- Errors follow RFC 7807 Problem Details where applicable.
- A `lib/server/` module hosts pure functions (no Next.js imports) that
  can be unit tested without rendering.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Keep Hono as a separate service | Reuses existing code; faster cold starts on Workers | Two deployables to ship, two auth boundaries, type-sharing pain | Rejected: complexity > benefit |
| tRPC inside Next.js | End-to-end types without manual schemas | Adds a layer; Server Actions cover most of our need | Rejected: not enough value at prototype scale |
| Route Handlers + Server Actions | Single deployable, shared types, ergonomic | Mixes RPC-ish and REST; needs convention | **Chosen** |

## Consequences

- **Positive:** one deployable to test and release.
- **Positive:** Zod schemas double as request validators and TypeScript
  types via `z.infer`.
- **Negative:** Server Actions are still evolving; we will pin a stable
  Next minor and not chase the latest preview features.
- **Risk:** mixing Route Handlers and Server Actions inconsistently.
  Mitigation: convention doc in the Phase 3 design pack.

## References

- ADR-002 frontend framework
- [Phase 1 PRD section 7](../../phase-1-requirements/prd.md)
