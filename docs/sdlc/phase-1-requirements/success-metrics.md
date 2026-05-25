# Success Metrics

**Phase:** 1 — Requirements & Discovery
**Status:** Approved
**Date:** 2026-05-24

This document defines what "success" means for the prototype. Because the
build is a prototype/demo (Phase 0 D-004), the metrics are framed around
demo readiness, perceived quality, and technical health — not customer
adoption or revenue.

---

## 1. Metric Tiers

| Tier | Purpose | Audience |
|---|---|---|
| **North Star** | Single number that captures whether the prototype achieves its core promise. | Project sponsor |
| **Product KPIs** | Indicators of whether the prototype's features work as intended in demos and dogfooding. | Product lead, engineering lead |
| **Technical KPIs** | Indicators of engineering health, performance, and cost. | Engineering lead |
| **Qualitative signals** | Subjective feedback from demo audiences. | Product lead |

---

## 2. North Star

**Time from "I want to reply to this email" to "draft is acceptable to send" — median, across at least 20 demo or dogfood sessions.**

| Target | Stretch |
|---|---|
| ≤ 60 seconds | ≤ 30 seconds |

Measurement: instrument the compose window with two timestamps — one when
the user opens reply/forward/new, one when the user clicks Send (or
"accept as-is" in a dogfood session). Persist to D1 and surface in a
hidden dev dashboard.

---

## 3. Product KPIs

| ID | Metric | Target | How measured |
|---|---|---|---|
| K-1 | **AI draft acceptance rate** — drafts sent with no edits or only whitespace edits, divided by total drafts generated. | ≥ 25% | Diff between streamed draft text and sent text; log to D1. |
| K-2 | **AI draft usage rate** — number of compose sessions where "AI Draft" was clicked at least once, divided by total compose sessions. | ≥ 70% | Telemetry event per compose session. |
| K-3 | **Personalization coverage** — drafts that include the client's name and at least one segment- or household-specific fact. | ≥ 95% | Post-generation check using a deterministic rules pass (name present, plus one of {segment tone keyword, household member name, asset figure, risk profile}). |
| K-4 | **Summary use rate** — long emails (>100 words) where the user clicked Summarize. | ≥ 50% | Telemetry. |
| K-5 | **Follow-up acceptance** — suggested follow-ups added to the Follow-ups view, divided by total suggestions surfaced. | ≥ 20% | D1 count. |
| K-6 | **Depth distribution** — share of drafts generated at Light / Medium / Deep. | Medium ≥ 50% | Telemetry; used to validate that defaults make sense. |

---

## 4. Technical KPIs

| ID | Metric | Target |
|---|---|---|
| T-1 | First paint (cold load, broadband). | < 1.5s |
| T-2 | AI draft time-to-first-token. | < 3s p50, < 5s p95 |
| T-3 | AI draft full-response latency at Medium depth. | < 8s p50, < 15s p95 |
| T-4 | Per-draft LLM cost at Medium depth. | < USD 0.05 |
| T-5 | LLM error rate (HTTP 5xx or timeout) over rolling 24h. | < 2% |
| T-6 | D1 write error rate. | < 0.5% |
| T-7 | Cloudflare Worker request error rate. | < 1% |
| T-8 | Crash-free sessions (no unhandled JS error). | ≥ 98% |
| T-9 | Lighthouse accessibility score. | ≥ 90 |
| T-10 | Lighthouse performance score. | ≥ 80 |

---

## 5. Qualitative Signals

Collected from internal demos and any informal advisor reviews. Not
hard-gated, but tracked.

- **Demo "wow" rate:** in a 5-minute demo, did at least one viewer say
  something positive about the personalization unprompted?
- **Believability:** does the AI draft pass for "could a real advisor have
  written this?" in informal reviews? Tracked as yes/no per demo.
- **Embarrassment events:** any LLM output that is offensive, factually
  wrong about the (fictional) client, or off-tone. Target: zero.
- **Confusion events:** anything a demo viewer asks "why does it do that?"
  that the team cannot explain in one sentence.

---

## 6. Tracking Cadence

| Metric type | Cadence | Owner |
|---|---|---|
| North Star | Weekly during build; per demo afterward | Product lead |
| Product KPIs | Weekly | Product lead |
| Technical KPIs | Per sprint review | Engineering lead |
| Qualitative signals | Per demo or dogfood session | Whoever ran it |

---

## 7. Exit Criteria for the Prototype

The prototype is considered "shippable as a demo" when **all** of the
following hold for at least one full week:

- North Star median ≤ 90 seconds (relaxed from target during ramp).
- K-1 ≥ 15%, K-2 ≥ 50%, K-3 ≥ 90%.
- T-1, T-2, T-3, T-7, T-8 all meet their targets in the last 100 sessions.
- Zero open "embarrassment" events from qualitative signals in the last
  week of dogfood.

---

## 8. Out of Scope (this phase)

The following metrics are intentionally **not** tracked, because the
prototype's scope (single user, no production traffic, no compliance)
makes them irrelevant or premature:

- DAU / MAU, retention curves, cohort analysis.
- NPS / CSAT (no real customers).
- Conversion, revenue, ARR.
- Regulatory audit metrics (record retention completeness, supervision
  queue throughput).
- Multi-tenant noisy-neighbor or fairness metrics.

---

## 9. Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-24 | Initial approved metrics set. | Product lead |
