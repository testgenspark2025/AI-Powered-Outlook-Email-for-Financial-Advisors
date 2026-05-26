# SLOs and SLIs

## Vocabulary

- **SLI** — Service Level Indicator. A measurable number, e.g. "p95
  latency of `GET /api/v1/emails`".
- **SLO** — Service Level Objective. A target on that number, e.g.
  "p95 < 300 ms over a rolling 28-day window".
- **Error budget** — `1 - SLO`. The room we have to be unhealthy
  before alerting fires. We spend it on releases, experiments,
  outages, etc.

The SLOs below are **demo-grade** numbers. They tighten when the
product moves past a private demo into a real customer pilot (Phase 8).

## SLO table

| # | What | SLI source | SLO target | Window | Budget |
|---|---|---|---|---|---|
| SLO-1 | Production uptime | Uptime probe on `/api/v1/health` | 99.5% | 28 days | 3.4 h / 28 d |
| SLO-2 | Latency of inbox load | p95 of `GET /api/v1/emails?folder=inbox` from CF logs | < 300 ms | 28 days | — |
| SLO-3 | Latency of read open | p95 of `GET /api/v1/emails/:id` | < 250 ms | 28 days | — |
| SLO-4 | Latency of draft autosave | p95 of `PATCH /api/v1/drafts/:id` | < 400 ms | 28 days | — |
| SLO-5 | Send success rate | `2xx` on `POST /api/v1/emails` divided by total | ≥ 99.9% | 28 days | 0.1% |
| SLO-6 | AI first-token latency | Time-to-first-token from `/api/v1/ai/draft-reply` SSE | p95 < 2 s | 28 days | — |
| SLO-7 | AI request success rate | `2xx` from any `/api/v1/ai/*` route | ≥ 99% | 28 days | 1% |
| SLO-8 | Backup freshness | Age of newest backup in R2 | ≤ 25 h | rolling | — |
| SLO-9 | Restore drill recency | Time since the last successful restore drill | ≤ 90 days | rolling | — |

Notes:
- SLO-1 (99.5%) is the realistic ceiling once Cloudflare Pages + D1 +
  Azure OpenAI are all in the path. Promise it, then chase it.
- SLO-5 (99.9% send) is deliberately tighter than uptime; sending a
  message is the most consequential write in the system.
- SLO-6 and SLO-7 are **deferred** until Sprint 3 lands the AI surface.
  Until then, the AI endpoints are exercised by tests only.

## Where the numbers come from

| SLI | Source | Notes |
|---|---|---|
| Uptime | UptimeRobot (or equivalent) hitting `/api/v1/health` every 60 s | Free tier is enough. |
| Latency | Cloudflare Pages "Web Analytics" + logs | Per-route percentiles. |
| Success rates | CF logs filtered by status code | We compute the ratio per route per day. |
| AI first-token | SSE timestamps emitted by the gateway | Wired in Sprint 3. |
| Backup freshness | Object metadata in R2 (`Last-Modified`) | Cron writes the daily backup. |
| Restore drill | Run log under `docs/sdlc/phase-7-operations/drills/` | Manual, but the log is the source. |

## Error budget policy

If we exceed the error budget for SLO-1 or SLO-5 in any rolling
28-day window:

1. New feature work pauses for one sprint.
2. The team holds a "reliability sprint" — only bugs, observability,
   and runbook improvements.
3. The Tech Lead reports the burn at the next weekly ops review.

If we're under budget consistently, we either tighten the SLO or
spend the surplus on calculated risks (experiments, faster releases).

## What is NOT in this SLO table

- Time to first AI summary token — out of scope until Sprint 4.
- Search latency — there's no search yet.
- Compose autosave consistency across tabs — single-user prototype.
- Anything about cost — covered separately in `cost-and-capacity.md`.

## Review cadence

The SLO table is reviewed:

- Quarterly by the Tech Lead.
- Immediately after any sev-1 incident, in the postmortem.
- When entering Phase 8 (Evolution) to set v2 targets.
