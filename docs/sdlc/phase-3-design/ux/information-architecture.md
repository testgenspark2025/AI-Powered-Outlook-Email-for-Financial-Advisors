# Information Architecture

**Phase:** 3 — Design (UX)
**Status:** Approved
**Date:** 2026-05-24

## 1. Sitemap

```
/login
/                          (Inbox; default landing after login)
  /folder/inbox
  /folder/drafts
  /folder/sent
  /folder/junk
  /folder/deleted
  /folder/archive
/segment/:segmentId        (filtered inbox view)
/email/:emailId            (full reading view, deep link)
/compose/new
/compose/reply/:emailId
/compose/replyAll/:emailId
/compose/forward/:emailId
/compose/draft/:draftId
/follow-ups
/settings
/api/v1/...                (REST, see api/openapi.yaml)
```

Notes:

- The compose screen is rendered as a popup window-style overlay over the
  underlying inbox route, but also has its own URL so it is shareable and
  reloadable.
- `/segment/:segmentId` is a filter, not a separate folder; it preserves
  the current folder selection in query state.

## 2. Primary navigation (Outlook left rail)

| Group | Items |
|---|---|
| Favorites | Inbox, Sent Items, Drafts |
| Mail | Inbox, Junk Email, Drafts, Sent Items, Deleted Items, Archive |
| Client Segments | (10 wealth segments from existing seed; clicking filters the current folder) |
| Work | Follow-ups (counter shows open items) |
| Settings | Gear icon at the bottom |

## 3. Page anatomy (classic 3-pane)

```
+----------------------------------------------------------------------------------+
|  Title bar (app name, window controls — purely cosmetic)                         |
+----------------------------------------------------------------------------------+
|  Ribbon (Home / Send-Receive / Folder / View tabs; ribbon content for active tab)|
+--------------------+----------------------+-------------------------------------+
| Left rail          | Message list (1/3)   | Reading pane (rest)                 |
| (nav, ~256px)      |                      |                                     |
|                    |                      |                                     |
|                    |                      |                                     |
|                    |                      |                                     |
+--------------------+----------------------+-------------------------------------+
|  Status bar (online indicator, item count, theme toggle hint)                    |
+----------------------------------------------------------------------------------+
```

When an email is open and the reading pane is visible:

- A **client/household context strip** appears at the top of the reading
  pane (collapsible).
- A **Summarize** affordance appears next to the subject for emails over
  100 words.

When compose is open (popup overlay):

```
+--------------------------------------------------------------------+
|  Compose: <subject>             [Send] [AI Draft ▾] [Save] [Close] |
+--------------------------------------------------+-----------------+
| To: ___________________________________          | Client Insights |
| Subject: ___________________________________     |  - Profile      |
+--------------------------------------------------+  - Household    |
| Body                                             |  - Segment      |
|                                                  |  - Suggested    |
|                                                  |    follow-ups   |
|                                                  |    (after AI)   |
+--------------------------------------------------+-----------------+
| Depth: ( Light )( Medium ●)( Deep )    autosaved 12s ago           |
+--------------------------------------------------------------------+
```

## 4. URL state vs UI state

| State | Owner | Why |
|---|---|---|
| Selected folder | URL (path) | Shareable, refresh-safe |
| Segment filter | URL (query `?segment=ID`) | Shareable |
| Selected email in list | URL (path `/email/:id`) | Deep-linkable |
| Compose open | URL (path `/compose/...`) | Refresh-safe |
| Reading pane collapsed insights | localStorage | Per-user preference |
| Theme | localStorage | Per-user preference |
| Depth selector default | localStorage | Per-user preference |
| Draft body in progress | D1 (autosaved) + in-memory editor state | Survives reload |

## 5. Keyboard map

| Key | Action | Context |
|---|---|---|
| `↑` / `↓` | Move selection in message list | Inbox |
| `Enter` | Open selected email | Inbox |
| `r` | Reply to selected/open email | Anywhere |
| `R` | Reply All | Anywhere |
| `f` | Forward | Anywhere |
| `n` | New email | Anywhere |
| `Esc` | Close compose popup | Compose |
| `Cmd/Ctrl+Enter` | Send draft | Compose |
| `Cmd/Ctrl+S` | Force-save draft (auto-save also runs) | Compose |
| `Cmd/Ctrl+K` | Open command palette / search | Anywhere |
| `/` | Focus search box | Anywhere |
