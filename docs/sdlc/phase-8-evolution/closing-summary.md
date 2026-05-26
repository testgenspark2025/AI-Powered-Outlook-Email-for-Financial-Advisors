# Closing Summary

The single page that answers "what did we actually build, end to
end?" If you read nothing else in `docs/sdlc/`, read this.

## The program in one paragraph

Between 2026-05-24 and 2026-05-26 we walked an 8-phase SDLC for the
*AI-Powered Outlook Email for Financial Advisors* prototype. We
locked the scope to a solo advisor, UI-only flows, Azure OpenAI for
AI, and no compliance work. We produced ~7,000 lines of planning
documents on `main` and shipped a working Next.js 15 application
through Sprints 0-2 on `develop` — auth, three-pane inbox, compose,
autosave, send, drafts, sent items, dark mode, 50 passing tests, and
a green build. The remaining Phase 4 sprints (AI draft, summarise,
Azure cutover, UAT) are paused but the carry-over is captured in the
tech-debt register and the v2 roadmap.

## Phase-by-phase outcome

| Phase | What it produced | Where it lives | Status |
|---|---|---|---|
| 0 | Charter with locked decisions D-001 to D-004 | `docs/sdlc/phase-0-scope.md` | Approved |
| 1 | PRD (27 FRs, 10 NFRs), 19 user stories, success metrics | `docs/sdlc/phase-1-requirements/` | Approved |
| 2 | 10 ADRs, roadmap, sprint plan, RACI, $258K budget, risks | `docs/sdlc/phase-2-planning/` | Approved |
| 3 | UX (IA, flows, wireframes, design system), C4 architecture, ERD, OpenAPI, threat model | `docs/sdlc/phase-3-design/` | Approved |
| 4 | Sprint 0 — foundation; Sprint 1 — inbox + reading; Sprint 2 — compose + send | `develop` branch under `app/` and `docs/sdlc/phase-4-implementation/` | Paused at Sprint 2 |
| 5 | Test strategy, test plan, acceptance map, defect mgmt, UAT script, release sign-off, two checklists | `docs/sdlc/phase-5-testing-qa/` | Approved |
| 6 | Deployment architecture, release process, three runbooks, cutover plan, pre-launch + release-day checklists | `docs/sdlc/phase-6-deployment/` | Approved (theoretical) |
| 7 | SLOs, observability, alerting, incident response, backup + DR, security ops, cost + capacity, postmortem template, on-call + ops-review checklists | `docs/sdlc/phase-7-operations/` | Approved (theoretical) |
| 8 | Versioning + deprecation, tech-debt register, v2 roadmap, feedback loop, retro template, sunset policy, lessons learned, this summary | `docs/sdlc/phase-8-evolution/` | Approved |

## What was actually shipped

On `develop` branch, `app/` directory:

- Next.js 15 + TypeScript + Tailwind, pnpm, Vitest, ESLint flat
  config.
- Shared-password auth (ADR-007): HMAC session cookies, middleware
  gate, `/login`, `/api/v1/auth/{login,logout}`.
- Drizzle schema for all 10 tables from the ERD (ADR-004).
- LLM gateway with `LlmProvider` interface, deterministic
  `MockProvider`, `AzureProvider` stub.
- REST API (Edge runtime) under `/api/v1`:
  `health`, `segments`, `clients`, `clients/:id`, `emails`,
  `emails/:id`, `drafts`, `drafts/:id`, `ai/draft-reply` (SSE).
- Three-pane inbox layout: `RibbonBar`, `LeftRail`, `MessageList`,
  `ReadingPane`, `ClientInsightsCard`.
- Compose flow with 5-second autosave debounce, save / send /
  discard, reply with quoted body.
- Drafts and Sent Items folders backed by an in-memory mutable
  store (TD-001).
- Dark mode toggle with `localStorage` persistence.
- Five handcrafted clients (Sterling, Park, Martinez, O'Brien,
  Chen) across five segments, five seeded inbound emails.
- 50 Vitest cases across 6 suites: session HMAC, MockProvider,
  repos, handlers, drafts repo, drafts handlers.
- GitHub Actions CI: lint → typecheck → unit → build.

The build prints 15 routes + middleware. All gates green.

## What is paused or deferred

On `develop`, three sprints remain on the original plan; they are
documented in the tech-debt register and the v2 roadmap:

- Sprint 3 — AI Draft button + depth selector + SSE consumer.
- Sprint 4 — Summarise + suggested follow-ups.
- Sprint 5 — Azure cutover, D1 binding, observability, Playwright,
  Promptfoo.
- Sprint 6 — UAT, bug bash, cutover, demo.

The Phase 4 cutover plan (in `phase-6-deployment/cutover-plan.md`)
describes the one-time flip from "develop has the new app" to "main
has the new app".

## How the documents cross-reference

```
charter (P0)
   │
   ├── PRD/user-stories (P1) ───►  acceptance-criteria.md (P5)
   │                                ├── unit/handler tests
   │                                └── uat-script.md
   │
   ├── ADRs (P2) ───► runbooks (P6), SLOs (P7)
   │
   ├── threat-model (P3) ───►  security-ops.md (P7)
   │
   ├── sprint-plan (P2) ───►  sprint reports on develop (P4)
   │                            │
   │                            └──► tech-debt.md (P8)
   │                                  │
   │                                  └──► v2-roadmap.md (P8)
   │
   └── 13 release gates (P5) ───►  runbooks + checklists (P6)
                                     │
                                     └──►  alerts + SLOs (P7)
```

Every arrow in that diagram is a real link in the documents. The
SDLC index at `docs/sdlc/README.md` is the entry point.

## What this means for the next program

Read these three documents first, in order:

1. `phase-8-evolution/lessons-learned.md` — what we'd do differently.
2. `phase-8-evolution/v2-roadmap.md` — the bet for v2.
3. `phase-8-evolution/tech-debt.md` — the debt to inherit or pay.

Then run a fresh Phase 0 with new locked decisions. The locked
decisions are the only thing the next program must own.

## Acknowledgments

- The Phase 2 sprint plan held up against contact with reality.
- The repo facade pattern (L-04) was worth more than it cost.
- The "honest deferral" habit (L-09) made every later phase
  trustworthy.

The next program inherits the docs, not the assumptions. Treat them
as a starting position, challenge them in Phase 0, then build.

---

*End of SDLC walkthrough for v1 prototype.*
