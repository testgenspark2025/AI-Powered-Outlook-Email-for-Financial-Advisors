# Architecture Decision Records

Each ADR captures one architecturally significant choice. ADRs are
immutable once accepted; revisions happen by writing a new ADR that
supersedes the previous one.

## Index

| ID | Title | Status | Date |
|---|---|---|---|
| [ADR-001](./adr-001-build-approach.md) | Greenfield rewrite, same repository | Accepted | 2026-05-24 |
| [ADR-002](./adr-002-frontend-framework.md) | Next.js (App Router) as the frontend framework | Accepted | 2026-05-24 |
| [ADR-003](./adr-003-backend-api.md) | Next.js Route Handlers + Server Actions for backend | Accepted | 2026-05-24 |
| [ADR-004](./adr-004-database.md) | Cloudflare D1 with Drizzle ORM | Accepted | 2026-05-24 |
| [ADR-005](./adr-005-llm-provider.md) | Azure OpenAI via an internal LLM gateway | Accepted | 2026-05-24 |
| [ADR-006](./adr-006-hosting.md) | Cloudflare Pages with `next-on-pages` | Accepted | 2026-05-24 |
| [ADR-007](./adr-007-auth.md) | Single shared password gate (cookie-based) | Accepted | 2026-05-24 |
| [ADR-008](./adr-008-styling-components.md) | Tailwind CSS + shadcn/ui primitives | Accepted | 2026-05-24 |
| [ADR-009](./adr-009-testing-strategy.md) | Vitest, Playwright, and prompt evals | Accepted | 2026-05-24 |
| [ADR-010](./adr-010-ci-cd.md) | GitHub Actions for CI, Cloudflare Pages for CD | Accepted | 2026-05-24 |

## Template

See [adr-template.md](./adr-template.md) for the canonical format.

## Authoring rules

- One decision per file.
- File name: `adr-NNN-short-slug.md`.
- Numbering is monotonic and gap-free.
- Status transitions: Proposed → Accepted; or Accepted → Superseded by
  ADR-XYZ; or Accepted → Deprecated.
- Update the index when adding or changing an ADR.
