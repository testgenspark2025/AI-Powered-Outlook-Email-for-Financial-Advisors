# Defect Management

## Where defects live

GitHub Issues on this repo, with the label `bug`. We use one label per
severity (`bug:sev-1` … `bug:sev-4`) and a milestone per sprint.

## Severity ladder

| Sev | Trigger | Example | Time to triage | Time to fix |
|---|---|---|---|---|
| 1 — Critical | Demo is dead. Cannot log in, cannot read mail, cannot send. Data loss for an already-sent message. | Login route 500s. Sending a complete draft does not move to Sent. | 1 hour | Same day. Hot-fix on `develop` and tag `vX.Y.Z+hotfix`. |
| 2 — High | A primary flow is broken but a workaround exists. | Autosave silently fails; user can still hit "Save draft". | 1 day | Within sprint. |
| 3 — Medium | A secondary flow is broken; many users would notice. | Segment filter renders the wrong count badge. Theme toggle flickers. | 3 days | Within 2 sprints. |
| 4 — Low | Cosmetic or rare. | A label is off by one pixel. Stack trace from `_resetDraftStoreForTests` shows in dev console. | 1 week | Backlog. |

## Lifecycle

```
   open ──► triaged ──► in-progress ──► in-review ──► verified ──► closed
              │
              └──► won't-fix / duplicate ──► closed
```

- `open`: just filed.
- `triaged`: severity set, owner assigned, sprint milestone added.
- `in-progress`: branch cut.
- `in-review`: PR open, awaiting review.
- `verified`: merged + the reporter (or QA Lead) signs off that it's
  fixed against the latest `develop`.
- `closed`: the milestone ships.

Sev-1 bugs skip queues. The reporter pages the on-call directly (when we
have an on-call rotation — until then, this is the Tech Lead by default).

## Required fields on a bug report

1. **Title** in the form `<area>: <one-line behavior>`.
   E.g. `compose: autosave drops the body when subject is empty`.
2. **Steps to reproduce** — exact, copy-pasteable.
3. **Expected vs actual**.
4. **Environment** — branch, commit SHA, browser, OS.
5. **Severity** — proposed; the QA Lead decides at triage.
6. **Attachments** — screenshots, recordings, `console.log` snippets.

A template lives at `.github/ISSUE_TEMPLATE/bug.yml` (to be added
alongside the Phase 6 release-prep work).

## Triage cadence

- Async daily for sev-1 / sev-2 (Tech Lead + QA Lead).
- Weekly for sev-3 / sev-4 (whole team, 30 minutes).

## Bug bash playbook

Run a bug bash once per sprint, in the day before sprint review.

1. **Prep (15 min):** QA Lead announces the bash, the focus areas
   (usually the sprint's new features), and pairs people up.
2. **Bash (60 min):** Each pair takes one focus area and tries to break
   it. Findings go straight into GitHub Issues with the `bug-bash`
   label.
3. **Triage (30 min):** Sort the new bugs by severity, assign owners,
   decide which are in scope for the sprint.
4. **Outcome:** A short note in the sprint review deck — "N bugs found,
   M sev-1/2, K committed to this sprint, the rest in backlog."

## Postmortem trigger

A postmortem is required for:

- Any sev-1 bug that reaches a deployed environment.
- Any data loss for an already-sent message (even in dev).
- Any incident on a real customer demo.

The postmortem template lives at `docs/sdlc/phase-7-operations/`
*(folder created in Phase 7).* It is blameless, short, and ends with at
least one preventative action with an owner and a due date.

## Metrics we will start tracking when the team grows

- Defects found per sprint by severity.
- Defects found before vs after release.
- Mean time to triage (sev-1, sev-2).
- Mean time to fix (sev-1 only).
- Reopen rate.

These are not measured today (single-author prototype). When the team
expands past two people, the QA Lead adds them to the sprint review.
