# v2 Roadmap

This is what comes *after* v1.0. v1.0 itself is whatever lands when
the cutover plan in Phase 6 runs and the deferred sprints (3-6) ship.
v2 is the version a *real customer* would touch.

## v1 → v2: the boundary

v1 ends when:

- Sprints 3-6 of Phase 4 are merged into `main`.
- The AzureProvider works and the AI surface is real.
- D1 is bound; nothing is in-memory.
- The cutover plan has run.
- One internal demo to a stakeholder has happened.

v2 starts when at least one of these is true:

- A real financial advisor has been promised access.
- A regulator or compliance question has been raised.
- A second customer-type segment (e.g. RIA firms vs solo advisors) is
  in the funnel.

Until then, we are still in v1.

## v2 themes

Each theme has a one-sentence problem, a one-sentence outcome, and
success criteria.

### T1. Real mail backend

- **Problem:** v1 mimics Outlook chrome but does not talk to any
  mail provider, so it can't actually be a real advisor's inbox.
- **Outcome:** The user signs in with Microsoft 365 (or Google) and
  the inbox is their actual mailbox, read-only first, then
  read/write.
- **Success:** A solo advisor can connect their M365 account in
  under 5 minutes and read their last 50 messages with the same
  three-pane UX.
- **Major risks:** Microsoft Graph rate limits; OAuth UX; PII at rest.

### T2. Multi-user auth & accounts

- **Problem:** Shared-password auth (TD-008) is fine for a demo, not
  for real customers.
- **Outcome:** Email-based magic-link login or M365 SSO. Per-user
  data isolation.
- **Success:** Two advisors on the same instance cannot see each
  other's drafts or clients. Pen-tested.
- **Major risks:** Session model rework; D1 partitioning.

### T3. AI second-act: summarisation + follow-ups in production

- **Problem:** v1 wires the surface but stops there. The killer
  use case — "give me a summary of an inbound 1,000-word email" —
  is not in advisors' hands yet.
- **Outcome:** Both `summarize` and `suggestFollowUps` are first-
  class UI flows with promptfoo evals.
- **Success:** > 60% of inbound emails that exceed 300 words are
  summarised by the user at least once. Eval suite blocks bad
  regressions in CI.
- **Major risks:** Prompt drift; cost.

### T4. Compose superpowers

- **Problem:** v1 compose is plain text. Real advisors paste tables,
  attach PDFs, and sign off with disclosures.
- **Outcome:** Rich text (markdown subset), attachments stored in R2,
  per-segment signature templates.
- **Success:** A user can attach a PDF and a disclosure block in
  under 10 seconds.
- **Major risks:** Attachment size and storage cost; HTML email
  rendering across mail clients.

### T5. Compliance posture

- **Problem:** D-004 in the charter said "no compliance" for v1.
  v2 cannot say that.
- **Outcome:** SOC 2 Type 1 readiness assessment done; the docs
  produced in Phases 0-7 form the bulk of the evidence.
- **Success:** A third-party assessor can complete a gap analysis
  from this repo's `docs/sdlc/` alone.
- **Major risks:** Scope creep; legal review cost.

### T6. Observability that earns its keep

- **Problem:** Phase 7's observability plan is good in theory but
  unprovable until data flows.
- **Outcome:** Dashboards tied to live SLOs; the on-call uses them in
  real incidents.
- **Success:** Two real incidents are resolved using the dashboards
  named in `phase-7-operations/observability.md` without ad-hoc
  query writing.
- **Major risks:** Sampling vs storage cost; PII leak in logs.

### T7. Self-serve onboarding

- **Problem:** Today, "demo" means "the Tech Lead sets it up".
- **Outcome:** A new advisor signs themself up, picks a segment
  profile for their book, and sees their own inbox.
- **Success:** Five advisors complete onboarding without help.
- **Major risks:** Account provisioning; cost guardrails per
  account.

## Prioritisation

Rank by (customer pain) × (revenue lift) ÷ (effort). The first three
themes are the obvious near-term order:

1. **T1 — Real mail backend.** Without this, nothing is a "real
   product".
2. **T2 — Multi-user auth.** Required for any pilot.
3. **T3 — Summarisation + follow-ups.** Highest "magic moment" once
   T1 + T2 are real.

T4-T7 come next, in the order they unblock the next two themes.

## Anti-goals

What v2 explicitly does *not* try to be:

- **A full CRM.** We integrate with the advisor's existing tools, we
  don't replace them.
- **A document signing service.** Hand off to DocuSign / Adobe Sign.
- **A calendar.** Hand off to whatever the advisor already uses.
- **A cross-vendor BI tool.** The dashboards we ship are for our own
  ops; advisors get their own.

## Target launch quarter

Approximate, written here to be challenged later:

| Theme | Quarter |
|---|---|
| T1 | Q1 2027 |
| T2 | Q1 2027 |
| T3 | Q2 2027 |
| T4 | Q2 2027 |
| T5 | Q2-Q3 2027 |
| T6 | Q3 2027 |
| T7 | Q4 2027 |

These dates are inputs to Phase 0 of the v2 program; they are not
commitments yet.

## What to revisit before kicking off v2

- Phase 0 charter — do the locked decisions still hold?
- Phase 1 PRD — most user stories are still valid, but acceptance
  criteria for AI features need re-scoping against real customer
  data.
- Phase 2 ADRs — ADR-007 (shared password) is overtaken by T2.
- Phase 3 threat model — re-do for multi-user.
- Phase 5 acceptance criteria map — port to v2.
- Phase 7 SLOs — likely tighten.
