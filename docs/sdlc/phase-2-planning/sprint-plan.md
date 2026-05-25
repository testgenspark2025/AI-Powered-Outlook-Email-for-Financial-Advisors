# Sprint Plan — MVP

**Phase:** 2 — Analysis & Planning
**Status:** Approved
**Date:** 2026-05-24
**Cadence:** 2-week sprints, small team (2 to 3 engineers + 1 designer)

This plan covers Sprint 0 through Sprint 6. Each sprint lists goals, key
deliverables, and the user stories or ADR work it advances. Story IDs
refer to [user-stories.md](../phase-1-requirements/user-stories.md);
FR IDs refer to [the PRD](../phase-1-requirements/prd.md).

---

## Sprint 0 — Foundation (Weeks 1-2)

**Goal:** stand up the new Next.js app on Cloudflare with CI, login gate,
D1 schema scaffold, and a mock LLM gateway. No user-facing features yet.

| Workstream | Deliverable |
|---|---|
| Repo | Create `app/` directory; Next.js + TypeScript + Tailwind + shadcn/ui; pnpm workspaces. |
| Hosting | Wire `@cloudflare/next-on-pages`; preview deploys per PR. |
| Auth | Implement shared password gate + middleware (ADR-007). |
| Persistence | Initial D1 schema for clients, households, members, emails, drafts, sent, follow-ups, ai_calls, settings; Drizzle migrations. |
| AI | LLM gateway skeleton with mock provider; stub `draftReply`, `summarizeEmail`, `suggestFollowUps`. |
| CI | GitHub Actions workflow with lint, typecheck, unit tests. |
| Spike | Validate streaming responses on Cloudflare Workers (Risk R-006). |
| Spike | Validate Next.js + D1 binding via `next-on-pages` local dev. |

**Exit:** `pnpm dev` works; `pnpm test:unit` passes; CI green; preview
URL reachable; login gate blocks unauthenticated requests.

---

## Sprint 1 — Inbox & Reading (Weeks 3-4)

**Goal:** a working Outlook-style inbox with reading pane and client
context, populated by seeded data. No AI yet.

| Workstream | Deliverable |
|---|---|
| Data | Seed 5 handcrafted clients with households (FR-CLI-1, FR-CLI-2, FR-CLI-3). |
| UI | Three-pane Outlook layout: nav (folder tree), message list, reading pane (FR-INB-1, FR-INB-2). |
| UI | Client + household side panel in reading view (FR-INB-3). |
| UI | Keyboard navigation up/down/enter (FR-INB-4, US-1.3). |
| UI | Light/dark theme toggle (FR-SET-1, US-6.1). |
| Tests | Integration tests for inbox API; E2E for "open and read" flow. |

**Stories closed:** US-1.1, US-1.2, US-1.3, US-6.1.

---

## Sprint 2 — Compose Shell + Persistence (Weeks 5-6)

**Goal:** working compose popup (reply, reply-all, forward, new outbound)
with draft autosave and a Sent Items view. Still no AI.

| Workstream | Deliverable |
|---|---|
| UI | Popup compose window with client context side panel (FR-CMP-1, FR-CMP-3). |
| UI | Recipient autocomplete for new outbound (FR-CMP-2, US-2.5). |
| Persistence | Draft autosave every 5s via Server Action (FR-SND-2). |
| Persistence | Drafts view (FR-SND-4). |
| Persistence | Mock send → Sent Items view (FR-SND-1, FR-SND-3). |
| Tests | E2E for "compose, autosave, reload, continue, send". |

**Stories closed:** US-2.5 (shell), US-5.1, US-5.2.

---

## Sprint 3 — AI Draft + Depth Selector (Weeks 7-8)

**Goal:** AI Draft works end-to-end against the mock provider, with the
depth selector, regenerate, and edit.

| Workstream | Deliverable |
|---|---|
| AI | Prompt builders for reply and new outbound, parametrised by depth (PRD §9). |
| AI | Streaming wired from gateway to compose body (FR-CMP-6). |
| UI | Depth selector (Light / Medium / Deep) above AI Draft button (FR-CMP-5, US-2.2). |
| UI | Regenerate button (FR-CMP-7, US-2.3). |
| UI | Editor protects user edits during stream (US-2.4). |
| Telemetry | Log every call to `ai_calls` (model, depth, tokens, latency, outcome). |
| Tests | Prompt eval harness with at least 12 (input, expectation) pairs across depths. |

**Stories closed:** US-2.1, US-2.2, US-2.3, US-2.4.

---

## Sprint 4 — Summarization + Follow-ups (Weeks 9-10)

**Goal:** ship the last two AI workflows.

| Workstream | Deliverable |
|---|---|
| AI | `summarizeEmail` gateway function; bulleted output ≤ 60 words (FR-SUM-1, FR-SUM-2). |
| Persistence | Summary cache keyed by email ID (FR-SUM-3). |
| UI | "Summarize" button for long incoming emails; render summary above body. |
| AI | `suggestFollowUps` returns up to 3 from a fixed catalog (FR-FLW-1). |
| UI | Suggestions card after draft; "Add" button persists to `follow_ups` (FR-FLW-2). |
| UI | Follow-ups view in nav pane (FR-FLW-3). |
| Tests | Prompt eval for summarization (length, bullets, factual containment). |

**Stories closed:** US-3.1, US-3.2, US-4.1, US-4.2, US-4.3.

---

## Sprint 5 — Azure Cutover + Polish (Weeks 11-12)

**Goal:** swap mock provider for real Azure OpenAI; address polish
backlog; close NFRs.

| Workstream | Deliverable |
|---|---|
| AI | Implement Azure provider behind `LlmProvider`; feature flag for cutover. |
| Ops | Configure Pages secrets; verify region; verify cost guardrails. |
| UI | Filter by segment (FR-INB-5, US-1.4); search (FR-INB-6, US-1.5). |
| UI | Settings page: display name + signature (FR-SET-2, FR-SET-3, US-6.2). |
| NFR | Accessibility pass (NFR-6); Lighthouse audit (T-9, T-10). |
| Telemetry | Hidden dev dashboard surfacing North Star + KPIs. |

**Stories closed:** US-1.4, US-1.5, US-6.2.

---

## Sprint 6 — UAT, Bug Bash, Cutover (Weeks 13-14)

**Goal:** make the old prototype on `main` obsolete; ship the MVP.

| Workstream | Deliverable |
|---|---|
| QA | UAT with 3 to 5 advisors on the preview environment. |
| QA | Bug bash session (full team, 2 hours). |
| Engineering | Triage and fix P0/P1 bugs. |
| Migration | Merge `develop` into `main`; delete old `src/` and `public/` from prototype. |
| Docs | Update top-level README with the new app; record a demo video. |
| Demo | Record the canonical 5-minute demo. |

**Exit:** MVP exit criteria (roadmap §MVP) all green.

---

## Velocity assumptions

- Team: 2 engineers + 1 designer + 0.5 PM.
- Effective dev capacity: ~16 engineer-days per sprint (after meetings).
- 20% capacity reserved for unplanned work and small bugs.
- Spikes consume up to 2 engineer-days each.

## Definition of Ready (per story)

- Acceptance criteria written.
- UX direction agreed (Figma frame or sketch).
- Dependencies identified.

## Definition of Done (per story)

- Code merged; CI green.
- Integration test or E2E test added where applicable.
- Deployed to preview; product owner has validated against acceptance
  criteria.
- PRD requirement ID(s) referenced in the PR description.
