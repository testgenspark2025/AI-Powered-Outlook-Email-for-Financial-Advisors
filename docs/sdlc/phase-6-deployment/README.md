# Phase 6 — Deployment & Release

**Status:** Approved (theoretical — see D-Phase5-TargetEnv)
**Date:** 2026-05-26
**Owner:** Tech Lead (RACI A & R); QA Lead (C); Product (I)

This phase defines *how* the application moves from a developer's
laptop to a place where stakeholders can use it — the environments,
the release process, the runbooks, the migration playbook, and the
cutover from prototype to product.

## Locked decisions carried in from Phase 5

| ID | Decision | Effect on Phase 6 |
|---|---|---|
| D-Phase5-Pause | Phase 4 paused at Sprint 2. | This phase plans for what *will* deploy, against the design already on `main` (ADR-006: Cloudflare Pages, ADR-004: Cloudflare D1). Nothing is live yet. |
| D-Phase5-Depth | Medium — strategy + plans + checklists. | No new ADRs in this phase. We reference ADR-001, ADR-004, ADR-006, ADR-007 from Phase 2. |
| D-Phase5-TargetEnv | Local dev only for now. | Every command in the runbooks is documented and rehearsable but not yet executed. The pre-launch checklist names the trigger to switch from "theoretical" to "live". |

## Deliverables in this phase

| Doc | Purpose |
|---|---|
| [deployment-architecture.md](./deployment-architecture.md) | Environments, CF Pages + D1 topology, DNS, secrets layout. |
| [release-process.md](./release-process.md) | Branching model, versioning, tags, CHANGELOG cadence, release calendar. |
| [runbooks/deploy.md](./runbooks/deploy.md) | Happy-path deploy from a green `develop` to staging or production. |
| [runbooks/rollback.md](./runbooks/rollback.md) | Rolling back a bad release. |
| [runbooks/db-migration.md](./runbooks/db-migration.md) | Generating, reviewing, applying, and rolling back D1 migrations. |
| [cutover-plan.md](./cutover-plan.md) | The one-time `develop` → `main` flip when the new app replaces the prototype. |
| [pre-launch-checklist.md](./pre-launch-checklist.md) | Everything that must be true before the first public preview. |
| [checklists/release-day.md](./checklists/release-day.md) | What the release driver does on the day of a release. |

## How this phase relates to Phase 5

Phase 5 ended with `release-signoff.md` listing 13 gates. Gates 1-11
are already met by local CI today. Gates 12-13 — "deployment runbook
reviewed in the last 30 days" and "backup of the current `develop` tag
pushed" — activate the moment the first staging deploy happens. The
runbooks in this phase are what make those gates honest.

## Phase 6 exit criteria

The phase is "done" when all of the following hold:

1. The 8 documents above are reviewed and approved by RACI A (Tech Lead).
2. The deploy and rollback runbooks have been dry-run on a personal
   Cloudflare Pages project (no real customer data) at least once and
   any drift between docs and reality is corrected.
3. The cutover plan is signed by Product (RACI C in Phase 6 is
   actually RACI A for the cutover specifically — see the doc).
4. The pre-launch checklist is wired into the release-signoff matrix
   (gate 11) on `main`.

## Where the implementation will be deployed from

The "thing to deploy" is the `app/` directory on the branch named in
the release. Today that branch is `develop`. After the cutover, it
will be `main`. The build command is `pnpm build`. The runtime is
Cloudflare Pages (per ADR-006).

## Change log

| Date | Change | Author |
|---|---|---|
| 2026-05-26 | Phase 6 opened and closed in one pass; medium-depth, theoretical scope per D-Phase5-TargetEnv. | Tech Lead |
