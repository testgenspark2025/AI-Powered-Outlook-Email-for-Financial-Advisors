# Cutover Plan — `develop` → `main`

**Status:** Plan only. Not executed.
**Owner:** Tech Lead (A); Product (C); QA Lead (C).
**Trigger:** Phase 4 resumes, Sprints 3-6 land on `develop`, the
release-signoff matrix is signed for the first `v1.0.0-rc`.

## Why this plan exists

Per ADR-001, the new application is a greenfield rewrite that lives on
`develop` while the prototype stays on `main` until cutover. Right now
that means:

| Branch | Contents |
|---|---|
| `main` | The original `index.tsx` Hono / JSX prototype (no real auth, no DB, no AI) plus the Phase 0-3, 5 docs. |
| `develop` | The new `app/` Next.js application (Sprints 0-2 today) plus Phase 4 implementation docs. |

The cutover is the one-time event that flips those.

## End state we want

After cutover:

- `main` HEAD contains the new `app/` directory and the full SDLC
  docs (Phases 0-7 by then).
- The prototype source (`index.tsx`, original `package.json`, etc.)
  is removed from `main`.
- `develop` is rebased on the new `main` and continues to be where
  active work happens.
- The `main` HEAD is tagged `v1.0.0` and matches the production deploy
  (or the first staging deploy if production is not yet live).

## What we will NOT do during cutover

- **No new features.** Cutover is a flip, not a release.
- **No schema changes.** Migrations land in the release before cutover,
  not in the cutover PR itself.
- **No squash of `develop` history.** We preserve the per-sprint commits
  so the SDLC story is readable.

## Sequence

The cutover happens in one working day, ideally a Tuesday or Wednesday
so the team is around for the next 48 hours.

### T-3 days

1. Sprint 6 work is merged into `develop`. CI green.
2. The release driver opens the cutover tracking issue with this plan
   linked.
3. QA Lead schedules a full UAT run against `develop` for T-2.

### T-2 days

4. Run the UAT script end to end on `develop`. Capture the run log.
5. Tag `develop` as `v1.0.0-rc.1`. Deploy to staging.
6. Stakeholders use staging for one business day.

### T-1 day

7. Triage feedback. Any sev-1 / sev-2 becomes a blocker. Fix on
   `develop`, re-tag `v1.0.0-rc.N`, redeploy staging.
8. Final go / no-go meeting: Tech Lead, Product, QA Lead.
9. Backup `main` (the prototype) under a permanent tag:
   ```bash
   git tag -a prototype-final -m "Prototype before greenfield cutover" main
   git push origin prototype-final
   ```

### Cutover day

10. **Freeze writes to `develop`.** Add a branch protection that
    requires Tech Lead approval for any push. Announce in the team
    channel.
11. Open the cutover PR. The PR is mechanical:
    - On the cutover branch (`cutover/v1.0.0`), make `main` equal to
      `develop` plus a small commit that removes the prototype files
      (`index.tsx`, the original root `package.json`, etc.).
    - Keep `docs/sdlc/` intact — both phases of docs survive.
    - Keep `.github/workflows/ci.yml` from `develop`.
12. The PR runs CI: lint, typecheck, tests, build all green.
13. Two reviewers (one Tech Lead, one Product) approve.
14. Merge `cutover/v1.0.0` into `main` using a merge commit
    (not squash) to preserve history.
15. Tag `main` as `v1.0.0`. Push.
16. The release driver runs the deploy runbook with `TAG=v1.0.0`,
    `ENV=production`.
17. Smoke test production. If green, write the release notes.
18. **Reset `develop`** to track `main`:
    ```bash
    git checkout develop
    git fetch origin
    git reset --hard origin/main
    git push --force-with-lease origin develop
    ```
    Announce: `develop has been reset to v1.0.0 (main). Active work
    resumes on develop tomorrow.`

### T+1 day

19. Hold a 30-minute retro on the cutover itself. Capture lessons in
    `docs/sdlc/phase-8-evolution/cutover-retro.md` (Phase 8).
20. Unfreeze `develop`. Resume sprints.

## What changes on `main` in the cutover PR

Concretely, the diff is approximately:

```
- index.tsx                          (prototype)
- package.json                       (prototype's deps)
- src/...                            (prototype's components)
+ app/                                (the entire new app)
+ docs/sdlc/phase-4-implementation/   (Phase 4 sprint summaries)
+ docs/sdlc/phase-6-deployment/...    (already on main; no change)
+ docs/sdlc/phase-7-operations/...    (already on main; no change)
```

`CHANGELOG.md`, `README.md`, and `.github/workflows/ci.yml` are
overwritten by the `develop` versions.

## Rollback

The cutover is reversible up until the moment `develop` is reset.

| Stage | How to undo |
|---|---|
| Before tag push | Drop the cutover PR; `main` is unchanged. |
| After tag push, before prod deploy | Delete the tag; revert the merge commit on `main`; force-push (with team agreement). |
| After prod deploy | Run the rollback runbook with `GOOD_TAG=prototype-final` and restore the prototype. |

Once `develop` is reset, rollback is no longer a `git` operation; it
is a re-merge from `prototype-final`. We don't expect to need this.

## Sign-off

| Role | Name | Sign-off block |
|---|---|---|
| Tech Lead (A) | | I confirm the steps above will execute in the named order. |
| Product (C) | | I confirm the user-visible changes match the v1.0.0 release notes. |
| QA Lead (C) | | I confirm the staging UAT and the post-deploy smoke are scheduled. |
