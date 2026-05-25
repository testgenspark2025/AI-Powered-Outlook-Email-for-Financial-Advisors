# User Stories

**Phase:** 1 — Requirements & Discovery
**Status:** Approved
**Date:** 2026-05-24

Stories are grouped by epic. Each story has a unique ID, an acceptance
criteria block, and traces back to one or more functional requirements in
the [PRD](./prd.md).

Format: `As a <persona>, I want <capability>, so that <outcome>.`
Primary persona is **Alex, the Solo RIA** (see PRD section 5).

---

## Epic 1 — Inbox & Reading

### US-1.1 — See client communications at a glance
**As Alex,** I want to open the app and immediately see a list of client
emails grouped chronologically, **so that** I can decide what to work on
first.

Traces to: FR-INB-1, FR-INB-2.

Acceptance criteria:
- Inbox displays at least 5 seeded emails from 5 distinct clients.
- Each row shows sender, subject, preview snippet, and time.
- Unread emails are visually distinct (bold or accent color).
- Clicking a row opens the email in the reading pane within 200ms.

---

### US-1.2 — See client and household context while reading
**As Alex,** I want the client's profile and household to appear next to
the email body, **so that** I do not need to switch to my CRM to recall
the family situation.

Traces to: FR-INB-3.

Acceptance criteria:
- Selecting an email reveals a side panel with profile, household members,
  total assets, segment, and risk profile.
- Panel updates when a different client's email is selected.
- Panel can be collapsed and remembers its state in localStorage.

---

### US-1.3 — Navigate by keyboard
**As Alex,** I want to move between emails using arrow keys, **so that**
I can triage quickly without using the mouse.

Traces to: FR-INB-4.

Acceptance criteria:
- Up/Down arrows move selection in the inbox list.
- Enter opens the selected email in the reading pane.
- `r` opens reply; `f` opens forward; `n` opens new compose.

---

### US-1.4 — Filter by segment
**As Alex,** I want to filter the inbox by client wealth segment, **so
that** I can focus on a particular tier (for example, only Ultra HNW today).

Traces to: FR-INB-5.

Acceptance criteria:
- Segment list in the nav pane is clickable.
- Selecting a segment filters the inbox to that segment.
- A "Clear filter" affordance returns to all messages.

---

### US-1.5 — Search across emails and clients
**As Alex,** I want to type into a search box and find any email or client
by name or keyword, **so that** I can jump to context without scrolling.

Traces to: FR-INB-6.

Acceptance criteria:
- Search input is in the nav pane header.
- Searching matches against subject, body, sender, client name, and
  household member names.
- Results appear inline in the inbox list; clearing the input restores the
  full view.

---

## Epic 2 — AI Drafting

### US-2.1 — Get an AI-drafted reply
**As Alex,** I want to click "AI Draft" inside a reply window and receive
a personalized draft, **so that** I save time on the first version.

Traces to: FR-CMP-1, FR-CMP-3, FR-CMP-4, FR-CMP-6.

Acceptance criteria:
- The compose window includes a visible "AI Draft" button.
- Clicking the button streams a draft into the body within 5 seconds.
- The draft references the client by name and at least one segment- or
  household-specific fact.
- Errors (LLM unavailable, timeout) show a user-friendly retry.

---

### US-2.2 — Choose personalization depth
**As Alex,** I want to choose Light, Medium, or Deep before generating,
**so that** I can control how much context the model uses (and how long
it takes).

Traces to: FR-CMP-5.

Acceptance criteria:
- A segmented control (Light / Medium / Deep) is visible above the
  AI Draft button.
- Default is Medium; selection is remembered per session.
- Tooltip on each option explains what it includes.
- Selecting Deep displays a small badge ("retrieving context") while the
  retrieval step runs.

---

### US-2.3 — Regenerate a draft
**As Alex,** I want to regenerate a draft if I don't like the first
version, **so that** I can iterate quickly.

Traces to: FR-CMP-7.

Acceptance criteria:
- A "Regenerate" button is available after a draft has been produced.
- Regenerate uses the same depth unless the user changes it.
- Regenerate replaces the current draft body; previous content is
  discarded.

---

### US-2.4 — Edit before sending
**As Alex,** I want to freely edit the AI draft, **so that** the final
message is in my voice.

Traces to: FR-CMP-8.

Acceptance criteria:
- The compose body is a plain text or rich text editor.
- Cursor position and selection are preserved while streaming completes
  (or streaming pauses on focus, by design choice).
- Manual edits are not overwritten by background autosave.

---

### US-2.5 — Compose a new outbound email
**As Alex,** I want to start a new outbound email and choose a recipient
from my client list, **so that** I can proactively reach out with AI help.

Traces to: FR-CMP-2.

Acceptance criteria:
- "New Email" opens a popup compose window.
- The "To" field is an autocomplete over seeded clients.
- Selecting a client populates the client context panel and enables
  AI Draft.

---

## Epic 3 — Summarization

### US-3.1 — Summarize a long client email
**As Alex,** I want a one-paragraph summary of any long client email,
**so that** I can grasp the ask without re-reading.

Traces to: FR-SUM-1, FR-SUM-2.

Acceptance criteria:
- A "Summarize" button appears next to emails over 100 words.
- Clicking produces a bulleted summary of at most 60 words.
- Summary appears above the email body and can be dismissed.

---

### US-3.2 — Cached summary
**As Alex,** I want the summary to stay available after I navigate away
and back, **so that** I do not pay for the LLM call twice.

Traces to: FR-SUM-3.

Acceptance criteria:
- First summarization stores the result in D1 keyed to the email ID.
- Subsequent opens of the same email show the stored summary without an
  LLM call.

---

## Epic 4 — Follow-up Actions

### US-4.1 — See suggested follow-ups after drafting
**As Alex,** I want the system to suggest up to 3 follow-up actions tied
to the draft I just generated, **so that** I capture the "next step" while
it is fresh.

Traces to: FR-FLW-1.

Acceptance criteria:
- After a draft is generated, a card lists up to 3 suggestions from a
  fixed catalog (for example, "Schedule meeting", "Send tax-loss
  harvesting brief", "Set 30-day reminder").
- Suggestions are anchored to the current client.

---

### US-4.2 — Accept a follow-up
**As Alex,** I want to accept a suggested follow-up with one click, **so
that** I do not forget it.

Traces to: FR-FLW-2.

Acceptance criteria:
- Each suggestion has an "Add" button.
- Accepted follow-ups persist in D1 with: client ID, action type, due
  date if applicable, status (open / done).

---

### US-4.3 — Review follow-ups
**As Alex,** I want a single view of all open follow-ups across clients,
**so that** I can plan my week.

Traces to: FR-FLW-3.

Acceptance criteria:
- A "Follow-ups" entry exists in the nav pane.
- The view groups by client and shows action, due date, and status.
- Marking an item Done updates D1 immediately.

---

## Epic 5 — Send and Persistence

### US-5.1 — Send a draft
**As Alex,** I want to click Send and have the message appear in Sent
Items, **so that** the demo workflow feels complete.

Traces to: FR-SND-1, FR-SND-3.

Acceptance criteria:
- Clicking Send writes a row to D1 (no network email is dispatched).
- The compose window closes.
- Sent Items view shows the new message at the top with timestamp.

---

### US-5.2 — Auto-saved drafts
**As Alex,** I want my draft to survive a browser refresh, **so that** I
do not lose work.

Traces to: FR-SND-2, FR-SND-4.

Acceptance criteria:
- The draft autosaves every 5 seconds while the compose window is open.
- Autosave writes are debounced; rapid edits do not spam D1.
- A "Drafts" view lists in-progress drafts; clicking one reopens the
  compose window with state restored.

---

## Epic 6 — Settings and Theme

### US-6.1 — Toggle theme
**As Alex,** I want to switch between light and dark mode, **so that** I
can match my environment.

Traces to: FR-SET-1.

Acceptance criteria:
- A theme toggle exists in the ribbon.
- Choice persists in localStorage and applies on next load.

---

### US-6.2 — Set my name and signature
**As Alex,** I want to set my display name and email signature, **so
that** AI drafts feel like mine.

Traces to: FR-SET-2, FR-SET-3.

Acceptance criteria:
- Settings page exposes name and signature inputs.
- Signature is appended to new outbound drafts (not replies).
- Values persist in D1.

---

## Story Summary

| Epic | Count | Must-have stories |
|---|---|---|
| Inbox & Reading | 5 | US-1.1, US-1.2, US-1.3 |
| AI Drafting | 5 | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5 |
| Summarization | 2 | US-3.1 |
| Follow-up Actions | 3 | US-4.1, US-4.2 |
| Send & Persistence | 2 | US-5.1, US-5.2 |
| Settings & Theme | 2 | US-6.1 |
| **Total** | **19** | **14 must-have** |

---

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-24 | Initial approved set of 19 stories. | Product lead |
