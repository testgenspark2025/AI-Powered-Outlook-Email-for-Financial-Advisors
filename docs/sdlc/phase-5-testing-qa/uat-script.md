# UAT Script — Prototype on `develop` (Sprints 0-2)

A repeatable walkthrough across the current end-to-end flow. The QA
Lead runs this script before any release candidate or stakeholder demo.

## Preconditions

1. `develop` is checked out at the SHA being verified.
2. `app/.env.local` exists with `SESSION_SECRET` (32+ chars) and
   `SHARED_PASSWORD` set.
3. `pnpm install` ran clean.
4. The dev server is up:
   ```bash
   cd app
   pnpm dev
   ```
5. The QA Lead is using Chrome stable on macOS or Windows. Notes any
   browser-specific quirks in the run log.

## Run log template

For each run, copy this to `docs/sdlc/phase-5-testing-qa/runs/`:

```
Run date:   2026-MM-DD
Run owner:  <name>
Branch:     develop
Commit:     <short SHA>
Browser:    <Chrome 125 on macOS 14.5>
Outcome:    PASS / PASS-WITH-NOTES / FAIL
Defects:    <#123, #124>
```

## Steps

Each step has an id, an action, the expected outcome, and a tick box.

### S-AUTH — Authentication

| ID | Action | Expected | Result |
|---|---|---|---|
| S-AUTH-1 | Navigate to http://localhost:3000/ | Redirected to `/login`. | ☐ |
| S-AUTH-2 | Submit the wrong password | Stays on `/login`, shows "Incorrect password" message; cookie not set. | ☐ |
| S-AUTH-3 | Submit the correct password | Lands on `/`, the inbox shell renders. | ☐ |
| S-AUTH-4 | Open dev tools → Application → Cookies | Exactly one cookie `fa_session`, `HttpOnly`, `SameSite=Lax` (Secure only in HTTPS). | ☐ |
| S-AUTH-5 | (Manual) Clear `fa_session` and reload | Redirected to `/login`. | ☐ |

### S-INB — Inbox & reading

| ID | Action | Expected | Result |
|---|---|---|---|
| S-INB-1 | Land on `/` | 3-pane layout (folder rail / message list / reading pane). Five seeded messages newest-first. | ☐ |
| S-INB-2 | Click "Robert Sterling — Q4 Family Office Review…" | Body renders in the reading pane; header shows sender, subject, timestamp. | ☐ |
| S-INB-3 | Look at the right sidebar | "Client" card shows Sterling segment + risk + clientSince + age. "Household" card lists 4 members with assets. | ☐ |
| S-INB-4 | Press `ArrowDown` repeatedly | Selection moves down the message list one row at a time. Reading pane updates. | ☐ |
| S-INB-5 | Press `ArrowUp` until selection reaches the top | Selection stops at the first row. | ☐ |
| S-INB-6 | Click "Ultra High Net Worth" in the segment list | Message list shrinks to one item (Robert Sterling). URL gains `?segmentId=1`. | ☐ |
| S-INB-7 | Click "All" under "Client Segments" | Filter clears; five messages back. | ☐ |
| S-INB-8 | Reload the page mid-selection | The selected message is preserved via `?id=…` in the URL. | ☐ |

### S-COM — Compose & autosave

| ID | Action | Expected | Result |
|---|---|---|---|
| S-COM-1 | Click "+ New Email" in the ribbon | Lands on `/compose?draftId=df_…`. Empty form, status reads "Not saved yet" or "Last saved …". | ☐ |
| S-COM-2 | Type a `To`, `Subject`, and a few lines of body | After ~5 s of inactivity the status reads "Saving…" → "Saved at HH:MM:SS". | ☐ |
| S-COM-3 | Click "Save draft" while still typing | Status reads "Saving…" then "Saved at HH:MM:SS". | ☐ |
| S-COM-4 | Reload the page | Form re-renders with the same `To`, `Subject`, `body`. | ☐ |
| S-COM-5 | Click "Discard", confirm | Lands on `/`. Drafts folder no longer lists this draft. | ☐ |
| S-COM-6 | Open any inbox message → click "Reply" | Lands on `/compose?draftId=…`. `To` is the client's address. `Subject` starts with `RE:`. Body contains the quoted original. | ☐ |
| S-COM-7 | In the reply, blank out `To`, click "Send" | Status reads "To, subject, and body are required". Nothing leaves the drafts folder. | ☐ |
| S-COM-8 | Fill `To`, click "Send" | Redirects to `/?folder=sent`. The new message is at the top of Sent Items. | ☐ |
| S-COM-9 | Open the sent message | Header reads "To: …" and "Sent <timestamp>". Body matches what you typed. | ☐ |

### S-NAV — Folder navigation

| ID | Action | Expected | Result |
|---|---|---|---|
| S-NAV-1 | Click "Drafts" in the left rail | Lists in-progress drafts. Clicking a draft opens `/compose?draftId=…`. | ☐ |
| S-NAV-2 | Click "Sent Items" | Sent messages list. Reading pane shows sent body. | ☐ |
| S-NAV-3 | Click "Inbox" | Back to inbox; previous selection state may reset. | ☐ |

### S-SET — Settings

| ID | Action | Expected | Result |
|---|---|---|---|
| S-SET-1 | Click the moon icon (top-right of the ribbon) | The UI flips to dark mode. Background `html` gains `dark` class. | ☐ |
| S-SET-2 | Reload the page | Dark mode persists (read from `localStorage`). | ☐ |
| S-SET-3 | Click the sun icon | Light mode returns. Reload to confirm persistence. | ☐ |

### S-A11Y — Accessibility (light)

| ID | Action | Expected | Result |
|---|---|---|---|
| S-A11Y-1 | Use only the keyboard (Tab, Arrow keys, Enter, Space) to complete steps S-INB-1 to S-INB-6 | No step requires a mouse. Focus indicators are visible at every step. | ☐ |
| S-A11Y-2 | Run Lighthouse → Accessibility on `/` (signed in) | Score ≥ 90. No critical axe violations. | ☐ |

## Sign-off

> I confirm that the steps above passed (or that any failures have been
> filed as GitHub Issues with the right severity) on the commit named in
> the run log.

| Role | Name | Date | Signature |
|---|---|---|---|
| QA Lead | | | |
| Tech Lead | | | |
| Product | | | |
