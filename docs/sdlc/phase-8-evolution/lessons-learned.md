# Lessons Learned (Phases 0-7)

The next program's Phase 0 reads this first. Each lesson is short,
opinionated, and tied to where it came from. Lessons are not
prescriptions; they are starting positions.

## L-01. Lock decisions before drafting documents

**From:** Phase 0
**Lesson:** Asking 3-4 sharp scope questions up front and writing the
locked decisions at the top of the charter (D-001…D-004) was the
single highest-leverage thing in the whole program. Every later
phase referred back to those four lines. The temptation to start
drafting docs first and "we'll lock decisions later" produces docs
that age badly. Lock first, draft second.

## L-02. ADRs are cheap; not having one is expensive

**From:** Phase 2
**Lesson:** 11 ADRs sounded like overhead. In practice each one
saved at least one "wait, why did we pick X again?" conversation
later. The cost of writing an ADR is ~15 minutes; the cost of *not*
having one when a new contributor joins is one full sync.

## L-03. The threat model belongs *before* the API spec

**From:** Phase 3
**Lesson:** We wrote the OpenAPI spec first, then the threat model.
The threat model immediately fed back changes (ADR-011, problem+json,
no PII in logs). Doing the threat model first would have saved us
one revision of the OpenAPI file.

## L-04. Prefer in-memory facades behind a stable repo interface

**From:** Sprint 1-2
**Lesson:** Repos under `lib/db/repos/` shipped before the real D1
binding existed. Because the surface (function signatures) was right,
swapping to D1 in Sprint 5 is a pure implementation change. We could
ship the inbox, compose, and send flows without blocking on the
Cloudflare plumbing.

## L-05. Test the route handlers as functions

**From:** Sprint 0-2
**Lesson:** Vitest invoking `GET(req)` / `POST(req)` directly with a
`new Request()` is fast, deterministic, runs in CI without a server,
and surfaces handler logic bugs early. We didn't need Playwright for
Sprint 1 because of this.

## L-06. Mock providers should be deterministic and shaped exactly like the real thing

**From:** Sprint 0
**Lesson:** The `MockProvider` implements the same `LlmProvider`
interface as the (still stub) `AzureProvider`. Tests pin behavior
against the interface, not the provider. When Azure lands, we change
the resolver, not the tests.

## L-07. CI configuration deserves the same care as code

**From:** Sprint 0
**Lesson:** A 30-line `ci.yml` that runs lint, typecheck, unit
tests, and build was the cheapest insurance in the project. The
flat-config ESLint snag and the typecheck readonly-tuple issue would
have shipped without it.

## L-08. Edge runtime requires discipline about what you import

**From:** Sprint 0-2
**Lesson:** `runtime = "edge"` on every route handler is a constant
reminder to keep Node-only APIs out of `lib/`. The day we forget,
the build will tell us. Better still: the lint rule that flags
Node-only imports is on the v2 list.

## L-09. Honest deferral is better than partial implementation

**From:** Sprints 0-2
**Lesson:** Each sprint ended with an explicit "what is NOT in this
sprint" list. That list moved into the next sprint's plan or into
the tech-debt register. We never silently dropped work.

## L-10. The Sprint plan is a contract; the sprint report tells the truth

**From:** Phase 4
**Lesson:** The sprint plan in Phase 2 said "Inbox + reading +
keyboard nav + theme" for Sprint 1. The sprint report listed those
*and* the deferrals (Playwright, D1, real seeds). The combo is what
made the deferrals tracable.

## L-11. Documentation lives where the work lives

**From:** Phases 4, 5
**Lesson:** Sprint summaries lived on `develop` next to the code.
SDLC planning docs lived on `main`. Mixing the two would have
produced merge conflicts every cutover. The rule was simple and
boring: docs about a sprint go with the sprint; phase-level docs go
on `main`.

## L-12. "Theoretical" is fine as long as it's named

**From:** Phases 6, 7
**Lesson:** Calling the deployment + operations docs "theoretical
until the first staging deploy" was honest and prevented two
failure modes: (a) people treating the runbooks as proven; (b)
people skipping the runbooks because nothing was live yet. Honest
labels let everyone calibrate.

## L-13. Lightweight retros beat heavyweight processes

**From:** Phase 5-7
**Lesson:** We didn't run formal retros in the prototype, but
naming the next-sprint carry-overs in every sprint summary was a
*proto-retro*. When the team grows, the formal retros in Phase 8
build on that habit, not on a blank page.

## L-14. The hardest part of the SDLC is showing it's coherent

**From:** All phases
**Lesson:** Eight phases produced ~7,000 lines of documents. The
real win was that they cross-reference: the PRD's user stories show
up in Sprint reports, in the acceptance criteria map, in the UAT
script, in the v2 roadmap. The index in `docs/sdlc/README.md` and
the cross-doc links are what hold the program together. Maintain
them aggressively.

## L-15. Resist the urge to add new ADRs late

**From:** Phases 5-8
**Lesson:** Phases 5-8 added zero ADRs because the locked decisions
from Phase 5 were "medium depth, no new ADRs unless forced". That
discipline kept the later docs short. If a decision *was* forced,
we would have written an ADR — but the prototype scope didn't
demand any.

## How to use these lessons

- Don't treat them as rules. They were right in this program; they
  may be wrong in the next one.
- Read them out loud at the next program's Phase 0 kickoff and ask
  for each: "Is this still true for us?"
- Update or delete the ones the next program disproves. This file
  is the responsibility of whoever owns Phase 8 in the next program.
