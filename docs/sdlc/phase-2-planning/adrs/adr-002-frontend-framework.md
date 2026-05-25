# ADR-002: Next.js (App Router) as the Frontend Framework

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Engineering lead, design lead
- **Phase:** 2 — Analysis & Planning

## Context

The prototype uses Hono JSX SSR plus a single vanilla JS file. Phase 1
requirements (popup compose windows, autosave drafts, streaming AI
responses, configurable depth selector, follow-ups view, sent / drafts
views, settings) require component reuse, real client-side state, and a
clean way to stream responses from the server. We also want strong
TypeScript ergonomics and a large component ecosystem.

The application must continue to deploy to Cloudflare's edge platform per
the Phase 0 charter.

## Decision

We will use **Next.js (App Router) on TypeScript** for the new application,
deployed to Cloudflare via the `@cloudflare/next-on-pages` adapter. The
project will follow the standard Next.js layout under `app/`.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Hono JSX SSR + Alpine.js / HTMX | Closest to current stack; very small JS payload | Streaming UI patterns, autosave, and rich compose UI are awkward; weak component story | Rejected: scope outgrew it |
| React mounted in Hono pages via Vite | Reuses Hono backend | We would still own routing, data loading, streaming wiring ourselves; less value than picking a framework | Rejected: reinvents Next.js |
| Astro (islands) | Great DX, small payload, supports React islands | Compose window is a fully interactive island that dominates the page; islands buy us little here | Rejected: not a good fit for this UX |
| Next.js App Router | Mature, streaming-friendly, RSC, large ecosystem, Cloudflare adapter exists | Heavier than alternatives; build complexity higher | **Chosen** |
| SvelteKit | Excellent DX | Smaller component ecosystem; team familiarity is React-skewed | Deferred unless team composition changes |

## Consequences

- **Positive:** Server Components let us load client/household context on
  the server with no extra round-trip.
- **Positive:** Streaming the LLM response into a Suspense boundary or via
  a Server Action maps cleanly to FR-CMP-6.
- **Positive:** Large component library options (shadcn/ui, Fluent UI,
  Radix) speed up Outlook-style UI.
- **Negative:** Next.js on Cloudflare has known sharp edges (Node API
  surface, bundle size limits). Sprint 0 includes a spike to validate.
- **Risk:** `@cloudflare/next-on-pages` lags slightly behind upstream
  Next.js releases. Mitigation: pin to a supported Next minor.
- **Follow-up:** select a component library in ADR-008.

## References

- [Phase 0 D-002 Outlook-style UI](../../phase-0-scope.md)
- [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)
