# Risk Register

**Phase:** 2 — Analysis & Planning
**Status:** Approved (baseline)
**Date:** 2026-05-24

Consolidated register, including risks raised in Phase 0 and Phase 1.
Reviewed at every sprint review and at the MVP exit gate.

Scoring (1 to 5 each):
- **Likelihood:** 1 rare, 5 very likely
- **Impact:** 1 trivial, 5 project-threatening
- **Score:** L × I (range 1 to 25). Threshold for active mitigation: ≥ 9.

---

## Active risks

| ID | Source | Description | L | I | Score | Owner | Mitigation | Status |
|---|---|---|---|---|---|---|---|---|
| R-001 | Phase 0 | Azure OpenAI quota or region availability delays cutover in Sprint 5. | 3 | 4 | 12 | Eng lead | Apply for access in Sprint 0; mock provider supports the full streaming contract so build proceeds unblocked; have OpenAI direct ready as a fallback behind the gateway. | Open |
| R-002 | Phase 0 | Mock client data feels unrealistic and weakens the demo. | 3 | 3 | 9 | Product lead | Use rich household data from existing prototype; expand to 5 handcrafted clients (P-1); add 1 to 2 longer thread examples. | Open |
| R-003 | Phase 0 | Prompt injection from email body affects tone or leaks system prompt. | 3 | 3 | 9 | Eng lead | Treat email body as untrusted; prompt structure with explicit role separation; output guardrails (regex for banned phrases). | Open |
| R-004 | Phase 0 | Scope creep toward real Outlook integration mid-build. | 4 | 4 | 16 | Project sponsor | Out-of-scope list in charter; change-request required to expand; weekly scope check at sprint review. | Open |
| R-005 | Phase 0 | Cloudflare Pages limitations for streaming LLM responses. | 2 | 3 | 6 | Eng lead | Sprint 0 spike validates streaming via `next-on-pages`. If broken, fall back to non-streaming UI (still acceptable per FR-CMP-6 with revised target). | Open |
| R-006 | Phase 1 | Streaming through `next-on-pages` may hit subrequest or duration limits. | 3 | 3 | 9 | Eng lead | Same Sprint 0 spike covers this; budget Workers CPU time to 60s. | Open |
| R-007 | Phase 1 | Configurable depth feature confuses users in demos. | 3 | 2 | 6 | Design lead | Default to Medium; tooltips per option; usability test in Phase 3. | Open |
| R-008 | Phase 1 | Follow-up actions feel hallucinated. | 3 | 3 | 9 | Eng lead | Constrain output to fixed action catalog; reject non-catalog actions. | Open |
| R-009 | Phase 1 | 5 clients feel too narrow for a wealth-segment demo. | 2 | 2 | 4 | Product lead | Seed data is a JSON file; easy to extend post-MVP. | Open |
| R-010 | Phase 2 | Greenfield rewrite drifts from prototype features (ADR-001). | 3 | 4 | 12 | Eng lead | Feature parity checklist tied to PRD FR-IDs; cutover gate in Sprint 6. | Open |
| R-011 | Phase 2 | `@cloudflare/next-on-pages` lags upstream Next.js (ADR-002, ADR-006). | 3 | 3 | 9 | Eng lead | Pin to a supported Next.js minor; subscribe to adapter releases. | Open |
| R-012 | Phase 2 | LLM cost overrun during dogfood (NFR-10). | 3 | 3 | 9 | Eng lead | Daily token budget per environment; alert on threshold; mock provider is default in dev. | Open |
| R-013 | Phase 2 | Flaky E2E tests block merges (ADR-009, ADR-010). | 3 | 2 | 6 | Eng lead | Auto-retry once; quarantine label; root-cause within one sprint. | Open |
| R-014 | Phase 2 | Shared password leaks publicly (ADR-007). | 2 | 3 | 6 | Project sponsor | Rotation via redeploy; rate limit `/login`; do not share in public channels. | Open |
| R-015 | Phase 2 | Single advisor product validation is too narrow to inform V1. | 3 | 3 | 9 | Product lead | Run UAT with 3 to 5 advisors before MVP exit; collect structured feedback. | Open |

---

## Closed / accepted risks

None at baseline.

---

## Review cadence

- Sprint review (every 2 weeks): score and mitigation update.
- Phase exit (MVP gate): every open risk reviewed; either closed,
  accepted, or carried into V1.
