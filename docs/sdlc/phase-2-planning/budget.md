# Budget Estimate — MVP

**Phase:** 2 — Analysis & Planning
**Status:** Approved (planning baseline)
**Date:** 2026-05-24
**Horizon:** 14 weeks, Sprint 0 through Sprint 6
**Currency:** USD; ranges reflect optimistic to pessimistic.

This is a planning-grade estimate, not a committed quote. Refresh at the
MVP exit gate.

---

## 1. People

Team composition per Phase 2 input: 2 to 3 engineers + 1 designer +
0.5 PM. Rates are illustrative blended contractor rates; substitute
internal cost rates if the team is in-house.

| Role | FTE | Weeks | Blended weekly rate | Subtotal |
|---|---|---|---|---|
| Engineering lead | 1.0 | 14 | $4,500 | $63,000 |
| Engineer | 1.5 (avg of 1-2 floating) | 14 | $4,000 | $84,000 |
| Designer | 1.0 | 14 (heavier in Phases 3 and early build) | $3,500 | $49,000 |
| Product manager | 0.5 | 14 | $4,500 | $31,500 |
| Security / compliance (fractional) | 0.1 | 14 | $5,000 | $7,000 |
| **People total** | | | | **$234,500** |

Optimistic (smaller team, faster): **$170,000**.
Pessimistic (delays, contractor backfill): **$290,000**.

---

## 2. Cloud and Tooling (14 weeks)

Most services fit free tiers at prototype scale.

| Item | Notes | Cost |
|---|---|---|
| Cloudflare Pages | Generous free tier; prototype traffic well within | $0 |
| Cloudflare Workers | Free up to 100k req/day; prototype far below | $0 |
| Cloudflare D1 | Free tier covers prototype reads/writes | $0 |
| Cloudflare KV (if used) | Free tier | $0 |
| GitHub | Public repo, free Actions for public repos | $0 |
| Domain (optional) | Custom domain for the demo | $15 to $25 |
| Email forwarder for the domain (optional) | | $0 to $5/mo |
| **Cloud subtotal** | | **$0 to $50** |

---

## 3. LLM Costs

Largest variable cost. Assumes Azure OpenAI gpt-4o-mini class for Light
and Medium, gpt-4o or equivalent for Deep.

Assumptions:
- 200 dogfood drafts / week from the team
- 50 demo drafts / week
- Average prompt tokens per draft: 1,500 (Medium); 2,500 (Deep); 800 (Light)
- Average completion tokens per draft: 250
- Summaries: 100 / week, 400 in / 80 out tokens
- Follow-up suggestions: 200 / week, 200 in / 60 out tokens

Indicative LLM cost per week: **$8 to $20**.
Over 14 weeks: **$110 to $280**.

Add a 50% buffer for prompt iteration and eval runs: **$165 to $420** total LLM cost.

Cost controls:
- Daily token budget per environment (NFR-10, R-012).
- Mock provider in dev/test.
- Cache for summarization (FR-SUM-3).

---

## 4. Third-party Services (free tiers expected)

| Item | Why | Cost |
|---|---|---|
| Playwright | E2E | $0 |
| Vitest | Unit / integration | $0 |
| Promptfoo | Prompt evals | $0 |
| Sentry (optional) | Error tracking | $0 free tier sufficient |
| Datadog / Grafana Cloud | Skipped at MVP; use Cloudflare logs | $0 |
| Figma | Design | $0 to $15 / designer / mo |
| Linear / GitHub Projects | Backlog | $0 to $10 / user / mo |

Subtotal: **$0 to $200** over 14 weeks.

---

## 5. Contingency

Reserve **10%** of the people line for unplanned work.

- Optimistic: $17,000
- Baseline: $23,000
- Pessimistic: $29,000

---

## 6. Totals

| Scenario | People | Cloud + Tools | LLM | Contingency | **Total** |
|---|---|---|---|---|---|
| Optimistic | $170,000 | $200 | $165 | $17,000 | **~$187,400** |
| Baseline | $234,500 | $250 | $300 | $23,000 | **~$258,000** |
| Pessimistic | $290,000 | $400 | $420 | $29,000 | **~$320,000** |

---

## 7. Notes and Caveats

- People cost dwarfs everything else, as expected at this stage. Cost
  control levers are scope (locked by PRD) and pace (sprint plan).
- LLM cost is small but watch it carefully — it is the one line that can
  spike unexpectedly via a bug or runaway test.
- This budget is **build-only**. Operating costs after MVP are tiny
  (cloud free tiers plus modest LLM usage) but should be re-estimated
  when V1 planning begins.
- No costs allocated for compliance audits, security pen test, or legal
  review — none are in MVP scope per Phase 0 D-004.
