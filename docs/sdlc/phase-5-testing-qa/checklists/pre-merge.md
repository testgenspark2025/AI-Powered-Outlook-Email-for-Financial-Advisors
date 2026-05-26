# Pre-merge Checklist

This is what the PR author ticks before requesting review, and what
the reviewer re-checks before clicking Merge. Copy it into the PR body
and tick each item.

## Author (before "ready for review")

- [ ] `pnpm lint` is clean locally.
- [ ] `pnpm typecheck` is clean locally.
- [ ] `pnpm test:unit` is green locally.
- [ ] `pnpm build` succeeds locally with `SESSION_SECRET` and
      `SHARED_PASSWORD` set.
- [ ] New code paths have at least one happy-path test and one
      failure-path test.
- [ ] If the PR introduces a new endpoint, it returns RFC 7807 Problem
      Details on errors.
- [ ] If the PR adds an FR or NFR, `acceptance-criteria.md` is updated
      with the matching row.
- [ ] The PR description names the user story id(s) and the sprint.
- [ ] No `console.log` left in committed code (use `console.error` only
      for genuine errors).
- [ ] No new dependency added without a one-line justification in the
      PR body.
- [ ] No secret committed (env files, `.env*` are in `.gitignore`).
- [ ] Screenshots or a short clip attached if the PR changes the UI.

## Reviewer (before merge)

- [ ] All CI checks green (lint, typecheck, tests, build).
- [ ] The diff matches the PR description; nothing surprising shipped.
- [ ] Auth gate is still in place — no public route was added without
      an explicit `runtime = "edge"` and middleware allowance.
- [ ] Repo functions, not raw Drizzle / direct seed reads, are used in
      handlers and pages (per ADR-004).
- [ ] Edge runtime declared on every new `route.ts`.
- [ ] Server components do not import client-only state (e.g.
      `localStorage`) directly.
- [ ] Branch is up to date with `develop` (or `main` for doc PRs).
- [ ] Squash-and-merge is used unless the history is intentionally
      preserved (rare).

## After merge

- [ ] If the PR closes a story, the issue is closed with a link to the
      merged SHA.
- [ ] If the PR ships a new FR, the next UAT run includes it.
