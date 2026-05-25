# User Flows

**Phase:** 3 — Design (UX)
**Status:** Approved
**Date:** 2026-05-24

Canonical flow diagrams will live in Figma; the diagrams below are
authoritative drafts until the Figma file is published. Each flow is
referenced by user stories in
[user-stories.md](../../phase-1-requirements/user-stories.md).

---

## Flow 1 — Login

User story: implicit (ADR-007).

```mermaid
flowchart LR
    A[Visit any URL] --> B{Session cookie valid?}
    B -- yes --> C[Render requested page]
    B -- no --> D[Redirect to /login]
    D --> E[User submits shared password]
    E --> F{Password correct?}
    F -- yes --> G[Set fa_session cookie 30d] --> H[Redirect to original URL]
    F -- no --> I[Show error + rate-limit hint] --> E
```

---

## Flow 2 — Triage Inbox and Read

User stories: US-1.1, US-1.2, US-1.3.

```mermaid
flowchart LR
    A[Land on /] --> B[See message list + nav]
    B --> C{User action}
    C -- arrow keys --> D[Move selection]
    C -- click row --> E[Open email in reading pane]
    D --> E
    E --> F[Client context strip populated]
    F --> G{Long email?}
    G -- yes --> H[Show Summarize button]
    G -- no --> I[Done]
    H --> I
```

---

## Flow 3 — Summarize a Long Email

User stories: US-3.1, US-3.2.

```mermaid
flowchart LR
    A[Open email > 100 words] --> B[Click Summarize]
    B --> C{Summary in D1?}
    C -- yes --> D[Render cached summary]
    C -- no --> E[Call /api/v1/ai/summarize]
    E --> F[Stream/return 60-word bullets]
    F --> G[Persist summary to D1]
    G --> D
    D --> H[User dismisses or reads]
```

---

## Flow 4 — AI-Drafted Reply (happy path)

User stories: US-2.1, US-2.2, US-2.3, US-2.4.

```mermaid
flowchart LR
    A[Open email] --> B[Click Reply]
    B --> C[Compose popup opens with client context]
    C --> D[User picks depth Light/Medium/Deep]
    D --> E[Click AI Draft]
    E --> F[POST /api/v1/ai/draft-reply]
    F --> G[Stream tokens into compose body]
    G --> H[User edits or regenerates]
    H --> I[Suggested follow-ups appear in side panel]
    I --> J[Click Send]
    J --> K[POST /api/v1/sent]
    K --> L[Compose closes; Sent Items updated]
```

Failure branches:

- LLM 5xx or timeout → show retry CTA; user can change depth and retry.
- D1 write fails on autosave → toast warning; in-memory state preserved.
- D1 write fails on Send → block close; show retry; do not lose body.

---

## Flow 5 — New Outbound Email

User story: US-2.5.

```mermaid
flowchart LR
    A[Click New Email in ribbon] --> B[Compose popup, To field focused]
    B --> C[User types client name]
    C --> D[Autocomplete from seeded clients]
    D --> E[Select client]
    E --> F[Context panel + signature populated]
    F --> G[User writes subject and body, or uses AI Draft]
    G --> H[Send]
```

---

## Flow 6 — Accept a Follow-Up

User stories: US-4.1, US-4.2, US-4.3.

```mermaid
flowchart LR
    A[Draft generated] --> B[Suggestions card lists up to 3 follow-ups]
    B --> C[User clicks Add on a suggestion]
    C --> D[POST /api/v1/follow-ups]
    D --> E[Toast: added]
    E --> F[Counter on Follow-ups nav increments]
    F --> G[User can navigate to /follow-ups]
    G --> H[List grouped by client]
    H --> I[Mark Done → PATCH /api/v1/follow-ups/:id]
```

---

## Flow 7 — Resume a Saved Draft

User stories: US-5.2.

```mermaid
flowchart LR
    A[Open Drafts folder] --> B[List of drafts]
    B --> C[Click a draft]
    C --> D[GET /api/v1/drafts/:id]
    D --> E[Compose popup opens with state restored]
    E --> F[User continues editing]
    F --> G{Send or Save or Discard}
    G -- Send --> H[Move to Sent; delete draft row]
    G -- Save --> I[Autosave already running; no extra action]
    G -- Discard --> J[Delete draft row]
```

---

## Flow 8 — Search

User story: US-1.5.

```mermaid
flowchart LR
    A[Type in search box] --> B[Debounced GET /api/v1/search?q=...]
    B --> C{Empty result?}
    C -- yes --> D[Show "no matches"]
    C -- no --> E[Render results: emails, clients, follow-ups]
    E --> F[User clicks result] --> G[Navigate to deep link]
```

---

## Flow 9 — Theme Toggle

User story: US-6.1.

```mermaid
flowchart LR
    A[Click theme toggle in ribbon] --> B[Toggle html.dark class]
    B --> C[Write to localStorage]
```

---

## Edge cases catalog

- Network offline: drafts queue in memory; banner indicates "offline";
  autosave retries on reconnect.
- D1 unavailable: read-only mode banner; compose disabled.
- LLM unavailable: AI Draft button disabled with tooltip; manual compose
  still works.
- Session expired: redirect to /login, preserve return-to URL.
- Compose window closed without sending: confirmation modal if there are
  unsaved changes (after debounce window).
