# Regression Checklist

A short pass to run before tagging a release candidate. About 10
minutes if nothing is broken. Done in addition to the full UAT script.

| # | Area | Check | Result |
|---|---|---|---|
| 1 | Auth | Hit `/` while signed out → redirected to `/login`. | ☐ |
| 2 | Auth | Wrong password → stays on `/login`. | ☐ |
| 3 | Auth | Correct password → inbox renders. | ☐ |
| 4 | Inbox | Five seeded messages visible, newest-first. | ☐ |
| 5 | Inbox | Reading pane updates when you click a row. | ☐ |
| 6 | Inbox | Right-side ClientInsightsCard shows household members. | ☐ |
| 7 | Inbox | ArrowDown / ArrowUp / Enter move the selection. | ☐ |
| 8 | Inbox | Segment filter narrows the list and the count badge. | ☐ |
| 9 | Compose | "+ New Email" lands on `/compose?draftId=…`. | ☐ |
| 10 | Compose | After 5 s idle the status shows "Saved at …". | ☐ |
| 11 | Compose | Send with empty fields → 400 surfaced in the status line. | ☐ |
| 12 | Compose | Send with full fields → redirected to `/?folder=sent`. | ☐ |
| 13 | Reply | "Reply" pre-fills `To`, `RE:` subject, and the quoted body. | ☐ |
| 14 | Drafts | Drafts folder lists in-progress drafts; clicking resumes. | ☐ |
| 15 | Sent | Sent Items shows the message you just sent. | ☐ |
| 16 | Settings | Theme toggle works and persists across reload. | ☐ |
| 17 | API | `GET /api/v1/health` returns 200 with `ok: true`. | ☐ |
| 18 | API | `GET /api/v1/emails?folder=trash` returns 400 with `problem+json`. | ☐ |
| 19 | API | `GET /api/v1/clients/cl_missing` returns 404 with `problem+json`. | ☐ |
| 20 | Build | `pnpm build` finishes with 15 routes + middleware printed. | ☐ |

If anything is unchecked, the candidate does not ship; file a sev-1 /
sev-2 bug per `defect-management.md`.
