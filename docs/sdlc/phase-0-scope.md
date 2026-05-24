# Phase 0 — Scope & Project Charter

**Status:** Approved
**Date:** 2026-05-24
**Owner:** Project sponsor
**Project:** Financial Advisor Outlook — AI-Powered Client Communications

---

## 1. Project Mission

Build a demonstrable, AI-assisted email composition experience for a single
independent financial advisor. The experience should look and feel like
Microsoft Outlook, surface rich client and household context while drafting
client emails, and use a large language model to personalize replies.

The deliverable is a working prototype suitable for product validation,
investor demos, and as the foundation for a future production product. It is
**not** a regulated, customer-deployed financial application at this stage.

---

## 2. Scope Decisions

These decisions are locked for Phase 0. Changes must go through a formal
change request and re-baseline the plan.

| # | Decision Area | Decision | Rationale |
|---|---|---|---|
| D-001 | Target user | Solo independent advisor (single user) | Minimizes scope; avoids multi-tenant, billing, and admin surface area. Easiest path to a usable prototype. |
| D-002 | Outlook integration depth | Outlook-style UI only (mock mailbox) | No Microsoft Graph, no Azure AD, no M365 licensing. Eliminates the largest integration risk and lets the team focus on the AI experience. |
| D-003 | LLM provider | Azure OpenAI | Chosen for forward-compatibility with regulated financial services use cases (data residency, no training on inputs). Even though compliance is not in scope now, the choice avoids rework later. |
| D-004 | Compliance posture | None (prototype/demo) | No SEC/FINRA controls, no archival, no supervisory review queue. Will be flagged as a gap and revisited if/when the project moves toward production. |

---

## 3. In Scope

The following capabilities are explicitly included in this build:

- Outlook-style web UI (ribbon, folder tree, message list, reading pane,
  popup compose) — extending what already exists in the prototype repo.
- Mock inbox with seeded client emails (no real mail server).
- Rich client and household profile data, surfaced in a side panel when
  composing.
- 10 wealth-client segments with characteristic tone, challenges, and
  communication style.
- AI-assisted email drafting via Azure OpenAI:
  - Personalized draft based on client profile, household, segment, and the
    incoming email.
  - Streaming response in the compose window.
  - Editable draft; user can regenerate.
- Basic local persistence (browser localStorage or simple key-value store)
  so a user can return to drafts.
- Light/dark theme toggle (already in prototype).
- Single-user authentication: a simple shared password or no auth (prototype
  context).

---

## 4. Out of Scope

These items are intentionally excluded from this build. They are recorded
here so stakeholders cannot assume they exist.

- Real Microsoft Graph / Outlook / Office 365 integration.
- Sending real email through SMTP, SES, SendGrid, or any provider.
- Multi-user, multi-tenant, or firm-team features (no roles, no admin).
- Billing, subscriptions, or licensing.
- Regulatory compliance controls: audit log retention per SEC 17a-4,
  archival forwarding (Smarsh / Global Relay), FINRA Rule 2210 supervision,
  WORM storage, e-discovery hooks.
- CRM integration (Salesforce, Redtail, Wealthbox).
- Custodian / portfolio data integration (Schwab, Fidelity).
- Market data / news enrichment.
- Mobile apps (web responsive only).
- Internationalization (English/US only).
- Production-grade SLAs, on-call rotation, DR drills.

---

## 5. Constraints

- **Budget:** prototype budget; no enterprise contracts (Smarsh, LaunchDarkly,
  Datadog, etc.). Use free tiers and open-source where possible.
- **Timeline:** target a working prototype in 6 to 8 sprints (12 to 16 weeks)
  with a small team.
- **Hosting:** continue on Cloudflare Pages / Workers to match the existing
  prototype, unless a Phase 2 ADR overrides this.
- **Data residency:** US region for Azure OpenAI deployment.
- **Privacy:** no real client PII in seed data — only fabricated profiles
  (Robert Sterling, Dr. Sarah Martinez, Jennifer Chen, etc.).

---

## 6. Assumptions

- An Azure subscription with access to Azure OpenAI (gpt-4-class model) will
  be provisioned before Phase 4 starts.
- A single GitHub repository owner has rights to push and to enable CI.
- No real advisor or client data will be loaded into the prototype.
- The existing repository (`testgenspark2025/AI-Powered-Outlook-Email-for-Financial-Advisors`)
  is the system of record for code and documentation.

---

## 7. Success Criteria

The prototype is considered successful when:

1. A user can open the app, select any of the seeded client emails, and see
   the client and household context panel populated.
2. A user can click an "AI draft" action, and within 5 seconds receive a
   streaming response that references the client's name, segment, and at
   least one household-specific fact.
3. The user can edit and "send" the draft (mock send), and the message
   appears in a local Sent Items view.
4. A demo of the above can be recorded and shared without manual reset
   between runs.
5. The repository contains documented Phase 0 to Phase 8 deliverables that
   a new engineer can read and understand the project.

---

## 8. Known Risks (Phase 0)

| Risk ID | Description | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-001 | Azure OpenAI quota / region availability delays | Medium | High | Apply for access early; have OpenAI direct as a fallback behind a gateway. |
| R-002 | Mock data feels unrealistic to advisors during demo | Medium | Medium | Use the existing rich household data; expand to 8 to 10 clients. |
| R-003 | Prompt injection from email body affects draft tone or leaks system prompt | Medium | Medium | Treat email body as untrusted input; structured prompts with explicit role separation. |
| R-004 | Scope creep toward "real" Outlook integration mid-build | High | High | Documented out-of-scope list; change request required to expand. |
| R-005 | Cloudflare Pages limitations for streaming LLM responses | Low | Medium | Validate streaming in a Sprint 0 spike before committing. |

---

## 9. Open Questions (deferred to Phase 1)

- How many seeded clients do we want in the demo? (3 today; consider 8 to 10.)
- Should the prototype support attachments in compose? (Default: no.)
- Should drafts persist across browsers/devices? (Default: no, local only.)
- Do we want a "compliance preview" feature even though full compliance is
  out of scope? (Default: no; flagged as a stretch goal.)

---

## 10. Stakeholders

| Role | Name / Notes |
|---|---|
| Project sponsor | Repo owner |
| Product lead | TBD |
| Engineering lead | TBD |
| Demo audience | Financial advisors (validation), prospective investors |

---

## 11. Sign-off

Scope and decisions above are approved as the baseline for Phase 1 planning.

- Decisions D-001 through D-004 are locked.
- Out-of-scope list is binding; additions require a written change request.
- This document supersedes any conflicting verbal agreements made before
  2026-05-24.
