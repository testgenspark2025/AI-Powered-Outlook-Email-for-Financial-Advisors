# ADR-009: Testing Strategy — Vitest, Playwright, and Prompt Evals

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Engineering lead
- **Phase:** 2 — Analysis & Planning

## Context

The PRD requires shippable demo quality (success-metrics §7) and several
NFRs (T-7 worker error rate, T-8 crash-free sessions, T-9 accessibility,
T-10 performance). Phase 5 of the SDLC will scale this out; we need the
test stack baked in from Sprint 0.

## Decision

Three-layer test pyramid plus a fourth layer for AI behavior.

| Layer | Tool | Scope | Where it runs |
|---|---|---|---|
| Unit | Vitest | Pure functions in `app/lib/**`, including AI prompt builders and DB repository helpers (against `better-sqlite3` in-memory). | Local + CI |
| Integration | Vitest + Miniflare or `unstable_dev` | Route Handlers and Server Actions against an in-memory D1. | Local + CI |
| End-to-end | Playwright | Top user flows: login, read email, AI draft (with mock LLM), send, follow-up accept, dark mode toggle. | CI on PR + nightly |
| AI behavior | Promptfoo (or hand-rolled harness) | A small fixed set of (input, expectation) pairs per workflow and depth. Asserts presence of client name, segment cues, length bounds. | Manual + weekly CI |

Conventions:

- 70% line coverage minimum on `app/lib/**`; UI components are excluded
  from the coverage gate but exercised in E2E.
- Every Route Handler has at least one integration test.
- Snapshot tests are banned for UI; use explicit assertions.
- `MSW` (Mock Service Worker) intercepts the LLM provider in E2E so tests
  do not call Azure.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Jest | Familiar | Slower; ESM friction with Next | Rejected |
| Cypress | Mature | Heavier than Playwright; cross-browser story thinner | Rejected |
| No prompt evals | Less work | We would lose quality regressions on prompt changes | Rejected |
| Vitest + Playwright + Promptfoo | Fast, edge-friendly, broad coverage | One more tool to operate | **Chosen** |

## Consequences

- **Positive:** clear ownership per layer; CI feedback under 5 minutes.
- **Positive:** prompt evals catch quality regressions before users.
- **Negative:** four tools to keep healthy.
- **Risk:** mock LLM diverges from real Azure behavior. Mitigation: a
  small weekly canary run against the real provider.

## References

- Phase 1 success metrics §4
