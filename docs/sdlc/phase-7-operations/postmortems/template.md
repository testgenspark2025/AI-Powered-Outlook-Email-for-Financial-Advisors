# Postmortem — &lt;short title&gt;

**Incident id:** PM-YYYYMMDD-NN
**Severity:** sev-1 | sev-2
**Status:** Draft | In review | Final
**Author (IC):** <name>
**Reviewers:** <name>, <name>
**Closed at:** YYYY-MM-DD

> Blameless. We critique systems and processes, not people. Names
> appear only as roles ("IC", "scribe", "release driver").

## 1. Summary (4 lines maximum)

What happened, who saw it, how it was mitigated, what the customer
experience was.

> Example: On 2026-07-04 between 14:02 and 14:38 UTC, the production
> environment returned 500s on `POST /api/v1/emails` for all users.
> Compose was blocked; reads were unaffected. The bad release
> (`v1.2.4`) was rolled back to `v1.2.3`. No data was lost.

## 2. Impact

- **Duration:** start (UTC) → end (UTC) = NN minutes.
- **Affected surface:** which endpoints, which user flows.
- **Affected users:** count or "all".
- **SLO impact:** how much of which budget was burned.
- **Customer comms:** what we said, where, when.

## 3. Timeline

UTC times. Each row is a fact, not an opinion. Opinions go in §5.

| Time | What happened | Source |
|---|---|---|
| 13:55 | `v1.2.4` deployed to production | GitHub Release |
| 14:02 | Alert A-2 fires | PagerDuty |
| 14:03 | IC acks; opens `#fa-incident-21` | Slack |
| 14:09 | Triage identifies regression in draft validation | logs |
| 14:18 | Decision to roll back | channel |
| 14:32 | `runbooks/rollback.md` executed | run log |
| 14:38 | Smoke passes; incident closed | channel |

## 4. Root cause(s)

What technically went wrong, and why our defenses didn't catch it.

> Example: PR #87 changed the draft-validation predicate from
> "non-empty body" to "body length ≥ 1 after trim()", but the trim
> implementation rejected unicode whitespace, which the seed data did
> not exercise. CI passed.

There may be multiple root causes; list each as a level-3 heading.

### 4.1 Trigger

The change or external event that pushed the system into a bad state.

### 4.2 Why it slipped through

Tests, review, monitoring — what would have caught this and didn't.

## 5. What went well

Three bullets minimum. We are *also* learning from what worked.

- Alert A-2 fired within 7 min of the bad deploy.
- IC ack within 3 min.
- Rollback runbook executed cleanly in under 10 min.

## 6. What did not go well

Three bullets minimum.

- The validation change had no specific test; it was implicit in the
  "create draft" happy-path test.
- The pre-deploy backup was made but never used; we have no procedure
  to verify the backup is restorable in under 24 h.
- Customer comms went out 8 min after detection; we'd like that under
  5.

## 7. Where we got lucky

The "what if" cases. Things that could have made it much worse.

- The deploy happened at 14:00 UTC, not 22:00 — Tech Lead was awake.
- The bad validation only blocked sends; reads stayed up.

## 8. Action items

| # | Action | Owner | Due | Status |
|---|---|---|---|---|
| 1 | Add a unit test that asserts validation accepts the seeded body of every email | Author | 2026-07-11 | open |
| 2 | Add a backup-restore drill to the release-day checklist | Tech Lead | 2026-07-31 | open |
| 3 | Reduce IC → first-customer-comms target from 8 → 5 min in `incident-response.md` | Tech Lead | 2026-07-11 | open |

Action items are tracked in GitHub Issues with the label
`postmortem-action`. The on-call reviews them at every weekly ops
review until they are closed.

## 9. Appendix

- Link to the bad PR / release.
- Link to the relevant log queries.
- Screenshots of the dashboards at the time of the incident.

## Sign-off

| Role | Name | Date | Signed |
|---|---|---|---|
| IC | | | |
| Tech Lead | | | |
| Product | | | |
