# Tech-Debt Register

A single, honest list of debt we have taken on intentionally. Each
row has a cost, an effort, and an owner. The on-call reviews this
list at the weekly ops review (Phase 7).

Severity scale:

- **High** — actively limits new features, or risks a sev-1.
- **Medium** — slows the team or makes incidents worse.
- **Low** — annoying, fix when nearby.

Effort scale (T-shirt):

- **S** ≤ 1 dev-day. **M** 2-5 days. **L** > 1 sprint.

## Register

| Id | Description | Severity | Effort | Origin | Owner | Target |
|---|---|---|---|---|---|---|
| TD-001 | Drafts and sent-items live in an in-memory module store; lost on cold start. Required for any real demo to a customer. | High | M | Sprint 2 carry-over | Tech Lead | v1.0 (Sprint 5) |
| TD-002 | Cloudflare D1 binding + `@cloudflare/next-on-pages` adapter not wired into local dev or CI. Blocks TD-001 and the cutover. | High | M | Sprint 0 carry-over | Tech Lead | v1.0 (Sprint 5) |
| TD-003 | AzureProvider is a stub that throws. The AI surface is wired, but only MockProvider works. | High | M | Sprint 0 carry-over | AI Engineer | v1.0 (Sprint 5) |
| TD-004 | No "Draft with AI" button in compose; SSE endpoint exists but no UI consumer. | Medium | S | Sprint 3 deferred | Frontend | v1.0 (Sprint 3) |
| TD-005 | No summarisation or follow-up UI; provider methods exist but unused. | Medium | M | Sprint 4 deferred | Frontend | v1.0 (Sprint 4) |
| TD-006 | No Playwright E2E suite. Currently the "open and read" flow is covered only by Vitest hitting handlers directly. | Medium | M | Sprint 5 deferred | QA Lead | v1.0 (Sprint 5) |
| TD-007 | No Promptfoo evals. We can ship prompt changes without an automated guardrail. | Medium | M | Sprint 3 deferred | AI Engineer | v1.0 (Sprint 3) |
| TD-008 | The login route uses a single shared password (ADR-007). Adequate for demo, inadequate beyond it. | High | L | ADR-007 | Tech Lead | v2 (per `v2-roadmap.md`) |
| TD-009 | No real Outlook integration. The product mimics Outlook chrome but doesn't talk to Microsoft Graph or any other mail backend. | Critical for v2 | L | D-002 in charter | Product | v2 |
| TD-010 | Theme toggle reads/writes `localStorage` on the client only. SSR shows a placeholder glyph for one frame. Cosmetic. | Low | S | Sprint 1 design | Frontend | Backlog |
| TD-011 | `MessageList` keyboard nav is wired globally on `window` — it should be scoped to the panel when other elements (e.g. compose) are focused. | Low | S | Sprint 1 | Frontend | Backlog |
| TD-012 | No request-id propagation through routes / logs. Logging plan in Phase 7 assumes it. | Medium | S | Sprint 5 deferred | Backend | v1.0 (Sprint 5) |
| TD-013 | No `lib/log.ts` helper. Handlers either log nothing or call `console.error` ad-hoc. | Medium | S | Phase 7 observability | Backend | v1.0 (Sprint 5) |
| TD-014 | No CHANGELOG.md at repo root. Release-day checklist expects it. | Low | S | Phase 6 carry | Tech Lead | v1.0-rc.1 |
| TD-015 | No CODEOWNERS or PR template. Phase 6 pre-launch checklist requires them. | Low | S | Phase 6 carry | Tech Lead | v1.0-rc.1 |
| TD-016 | Drafts and emails seeds repeat household / segment metadata between them; the data model is denormalised. Fine for prototype, painful at scale. | Low | M | Sprint 1 | Backend | When D1 lands |
| TD-017 | Build artifacts (`app/.next`) get accidentally tracked when branch-switching because `.gitignore` lives only on `develop`. | Low | S | Phase 5 commit | Tech Lead | Cutover |
| TD-018 | No structured error from middleware for "session expired" vs "session invalid". Both return the same redirect. | Low | S | Sprint 0 | Backend | Backlog |
| TD-019 | The OpenAPI spec at `phase-3-design/api/openapi.yaml` doesn't cover the new draft endpoints from Sprint 2. | Medium | S | Sprint 2 | Backend | v1.0-rc.1 |
| TD-020 | No telemetry on autosave debounce — we can't measure how often it succeeds or how late. | Low | M | Sprint 2 | Backend | v1.0 (Sprint 5) |

## Aging policy

| If a row is open for | Then |
|---|---|
| > 60 days at Medium / High | Escalate to the next planning cycle. |
| > 1 year at Low | Either bump severity (it kept costing us), or close as "won't fix" and document why. |

## How rows get on this list

Anyone can add a row. Each row needs:

- A one-line description.
- A proposed severity and effort.
- The "origin" — which sprint / phase decision created the debt.
- A proposed owner. If unknown, "unassigned" is fine; ops review
  triages.

## How rows come off

Three ways:

1. **Paid** — fixed; PR linked; row deleted (the git history is the audit).
2. **Reframed** — split or merged; mention the new ids.
3. **Won't fix** — moved to `closed-debt.md` (this folder; created on
   first such row) with a paragraph on why.

We don't keep "fixed" rows in the live register; the list should be
the *current* picture.
