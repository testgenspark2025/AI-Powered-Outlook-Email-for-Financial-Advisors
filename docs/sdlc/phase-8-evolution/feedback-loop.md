# Feedback Loop

How signals from running the product turn into the next backlog. The
goal is to make decisions on evidence, not vibes — without drowning
in dashboards.

## Three input streams

| Stream | Source | Cadence |
|---|---|---|
| Operational | SLO burn, incidents, postmortems, cost (Phase 7) | Weekly ops review |
| Customer | Direct feedback, NPS-style pulses, support tickets | Continuous (channel) + monthly summary |
| Product | Usage metrics (event counts, retention, feature reach) | Weekly + monthly |

We deliberately keep the third stream small in v1 — privacy first,
analytics second.

## What we measure (v1, demo phase)

We measure as little as possible while still answering these
questions:

1. Did the user *use* the AI surface at all?
2. Did they send the draft, or abandon it?
3. How long did they spend reading vs writing?
4. Which segments produced the most reads / replies?

Event names live in `app/src/lib/analytics/events.ts` (introduced in
Sprint 5 along with observability). Today the file does not exist —
this is doctrine for when it does.

| Event | Properties | Privacy |
|---|---|---|
| `inbox_opened` | env, build | none |
| `email_opened` | client_segment, email_age_minutes | client_id NOT included |
| `ai_draft_started` | depth | text NOT included |
| `ai_draft_streamed` | first_token_ms, total_tokens | text NOT included |
| `draft_saved` | save_kind=auto/manual | nothing else |
| `draft_sent` | length_bucket=short/medium/long | nothing else |
| `draft_discarded` | age_seconds | nothing else |
| `theme_toggled` | next_theme | none |
| `error_displayed` | code, route | none |

Rules:
- No event carries the body, subject, recipient, or any client PII.
- We bucket numerics so they aren't fingerprints.
- We sample at 100% (low volume); we revisit at v2 scale.

## Where the data lives

In v1: nowhere persistent. We log the events through the same Cloud-
flare logs pipeline (`observability.md`) and query them ad-hoc.

In v2: a dedicated event sink (Cloudflare Workers Analytics Engine or
PostHog self-hosted). The choice is a v2 ADR.

## NPS-style pulse

Once per quarter, a banner asks one question in the app:

> "How likely are you to recommend Financial Advisor Outlook to a
> peer?" (0-10 scale + optional comment)

Implementation lives at `/api/v1/feedback` in v2. The result lands in
the product stream and is reviewed at the next sprint planning.

We do *not* run this in v1 (single internal demo user; the signal
would be noise).

## Decision loop

```
                    monthly
                    ┌─────────────┐
                    │             │
   data ───►  themes    ───►   backlog refresh   ───►  next sprint
                    │             │                          │
                    └─────────────┘                          │
                                                              │
                          ◄────────────────────────────────────┘
                                  (some items pull data
                                   forward as success criteria)
```

Concrete steps:

1. **Once a month**, Product + Tech Lead pull the data from each
   stream into a short doc: `proposals/themes-YYYY-MM.md`.
2. They cluster signals into 3-5 candidate themes for the next
   period.
3. The team scores each candidate against (customer pain) × (revenue
   lift) ÷ (effort).
4. The top themes flow into the v2 roadmap. The bottom themes go to
   the backlog or are dropped.
5. New stories include their **success metric** at write-time — what
   event(s) we expect to move and by how much.

## What we do *not* do

- We do not run A/B tests in v1. Sample size of one customer.
- We do not promise individual response to feature requests; we
  acknowledge in a public CHANGELOG section.
- We do not tie sprint goals to "increase metric X by Y%" without a
  hypothesis about *why*.

## When the loop fails

Failures look like:

- We made changes for two months and no metric moved.
- We changed a metric but customers complained more.
- We can't tell which change moved which number because everything
  shipped at once.

When that happens, the next sprint pauses new features, ships
*observability* (named events, named dashboards), and the loop
restarts.

## Activation trigger

Like everything in Phases 6-7, this is dormant until:

- The first staging deploy lands (so logs are real).
- The analytics event surface (`Sprint 5+`) ships.

Until then, the only data we have is qualitative — feedback from the
single demo user (us). That feedback still goes into
`proposals/themes-YYYY-MM.md`; we just write "qualitative" beside it.
