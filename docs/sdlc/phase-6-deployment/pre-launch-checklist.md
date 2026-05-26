# Pre-launch Checklist

Everything that must be true before the *first* time the application
is exposed beyond the development team. After it ships once, the
release-day checklist and the deploy runbook take over.

This is a one-time gate. Tick it once, archive the filled copy under
`docs/sdlc/phase-6-deployment/launches/`.

## Infrastructure (Cloudflare)

- [ ] Cloudflare account exists and the Pages product is enabled.
- [ ] Pages project `fa-outlook-app` created.
- [ ] D1 databases created: `fa-outlook-db-preview`,
      `fa-outlook-db-staging`, `fa-outlook-db-production`.
- [ ] R2 bucket `fa-backups-production` created (Phase 7 will use it).
- [ ] DNS records created per `deployment-architecture.md`.
- [ ] Custom domains attached to the Pages project for `staging` and
      production.
- [ ] HTTPS is enforced on every custom domain (Pages does this by
      default; verify the dashboard).
- [ ] The Cloudflare API token used by CI is scoped to **Pages + D1
      only**, not full account access.

## Secrets

- [ ] `SESSION_SECRET` set in Pages → preview, staging, production
      (different value per env). Each value is at least 32 hex chars.
- [ ] `SHARED_PASSWORD` set per env (different value per env).
- [ ] `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_KEY` set per env
      (different resource per env).
- [ ] No secret is committed to the repo (grep the diff).
- [ ] The `CLOUDFLARE_API_TOKEN` is stored in GitHub Actions secrets,
      not in any file.

## GitHub

- [ ] Branch protection on `main`: required CI checks, no force-push,
      linear history.
- [ ] Branch protection on `develop`: required CI checks, no force-
      push.
- [ ] PR template references the pre-merge checklist (Phase 5).
- [ ] CODEOWNERS file routes `app/` to the Tech Lead.
- [ ] Tag protection on `v*` tags: only the release driver can push.
- [ ] GitHub Environments created: `preview`, `staging`, `production`.
      Production requires manual approval.

## Application code

- [ ] `app/wrangler.toml` created with the per-env D1 binding.
- [ ] `next.config.mjs` includes the Pages adapter
      (`@cloudflare/next-on-pages`).
- [ ] Drizzle Kit config points at the right binding per env.
- [ ] All routes declare `runtime = "edge"`.
- [ ] No `process.env` access inside an Edge handler other than
      through the Pages helper.
- [ ] Health route exposes the env name and the build SHA.

## Observability (Phase 7 prepares; Phase 6 verifies presence)

- [ ] Cloudflare Logpush configured (or Logs panel in dashboard
      enabled) so we can read logs without SSHing anywhere.
- [ ] A simple uptime check pings `/api/v1/health` every 5 minutes.
- [ ] An on-call rotation exists, even if it is just "the Tech Lead
      this week".

## Compliance & legal (lightweight for the demo)

- [ ] Privacy notice on the login page: a short line saying "demo only,
      no real client data."
- [ ] No real client data is loaded into staging or production. The 5
      seeded clients are fictitious.
- [ ] The data export script is documented; we can hand a customer a
      JSON of their own data on request.

## Documentation

- [ ] `README.md` at repo root explains how to run, where docs live,
      and how to file bugs.
- [ ] `CHANGELOG.md` exists and starts with `[Unreleased]`.
- [ ] The Phase 5 release-signoff matrix is published.
- [ ] The cutover plan (`cutover-plan.md`) is reviewed by Product.

## Rehearsals

- [ ] Deploy runbook dry-run executed against a personal Cloudflare
      account. Outcome captured.
- [ ] Rollback runbook dry-run executed against the same account.
- [ ] Migration runbook dry-run executed against a personal D1.

## Go / no-go

After every box is ticked, the Tech Lead, Product, and QA Lead meet
for 15 minutes and say go or no-go aloud. If anyone says no-go, the
launch is postponed.

Sign here once the meeting concludes:

| Role | Name | Date | Go / No-Go |
|---|---|---|---|
| Tech Lead | | | |
| Product | | | |
| QA Lead | | | |
