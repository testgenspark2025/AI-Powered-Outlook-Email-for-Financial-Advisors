# Roadmap

**Phase:** 2 — Analysis & Planning
**Status:** Approved
**Date:** 2026-05-24

The roadmap groups the work into MVP, V1, and V2. Only MVP is scoped in
detail; later versions are directional and will be re-planned after
MVP retrospective.

---

## MVP — Prototype Demo (Sprints 0 through 6, ~14 weeks)

**Theme:** ship a private, demonstrable, AI-assisted Outlook-style email
experience for a single advisor, with all four AI workflows working
end-to-end.

### MVP scope (must-have, from PRD)

- Greenfield Next.js app on Cloudflare Pages with D1 (ADR-001 to ADR-010).
- Login gate + 5 seeded clients with rich household data.
- Outlook-style UI: ribbon, folder tree, message list, reading pane.
- Client + household side panel in reading and compose contexts.
- Popup compose for reply, reply-all, forward, and new outbound.
- AI Draft with configurable depth (Light / Medium / Deep).
- Email summarization for long incoming emails.
- Suggested follow-ups (fixed catalog), with a Follow-ups view.
- Drafts auto-save; Sent Items view; mock send.
- Light/dark theme; basic settings (display name, signature).
- CI pipeline + preview deploys per PR.
- Mocked LLM provider in dev/test; Azure OpenAI in production.

### MVP non-goals

Out-of-scope items from the PRD remain out: real Outlook, real send,
multi-user, compliance, CRM/portfolio integration, mobile apps.

### MVP exit criteria

All of the following must be true:

- Every must-have requirement in PRD §7 implemented and integration-tested.
- All 14 must-have user stories pass acceptance criteria.
- Success metrics K-1 ≥ 15%, K-2 ≥ 50%, K-3 ≥ 90% on dogfood data.
- Technical KPIs T-1, T-2, T-3, T-7, T-8 within target.
- No P0 or P1 bugs open.
- Documentation (this docs/sdlc tree + a 1-page user demo guide) is
  current.

---

## V1 — Hardened Prototype (~6 to 9 months from kickoff)

**Theme:** make the prototype credible for early access partners and
investor demos.

Candidate themes (not yet scoped):

- Expand seeded client library to 10+; allow CSV import.
- Light auth: per-user accounts, basic roles (advisor, assistant).
- Templates library and reusable snippets.
- Calendar integration mock (suggested meeting times).
- Compliance "preview" feature: highlight risky phrases without blocking.
- Observability dashboard for LLM cost and acceptance rate.
- Cost guardrails: daily budget cap, alert on anomaly.

V1 enters formal planning only after MVP retrospective. Phase 2 may be
re-baselined.

---

## V2 — Toward Production (~12 to 18 months)

**Theme:** the prototype is convincing enough to invest in
production-grade foundations.

Candidate themes:

- Real Microsoft Graph integration (full ADR pack rewrite).
- Compliance posture: SEC 17a-4 archival hooks, supervision queue.
- Multi-tenant SaaS skeleton, billing, admin.
- CRM integrations (Salesforce, Redtail, Wealthbox).
- Portfolio data integration (Schwab, Fidelity APIs).
- Move off D1 to Postgres if data volume requires it (re-evaluate).

This is intentionally vague; concrete planning requires market validation
from V1.

---

## Sequencing rules

- MVP exit criteria must hold before V1 work begins.
- ADRs locked in Phase 2 are valid through MVP only. V1 reopens at least
  ADR-007 (auth) and may reopen ADR-006 (hosting) if multi-tenant is
  chosen.
- Risks logged in [risk-register.md](./risk-register.md) are reviewed at
  each sprint review and at the MVP exit gate.

---

## Visual summary

```
[ Phase 2 ] --> [ Phase 3 design ] --> [ Phase 4 build: Sprint 0..6 ] --> [ MVP demo ]
                                                  |
                                                  v
                                              [ Phase 5 QA in parallel ]
                                                  |
                                                  v
                                              [ Phase 6 release ]
                                                  |
                                                  v
                                          [ Phase 7 operate ] --> V1 planning
```
