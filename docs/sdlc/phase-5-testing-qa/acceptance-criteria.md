# Acceptance Criteria — FR / NFR Coverage Map

This maps every Functional Requirement and Non-Functional Requirement
from the PRD to a test (automated or manual) or to the sprint that will
make it testable. The legend:

- **A** — Automated test (file path + test name).
- **M** — Manual UAT step (script id in `uat-script.md`).
- **D-Sn** — Deferred until Sprint n.
- **D-Phx** — Deferred until Phase x.

## Functional requirements

| FR | Summary | Status | Reference |
|---|---|---|---|
| FR-AUTH-1 | Single shared password gates the app | A | `tests/unit/session.test.ts` "creates and verifies a session", "rejects expired", "rejects tampered" |
| FR-AUTH-2 | Logout clears the session cookie | M | UAT step S-AUTH-2 |
| FR-INB-1 | Inbox lists inbound emails newest first | A | `tests/unit/repos.test.ts` "lists inbox sorted by receivedAt desc" |
| FR-INB-2 | Reading pane shows full email body | M | UAT step S-INB-2 |
| FR-INB-3 | Client + household side panel renders for known senders | A + M | `ClientInsightsCard` rendered when `email.client` is non-null; UAT step S-INB-3 |
| FR-INB-4 | Keyboard navigation (ArrowUp/Down/Enter) | M | UAT step S-INB-4 |
| FR-INB-5 | Filter inbox by client segment | A | `tests/unit/repos.test.ts` "filters by client segment"; `handlers.test.ts` "filters by segmentId" |
| FR-CLI-1 | Five handcrafted clients are seeded | A | `tests/unit/repos.test.ts` "lists all 5 clients with segments attached" |
| FR-CLI-2 | Household composition with per-member assets | A | `tests/unit/repos.test.ts` "attaches household to a single client" |
| FR-CLI-3 | Segment metadata (tone, characteristics, challenges) | A | `tests/unit/repos.test.ts` "looks up segments by id" |
| FR-COM-1 | Create a new email | A | `tests/unit/drafts-handlers.test.ts` "creates a draft and returns 201" |
| FR-COM-2 | Reply to an inbound email with quoted body | M | UAT step S-COM-2 |
| FR-COM-3 | Autosave a draft every 5 s of inactivity | M | UAT step S-COM-3 (visual confirmation of "Saved at …") |
| FR-COM-4 | Manual save | A | `tests/unit/drafts-handlers.test.ts` "updates fields" |
| FR-COM-5 | Discard a draft | A | `tests/unit/drafts-handlers.test.ts` "removes a draft and returns 204" |
| FR-COM-6 | Send a complete draft | A | `tests/unit/drafts-handlers.test.ts` "sends a complete draft, returns 201, and moves to sent folder" |
| FR-COM-7 | Send fails on incomplete draft | A | `tests/unit/drafts-handlers.test.ts` "rejects sending an incomplete draft" |
| FR-SENT-1 | Sent Items folder shows sent messages | A | `tests/unit/drafts-handlers.test.ts` "returns sent items only" |
| FR-DR-1 | Drafts folder lists in-progress drafts | A | `tests/unit/drafts-handlers.test.ts` "lists current drafts" |
| FR-AI-1 | Draft a reply with AI | D-S3 | Planned in Sprint 3 (mock provider scaffolding exists at `/api/v1/ai/draft-reply`). |
| FR-AI-2 | Adjustable response depth (light/medium/deep) | D-S3 | MockProvider already varies by depth; UI surface in S3. |
| FR-AI-3 | Stream AI tokens to the compose pane (SSE) | D-S3 | Handler exists; client wiring in S3. |
| FR-AI-4 | Summarise a long inbound email | D-S4 | Method present in `LlmProvider` interface. |
| FR-AI-5 | Suggested follow-ups for a client | D-S4 | Method present in `LlmProvider` interface. |
| FR-SET-1 | Toggle light / dark theme | M | UAT step S-SET-1 (light/dark toggle + persistence) |
| FR-API-1 | Every error returns RFC 7807 Problem Details | A | Multiple `handlers.test.ts` cases assert `Content-Type` contains `problem+json` |
| FR-API-2 | All routes are Edge-runtime | A | Static: every `route.ts` exports `runtime = "edge"`. Verified by grep at review time. |

## Non-functional requirements

| NFR | Summary | Status | Reference |
|---|---|---|---|
| NFR-PERF-1 | Inbox list TTFB < 300 ms p95 (local) | D-Ph6 | Need staging perf run. |
| NFR-PERF-2 | First AI token < 2 s p95 | D-S3 | Tests will live in Promptfoo + manual stopwatch. |
| NFR-PERF-3 | Full test suite < 10 s | A | Currently ~3.3 s on the developer's laptop. |
| NFR-A11Y-1 | All actions reachable by keyboard | M | UAT step S-A11Y-1 |
| NFR-A11Y-2 | WCAG 2.1 AA conformance | D-Ph6 | Audit at first public preview. |
| NFR-SEC-1 | Session cookie is `httpOnly`, `Secure`, `SameSite=Lax` | A | `tests/unit/session.test.ts` "issues a cookie with the right flags" *(planned — add in Sprint 3)* |
| NFR-SEC-2 | No secrets in client bundles | A | Static: grep `pnpm build` output for `SESSION_SECRET`/`SHARED_PASSWORD`. |
| NFR-SEC-3 | Error responses do not leak stack traces | A | All Problems helpers return curated `detail`. |
| NFR-OBS-1 | Each API response includes a request id | D-S5 | Wired with the Azure cutover. |
| NFR-OBS-2 | Structured logs in JSON | D-S5 | Same. |
| NFR-PORT-1 | Runs on Cloudflare Pages | D-S5 | `wrangler` plumbing. |
| NFR-REL-1 | Recover from a cold start with no draft loss | D-S5 | Requires D1 cutover. |
| NFR-PRIV-1 | No PII in logs | A + Code review | Today the only "log" is `console.error` in the auth flow; checked at review. |

## Coverage summary

| Category | Count | Tested | Deferred | Note |
|---|---|---|---|---|
| FR (Inbox/Read) | 5 | 5 | 0 | Closed in Sprint 1. |
| FR (Compose/Send) | 7 | 7 | 0 | Closed in Sprint 2. |
| FR (Clients/Segments) | 3 | 3 | 0 | Closed in Sprint 1. |
| FR (Auth) | 2 | 1 | 1 | Logout is manual. |
| FR (AI) | 5 | 0 | 5 | Deferred to Sprints 3-4. |
| FR (Settings) | 1 | 1 | 0 | Theme toggle. |
| FR (API) | 2 | 2 | 0 | RFC 7807 + Edge runtime. |
| NFR | 11 | 4 | 7 | Most NFRs depend on the live env. |

## Definition of "tested"

A criterion counts as tested if:

- it has at least one automated assertion that fails when the behavior
  changes, **or**
- it has a manual UAT step with a written outcome and a screenshot or
  recording attached to the release notes.

Anything else is "deferred", and the row above must name the sprint or
phase that will close it.
