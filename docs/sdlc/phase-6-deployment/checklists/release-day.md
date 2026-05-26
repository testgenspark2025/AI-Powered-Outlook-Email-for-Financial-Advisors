# Release-day Checklist

What the release driver does on the day of a release. Use this every
time, not just the first time. Total time budget: 30 minutes excluding
soak.

## T-30 min — Preparation

- [ ] Slack thread opened: `Release $TAG → $ENV starting at HH:MM UTC`.
- [ ] On the cutover or release ticket, the CI run for the target SHA
      is linked and green.
- [ ] `CHANGELOG.md` is finalised for `$TAG`.
- [ ] You have the env's `wrangler` credentials loaded
      (`wrangler whoami` matches the right account).
- [ ] You have the rollback runbook open in a second tab.

## T-0 — Deploy

- [ ] Step 1: Confirm tag (`runbooks/deploy.md` §1).
- [ ] Step 2: Pre-deploy DB backup (§2). Backup filename noted in the
      Slack thread.
- [ ] Step 3: Apply migrations if any (§3). If none, the output line
      "No migrations to apply" is noted.
- [ ] Step 4: Build (§4).
- [ ] Step 5: `wrangler pages deploy` (§5). Deployment URL noted.
- [ ] Step 6: Smoke test, in order (§6). All five checks tick.
- [ ] Step 7: Post-deploy comms (§7). GitHub Release notes updated.

## T+10 min — First soak

- [ ] Open the live URL in a fresh browser. Sign in. Read one email.
- [ ] Tail logs for 5 minutes. No 5xx. No unexpected stack traces.
- [ ] Send a test email through the demo account. Confirm it appears in
      Sent Items.

## T+30 min — Second soak

- [ ] Check Cloudflare's analytics for the project — no error spike.
- [ ] Check the uptime monitor — no missed checks.
- [ ] Check Azure OpenAI usage panel — no quota spike.

## Acceptance

If everything above is green:

- [ ] Mark the release ticket as **Released**.
- [ ] Close the Slack thread with `Release $TAG → $ENV complete.
      Smoke + soak clean.`
- [ ] Schedule a 24-hour follow-up reminder.

## If anything is not green

- Sev-1 → run the rollback runbook **now**.
- Sev-2 → escalate to the Tech Lead, decide rollback vs hotfix in 15 min.
- Sev-3 → file the bug, continue the release, mention in the soak note.

## Audit trail

The Slack thread + the GitHub Release page + the run log under
`docs/sdlc/phase-6-deployment/releases/$TAG-$ENV.md` are the
authoritative record. Anything not in one of those three places is
folklore.
