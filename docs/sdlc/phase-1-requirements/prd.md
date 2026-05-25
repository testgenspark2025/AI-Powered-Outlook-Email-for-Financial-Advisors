# Product Requirements Document (PRD)

**Project:** Financial Advisor Outlook — AI-Powered Client Communications
**Phase:** 1 — Requirements & Discovery
**Status:** Approved
**Date:** 2026-05-24
**Author:** Product lead
**Reviewers:** Engineering lead, design lead

---

## 1. Background

Financial advisors spend a significant portion of their day on client email.
Each response must be personalized to the client's situation, household,
risk profile, and segment, while staying on-tone for the advisor and the
firm. Today this is mostly manual, slow, and inconsistent.

The Phase 0 charter scoped a prototype for a **solo independent advisor**,
using an **Outlook-style UI** (no real mailbox), **Azure OpenAI** for
drafting, and **no regulatory compliance work**. This PRD specifies what
that prototype must do.

---

## 2. Problem Statement

A solo financial advisor needs to compose personalized, high-quality client
emails quickly. Switching between Outlook, CRM notes, and household records
is slow. AI assistants exist but lack client and household context, which
makes their drafts generic and unusable without heavy editing.

---

## 3. Goals

| ID | Goal |
|---|---|
| G-1 | Reduce time from "inbox opened" to "draft ready to send" to under 60 seconds for a typical reply. |
| G-2 | Produce drafts that reference at least one client-specific or household-specific fact, on demand. |
| G-3 | Make client context (profile, household, segment) visible without leaving the compose window. |
| G-4 | Demonstrate four AI workflows end to end: reply drafting, new outbound drafting, email summarization, suggested follow-up actions. |
| G-5 | Be demonstrable on any laptop with a modern browser; no install. |

## 4. Non-Goals

- Real Microsoft Outlook or Microsoft Graph integration.
- Real SMTP/IMAP send or receive.
- Regulatory compliance controls (audit retention, archival, supervision).
- Multi-user or firm-team workflows.
- CRM or custodian integration.
- Mobile apps.

---

## 5. Target User

**Primary persona — "Alex, the Solo RIA"**

- 35-55 years old, independent financial advisor with 30 to 80 active
  clients. Runs their own practice; no compliance officer.
- Uses Outlook for email, a CRM for client notes, and Excel/PDF for
  portfolio reviews.
- Comfortable with technology but not technical. Will adopt AI tools that
  save real time without surprise behavior.
- Cares about tone, accuracy, and not embarrassing themselves in front of
  high-value clients.

Secondary personas (out of scope for build, but considered for design):

- Advisor's part-time assistant (read-only mode in a future phase).
- Prospective firm-level buyer evaluating the demo for a future product.

---

## 6. Product Decisions (locked)

| # | Decision | Source |
|---|---|---|
| P-1 | 5 seeded clients with handcrafted variety across segments. | Phase 1 input |
| P-2 | AI workflows in MVP: reply drafting, new outbound drafting, summarization of long incoming emails, suggested follow-up actions. | Phase 1 input |
| P-3 | Personalization depth is **configurable per draft**: user selects Light, Medium, or Deep before generation. | Phase 1 input |
| P-4 | Persistence layer: **Cloudflare D1** (SQLite at the edge). Stores drafts, sent mail, follow-ups, and user preferences. | Phase 1 input |
| P-5 | Single shared password gate on the prototype, or no auth (deployment decision). No multi-user features. | Phase 0 charter |
| P-6 | Streaming responses from the LLM into the compose UI. | UX requirement |

---

## 7. Functional Requirements

Numbered for traceability. Each requirement has a priority: **M** (must),
**S** (should), **C** (could), **W** (won't this phase).

### 7.1 Inbox and message reading

| ID | Req | Priority |
|---|---|---|
| FR-INB-1 | The app shall display a mock inbox containing seeded emails from 5 distinct clients. | M |
| FR-INB-2 | The app shall allow selecting an email to view its full body in a reading pane. | M |
| FR-INB-3 | The app shall display the matched client's profile and household in a side panel when reading an email. | M |
| FR-INB-4 | The app shall support keyboard arrow navigation between emails. | S |
| FR-INB-5 | The app shall support filtering the inbox by client segment. | S |
| FR-INB-6 | The app shall support free-text search across emails and client data. | S |

### 7.2 Compose and AI drafting

| ID | Req | Priority |
|---|---|---|
| FR-CMP-1 | The user shall be able to compose a reply, reply-all, or forward, opening a popup compose window. | M |
| FR-CMP-2 | The user shall be able to compose a new outbound email and select a recipient from the seeded client list. | M |
| FR-CMP-3 | Inside any compose window, the user shall see the matched client's profile, household, and segment in a side panel. | M |
| FR-CMP-4 | The user shall be able to trigger AI drafting via an explicit button labeled "AI Draft". | M |
| FR-CMP-5 | Before triggering AI drafting, the user shall be able to select the personalization depth: Light, Medium, or Deep. | M |
| FR-CMP-6 | The AI draft shall stream into the compose body within 5 seconds of triggering. | M |
| FR-CMP-7 | The user shall be able to regenerate the AI draft, optionally with a different depth. | M |
| FR-CMP-8 | The user shall be able to edit the AI draft freely before sending. | M |

### 7.3 Summarization

| ID | Req | Priority |
|---|---|---|
| FR-SUM-1 | The user shall be able to request a TL;DR summary of any incoming email longer than 100 words. | M |
| FR-SUM-2 | Summaries shall be no longer than 60 words and bullet-formatted. | S |
| FR-SUM-3 | Summaries shall persist for the lifetime of the email record in D1. | S |

### 7.4 Suggested follow-up actions

| ID | Req | Priority |
|---|---|---|
| FR-FLW-1 | After an AI draft is generated, the system shall propose up to 3 suggested follow-up actions (for example, "schedule a Q4 review", "share tax-loss harvesting brief"). | M |
| FR-FLW-2 | The user shall be able to accept a follow-up action; accepted actions shall persist in D1 as a "follow-up" record tied to the client. | M |
| FR-FLW-3 | The app shall expose a simple Follow-ups view listing all accepted follow-up actions. | S |

### 7.5 Send and persistence

| ID | Req | Priority |
|---|---|---|
| FR-SND-1 | The user shall be able to "send" a drafted email. No real email is dispatched; the message appears in a local Sent Items view. | M |
| FR-SND-2 | Drafts shall auto-save to D1 every 5 seconds while composing. | M |
| FR-SND-3 | The Sent Items view shall list all sent messages with timestamp, recipient, and a link back to the original message. | M |
| FR-SND-4 | The user shall be able to reopen a draft from a Drafts view and continue editing. | S |

### 7.6 Client and household data

| ID | Req | Priority |
|---|---|---|
| FR-CLI-1 | The app shall ship with 5 seeded clients spanning Ultra HNW, HNW, Affluent Professional, Pre-Retiree or Recent Retiree, and Young Professional segments. | M |
| FR-CLI-2 | Each client shall have a household record with at least one member; HNW and Ultra HNW clients shall have multi-member households. | M |
| FR-CLI-3 | Each client shall have a risk profile, occupation, and client-since date. | M |

### 7.7 Settings and theme

| ID | Req | Priority |
|---|---|---|
| FR-SET-1 | The app shall support a light and dark theme toggle, persisted in localStorage. | M |
| FR-SET-2 | The app shall expose a Settings page where the user can set their advisor display name and signature. | S |
| FR-SET-3 | Signature shall be appended to drafts that originate from "new outbound" composes. | C |

---

## 8. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | First paint < 1.5s on a fresh load over broadband. |
| NFR-2 | Performance | AI draft first token < 3s; full draft typically < 8s. |
| NFR-3 | Reliability | The app shall handle LLM API errors gracefully with a user-visible retry. |
| NFR-4 | Security | API endpoints shall reject requests over plain HTTP in non-local environments. |
| NFR-5 | Privacy | No real client PII; seed data is fabricated and clearly labeled. |
| NFR-6 | Accessibility | Keyboard navigation for inbox and compose; ARIA labels on interactive controls. |
| NFR-7 | Browser support | Latest two versions of Chrome, Edge, Safari, and Firefox. |
| NFR-8 | Hosting | Continue on Cloudflare Pages + Workers; D1 for persistence. |
| NFR-9 | Observability | Structured logs for every LLM call (model, depth, token counts, latency, error). |
| NFR-10 | Cost | Per-draft LLM cost must remain under USD 0.05 at default depth. |

---

## 9. Personalization Depth — Definition

Locked from Phase 1 input P-3. The user picks one before generating.

| Depth | What gets injected into the prompt |
|---|---|
| Light | Advisor name; client first name; client segment tone descriptor; one household top-line fact (for example, "household assets: $72.3M"). |
| Medium | Light context plus: client risk profile, occupation, client-since date, full household member list with relations and assets. |
| Deep | Medium context plus: last 3 emails in the thread (or last 3 client emails if new outbound), and retrieved snippets from a small fixed corpus of "firm-approved" content (seeded JSON or D1 table). |

Deep mode requires a simple retrieval layer over the seeded corpus; not full
RAG with embeddings in MVP — substring or keyword match is acceptable.

---

## 10. Out-of-Scope Reminders

These are flagged so reviewers do not assume they are coming:

- Real Outlook, Graph, or SMTP integration.
- Multi-user accounts, roles, sharing.
- Compliance / archival / supervision features.
- Mobile-native apps.
- CRM and portfolio data ingestion.
- Internationalization, localization, RTL.

---

## 11. Dependencies and Assumptions

- Azure OpenAI deployment is available before Sprint 5; otherwise the team
  uses OpenAI direct behind a gateway abstraction.
- Cloudflare D1 quotas are sufficient for prototype usage (well within
  free tier).
- One designer is available for the compose-window depth selector and
  follow-up UI.

---

## 12. Risks (Phase 1 additions)

| Risk ID | Description | Mitigation |
|---|---|---|
| R-006 | Streaming LLM responses through Cloudflare Workers may hit subrequest or duration limits. | Sprint 0 spike: validate streaming on Workers. Fall back to non-streaming if needed. |
| R-007 | Configurable depth feature confuses users in demos. | Default to Medium; tooltips on each option. |
| R-008 | Follow-up actions feel hallucinated rather than useful. | Constrain output to a fixed action catalog (schedule meeting, send brief, set reminder). |
| R-009 | 5 clients still feel too narrow for a wealth-segment demo. | Make seed data easy to extend via a JSON file. |

---

## 13. Open Questions (carry into Phase 2)

- What does the "send" interaction look like for the unhappy path (no
  network, LLM down, validation fails)?
- Should the Sent Items view be searchable in MVP, or just chronological?
- How should the Drafts view behave when a draft has been "sent" — keep,
  archive, or delete?
- How obvious should we make it that this is a prototype (banner, footer
  watermark) to avoid demo confusion?

---

## 14. Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-24 | Initial approved version. | Product lead |
