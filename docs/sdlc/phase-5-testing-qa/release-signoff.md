# Release Sign-off

The matrix below is the *minimum* set of gates before any release
candidate is tagged or merged into `main`. Each row has an owner and a
binary outcome.

## Gate matrix

| # | Gate | Owner | Evidence | Required for |
|---|---|---|---|---|
| 1 | Lint clean (`pnpm lint`) | Author | CI run link | every merge |
| 2 | Typecheck clean (`pnpm typecheck`) | Author | CI run link | every merge |
| 3 | All unit + integration tests pass (`pnpm test:unit`) | Author | CI run link | every merge |
| 4 | Build succeeds (`pnpm build`) | Author | CI run link | every merge |
| 5 | Pre-merge checklist filled in the PR | Reviewer | PR checklist | every merge |
| 6 | Acceptance criteria for the changed features mapped to a test or deferral | Author | `acceptance-criteria.md` diff in the PR | every merge that adds an FR |
| 7 | UAT script run on the candidate SHA | QA Lead | run log under `runs/` | release candidate |
| 8 | Regression checklist run | QA Lead | run log under `runs/` | release candidate |
| 9 | No open sev-1 or sev-2 bugs on the milestone | QA Lead | GitHub query | release candidate |
| 10 | Release notes drafted | Author | `CHANGELOG.md` entry | release candidate |
| 11 | Sign-off section of `uat-script.md` signed by QA, Tech, Product | All three roles | filled doc | release candidate |
| 12 | Deployment runbook reviewed in the last 30 days | Tech Lead | runbook diff or "no change" note | production release (Phase 6) |
| 13 | Backup of the current `develop` tag pushed | Tech Lead | `git push origin <tag>` | production release (Phase 6) |

Gates 12-13 are not relevant until Phase 6 deployment work begins.

## What counts as a release candidate today

Because there is no public deployment yet, a "release candidate" is a
named tag on `develop` (for example `rc-2026-05-26`) cut for an
internal demo or stakeholder review.

Procedure:

1. Tech Lead opens a tracking issue: `Release: <name>`.
2. Author finalises `CHANGELOG.md` and the run log template.
3. QA Lead runs the UAT script and the regression checklist.
4. Sign-off section in `uat-script.md` is signed.
5. Tag is cut:
   ```bash
   git tag -a rc-2026-05-26 -m "Internal demo cut"
   git push origin rc-2026-05-26
   ```
6. The tag is what is demoed. Do not move it after the fact.

## Roles for sign-off

| Role | Today | Responsibility |
|---|---|---|
| QA Lead | Solo author (acting) | Runs UAT + regression. Owns gate 7-9, 11. |
| Tech Lead | Solo author (acting) | Owns gates 1-6 (via CI). Owns gates 12-13 when in scope. |
| Product | Solo author (acting) | Confirms the release notes match what was committed. |

When the team grows past one person, the RACI in
`docs/sdlc/phase-2-planning/raci.md` takes over.

## What "rollback" means today

Local dev only — there is nothing to roll back. The rollback rehearsal
lives in Phase 6.

## Change log

| Date | Change | Author |
|---|---|---|
| 2026-05-26 | First version. Local-dev-only gates; deployment gates marked Phase 6. | QA Lead |
