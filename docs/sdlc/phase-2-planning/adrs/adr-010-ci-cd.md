# ADR-010: GitHub Actions for CI, Cloudflare Pages for CD

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Engineering lead
- **Phase:** 2 — Analysis & Planning

## Context

We need a CI pipeline that runs on every PR (lint, typecheck, unit,
integration, E2E, build) and a CD pipeline that deploys to Cloudflare
Pages. We also want preview deploys per PR for UAT.

## Decision

- **CI:** GitHub Actions. One workflow `ci.yml` runs:
  1. `pnpm install --frozen-lockfile`
  2. `pnpm lint`
  3. `pnpm typecheck`
  4. `pnpm test:unit`
  5. `pnpm test:integration`
  6. `pnpm build` (next build + next-on-pages)
  7. `pnpm test:e2e` (Playwright against the built output)
- **CD:** Cloudflare Pages' native Git integration deploys preview builds
  per PR and production builds on `main`. We do **not** run `wrangler
  pages deploy` from GitHub Actions to avoid double-deploys.
- **Secrets:** managed in Cloudflare Pages (Azure OpenAI key, session
  secret, shared password). GitHub Actions does not need them for CI
  because LLM is mocked.
- **Required checks:** all CI jobs are required to merge to `main`.

Branching:

- Trunk-based on `main`. Short-lived feature branches.
- A `develop` branch is used only during the greenfield rewrite (ADR-001)
  and removed at cutover.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| CircleCI | Fast | Extra account to manage | Rejected |
| GitHub Actions deploy via Wrangler | One pipeline | Conflicts with Pages Git integration | Rejected |
| Pages Git integration only (no GitHub Actions) | Zero extra config | No place for lint/test gates | Rejected |
| GitHub Actions CI + Pages CD | Best of both | Two systems to know | **Chosen** |

## Consequences

- **Positive:** PR feedback in under 5 minutes for unit + lint + types.
- **Positive:** preview URL per PR for product/design review.
- **Negative:** two dashboards (Actions + Pages) to debug failed deploys.
- **Risk:** flaky E2E blocks merges. Mitigation: auto-retry once;
  quarantine label for unstable specs.

## References

- ADR-006 hosting
- Phase 1 success metric T-7
