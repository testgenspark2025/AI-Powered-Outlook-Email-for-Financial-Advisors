# Backup and Disaster Recovery

## What we back up

| Asset | Where it lives | Backup target | Frequency |
|---|---|---|---|
| D1 production database | Cloudflare D1 | R2 bucket `fa-backups-prod`, prefix `daily/` | Daily at 02:00 UTC |
| D1 staging database | Cloudflare D1 | R2 bucket `fa-backups-stg`, prefix `daily/` | Weekly |
| Repo (source of truth) | GitHub | GitHub mirror (origin + at least one developer's clone) | Continuous |
| Secrets | Cloudflare Pages + GitHub Actions | A sealed copy in 1Password / equivalent | On change |
| Backups themselves (one extra) | R2 prod bucket | R2 prod bucket, prefix `weekly-rolling/` | Weekly snapshot of the daily |

Notes:

- We do not back up Azure OpenAI; prompts are deterministic given the
  schema, and the model is provided by the vendor.
- We do not back up the in-memory drafts store; it is by definition
  not in any backup story until D1 is wired (Sprint 5).
- Logs in R2 (`fa-logs-prod`) are their own retention bucket; not
  part of DR.

## RPO and RTO

| Class | RPO (max data loss) | RTO (max recovery time) |
|---|---|---|
| Production database | 24 h | 2 h |
| Production application | 0 (stateless image) | 30 min |
| Secrets | 0 (we cycle them, never lose them) | 1 h |
| Logs | 24 h (we accept gaps) | n/a — informational |

These are the demo-grade targets. Move them to 6 h / 30 min in Phase 8
if the product is genuinely customer-facing.

## Backup procedure

A scheduled job (Cloudflare Cron Trigger, added in the Phase-7
activation list) runs:

```sh
# pseudo — actual implementation lives in scripts/backup.ts
TS=$(date -u +%Y%m%dT%H%M%SZ)
wrangler d1 export fa-outlook-db-prod --output /tmp/$TS.sql
wrangler r2 object put fa-backups-prod/daily/$TS.sql --file=/tmp/$TS.sql
```

We keep:

- 30 most recent daily backups (`daily/`).
- 12 most recent weekly backups (`weekly-rolling/`).

A lifecycle rule on the R2 bucket deletes objects older than that.

## Restore procedure

If `runbooks/rollback.md` (Phase 6) doesn't apply because the bad
state is older than the deploy backup, restore from the daily:

```sh
# 1. Pick the backup
wrangler r2 object list fa-backups-prod --prefix=daily/ | tail

# 2. Pull it down
wrangler r2 object get fa-backups-prod/daily/<file>.sql --file=/tmp/restore.sql

# 3. Apply it to a fresh D1 (do NOT overwrite the live DB blindly)
wrangler d1 create fa-outlook-db-restore
wrangler d1 execute fa-outlook-db-restore --file=/tmp/restore.sql

# 4. Smoke-test the restore DB by binding it to a preview deploy
#    (edit wrangler.toml temporarily; redeploy to a feature branch)

# 5. Once verified, swap the binding in prod's wrangler config
```

The "do not overwrite blindly" rule is intentional. Bad restores
have ended companies.

## Restore drill

Per SLO-9, we run a drill at least every 90 days. The drill:

1. The on-call picks a random daily backup from the last 7 days.
2. Restores it into `fa-outlook-db-restore` per the steps above.
3. Verifies row counts and a smoke test against a preview deploy
   bound to it.
4. Writes a one-page log under
   `docs/sdlc/phase-7-operations/drills/YYYY-MM-DD.md`.
5. Deletes the restore DB and the preview deploy.

If the drill fails, that *itself* opens a sev-2 incident.

## DR scenarios

| Scenario | Likelihood | Plan |
|---|---|---|
| Single bad migration | Likely | Rollback runbook (Phase 6) or restore from yesterday's backup. |
| Single record corruption | Likely | Spot-fix with `wrangler d1 execute` after writing a SQL patch and code-reviewing it. |
| Whole D1 database lost / unreachable | Unlikely | Wait for Cloudflare; if > 1 h, restore latest backup into a new D1 and re-point the binding. |
| Cloudflare region outage | Possible | We accept it for demo phase. Phase 8 considers multi-region. |
| Cloudflare account compromise | Unlikely but catastrophic | Rotate all secrets (`security-ops.md`), restore from backups into a new account. The repo + last sealed secrets bundle are the seeds. |
| Lost laptops, all developers | Unlikely but catastrophic | The repo on GitHub + the sealed secrets bundle in 1Password are sufficient to rebuild. The pre-launch checklist requires both. |

## Backup integrity check

Once a month, a cron job downloads the newest backup and runs:

```sh
sqlite3 ":memory:" ".read /tmp/restore.sql" "SELECT count(*) FROM clients;"
```

It posts the row count to `#fa-ops`. A failure or a sudden drop opens
a sev-3 ticket and queues a drill ahead of schedule.

## What we do NOT promise

- Point-in-time recovery between daily snapshots — Phase 8 if needed.
- Cross-cloud DR — Phase 8 if a customer demands it.
- Zero-RPO writes for "sent" messages. We accept up to 24 h of data
  loss for the demo; the user can resend.
