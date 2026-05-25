# Phase 2 — Analysis & Planning

**Status:** Approved
**Date:** 2026-05-24

## Deliverables

| Document | Purpose |
|---|---|
| [adrs/](./adrs/) | 10 Architecture Decision Records, one per significant choice. |
| [roadmap.md](./roadmap.md) | MVP scope, exit criteria; directional V1 and V2. |
| [sprint-plan.md](./sprint-plan.md) | Sprint 0 through Sprint 6 plan tied to PRD requirements and user stories. |
| [risk-register.md](./risk-register.md) | Consolidated risk register (R-001 through R-015), scored and assigned. |
| [raci.md](./raci.md) | Responsibility matrix across SDLC activities and sprint ceremonies. |
| [budget.md](./budget.md) | People, cloud, LLM, contingency totals; baseline ~$258k for 14 weeks. |

## Phase 2 decisions (locked)

1. **Build approach:** greenfield rewrite in the same repo (ADR-001).
2. **Frontend framework:** Next.js (App Router) on Cloudflare via
   `next-on-pages` (ADR-002, ADR-006).
3. **Sprint cadence:** 2-week sprints, small team (2-3 eng + designer).
4. **ADR discipline:** full ADR template per decision, one file each.

These decisions feed Phase 3 (Design): system architecture diagrams,
ERD, OpenAPI spec, UX flows, and threat model.

## Open items carried into Phase 3

- Validate streaming on Cloudflare Workers (R-005, R-006) via a Sprint 0
  spike before architecture is finalized.
- Choose Outlook layout component patterns in shadcn/ui (depends on
  designer's Figma work).
- Decide on autocomplete library for recipient picker (likely `cmdk`).
