# Phase 7 — Operations & Maintenance

**Status:** Approved (theoretical — see D-Phase5-TargetEnv)
**Date:** 2026-05-26
**Owner:** Tech Lead (RACI A); SRE / on-call holder (R); QA Lead (C); Product (I)

This phase defines how the running system stays healthy: what we
measure, what we alert on, what we do when something breaks, how we
keep data, and how the on-call human spends their time.

## Locked decisions carried in

| ID | Decision | Effect on Phase 7 |
|---|---|---|
| D-Phase5-Pause | Phase 4 paused at Sprint 2. | The SLOs and alerts are sized for the demo footprint (single advisor, 5 seeded clients, mock LLM). They scale up in Phase 8. |
| D-Phase5-Depth | Medium. | No new ADRs. The Cloudflare Pages + D1 + Azure choices stand. |
| D-Phase5-TargetEnv | Local dev only today. | Every document here is theoretical until the first staging deploy. The "activate" triggers are explicit per doc. |

## Deliverables in this phase

| Doc | Purpose |
|---|---|
| [slos-and-sli.md](./slos-and-sli.md) | The numbers we promise: availability, latency, error rate, freshness. |
| [observability.md](./observability.md) | Logging, metrics, and tracing — what we capture, where it lives, who reads it. |
| [alerting.md](./alerting.md) | Which SLO breach pages whom, how fast, and through what channel. |
| [incident-response.md](./incident-response.md) | Severity ladder, on-call expectations, comms templates, postmortem trigger. |
| [backup-and-dr.md](./backup-and-dr.md) | RPO/RTO, what we back up, how we test restores. |
| [security-ops.md](./security-ops.md) | Key rotation, dependency audit, threat-model follow-through. |
| [cost-and-capacity.md](./cost-and-capacity.md) | Budget tracking, cost alerts, and when to scale (or stop). |
| [postmortems/template.md](./postmortems/template.md) | Blameless postmortem template. |
| [checklists/on-call-handoff.md](./checklists/on-call-handoff.md) | What the outgoing on-call hands to the incoming one. |
| [checklists/weekly-ops-review.md](./checklists/weekly-ops-review.md) | Standing 30-minute weekly meeting agenda. |

## How this phase relates to the others

- Phase 3's threat model and Phase 6's runbooks are the upstream
  artifacts. This phase doesn't replace them; it tells you when to
  read them.
- Phase 5's release-signoff gates 12-13 (deploy runbook reviewed, last
  backup tag) tie back into Phase 7 reality once the first staging
  deploy runs.
- Phase 8 will reuse the SLO numbers as inputs to the v2 roadmap.

## Activation trigger

Every plan and runbook in this phase is *dormant* until the first
staging deploy completes (Phase 6, `runbooks/deploy.md` against
`ENV=staging`). At that moment, the Tech Lead:

1. Stands up the on-call rotation (even if it's "Tech Lead this
   week").
2. Wires the alerts in `alerting.md` to a real channel.
3. Schedules the first weekly ops review.
4. Runs a restore drill from a fresh backup within 14 days.

## Phase 7 exit criteria

The phase is "done" when:

1. The 10 documents above are reviewed and approved by RACI A (Tech
   Lead).
2. Each SLO in `slos-and-sli.md` has a named SLI source (where the
   number comes from) and a named alert in `alerting.md`.
3. The postmortem template is referenced from the Phase 5
   `defect-management.md` doc (it is).
4. The on-call rotation has at least one named human, even if it is
   the same person all weeks.

## Change log

| Date | Change | Author |
|---|---|---|
| 2026-05-26 | Phase 7 opened and closed in one pass; medium-depth, theoretical. | Tech Lead |
