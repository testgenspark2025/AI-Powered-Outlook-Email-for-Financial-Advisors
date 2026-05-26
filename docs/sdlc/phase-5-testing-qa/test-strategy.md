# Test Strategy

## Goals

1. Catch regressions in the routes a financial advisor will actually use
   (read, reply, draft, send) before they reach the demo branch.
2. Keep tests fast enough to gate every PR (target: full suite under 10 s).
3. Keep the test code obvious enough that a new contributor can add a
   test in under 15 minutes.
4. Be honest about what we *can't* test yet (no live LLM, no D1, no
   public deploy) and write that down so it doesn't surprise anyone.

## Test pyramid

```
                  +---------------------+
                  |  UAT (manual)       |   1-2 scripted runs / release
                  +---------------------+
                +-------------------------+
                |  E2E (Playwright)       |  deferred (Sprint 5)
                +-------------------------+
              +-----------------------------+
              |  Prompt evals (Promptfoo)   | deferred (Sprint 3-4)
              +-----------------------------+
            +---------------------------------+
            |  Integration (Vitest, handler)  |  ~25 cases today
            +---------------------------------+
          +-------------------------------------+
          |  Unit (Vitest)                      |  ~25 cases today
          +-------------------------------------+
```

We deliberately over-weight unit + integration over E2E for the
prototype phase. The compose + send flow is exercised end-to-end via
Vitest hitting the route handlers directly — which is fast, reliable,
and runs in CI with no browser overhead.

## Layers in scope today

| Layer | Tool | Lives at | Run command |
|---|---|---|---|
| Unit | Vitest | `app/tests/unit/*.test.ts` | `pnpm test:unit` |
| Integration (handler) | Vitest + native `Request`/`Response` | same | `pnpm test:unit` |
| Static | TypeScript, ESLint | repo wide | `pnpm typecheck`, `pnpm lint` |
| Build | Next.js build | `app/.next` | `pnpm build` |
| Manual / UAT | [uat-script.md](./uat-script.md) | human | `pnpm dev` then follow script |

CI runs the first four on every PR and push to `main` / `develop` via
`.github/workflows/ci.yml`. Manual UAT is run by the QA Lead before a
release candidate is tagged.

## Layers deferred (with trigger)

| Layer | Tool | Triggered by |
|---|---|---|
| E2E browser | Playwright (ADR-009) | Sprint 5 (Azure cutover) when the first real provider lands. |
| Prompt evals | Promptfoo (ADR-009) | Sprint 3 (AI draft) when prompts are committed to source. |
| Load / soak | k6 against staging | Production deploy in Phase 7. |
| Penetration test | OWASP ZAP baseline | First public preview. |
| Accessibility audit | axe-core + manual VoiceOver | Pre-launch (Sprint 6). |
| Visual regression | Playwright + snapshots | Optional; only if UI ships break unexpectedly. |

## Test environments

Today there is exactly one environment: `local-dev`. Everything runs
from the developer's machine.

| Env | Purpose | Data | LLM | Notes |
|---|---|---|---|---|
| local-dev | Author + run all tests | In-memory seeded (5 clients, 5 emails) | MockProvider | Reset per process; drafts vanish on restart. |
| local-uat (future) | Scripted UAT after Sprint 5 | Local D1 file + seed migrations | Azure (sandbox key) | Same machine, separate `.env`. |
| staging (future) | CI smoke + perf | D1 staging | Azure (sandbox key) | Per Phase 6. |
| production (future) | Live | D1 prod | Azure (prod key) | Per Phase 6. |

## Test data strategy

- All seed data lives under `app/src/lib/db/seed/*.seed.ts`.
- Seeds are *plain TypeScript modules* so they are diffable, importable
  from tests, and fully deterministic.
- The five seeded clients deliberately span five segments (Ultra HNW,
  HNW, Affluent Professional, Pre-Retiree, Young Professional) so any
  test that reaches for "one client per segment" can pick from them.
- The drafts store is process-local. Every handler test that exercises
  the drafts API resets it via `_resetDraftStoreForTests()` in
  `beforeEach`.

If we add fixtures, they go under `app/tests/fixtures/` — *not* under
`app/src/`. That folder is excluded from production bundles.

## Coverage targets

We are not blocking PRs on coverage numbers in the prototype phase.
We do report them locally:

```bash
pnpm test:unit --coverage
```

A non-binding target for `app/src/lib/**` is **80% lines, 70% branches**.
We will revisit binding gates after Sprint 5.

## What "good" looks like in a test

1. Tests exercise a *behavior*, not the implementation. The repo tests
   call public functions, not internals.
2. Tests share no state. Anything that needs the drafts store reset does
   it in `beforeEach`.
3. Assertions are specific. Prefer `expect(items).toHaveLength(5)` over
   `expect(items.length).toBeGreaterThan(0)` unless the length is
   genuinely variable.
4. Names read like sentences. `it("rejects sending an incomplete draft")`
   beats `it("test send error")`.
5. No mocks of code we own. If a function is hard to test without a
   mock, it is a sign the function should be split.

## Risks the test strategy still leaves uncovered

| Risk | Mitigation now | When we fix it |
|---|---|---|
| Edge runtime behaves differently from Node `Request`/`Response` | We type imports through Web standards and avoid Node-only APIs in handlers. | E2E in Sprint 5 against `wrangler dev`. |
| MockProvider drift from Azure | Provider interface is shared; both implement the same `LlmProvider`. | Promptfoo evals in Sprint 3-4. |
| SSR/CSR hydration mismatch in dark-mode toggle | We use `suppressHydrationWarning` and only read `localStorage` after mount. | Visual regression at first launch. |
| Concurrent draft edits | Out of scope (single-user prototype). | If multi-user, add `If-Match`/ETags. |
