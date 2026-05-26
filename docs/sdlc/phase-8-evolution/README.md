# Phase 8 — Evolution & Retirement

**Status:** Approved
**Date:** 2026-05-26
**Owner:** Product (RACI A); Tech Lead (R); QA Lead (C); whole team (I)

The last phase in the SDLC. It is also the *first* phase of every
next version: it captures how the product changes over time, how
debt is tracked and paid down, what v2 looks like, when and how a
feature (or the whole product) gets retired, and the lessons that
the next program should not have to learn again.

## Locked decisions carried in

| ID | Decision | Effect on Phase 8 |
|---|---|---|
| D-Phase5-Pause | Phase 4 paused at Sprint 2. | The v2 roadmap explicitly reclaims the deferred Phase 4 work (Sprints 3-6) as v1.1 / v1.2 — not as v2 features. |
| D-Phase5-Depth | Medium. | No new ADRs in this phase. |
| D-Phase5-TargetEnv | Local dev only today. | The evolution loop runs on real usage data — so the activation trigger for "use metrics to decide" is the first staging deploy. Until then this is doctrine. |

## Deliverables in this phase

| Doc | Purpose |
|---|---|
| [versioning-and-deprecation.md](./versioning-and-deprecation.md) | API + UI versioning, deprecation windows, breaking-change protocol. |
| [tech-debt.md](./tech-debt.md) | Current debt register with impact, effort, and owner. Auto-collected from the carry-overs in Phases 4-7. |
| [v2-roadmap.md](./v2-roadmap.md) | The major themes beyond v1 and the success criteria for each. |
| [feedback-loop.md](./feedback-loop.md) | How user feedback + SLO data + business metrics turn into a backlog. |
| [retro-template.md](./retro-template.md) | Sprint, release, and program retro template. |
| [sunset-policy.md](./sunset-policy.md) | When and how a feature or the product is retired. |
| [lessons-learned.md](./lessons-learned.md) | What Phases 0-7 taught us; the next program reads this first. |
| [closing-summary.md](./closing-summary.md) | The single page that summarises the whole SDLC walk-through. |

## How Phase 8 plugs into the rest

```
   Phase 7   ──── SLO burn, incidents, cost ─────►   Phase 8 backlog
   Customers ──── feedback, NPS, requests ─────►    (feedback-loop.md)
   Phase 6   ──── what hurt during a release ─►    Phase 8 retros
   Tech team ──── carry-overs, shortcuts ─────►    Phase 8 tech-debt
                                                          │
                                                          ▼
                                                   v2-roadmap.md
                                                          │
                                                          ▼
                                            Phases 0-7 of the next major
```

The program does not end. Phase 8 closes a loop that feeds straight
into the next program's Phase 0.

## Exit criteria

Phase 8 is "approved" when:

1. The 8 documents above exist and are reviewed by RACI A (Product).
2. The tech-debt register reflects every carry-over named in
   Phases 4-7.
3. The v2 roadmap names a target launch quarter (even if approximate)
   and explicit success criteria.
4. The closing-summary is published as the README for the SDLC
   directory's "what did we build?" question.

This phase is *not* time-bounded; it stays open as the loop. Each
release closes some items and opens others.

## Change log

| Date | Change | Author |
|---|---|---|
| 2026-05-26 | Phase 8 opened and closed in one pass; medium-depth. | Product |
