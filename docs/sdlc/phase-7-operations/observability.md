# Observability

What we capture, where it lives, and who reads it. Cloudflare gives
us logs and basic metrics for free; we lean on those before adding
anything paid.

## Three signals

| Signal | What | Tool today | Tool tomorrow |
|---|---|---|---|
| Logs | Per-request lines from handlers and middleware | Cloudflare Workers logs (live tail) | Logpush → R2 → Athena-style query (Phase 8). |
| Metrics | Counts and percentiles of requests, errors, latency | Cloudflare Pages → Web Analytics + Workers Analytics | Prometheus-style metrics if we ever leave Pages. |
| Traces | Spans across a request (auth → handler → D1 → Azure) | None | OpenTelemetry through Workers Trace API (deferred). |

Tracing is genuinely useful only once the AI gateway is live (Sprint
3+). Until then, structured logs are sufficient.

## Logging conventions

Every log line is JSON, on a single line, written with `console.log`
(or `console.error` for sev-2+ situations). The shape is:

```json
{
  "ts": "2026-05-26T12:34:56.789Z",
  "level": "info" | "warn" | "error",
  "msg": "draft saved",
  "request_id": "req_abc123",
  "route": "/api/v1/drafts/:id",
  "method": "PATCH",
  "status": 200,
  "duration_ms": 14,
  "user_session_id": "anon-hash" ,
  "env": "production",
  "build": "v1.2.0"
}
```

Rules:

1. **No PII in logs.** Names, email bodies, draft contents, household
   data — none of it ever appears in log lines. We log ids and hashes.
2. **One line per request.** Handlers may add fields with `ctx.log()`
   (a small helper introduced in Sprint 5), but every request produces
   exactly one *summary* line at the end.
3. **Levels.**
   - `info` — request completed, normal.
   - `warn` — handled but unexpected (e.g. 4xx caused by client error
     that we recover from).
   - `error` — 5xx, unhandled rejection, dependency failure. Pages
     the on-call after rate-limited dedup.
4. **No stack traces in 4xx responses.** Stack traces stay in logs and
   never reach the user. The Problem Details body has a static
   `detail` string.

## What we log today vs tomorrow

| Today (Sprints 0-2) | Tomorrow (Sprint 5+) |
|---|---|
| `console.error` in the auth path | Full request summary line on every handler. |
| Nothing else (in-process MockProvider doesn't log) | AI gateway logs provider, model, prompt-token count, completion-token count (not content). |
| — | Outbound dependency status (D1 read, Azure call) with duration. |
| — | Background tasks (backup, restore drill) log start/end. |

A small `lib/log.ts` helper is part of the Sprint 5 work; until then,
the runbooks acknowledge that logs are sparse.

## Where the logs live

| Env | Path | Retention |
|---|---|---|
| Production | Cloudflare dashboard → Pages → Logs | 7 days hot in the dashboard. |
| Production (archive) | Logpush → R2 bucket `fa-logs-prod` | 90 days. Configured in Phase 7 follow-up. |
| Staging | Cloudflare dashboard → Pages → Logs | 7 days, no archive. |
| Local | The dev's terminal | None. |

Live tail commands:

```bash
wrangler pages deployment tail --project-name=fa-outlook-app --env=production
```

## Metrics

The Cloudflare Web Analytics panel gives us, per-route:

- Requests / second.
- Status code distribution.
- p50 / p75 / p99 latency.

Per-Worker analytics give us:

- Errors / second.
- CPU time distribution.
- Subrequests per request.

For SLO purposes we read those directly. We do not have a custom
metrics pipeline.

## Dashboards (planned)

A single Notion or Grafana dashboard pinned in the team channel,
showing:

| Tile | SLO it serves | Source |
|---|---|---|
| Uptime over 28 d | SLO-1 | UptimeRobot |
| p95 latency by route | SLO-2-4 | CF Web Analytics |
| Send success rate over 28 d | SLO-5 | CF logs |
| Cost month-to-date | (cost) | Azure cost panel + CF billing |
| Latest backup age | SLO-8 | R2 object metadata |

Dashboard build is a Sprint-5 follow-up.

## What we deliberately do NOT capture

- Email body contents — privacy.
- AI prompts or completions verbatim — privacy (NFR-PRIV-1) and
  cost (logs are expensive at scale).
- IP addresses beyond what Cloudflare already records.
- Browser fingerprints. We have no need.

## Privacy & retention review

The Tech Lead reviews this doc once per quarter to confirm:

- Retention windows match policy.
- No new log line slipped in that captures PII.
- The dashboard tiles still serve the SLOs and not vanity metrics.
