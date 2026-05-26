# Sunset Policy

When to retire a feature, and when to retire the whole product.

## Feature sunset

### Triggers

A feature is a candidate for sunset when *any two* of the following
are true for three consecutive months:

- Usage is below 5% of monthly active users.
- It produces > 25% of bug reports relative to its size.
- It blocks an architectural change worth its cost in effort.
- It has no clear owner (the original author left, no one volunteered).
- Its operational cost is > 10× its revenue contribution.

The on-call surfaces candidates in the weekly ops review.

### Process

1. **Decision** — Product + Tech Lead meet for 30 minutes; if both
   say sunset, it sunsets.
2. **Announce** — Release notes name the feature, the cutoff date,
   and what (if anything) replaces it.
3. **Soft-disable** — Hide the entry points (button, route in the
   nav) but keep the data and the backend route alive. This is the
   "are people complaining?" period.
4. **Grace window** — 30 days for v1, 90 days for v2+. Users may
   request a re-enable; one re-enable per feature ends the sunset.
5. **Hard-remove** — Delete the code, delete the route, mark the
   migration that drops the columns.
6. **Forget** — One sprint later, delete the related docs / runbooks
   (after capturing any lesson in `lessons-learned.md`).

### What to keep when a feature is sunset

- A short note in `docs/sdlc/phase-8-evolution/sunsets/YYYY-MM-DD-<name>.md`:
  why it was sunset, what we learned, anything a future feature
  would need to know.
- The OpenAPI spec gets a `410 Gone` entry pointing to the note.
- The release notes for the next minor version name the removal.

### What to NOT keep

- Feature flags that disable the dead feature. Remove them.
- Tests that target dead code. Remove them.
- Doc pages that describe how to use the dead feature. Archive, then
  delete after one quarter.

## Product sunset

### Triggers

The whole product is a candidate for sunset when *any one* of the
following is true:

- The strategic bet that funded it (the Phase 0 charter) has been
  withdrawn.
- The team has been redeployed and there is no on-call.
- The product has had no active customer for 6 months.
- A regulatory or security event makes continuing operation
  impractical.

### Process

1. **Decision** — Recorded in `sunsets/PRODUCT-YYYY-MM-DD.md` with a
   sign-off from Product, Tech Lead, and the original sponsor.
2. **Announce** — Customers receive 90 days' notice with a date.
   Internal stakeholders receive immediate notice.
3. **Freeze** — Stop merging anything that isn't a security patch.
4. **Migration path** — If we have customers, document how their
   data leaves the system. Provide an export at `/api/v1/export/me`
   (build it now if it doesn't exist).
5. **Last release** — A final `vX.Y.Z` tagged "EOL", with the EOL
   note in the README at repo root.
6. **Wind-down** — Disable production, delete D1 production data per
   policy, archive backups for the legal retention period, delete
   secrets last.
7. **Repo** — Mark the GitHub repo Archived. Do not delete it.

### Data after sunset

Per the privacy doctrine in this repo:

- Customer data exported once (item 4 above) and then deleted from
  D1 and R2 after the notice window.
- Logs purged at the end of their retention.
- Backups kept for the legal minimum, then deleted; the deletion is
  recorded in `sunsets/PRODUCT-*.md`.
- Source code stays in the archived repo, public, for the next
  product to learn from.

## Sunset criteria for the v1 prototype specifically

The current v1 prototype is *defined* as time-bounded:

> v1 exists to validate the user experience and produce the SDLC
> artifacts for a real v2. It is not intended for long-term use.

A natural sunset trigger fires the moment the v2 program enters Phase
0. The transition is described in `v2-roadmap.md`:

| Step | What |
|---|---|
| 1 | v2 program kicks off Phase 0; v1 is feature-frozen on `main`. |
| 2 | v1 stays alive for one quarter as a "demo of the old shape" while v2 is built. |
| 3 | At v2 launch, v1 enters its 30-day grace window. |
| 4 | v1 is archived per the product-sunset process above. |

This is hopeful, not pessimistic. It is the cleanest way to keep v1
small and to give v2 permission to be different.
