# ADR-007: Single Shared Password Gate (Cookie-Based)

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Engineering lead, product lead
- **Phase:** 2 — Analysis & Planning

## Context

Phase 0 D-001 scopes the application to a single user. Phase 1 (P-5)
allows a single shared password gate or no auth. We want the prototype to
be safe to share publicly without exposing the AI endpoints to the open
internet (LLM cost risk), but we do not want to build accounts, password
reset, or SSO.

## Decision

We will implement a **single shared-password gate**. A user lands on
`/login`, submits the password, and on success receives a signed, HttpOnly
cookie (`fa_session`) valid for 30 days. The password and the signing
secret are environment variables.

Implementation notes:

- Password compared with `crypto.subtle.timingSafeEqual`-equivalent
  constant-time check.
- Cookie value is an HMAC-SHA256 over a timestamp + nonce, verified on
  every request via Next.js middleware.
- Middleware redirects unauthenticated requests for any path under `/`
  (except `/login` and `/api/health`) to `/login`.
- No registration flow, no password reset; password rotation is a redeploy.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| No auth | Simplest | LLM endpoints exposed to bots; cost risk | Rejected |
| Auth.js with Email magic-link | Real per-user accounts | Overkill for a single-user prototype | Rejected at this phase |
| HTTP Basic auth at Cloudflare | Easy to add | Worse UX; sticky in browsers; no logout | Rejected |
| Shared password + cookie | Cheap, easy, UX-good | Not real auth; users share a secret | **Chosen** |

## Consequences

- **Positive:** keeps the prototype private with minimal effort.
- **Positive:** can be replaced by real auth in a future phase without
  changing route shapes.
- **Negative:** if the shared password leaks, everyone using that URL
  loses access until it is rotated.
- **Risk:** brute force attempts on the login endpoint. Mitigation: rate
  limit `/login` to 10 attempts per IP per 10 minutes via Cloudflare
  rules.

## References

- Phase 0 D-001
- Phase 1 P-5
