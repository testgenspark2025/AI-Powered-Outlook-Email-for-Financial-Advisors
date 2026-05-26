# Weekly Ops Review

A standing 30-minute meeting, usually Friday afternoon. The purpose is
to look at the last week and decide what to do about it. It is *not* a
status update.

## Attendees

- Tech Lead (chair)
- Outgoing + incoming on-call (during the handoff week)
- QA Lead
- Product (optional unless the agenda calls for them)

## Agenda (in order; skip the empty rows)

### 1. SLO burn (5 min)

- Pull the latest dashboard.
- Any SLO at risk (> 50% of monthly budget spent)?
- Any SLO consistently under budget for two months? — candidate to
  tighten.

### 2. Incidents (10 min)

- Any sev-1 / sev-2 in the last week?
- Any postmortems due this week? Confirm owners and due dates.
- Any postmortem action items past their due dates?

### 3. Backups & DR (3 min)

- Newest backup age (should be ≤ 25 h).
- Last restore drill date (should be ≤ 90 days).
- Any failures of the monthly backup-integrity check.

### 4. Cost (3 min)

- MTD spend vs envelope.
- Any anomaly worth flagging to Product?

### 5. Security (3 min)

- `pnpm audit` output. Anything new and critical?
- Dependabot PRs open > 7 days.
- Rotation calendar — anything coming up.

### 6. Capacity (2 min)

- Concurrent users at peak this week.
- Any of the "stop and rethink" triggers tripped?

### 7. Documentation drift (2 min)

- Anything in the runbooks (Phase 6 + Phase 7) that bit us this week?
  Update before next Friday.

### 8. Looking ahead (2 min)

- Risky changes coming next week. Plan to be more attentive on those
  days.

## Outputs

- A short note (≤ 5 bullets) posted to `#fa-ops` after the meeting.
- Any new action items filed as GitHub Issues with the label
  `ops-review` and the owner assigned.

## When the meeting can be skipped

- Every attendee is OOO and there are no open sev-1 / sev-2 incidents.

In that case, the Tech Lead drops the bullets in `#fa-ops`
asynchronously and notes "no meeting this week" in the next week's
agenda.
