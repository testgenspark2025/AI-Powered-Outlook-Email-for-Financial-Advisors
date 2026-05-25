# Wireframes

**Phase:** 3 — Design (UX)
**Status:** Approved (text wireframes); high-fidelity Figma pending
**Date:** 2026-05-24

The canonical wireframes will live in a Figma file linked here once it
exists. The text wireframes below are authoritative for engineering until
Figma is published.

Figma link: _TBD — add when published_
draw.io link: _TBD — for any flow charts the team prefers in draw.io_

---

## W1 — Login

```
+----------------------------------------------+
|                  Financial                   |
|             Advisor Outlook (logo)           |
|                                              |
|         +-----------------------------+      |
|         | Password                    |      |
|         | [                         ] |      |
|         +-----------------------------+      |
|                                              |
|         [           Sign in          ]       |
|                                              |
|         Wrong password? Try again in N s.    |
|                                              |
+----------------------------------------------+
```

Notes:
- Centered card, ~360px wide.
- Show rate-limit countdown on incorrect attempts (R-014).

---

## W2 — Inbox + Reading Pane (default)

```
+------------------------------------------------------------------------------------------+
| FA Outlook                              [-] [□] [x]                                       |
+------------------------------------------------------------------------------------------+
| Home  Send/Receive  Folder  View                                                          |
| [New Email]  [Reply] [Reply All] [Forward]  | [Delete] | [AI Assist] [Theme]              |
+----------------+-----------------------------+----------------------------------------+--+
| Mail           | Inbox     ⚙ ⏷            ↘ | Subject row                              |  |
|  > Favorites   | All | Unread | Flagged       | From: ...                                |  |
|    Inbox  (3)  | -----------------------------|                                          |  |
|    Sent        | • Robert Sterling           | Body...                                  |  |
|    Drafts      |   Q4 Family Office Review   |                                          |  |
|                |   "I'd like to schedule..." |  +------------------------------------+  |  |
|  > Mail        |   2:30 PM   • Important     |  | Client Insights (collapsible)      |  |  |
|    Inbox       |                             |  | Robert Sterling                    |  |  |
|    Junk        | • Dr. Sarah Martinez        |  | Ultra High Net Worth               |  |  |
|    Sent        |   Retirement Planning ...   |  | Household $72.3M, 4 members        |  |  |
|    ...         |                             |  | [Show more]                        |  |  |
|                | • Jennifer Chen             |  +------------------------------------+  |  |
|  > Segments    |   First Home Purchase ...   |                                          |  |
|    Ultra HNW   |                             | [Summarize] for long emails              |  |
|    HNW         |                             |                                          |  |
|    ...         |                             |                                          |  |
|  ⚙ Settings    |                             |                                          |  |
+----------------+-----------------------------+------------------------------------------+--+
```

Notes:
- Left rail width 256px; message list 33% of the rest; reading pane fills.
- The Client Insights strip in the reading pane is collapsed by default
  in this view; user can expand or pin it.
- Segment chips render with a small dot in the segment's accent color.

---

## W3 — Compose Popup (Reply with AI Draft)

```
+----------------------------------------------------------------------------------------+
|  Reply — Q4 Family Office Review                          [Send]  [AI Draft ▾]  [x]    |
+----------------------------------------------------------+-----------------------------+
| To: Robert Sterling <rsterling@sterlingfamily.com>       |                             |
| Subject: Re: Q4 Family Office Review & Tax Strategy ...  |  CLIENT INSIGHTS            |
|                                                          |                             |
| Body (editor):                                           |  Robert Sterling            |
|                                                          |  Age 58 · CEO & Founder     |
| Dear Mr. Sterling,                                       |  Sterling Family Office     |
|                                                          |  Client since Mar 2018      |
| Thank you for reaching out regarding the Q4 review. ...  |  Risk: Conservative         |
|                                                          |  Segment: Ultra HNW         |
|                                                          |                             |
|                                                          |  HOUSEHOLD ($72.3M)         |
|                                                          |   Robert      $67.5M Self   |
|                                                          |   Sarah       $4.2M  Spouse |
|                                                          |   Michael     $350K  Son    |
|                                                          |   Emma        $280K  Daugh  |
|                                                          |                             |
|                                                          |  SUGGESTED FOLLOW-UPS       |
|                                                          |   [+] Schedule Q4 review    |
|                                                          |   [+] Send TLH brief        |
|                                                          |   [+] 30-day reminder       |
+----------------------------------------------------------+-----------------------------+
| Depth: ( Light ) ( ● Medium ) ( Deep )    [Regenerate]      autosaved 12s ago          |
+----------------------------------------------------------------------------------------+
```

Notes:
- Window approx 1024 × 720; resizable; remembered per session.
- The depth selector is a segmented control with tooltips per option.
- The Send button shows a checkmark briefly on success, then closes.
- The AI Draft button has a chevron that opens an inline depth+regenerate
  menu in compact widths.

---

## W4 — Compose Popup (New Outbound)

Same as W3 but with:

- To field empty with autocomplete combobox over seeded clients (use
  `cmdk` style).
- Selecting a client populates the right-side panel and unlocks AI Draft.
- A signature is appended to the body when the user starts typing or
  triggers AI Draft (per FR-SET-3).

---

## W5 — Drafts Folder

```
+----------------+-----------------------------+------------------------------------------+
| Mail           | Drafts                      | [Empty state if none]                    |
|  ...           | • To: Jennifer Chen         |                                          |
|                |   First Home Purchase reply |                                          |
|                |   "Hi Jen, thanks for ..."  |                                          |
|                |   Saved 12s ago             |                                          |
|                |                             |                                          |
+----------------+-----------------------------+------------------------------------------+
```

Clicking a draft opens W3 with state restored.

---

## W6 — Sent Items

Identical to W2 but:
- Message list shows sent messages sorted by send time desc.
- Reading pane shows the sent body; client insights still appear.
- No "Reply" affordance from a sent message (replies always thread off
  the inbound message).

---

## W7 — Follow-ups View

```
+----------------+----------------------------------------------------------------+
| Mail           | Follow-ups                                          [✓ Done]   |
|  Follow-ups    | Robert Sterling — Ultra HNW                                    |
|  (5)           |   • Schedule Q4 review                Due Fri  [Done] [Snooze]|
|                |   • Send TLH brief                    Today    [Done] [Snooze]|
|                |                                                                |
|                | Dr. Sarah Martinez — Affluent Pro                             |
|                |   • Send partnership analysis         Mon      [Done] [Snooze]|
|                |                                                                |
|                | Jennifer Chen — Young Pro                                      |
|                |   • Mortgage pre-approval intro       Wed      [Done] [Snooze]|
+----------------+----------------------------------------------------------------+
```

---

## W8 — Settings

```
+----------------+---------------------------------------------------------+
| Mail           | Settings                                                |
|  Settings      |                                                         |
|                |  Display name                                           |
|                |  [ Alex Rivera                                       ]  |
|                |                                                         |
|                |  Signature                                              |
|                |  [ Alex Rivera, CFP                                   ] |
|                |  [ Rivera Wealth Advisors                             ] |
|                |  [ alex@riverawealth.example                          ] |
|                |                                                         |
|                |  Default AI depth   ( Light ) ( ● Medium ) ( Deep )    |
|                |                                                         |
|                |  Theme              ( ● System ) ( Light ) ( Dark )    |
|                |                                                         |
|                |  [Save changes]                                         |
+----------------+---------------------------------------------------------+
```

---

## Responsive notes

- Below 1024px width: the reading pane and client insights collapse into
  tabs above the message list.
- Below 768px: hide left rail behind a hamburger; compose becomes
  full-screen.
- Below 480px: prototype is intentionally **not optimized**; show a banner.

---

## Accessibility annotations

- Every interactive control needs an accessible name (aria-label or
  text). Icon-only buttons need a tooltip + aria-label.
- Color is never the only signal: importance flag uses both color and
  an icon; segment chips include label text.
- Focus order: ribbon → left rail → message list → reading pane →
  compose (when open, traps focus).
- Live region announces autosave events and AI streaming completion.
