# Release Process

## Branching model

We use a lightweight trunk-based variant of GitFlow, anchored on the
fact that there is exactly one long-lived branch in production
(`main`) and one long-lived branch for active work (`develop`).

```
                          tag v1.0.0
                              │
   main ───────────────●──────●───────────────────────
                       │       \
                       │        \   merge after cutover
                       │         \
   develop ─●────●─────●──────────●─●──●──●──────●────
            \   /                    \    /      \
             \_/                      \__/        \
            PR-12                    PR-19      rc-2026-05-26
            (squash)               (squash)
```

| Branch | Purpose | Protections |
|---|---|---|
| `main` | What is in production (or what *will* be once we deploy). | Linear history. Tag-protected. Required CI checks. No force-push. |
| `develop` | Where new features integrate. | Required CI checks. No force-push. |
| `feature/<id>` | One PR's worth of work. Cut from `develop`. | Squashed into `develop`. Deleted on merge. |
| `hotfix/<id>` | Sev-1 fix on top of the latest production tag. | Cut from `main`, merged back into both `main` and `develop`. |

The cutover from "develop has the new app, main has the prototype" to
"main has the new app, prototype is retired" is described in
[cutover-plan.md](./cutover-plan.md).

## Versioning

SemVer (`MAJOR.MINOR.PATCH`) with the following rules:

| Bump | Trigger |
|---|---|
| MAJOR | Breaking change to a documented API or to the user's mental model (rare in the demo phase). |
| MINOR | New user-visible feature; closes one or more user stories. |
| PATCH | Bug fixes, dependency bumps, copy edits. |

Pre-release tags:

- `vX.Y.Z-rc.N` — release candidate. Promoted to `vX.Y.Z` after sign-off.
- `staging-YYYYMMDD-HHMM` — staging-only tag for rehearsal.

`vX.Y.Z` tags are protected; only the release driver may push them.

## Cadence

| Cadence | What | Trigger |
|---|---|---|
| Continuous | Preview deploys per PR. | GitHub Actions on push. |
| Sprint review | Internal demo. | End of each 2-week sprint. Tagged `rc-YYYY-MM-DD`. |
| On demand | Production. | Stakeholder demo or external user trial. Tagged `vX.Y.Z`. |

The release driver rotates per the RACI in `phase-2-planning/raci.md`.
Today the Tech Lead is acting in that role.

## CHANGELOG

Lives at `CHANGELOG.md` at the repo root, following Keep a Changelog.

Each release adds one section:

```
## [1.2.0] - 2026-07-14
### Added
- Compose: AI draft replies with adjustable depth (US-3.1, US-3.2).
### Changed
- Inbox: segment filter now persists across reloads (FR-INB-5).
### Fixed
- Sent Items rendering when the household has zero members (#42).
### Security
- Bumped Next.js to 15.1.3 (CVE-2026-NNNN).
```

Conventions:

- Sections must be in this order: `Added`, `Changed`, `Deprecated`,
  `Removed`, `Fixed`, `Security`.
- Each bullet points to a user story id, a GitHub issue id, or a PR
  number. Never to a person's name.
- Pre-release entries live under `## [Unreleased]` and graduate at
  tag time.

## Tag and release procedure

1. Confirm CI is green on the SHA being tagged.
2. Confirm `CHANGELOG.md` has an entry that matches the tag version.
3. Tag locally:
   ```bash
   git tag -a v1.2.0 -m "Release 1.2.0"
   ```
4. Push the tag:
   ```bash
   git push origin v1.2.0
   ```
5. GitHub Actions sees the tag and runs the deploy workflow
   ([runbooks/deploy.md](./runbooks/deploy.md)).
6. The release driver opens a GitHub Release tied to the tag, pastes
   the relevant CHANGELOG section, and links to the staging UAT run.

## Rollback at the release level

The fastest rollback is *the previous tag*. If `v1.2.0` is bad and
`v1.1.5` was the last green tag, the release driver runs the rollback
runbook with `v1.1.5` as the target. See
[runbooks/rollback.md](./runbooks/rollback.md).

## When the release process gets a real test

Today this is theoretical. Two triggers move it to "live":

1. The Phase 4 cutover lands (post Sprint 5/6 of the original plan).
2. Or the demo team needs a public preview URL on a real Cloudflare
   account.

When either happens, the release driver dry-runs the deploy runbook
on a personal Cloudflare account first, fixes any drift between the
docs and reality, and then runs it for real.
