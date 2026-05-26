# Runbook — D1 Migrations

Drizzle Kit produces SQL migration files; `wrangler d1 migrations`
applies them to a Cloudflare D1 database. This runbook covers
authoring, reviewing, applying, and rolling back.

## Layout

```
app/
├── drizzle.config.ts
├── src/lib/db/
│   ├── schema.ts          # Drizzle schema, the source of truth
│   └── migrations/        # generated SQL — committed
│       ├── 0000_initial.sql
│       ├── 0001_add_followups_table.sql
│       └── meta/_journal.json
```

## Author a new migration

1. Edit `src/lib/db/schema.ts`.
2. Generate the SQL:
   ```bash
   cd app
   pnpm drizzle-kit generate
   ```
3. Drizzle writes the new file under `migrations/`. Read it carefully.
4. If it tries to drop or rename a column, **stop**. Use the column-
   evolution pattern below instead.
5. Commit the schema change *and* the generated SQL together.

## Review checklist (PR reviewer)

- [ ] The SQL file is named consistently (`NNNN_short_description.sql`).
- [ ] No `DROP TABLE` on a table that has rows in any env.
- [ ] No `DROP COLUMN` on a column referenced by any current code path.
- [ ] No `ALTER COLUMN` that narrows a type or adds `NOT NULL` without
      a default.
- [ ] Indexes that may take time are created `IF NOT EXISTS`.
- [ ] A rollback path is described in the PR body (see below).

## Column-evolution pattern (safe by default)

To rename `email` → `address`:

1. **Expand** — add the new column `address` alongside `email`. Backfill.
2. **Migrate writes** — the app writes to both columns for one release.
3. **Migrate reads** — the app reads from `address`, ignores `email`.
4. **Contract** — a later migration drops `email`.

This takes three releases. We prefer it to a one-shot rename because it
makes rollback trivial at every step.

## Apply to local

```bash
cd app
wrangler d1 migrations apply fa-outlook-db-local --local
```

Verify in Drizzle Studio:

```bash
pnpm drizzle-kit studio
```

## Apply to preview

Preview migrations run automatically in the GitHub Actions deploy
workflow (see `runbooks/deploy.md` step 3). If you need to run them
by hand:

```bash
wrangler d1 migrations apply fa-outlook-db-preview --env=preview
```

## Apply to staging or production

Always **backup first**:

```bash
wrangler d1 export fa-outlook-db-$ENV --output backups/pre-mig-$(date +%Y%m%d-%H%M)-$ENV.sql
```

Then:

```bash
wrangler d1 migrations apply fa-outlook-db-$ENV --env=$ENV
```

If the apply errors, **do not** retry blindly. Read the error.

| Error | Likely cause | Action |
|---|---|---|
| `UNIQUE constraint failed` | Backfill produced duplicates | Inspect the data; usually means the migration needs a `DELETE`/`UPDATE` step before the constraint is added. |
| `no such column` | The migration references a column that was already dropped in a prior migration | Repair the migration in source; bump the version; re-run. |
| `database is locked` | Another writer | Wait 30 s, retry. If it persists, escalate. |

## Rollback

Three options, in order of safety:

1. **Restore the backup** (`runbooks/rollback.md` step 2). This is the
   default for staging and production.
2. **Forward-only rollback migration** — author a new migration that
   reverses the change. Use this only for fully-additive migrations
   (e.g. dropping a newly-added index).
3. **Manual SQL** — only with the Tech Lead present. Document every
   statement in the incident ticket.

## Special case — D1 cold cache

After a large migration, D1 may show elevated query latency for
several minutes as its planner statistics refresh. This is normal.
The SLO budget in Phase 7 accounts for it.

## Migration smoke test

After applying to staging:

```bash
# Schema-only sanity check
wrangler d1 execute fa-outlook-db-staging --command="
  SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name;
"

# Row count parity (compare against backup)
wrangler d1 execute fa-outlook-db-staging --command="
  SELECT 'clients' AS table_name, COUNT(*) AS rows FROM clients
  UNION ALL SELECT 'segments', COUNT(*) FROM segments
  UNION ALL SELECT 'emails', COUNT(*) FROM emails;
"
```

Compare to the pre-migration backup. Any drop in rows that isn't
explained by the migration is a stop-the-deploy signal.
