# Incident Response

How we respond when an alert fires. The goal is to restore service
fast, communicate honestly, and learn enough to make it less likely
next time.

## Severity ladder (operations)

This is consistent with the bug severity ladder in Phase 5 but framed
around running systems, not bug reports.

| Sev | Trigger | Customer experience | Ack / Resolve targets |
|---|---|---|---|
| 1 | Production down. Send / read / login broken. Data loss. | "I can't use the app." | Ack < 15 min · Resolve < 1 h · Postmortem required |
| 2 | A primary flow degraded. Latency far above SLO. AI features off. | "It's slow / partly broken." | Ack < 30 min · Resolve < 4 h · Postmortem if customer-visible |
| 3 | Background issue. Backup missed, dashboard down, dependency CVE. | None. | Ack < 1 business day · Resolve < 5 business days |
| 4 | Cosmetic, internal. | None. | No ack target. Backlog. |

## Roles during an incident

| Role | First filled by | Responsibility |
|---|---|---|
| Incident Commander (IC) | The on-call who acks the page | Owns the incident end-to-end. Makes the call to roll back. |
| Communications | IC (default) or a delegated person | Posts updates to the incident channel and the status page. |
| Subject expert | Pulled in as needed | Knows the affected component (auth, AI, DB). |
| Scribe | Optional; the IC if alone | Captures the timeline for the postmortem. |

In single-person operation (today), the on-call is all four roles.

## Incident channels

| Channel | Used for |
|---|---|
| `#fa-ops` Slack | Day-to-day notices, sev-3+. |
| `#fa-incident-<id>` Slack | A dedicated channel opened for every sev-1 / sev-2. |
| Status page (public) | One-line updates for customer-visible incidents. |
| Email to stakeholders | At least one update per hour during a sev-1. |

## Playbooks

These are the "if the alert fires, look here first" runbooks. Each
has a short checklist; deep procedures live in
`phase-6-deployment/runbooks/`.

### Production down (A-1, A-10)

1. **Ack.** Open `#fa-incident-<id>`. Post: `Sev-1: Production down,
   IC=<you>. Investigating.`
2. **Confirm.** Hit `/api/v1/health` from your laptop. If it 5xxs or
   times out, the alert is real.
3. **Triage.**
   - Cloudflare status page: is Pages up?
   - Cloudflare dashboard → Pages → Logs: any 5xx storm?
   - D1 dashboard: errors? lag?
   - Azure portal: AOAI healthy?
4. **Mitigate.**
   - If a recent deploy correlates: run
     `runbooks/rollback.md` to the prior tag.
   - If a dependency is down: post a status page update, switch the
     UI to a degraded banner if available, wait.
5. **Communicate.** Update the channel every 15 minutes minimum.
6. **Resolve.** When `/api/v1/health` is green for 10 minutes and
   smoke test passes, declare the incident over.
7. **Postmortem.** Open the template within 24 hours.

### Send failing (A-2)

1. **Ack.** Open the incident channel.
2. **Confirm.** Compose a draft in your own demo account and send. Do
   you see a 5xx?
3. **Triage.**
   - D1: is the `email_messages` table writable?
   - Drafts repo: did we ship a bad validation recently?
   - Migrations: did a migration apply in the last hour?
4. **Mitigate.** Rollback the last release if it correlates. Otherwise
   patch forward with a hotfix on a `hotfix/` branch.
5. **Communicate / Resolve / Postmortem** — same as A-1.

### Latency burn (A-3)

1. **Ack** in `#fa-ops` (no separate channel needed unless it
   escalates).
2. **Triage.**
   - Did the inbox-load route get heavier? (regression check on the
     last 5 PRs).
   - Is D1 in a region issue? (status page).
   - Is the user list expanding faster than expected? (cost-and-
     capacity).
3. **Mitigate.** Often the right move is to wait — the alert window
   is 30 min, so a transient spike resolves itself. If it doesn't,
   roll back the latest release or open a perf ticket.

### AI degraded (A-4)

1. **Ack** in `#fa-ops`.
2. **Triage.** Hit `/api/v1/ai/draft-reply` with the demo payload.
   Check Azure dashboard for quota / throttling.
3. **Mitigate.** Fall back to MockProvider via the env var (Sprint 5
   change introduces `LLM_PROVIDER`). The UI banner reads "AI
   temporarily unavailable; reply manually."
4. **Communicate.** Status-page update for customer-visible degraded
   mode.

### Cost burn (A-7, A-8)

See `cost-and-capacity.md`. Short version: at 80% throttle non-
critical AI features (depth=deep first), at 100% turn off AI for the
remainder of the month and notify Product.

## Comms templates

### First post (sev-1)

> **Sev-1 incident — Production down**
> Started: HH:MM UTC. IC: <name>.
> Symptom: <one sentence>.
> Mitigation in progress. Next update in 15 min.

### Hourly update (sev-1)

> **Update HH:MM UTC**
> Current status: <one sentence>.
> What we've tried: <2-3 bullets>.
> What we're trying next: <one bullet>.
> ETA: <best guess or "still investigating">.

### Resolution

> **Resolved HH:MM UTC**
> Root cause: <one sentence; postmortem to follow>.
> Mitigation: <what we did>.
> Postmortem owner: <name>. Due: 7 days.

## Postmortem rules

- Mandatory for every sev-1, and for any sev-2 that was customer-
  visible.
- Blameless. We critique systems and processes, not people.
- Authored by the IC within 7 days.
- Reviewed at the next weekly ops review.
- Filed under `docs/sdlc/phase-7-operations/postmortems/`.
- The action items have owners and due dates. We track follow-through
  in the next ops review.

Template: `postmortems/template.md`.

## On-call expectations

See `checklists/on-call-handoff.md` for the weekly handoff. Short
version:

- The on-call is reachable by phone for the week.
- They ack alerts within the targets above.
- They do not start risky deploys on the last day of their shift.
- They write a handoff note at the end of the week, even if nothing
  happened.

Today the rotation is "Tech Lead, week in week out". That is fine for
a demo; it changes when the team grows.
