# Runbook — Deploy

**Use this when:** you are promoting a tagged commit to staging or
production.
**Do not use this for:** preview deploys (those are automatic per PR).

## Pre-flight (must all be true)

- [ ] You are the release driver for this release.
- [ ] The release-signoff matrix (Phase 5) is signed for this tag.
- [ ] `CHANGELOG.md` has a section that matches the tag version.
- [ ] The tag is pushed to `origin`.
- [ ] Your `wrangler` is logged in (`wrangler whoami`).
- [ ] You can read the target env's secrets (you have the Cloudflare
      Pages role).

## Variables you will need

| Variable | Where to find it |
|---|---|
| `TAG` | The semver tag, e.g. `v1.2.0`. |
| `ENV` | `staging` or `production`. |
| `PROJECT` | `fa-outlook-app`. |
| `D1_DB` | `fa-outlook-db-<env>`. |
| `WORKING_DIR` | The repo root. |

## Steps

### 1. Confirm the tag

```bash
git fetch --tags
git checkout $TAG
git rev-parse HEAD
```

Cross-check the SHA against the GitHub Release page.

### 2. Pre-deploy DB backup

```bash
wrangler d1 export $D1_DB --output backups/$TAG-$ENV.sql
```

Confirm the file is non-empty and contains expected table names
(`segments`, `clients`, `households`, ...).

### 3. Apply migrations (if any)

See [db-migration.md](./db-migration.md). In short:

```bash
cd app
pnpm drizzle-kit generate    # only if you authored new migrations
wrangler d1 migrations apply $D1_DB --env $ENV
```

If no new migrations exist, skip this step. The output should read
"No migrations to apply".

### 4. Build the bundle

```bash
cd app
pnpm install --frozen-lockfile
pnpm build
npx @cloudflare/next-on-pages
```

You should see `.vercel/output/static` populated.

### 5. Deploy

```bash
wrangler pages deploy app/.vercel/output/static \
  --project-name=$PROJECT \
  --branch=$ENV \
  --commit-message="Deploy $TAG to $ENV"
```

Wrangler prints a URL like `https://<sha>.<project>.pages.dev`. The
custom domain alias (`staging.fa.example.com` or `fa.example.com`)
updates after Cloudflare propagates the alias — usually 30 s.

### 6. Smoke test (in this exact order)

| # | Check | Expected |
|---|---|---|
| 1 | `curl -sf https://<env-url>/api/v1/health` | 200, `{"ok":true,"env":"<env>"}` |
| 2 | Open `https://<env-url>/` in a private window | Redirected to `/login` |
| 3 | Sign in with the env's `SHARED_PASSWORD` | Inbox renders |
| 4 | Click the top inbox row | Reading pane shows the email + client insights |
| 5 | Run the regression checklist (Phase 5) | All ticks |

If any check fails, go to [rollback.md](./rollback.md) immediately.

### 7. Post-deploy

- [ ] Update the GitHub Release notes with the env URL and the smoke
      test outcome.
- [ ] Post to the team channel: `Released $TAG to $ENV (<url>)`.
- [ ] Move the `$ENV` GitHub environment's "last deploy" marker.
- [ ] If this was production, immediately schedule a follow-up
      observation window in your calendar (30 min).

## Timing budget

| Step | Wall-clock |
|---|---|
| 1 — confirm tag | < 30 s |
| 2 — DB backup | 5-30 s |
| 3 — migrations | 0-60 s |
| 4 — build | 60-120 s |
| 5 — deploy | 30-60 s |
| 6 — smoke | 5 min |
| 7 — post-deploy | 5 min |
| **Total** | **~15 min** |

If you exceed 30 min wall-clock, treat it as a deploy incident and
write a brief postmortem under
`docs/sdlc/phase-7-operations/postmortems/` (folder appears in
Phase 7).

## Notes for first-time deployers

- Cloudflare Pages projects must be created before this runbook works.
  That one-time setup is in
  [`../pre-launch-checklist.md`](../pre-launch-checklist.md).
- The `wrangler` CLI prompts for OAuth on first run. Do that on your
  own laptop, not on shared infrastructure.
- If `wrangler pages deploy` says "deployment aborted because branch
  is locked", check that you have the right Pages role and that the
  branch protection rule for `$ENV` allows you to push.
