# RACI Matrix

**Phase:** 2 — Analysis & Planning
**Status:** Approved
**Date:** 2026-05-24

Legend:
- **R** Responsible — does the work
- **A** Accountable — owns the outcome (only one per row)
- **C** Consulted — input sought
- **I** Informed — kept in the loop

Roles:
- **Sponsor** — project sponsor (repo owner)
- **PM** — product manager / product lead
- **EL** — engineering lead
- **Eng** — engineer (any)
- **Des** — designer
- **QA** — QA (rotating engineering responsibility in MVP)
- **SecComp** — security / compliance reviewer (fractional)

---

## SDLC activities

| Activity | Sponsor | PM | EL | Eng | Des | QA | SecComp |
|---|---|---|---|---|---|---|---|
| Phase 0 scope and charter | A | R | C | I | I | I | C |
| Phase 1 PRD and user stories | C | A | C | I | C | I | I |
| Phase 1 success metrics | C | A | C | I | I | I | I |
| Phase 2 ADRs | I | C | A | R | C | I | C |
| Phase 2 sprint plan | I | R | A | C | C | C | I |
| Phase 2 risk register | A | R | C | C | C | C | C |
| Phase 3 UX design | I | C | I | I | A/R | C | I |
| Phase 3 system architecture | I | C | A | R | I | C | C |
| Phase 3 data model + ERD | I | C | A | R | I | C | I |
| Phase 3 API spec | I | C | A | R | I | C | I |
| Phase 3 threat model | I | C | A | C | I | C | R |
| Phase 4 implementation | I | I | A | R | C | C | I |
| Phase 4 code review | I | I | R | R | I | C | C |
| Phase 5 test plan | I | C | A | C | I | R | C |
| Phase 5 unit / integration tests | I | I | A | R | I | C | I |
| Phase 5 E2E tests | I | I | A | R | I | R | I |
| Phase 5 UAT with advisors | C | A | C | C | C | R | I |
| Phase 6 release decision | A | R | C | I | I | C | C |
| Phase 6 deploy to prod | I | I | A | R | I | I | I |
| Phase 7 incidents | I | I | A | R | I | C | C |
| Phase 7 cost monitoring | C | C | A | R | I | I | I |

---

## Per-sprint roles

| Activity | PM | EL | Eng | Des | QA |
|---|---|---|---|---|---|
| Sprint planning | A | R | R | C | C |
| Story refinement | A | R | R | C | C |
| Daily standup | R | R | R | R | R |
| Sprint demo | R | R | R | R | R |
| Sprint retro | A | R | R | R | R |

---

## Notes

- **A is non-delegable.** The accountable role signs off and is the
  escalation point.
- In MVP, the engineering lead doubles as the security reviewer for code
  changes; the fractional SecComp role consults on the threat model and
  any sensitive design decisions.
- QA is currently a shared engineering responsibility; promote to a
  dedicated role at V1 if scope expands.
