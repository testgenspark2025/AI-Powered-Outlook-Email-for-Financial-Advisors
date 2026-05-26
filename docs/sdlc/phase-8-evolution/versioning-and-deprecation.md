# Versioning & Deprecation

How the product evolves without breaking the people who already use
it.

## Product version

SemVer at the repo level — same as the release process in Phase 6:

| Bump | Trigger |
|---|---|
| MAJOR | A user-visible flow changes in a way that requires re-training or that breaks a documented API. |
| MINOR | A new user-visible feature ships. |
| PATCH | Bug fixes, dependency bumps, copy. |

The current target for the first production tag is `v1.0.0` — the
output of the Phase 4 cutover when it runs. Until then, internal
demo tags are `rc-YYYY-MM-DD`.

## API version

The REST API is versioned in the URL: `/api/v1/...`. Per ADR-011.

Promotion rules:

1. `/api/v1` is stable. Once a contract is published in
   `phase-3-design/api/openapi.yaml`, we may only make *additive*
   changes inside `v1`. New optional fields, new endpoints, new query
   params — all fine. Removing or renaming anything is not.
2. A breaking change starts `/api/v2` alongside `/api/v1`. The two
   coexist for the deprecation window (below).
3. The handlers may share code, but the schemas must not. A
   breaking change in `v2` does not silently change `v1`.

## Deprecation window

When we mark something deprecated in `/api/v1`:

| When | What happens |
|---|---|
| T=0 | Release notes name the deprecation. The endpoint or field gains a `Deprecation` HTTP header with a date. The OpenAPI spec marks the field `deprecated: true`. |
| T+30 days | We email every known integrator (today: zero — internal use only). |
| T+60 days | Server logs a `warn` line whenever the deprecated path is hit. |
| T+90 days | Cutoff. The deprecated path returns `410 Gone` with a Problem Details body that names the replacement. |

Until we have an external integrator, this windowing is theoretical
but we still follow it — it builds the muscle.

## UI deprecation

UI surfaces are harder to "version". We apply the same spirit:

1. A user-visible flow is replaced, not silently mutated.
2. The old flow stays available behind a "Use the previous version"
   link for 30 days where reasonable.
3. The release notes show before/after screenshots.

If the new flow is a strict superset (no removed actions), this
process can be skipped and the change ships as a MINOR.

## Breaking-change protocol

A breaking change requires, in order:

1. A short proposal in `docs/sdlc/phase-8-evolution/proposals/` named
   after the version it targets (`v2.0-compose-rework.md`).
2. A decision recorded in the proposal (Product + Tech Lead sign-off).
3. An entry in this doc's "Active deprecations" table.
4. An ADR (back to Phase 2 ADR cadence) if the change affects an
   architecture decision.

## Active deprecations

| Path / field | Since | Cutoff | Replacement | Notes |
|---|---|---|---|---|
| (none today) | — | — | — | Nothing is deprecated yet. |

When the first row exists, the on-call also adds a banner to the
internal status page so customer-facing rollouts can be timed.

## Data versioning

| Layer | Versioning |
|---|---|
| D1 schema | Drizzle migrations; one file per change, numbered `NNNN_*.sql`. |
| Seed data | Plain TS modules; not "versioned" beyond git history. |
| Backups in R2 | The filename contains a UTC timestamp. |
| OpenAPI spec | Lives in `phase-3-design/api/openapi.yaml`. Each MAJOR bumps `info.version`. |

## Documentation versioning

The SDLC docs in this repo are *living*. We don't snapshot them per
release; instead each doc has a "change log" section at the bottom.
Major redoctrines bump the change log; small edits don't.

The OpenAPI spec is the one exception — it freezes at each MAJOR.
When `v2` lands, the file becomes
`phase-3-design/api/openapi-v2.yaml`, and the v1 file stays untouched
as a historical record.

## What we deliberately do NOT do

- We don't expose multiple "channels" (stable / beta) to end users.
  There's no UI selector for "experimental features" in v1 scope.
- We don't ship behind feature flags by default. Feature flags exist
  only for the cost-throttle ladder (Phase 7) and for incident
  mitigation, not for slow rollouts.
- We don't run blue/green in v1. We rely on Cloudflare Pages'
  per-deploy URLs and the rollback runbook (Phase 6).

These choices match prototype scope; revisit in v2.
