# Cost & Capacity

Money and growth. The two questions: are we spending what we expect,
and is the product holding up at the size it actually is.

## Monthly budget envelope (demo phase)

| Line | Provider | Expected | Hard cap |
|---|---|---|---|
| Cloudflare Pages | CF | $0 (free tier) | $50 / month |
| Cloudflare D1 | CF | $0 (free tier) | $20 / month |
| Cloudflare R2 | CF | $0 (free tier) | $10 / month |
| Azure OpenAI | Azure | $50-200 / month | $400 / month |
| UptimeRobot / monitoring | various | $0-15 / month | $30 / month |
| **Total** | | **$50-215** | **$510** |

Phase 2's `budget.md` carries the $258K program budget; this table is
just the operating cost while the prototype is alive.

## Cost alerts

Two alerts, tied to the same SLI (Azure cost panel):

| Alert | Trigger | Severity | Action |
|---|---|---|---|
| A-7 | MTD spend > 80% of monthly cap | sev-2 | Throttle non-critical AI features. Notify Product. |
| A-8 | MTD spend > 100% of monthly cap | sev-1 | Disable AI features. Notify Product. Open incident. |

Throttling order (least to most painful):

1. Cap `depth=deep` requests; default new requests to `medium`.
2. Cap `depth=medium`; default to `light`.
3. Disable streaming; respond with a short canned message.
4. Disable the AI surface entirely; show a banner.

Each step lives behind a feature flag so the on-call can toggle
without a deploy.

## Cost review cadence

| When | Who | Output |
|---|---|---|
| Weekly | On-call | One line in the weekly ops review: "MTD = $X, on / over / under track". |
| Monthly | Tech Lead | A short note in the team channel with the previous month's totals + a comparison to the same month last quarter. |
| Quarterly | Product + Tech Lead | Decide whether to raise the cap, lower it, or invest in cost reduction. |

## Capacity envelope (demo phase)

| Dimension | Today | Comfortable | Stop and rethink |
|---|---|---|---|
| Concurrent users | 1 | 10 | 50 |
| Emails per user | 5 (seeded) | 200 | 2,000 |
| Clients per user | 5 (seeded) | 50 | 200 |
| AI requests per day | 0 (mock only) | 200 | 1,000 |
| D1 size | < 1 MB | 100 MB | 5 GB |

"Stop and rethink" means: pause new features, profile, and decide if
we need to leave Cloudflare Pages or change the data model.

## Capacity tests

| Trigger to run | What | Tool |
|---|---|---|
| Before a public preview | 100 RPS for 10 min against staging | k6 |
| Quarterly | 50 RPS over an hour to surface slow leaks | k6 |
| Before a sprint that touches AI | Same payload, watch p95 first-token | scripted SSE harness |

All capacity tests run against staging. Production stays unloaded.

## Scaling triggers (and the decisions they force)

| Trigger | Decision |
|---|---|
| Daily active users > 10 | Move from a single shared Pages project to one project per customer. |
| AI requests per day > 1,000 | Negotiate a reserved capacity tier with Azure; or cache responses for repeated drafts. |
| D1 > 1 GB | Add partitioning per customer; revisit ADR-004. |
| First p99 latency spike > 1 s sustained | Profile with traces; consider warming or pre-rendering top routes. |
| First non-CF customer demand | Add a portability layer; revisit the Cloudflare-only assumption. |

Each trigger is a discussion, not an automatic action.

## What costs are we deliberately ignoring (for now)

- Engineer time. Tracked in the Phase 2 budget separately.
- Domain renewal — annual, predictable, < $20.
- Email deliverability service — none today; we don't actually send
  mail. When we do (future), pick from SES / Postmark / Resend and
  re-baseline the table above.
- Compliance audits, lawyer time — D-004 in the charter says "no
  compliance" for the prototype.
