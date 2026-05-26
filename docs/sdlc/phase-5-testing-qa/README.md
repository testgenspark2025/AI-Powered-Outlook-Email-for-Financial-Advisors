# Phase 5 — Testing & Quality Assurance

**Status:** Approved
**Date:** 2026-05-26
**Owner:** QA Lead (RACI A); Tech Lead (RACI R); Product (RACI C)

This phase defines how the product is verified — what is tested, how,
by whom, with what entry/exit gates, and how defects are managed.

## Locked decisions (entering Phase 5)

| ID | Decision | Why |
|---|---|---|
| D-Phase5-Pause | Phase 4 paused at Sprint 2; Phases 5-8 plan around what is in `develop` today (auth, inbox/read, compose/drafts/send, mock LLM, in-memory repos). | Lets us close the planning loop end-to-end without blocking on AI/Azure/D1 work. |
| D-Phase5-Depth | Medium — strategy + plans + checklists. No new ADRs unless a decision is forced. | Prototype-grade scope; the heavy lifting was in Phases 0-3. |
| D-Phase5-Cadence | One phase at a time, with sign-off between phases. | Matches prior phases. |
| D-Phase5-TargetEnv | Local dev only. Deployment/operations docs (Phases 6-7) are theoretical for now. | Cloudflare cutover deferred until Phase 4 Sprint 5 lands. |

## Deliverables in this phase

| Doc | Purpose |
|---|---|
| [test-strategy.md](./test-strategy.md) | Pyramid, layers, tools, and what is in / out of scope (now and later). |
| [test-plan.md](./test-plan.md) | Layer-by-layer plans with entry/exit criteria and how to run each. |
| [acceptance-criteria.md](./acceptance-criteria.md) | Map every PRD FR/NFR to one or more tests (or mark deferred). |
| [defect-management.md](./defect-management.md) | Bug lifecycle, severity ladder, SLAs, and the bug-bash playbook. |
| [uat-script.md](./uat-script.md) | A repeatable UAT walkthrough across the current end-to-end flow. |
| [release-signoff.md](./release-signoff.md) | The release-gate matrix and who signs what before promotion. |
| [checklists/pre-merge.md](./checklists/pre-merge.md) | PR author + reviewer checklist before a merge. |
| [checklists/regression.md](./checklists/regression.md) | Short regression run before any release candidate. |

## Scope at a glance

In scope right now (testable against `develop`):

- Auth (login gate, session cookie, logout)
- Inbox: list, filter by segment, keyboard nav, theme toggle
- Read: open inbound email, see client + household insights
- Compose: new email, reply, autosave (5 s), discard
- Send: validation, draft → sent transition
- Sent Items + Drafts folders
- 5 REST endpoint families under `/api/v1/*`
- Mock LLM provider (deterministic; used by `/api/v1/ai/draft-reply`)

Out of scope this phase (deferred to the sprints that build them):

- AI draft replies via real provider (Sprint 3+)
- Summarisation and follow-ups (Sprint 4)
- Azure provider cutover (Sprint 5)
- D1 binding + next-on-pages (Sprint 5)
- Production-grade perf / load / security testing (Phase 7)
- Full WCAG 2.1 AA conformance audit (Phase 6 / 7)

## Phase-5 exit criteria

This phase is "done" when:

1. The seven documents above are reviewed and approved by RACI A (QA Lead).
2. Every PRD FR/NFR appears in `acceptance-criteria.md` either with a
   test reference or an explicit "deferred to Sprint N" marker.
3. The UAT script in `uat-script.md` has been dry-run against `develop`
   at least once with a written outcome.
4. The two checklists are linked from the PR template and the CHANGELOG.

## Where to find the implementation under test

The implementation lives on the `develop` branch. See:

- `app/` — the Next.js application (Sprints 0-2).
- `docs/sdlc/phase-4-implementation/` (on `develop`) — sprint summaries.
- `app/tests/unit/` (on `develop`) — current automated test suites.

This Phase 5 documentation lives on `main` and references those paths.

## Change log

| Date | Change | Author |
|---|---|---|
| 2026-05-26 | Phase 5 opened and closed in one pass; medium-depth scope. | QA Lead |
