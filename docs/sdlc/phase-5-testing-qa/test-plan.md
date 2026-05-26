# Test Plan

This is the per-layer plan that turns the strategy into commands a
human can run. For each layer it lists: what it covers, how to run it,
the entry criteria (when you may start it), the exit criteria (when it
counts as "passed"), and the owner.

## L1 — Unit tests

| Field | Value |
|---|---|
| Tool | Vitest 2.x (`vitest run`) |
| Lives at | `app/tests/unit/*.test.ts` |
| Cases today | 50 across 6 files (session, mock-provider, repos, handlers, drafts, drafts-handlers) |
| Coverage focus | `app/src/lib/**` and route handler bodies |
| Run | `pnpm test:unit` |
| Entry criteria | The PR compiles (`pnpm typecheck` green). |
| Exit criteria | Every test passes locally and in CI. New code paths have at least one test. |
| Owner | Author of the change. |

### Required cases when adding a feature

- Happy path.
- One validation failure.
- One "not found / forbidden" path if the resource has an id.
- One concurrent-edge case if the feature mutates shared state.

## L2 — Integration tests (handler-level)

| Field | Value |
|---|---|
| Tool | Vitest, invoking the route handler functions directly with `new Request()` |
| Lives at | `app/tests/unit/*-handlers.test.ts` |
| Cases today | 21 (clients, emails, segments, drafts, send) |
| Run | `pnpm test:unit` |
| Entry criteria | L1 green. |
| Exit criteria | Every public `/api/v1/**` endpoint has at least: a 2xx happy path, a 4xx validation path, and (where applicable) a 404 path. |
| Owner | Author of the route. |

We do not spin up a real Next.js server for these. The handlers are
ordinary functions, so calling them directly is faster and stable.

## L3 — Static checks

| Field | Value |
|---|---|
| Tools | `tsc --noEmit`, `eslint .` |
| Run | `pnpm typecheck && pnpm lint` |
| Entry criteria | Always. |
| Exit criteria | Zero errors. Warnings are allowed only when annotated with a comment that links to a follow-up issue. |
| Owner | Author. |

## L4 — Build verification

| Field | Value |
|---|---|
| Tool | `next build` |
| Run | `SESSION_SECRET=ci SHARED_PASSWORD=ci pnpm build` |
| Entry criteria | L1-L3 green. |
| Exit criteria | Build completes; route table prints; middleware compiles. |
| Owner | CI. |

The CI workflow (`.github/workflows/ci.yml`) chains L1-L4 in one job
and is required for merge.

## L5 — Manual UAT

| Field | Value |
|---|---|
| Script | [uat-script.md](./uat-script.md) |
| Run | `pnpm dev` → follow the steps |
| Entry criteria | A release candidate tag is in flight. |
| Exit criteria | Every script step is either "pass" or has a tracked defect ticket. |
| Owner | QA Lead. |

## L6 — Prompt evaluation (deferred)

| Field | Value |
|---|---|
| Tool | Promptfoo (per ADR-009) |
| Trigger to activate | First commit that introduces a prompt template (Sprint 3). |
| Cases planned | One per `LlmProvider` method: `draftReply`, `draftNew`, `summarize`, `suggestFollowUps`. |
| Entry criteria | The provider returns deterministic output for a frozen seed. |
| Exit criteria | Evals pass for the MockProvider and the Azure sandbox key with identical schemas. |
| Owner | AI engineer. |

## L7 — E2E browser tests (deferred)

| Field | Value |
|---|---|
| Tool | Playwright (per ADR-009) |
| Trigger to activate | Sprint 5 cutover from `wrangler dev`. |
| First three scenarios | (a) open and read an email; (b) compose, autosave, send; (c) reply to an inbox message with the quoted body. |
| Entry criteria | Local D1 binding works against `wrangler pages dev`. |
| Exit criteria | All three scenarios pass headless in CI. |
| Owner | QA Lead. |

## L8 — Accessibility (light, today)

| Field | Value |
|---|---|
| Tool | Manual keyboard sweep + Lighthouse axe |
| Run | `pnpm dev` → keyboard-only walkthrough of UAT script L5. |
| Entry criteria | Pre-release candidate. |
| Exit criteria | All UAT script steps reachable by keyboard; no `axe` critical violations. |
| Owner | QA Lead. |
| Full audit | Deferred to first public preview (Phase 6 / 7). |

## L9 — Performance (deferred)

| Field | Value |
|---|---|
| Tool | k6 against staging |
| Trigger to activate | First public preview. |
| Target SLOs | See Phase 7 — Operations & SLOs. |
| Notes | Local-dev profile is good enough to spot anomalies but not to certify. |

## L10 — Security (deferred)

| Field | Value |
|---|---|
| Tools | OWASP ZAP baseline + Snyk for dependencies |
| Trigger to activate | First public preview. |
| Threat model | See `docs/sdlc/phase-3-design/security/threat-model.md`. |
| Notes | Today, the only controls in code are: shared-password auth (`middleware.ts`), HMAC session cookies, Edge runtime sandboxing, problem+json error shape (no stack traces leaked). |

## Cross-cutting

- **Test data:** Use the seeds in `app/src/lib/db/seed/*.seed.ts`.
  Don't invent ad-hoc fixtures; if you need a new shape, add it to the
  seeds and reference it from tests.
- **Time:** Tests must not rely on the wall clock except via Vitest's
  fake timers. Today nothing uses fake timers because nothing in the
  app schedules timed work that needs simulation.
- **Network:** Tests must not hit the network. The MockProvider is
  fully in-process; no Azure calls in any test.
- **Order independence:** Tests must pass in any order
  (`vitest run --shuffle`).
- **Cleanup:** Tests that mutate the drafts store must reset it.
