# Deployment Architecture

## Topology at a glance

```
                ┌──────────────────────────────────────┐
                │           Cloudflare DNS             │
                │   fa.example.com (apex)              │
                │   *.fa.example.com (preview)         │
                └────────────────┬─────────────────────┘
                                 │
                                 ▼
                ┌──────────────────────────────────────┐
                │       Cloudflare Pages project        │
                │       fa-outlook-app                  │
                │   - Production: main                   │
                │   - Preview:    pr-*, develop, tags    │
                │   - Edge runtime (Next.js on Pages)    │
                └──────┬───────────────────┬────────────┘
                       │                   │
              binds to │                   │ env vars (encrypted)
                       ▼                   ▼
              ┌────────────────┐   ┌────────────────────┐
              │  D1 database    │   │  Cloudflare Pages  │
              │  fa-outlook-db  │   │  Project secrets   │
              │  (per env)      │   │  (per env)         │
              └────────┬────────┘   └────────────────────┘
                       │
              optional │ scheduled
                       ▼
              ┌────────────────┐
              │  R2 bucket      │  ← weekly D1 export (Phase 7)
              │  fa-backups-*   │
              └────────────────┘

                 ┌─────────────────────────────────┐
                 │  Azure OpenAI                    │  ← outbound only
                 │  resource: fa-outlook-aoai-*     │     per env
                 └─────────────────────────────────┘
```

## Environments

| Env | Branch / trigger | URL pattern | D1 database | LLM | Notes |
|---|---|---|---|---|---|
| Local dev | any working tree | `localhost:3000` | local `wrangler d1` (file) | MockProvider | What we use today. |
| Preview | every PR + `develop` push | `https://<sha>.fa-outlook-app.pages.dev` | `fa-outlook-db-preview` (shared) | MockProvider | Auto, per ADR-006. |
| Staging | tag `staging-*` | `https://staging.fa.example.com` | `fa-outlook-db-staging` | Azure sandbox key | Smoke + perf rehearsal. |
| Production | tag `vX.Y.Z` on `main` | `https://fa.example.com` | `fa-outlook-db-prod` | Azure prod key | The "demo" env. |

Notes:
- Preview shares a single D1 database across all PRs by design — it
  is treated as throw-away. Migrations applied to preview must be
  idempotent enough to survive multiple PRs touching the schema.
- Staging and production each have *their own* D1 database. There is
  no shared D1 across environments.
- The Azure resource is paired one-to-one with the env. We do not
  cross keys.

## Build & runtime

| Item | Value |
|---|---|
| Runtime | Cloudflare Workers / Pages (Edge) |
| Build command | `cd app && pnpm install --frozen-lockfile && pnpm build` |
| Output directory | `app/.vercel/output/static` (via `@cloudflare/next-on-pages`) |
| Node version for build | 20 (matches CI; matches Cloudflare Pages build image) |
| Package manager | pnpm 9.15.9 (per ADR-010) |
| Next.js version | 15.0.3 |

The Pages project is configured to run `npx @cloudflare/next-on-pages`
as the post-build step. That command rewrites the `.next` output to
the format Pages serves.

## Bindings

Configured in `app/wrangler.toml` (created when Sprint 5 ships):

| Binding | Type | Pointed at | Notes |
|---|---|---|---|
| `DB` | D1 | `fa-outlook-db-<env>` | Drizzle dialect = `sqlite`. |
| `AOAI` | secret | Azure OpenAI endpoint + key | Per env. |
| `SESSION_SECRET` | secret | 64-hex string | Per env. |
| `SHARED_PASSWORD` | secret | per-env value | Per env. Demo only. |

The application reads bindings through Next on Pages' helper, never
directly via `process.env` at runtime in handlers.

## DNS

| Record | Type | Value | Notes |
|---|---|---|---|
| `fa.example.com` | CNAME | `<project>.pages.dev` | Production. |
| `staging.fa.example.com` | CNAME | `<project>.pages.dev` | Custom domain alias. |
| `*.fa.example.com` | (no record) | Pages handles preview subdomains. | |

DNS lives in Cloudflare and is managed by hand in the dashboard for
now. When we add Terraform (Phase 7), it moves to code.

## Secrets

| Where | What | Rotation |
|---|---|---|
| Cloudflare Pages project → Settings → Environment Variables | `SESSION_SECRET`, `SHARED_PASSWORD`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_KEY` | Quarterly + on personnel change. |
| GitHub Actions secrets | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | Quarterly. Token is scoped to Pages + D1 only. |
| Local `.env.local` | Same as Pages, dev values only | Not rotated; developer's own machine. |
| Repo (committed) | none | — |

No secret is ever committed. The pre-merge checklist (Phase 5) has a
"no secret committed" line; the release-day checklist re-verifies.

## Failure domains

| Failure | Blast radius | Mitigation |
|---|---|---|
| Cloudflare Pages outage | All envs hosted on Pages | Status page; document a fallback hosting target in Phase 7 (deferred). |
| D1 outage | The env that owns that DB | Same env's app degrades to read-only for inbox (seeds), compose returns 5xx until DB returns. |
| Azure OpenAI outage | AI features only | Provider gateway falls back to MockProvider; banner in UI says "AI temporarily unavailable" (deferred to Sprint 5). |
| Bad migration | The env we ran it on | Rollback runbook + nightly D1 export. |

## Cost

| Item | Provider | Free tier headroom | Notes |
|---|---|---|---|
| Pages | Cloudflare | 500 builds/mo free | Plenty. |
| D1 | Cloudflare | 5 GB free, 5M reads/day | Plenty for prototype + small demo. |
| R2 (backups) | Cloudflare | 10 GB free | Plenty. |
| Azure OpenAI | Microsoft | none — pay per token | Budget capped in Phase 7 SLOs. |

See `docs/sdlc/phase-2-planning/budget.md` for the $258K end-to-end
program budget; the operating cost of running the demo for one year
is ~$2-4K of Azure tokens against the planned usage.
