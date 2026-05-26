# Runbook — Rollback

**Use this when:** the deploy runbook produced a release that fails
smoke, has a sev-1 bug, or otherwise must be reverted.
**Time budget:** under 10 minutes from decision to "rolled back".

## Decision tree

1. **Is the bad release in production?** Yes → run this runbook now.
2. **Is the bad release in staging only?** No customer impact; you can
   either run this runbook or fix forward. Either is fine.
3. **Is the bad release a preview?** Do nothing; close the PR or push
   a new commit.

## Pre-flight

- [ ] You are the release driver (or an on-call holder if outside
      business hours).
- [ ] You have an incident channel open (Slack thread is fine).
- [ ] You have the bad tag (`$BAD_TAG`) and the last good tag
      (`$GOOD_TAG`) written down.

## Steps

### 1. Roll back the application

The fastest path is to redeploy the previous good build from
Cloudflare Pages' deployment history. From the Pages dashboard:

> Pages → `fa-outlook-app` → Deployments → find the deployment for
> `$GOOD_TAG` → "Rollback to this deployment".

CLI equivalent:

```bash
wrangler pages deployment list \
  --project-name=fa-outlook-app \
  --branch=$ENV | grep "$GOOD_TAG"
# copy the deployment-id

wrangler pages deployment rollback <deployment-id> \
  --project-name=fa-outlook-app
```

### 2. Roll back the database (if migrations ran)

If `$BAD_TAG` applied any migrations, restore from the pre-deploy
backup made in step 2 of the deploy runbook.

```bash
wrangler d1 execute fa-outlook-db-$ENV \
  --file=backups/$BAD_TAG-$ENV.sql
```

If you cannot find the backup, **stop and escalate to the Tech Lead.**
Do not improvise migrations under pressure.

If `$BAD_TAG` did not apply migrations, skip this step.

### 3. Smoke test the rolled-back environment

Repeat steps 6.1 to 6.5 of [deploy.md](./deploy.md) against the rolled
-back environment.

### 4. Confirm the rollback

- [ ] The Pages dashboard shows the active deployment as the one tied
      to `$GOOD_TAG`.
- [ ] `curl https://<env-url>/api/v1/health` returns the build SHA of
      `$GOOD_TAG`.
- [ ] The regression checklist passes.

### 5. Communicate

- Post in the incident channel: `Rolled back to $GOOD_TAG on $ENV at
  HH:MM. Smoke passing. Bad tag is $BAD_TAG.`
- Update the GitHub Release notes for `$BAD_TAG` with a "**Rolled
  back**" marker and a link to the incident issue.
- Pin a comment on the bad release's PR (if any) so the next merge
  conflict avoids re-introducing the regression.

### 6. Open a postmortem

A sev-1 in production requires a postmortem (Phase 5, defect-
management). Template will live at
`docs/sdlc/phase-7-operations/postmortems/template.md` once Phase 7 is
opened. Until then, a Google Doc is acceptable as long as it has:

- Timeline of events with UTC timestamps.
- Root cause(s).
- One or more preventative actions with owner and due date.

## Common pitfalls

- **"It's faster to push a hotfix":** Sometimes true, but the rollback
  is reversible and the hotfix is not. Default to rollback.
- **"The bug is small":** If it triggers the "send" path or any data
  -mutating endpoint, treat it as sev-1 anyway. Drafts going missing
  destroys user trust more than a missing label.
- **"The build is gone from Pages":** Pages keeps a rolling window of
  recent deployments. If the good one has scrolled out, the recovery
  path is to check out `$GOOD_TAG` locally and run the deploy runbook
  with that tag, *skipping* the migration step (since the schema is
  unchanged).

## Rehearsal

The Tech Lead rehearses this runbook against a personal CF account
once per quarter. The rehearsal counts toward gate 12 of the release-
signoff matrix.
