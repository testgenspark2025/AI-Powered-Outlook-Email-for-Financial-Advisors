# Alerting

The bridge from `slos-and-sli.md` (the numbers) to a human's phone.
Every alert here ties to exactly one SLO and to exactly one on-call.

## Principles

1. **No alert without an SLO.** If we can't say which target this
   alert protects, we don't fire it.
2. **No alert without a runbook.** Every alert links to a section of
   `incident-response.md` or a runbook in `phase-6-deployment/runbooks/`.
3. **Page only on user-visible problems.** Backups failing is
   important but not page-worthy; uptime is.
4. **Snooze ≠ silence.** Snoozed alerts auto-fire again at the
   snooze deadline. Silenced alerts require an explicit incident
   ticket to silence.

## Alert table

| # | Name | SLO | Trigger | Severity | Route | Runbook |
|---|---|---|---|---|---|---|
| A-1 | Production down | SLO-1 | UptimeRobot misses 2 consecutive 60-s probes | sev-1 | Page on-call (SMS) | `incident-response.md` → "Production down" |
| A-2 | Send route 5xx spike | SLO-5 | `POST /api/v1/emails` 5xx rate > 1% over 10 min | sev-1 | Page on-call (SMS) | `incident-response.md` → "Send failing" |
| A-3 | Inbox latency burn | SLO-2 | p95 of `GET /api/v1/emails` > 600 ms over 30 min | sev-2 | Slack `#fa-ops` mention | `incident-response.md` → "Latency burn" |
| A-4 | AI request failure | SLO-7 | `2xx` rate on `/api/v1/ai/*` < 97% over 30 min | sev-2 | Slack `#fa-ops` mention | `incident-response.md` → "AI degraded" |
| A-5 | Backup missed | SLO-8 | Newest backup older than 25 h | sev-3 | Slack `#fa-ops` notice | `backup-and-dr.md` → "Backup missed" |
| A-6 | Restore drill overdue | SLO-9 | Last drill > 90 days | sev-3 | Slack `#fa-ops` notice (once per week) | `backup-and-dr.md` → "Drill cadence" |
| A-7 | Cost budget burn | (cost) | Month-to-date Azure spend > 80% of monthly cap | sev-2 | Slack `#fa-ops` mention + email Product | `cost-and-capacity.md` |
| A-8 | Cost budget breach | (cost) | Month-to-date Azure spend > 100% of monthly cap | sev-1 | Page on-call + email Product | `cost-and-capacity.md` |
| A-9 | Pages build failed on `main` | release | CI fails on `main` after a tag | sev-2 | Page release driver | `release-process.md` → "Tag and release" |
| A-10 | Health endpoint changed shape | release | `/api/v1/health` returns non-200 *or* an unexpected JSON shape | sev-1 | Page on-call | `incident-response.md` → "Production down" |

## Routing

| Route | Tool today | Tool tomorrow |
|---|---|---|
| Page on-call (SMS) | PagerDuty *or* a free webhook → personal phone | When the team is larger: a real PagerDuty service. |
| Slack `#fa-ops` mention | Slack webhook | Same, with an opsgenie-style ack flow. |
| Slack `#fa-ops` notice | Slack webhook | Same. |
| Email Product | Standard email | Same. |

## De-duplication and noise control

- Alerts are de-duped by `(alert_name, env)` for 15 minutes by default.
  An incident can extend it.
- A flapping alert (`> 3` transitions in 30 min) auto-escalates one
  severity level.
- A maintenance window silences a list of alerts for a given start /
  end. The on-call records the window in `runbooks/`.

## What we explicitly do NOT alert on

| Symptom | Why we don't page |
|---|---|
| A single 5xx | Noise. We page on rates. |
| A slow request occasionally | The percentile alerts already catch this. |
| Dependency warnings on build | Reviewed weekly in the ops review. |
| Theme toggle bugs | Sev-3 at worst; the bug board handles it. |

## Activation order (when the env goes live)

1. Configure UptimeRobot probe → SLO-1 alert (A-1) → personal phone.
2. Enable Cloudflare Web Analytics on the project.
3. Wire the Slack webhook to `#fa-ops` and post a test message.
4. Set the Azure budget alert at 80% and 100% (A-7, A-8).
5. Enable the daily backup cron; verify A-5 fires when paused.

Each step lives in the Phase-7 follow-up task list.

## Quarterly review

The Tech Lead reviews this file every quarter and at every postmortem
to:

- Remove alerts that haven't fired in a year (or were always wrong).
- Add alerts that *should* have fired during incidents but didn't.
- Re-check that every alert has a current runbook link.
