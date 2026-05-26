# Security Operations

Day-to-day security work. The architectural threat model is upstream
in `docs/sdlc/phase-3-design/security/threat-model.md` and ADR-011;
this doc is about the recurring tasks that keep us honest.

## Asset inventory

| Asset | Where | Sensitivity | Owner |
|---|---|---|---|
| `SESSION_SECRET` | Cloudflare Pages env vars (per env) | Critical | Tech Lead |
| `SHARED_PASSWORD` | Cloudflare Pages env vars (per env) | High (demo only) | Tech Lead |
| `AZURE_OPENAI_KEY` | Cloudflare Pages env vars (per env) | High (billed!) | Tech Lead |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions secret | Critical | Tech Lead |
| Production D1 | Cloudflare | Critical (contains drafts + sent) | Tech Lead |
| Backups in R2 | Cloudflare | Critical | Tech Lead |
| Source code | GitHub (public) | Low | Tech Lead |
| 1Password vault holding sealed secrets bundle | 1Password | Critical | Tech Lead |

## Rotation calendar

| Secret | Cadence | Trigger out-of-band |
|---|---|---|
| `SESSION_SECRET` | Every 90 days | Any compromise; any team change. |
| `SHARED_PASSWORD` | Every 30 days | After any demo to an external party. |
| `AZURE_OPENAI_KEY` | Every 90 days | Any cost anomaly; any team change. |
| `CLOUDFLARE_API_TOKEN` | Every 90 days | Any team change. |
| 1Password vault sharing | On every team change | — |

Procedure (per secret):

1. Generate a new value (`openssl rand -hex 32` for `SESSION_SECRET`).
2. Set the new value in Cloudflare Pages → preview, staging,
   production *in that order*.
3. Trigger a re-deploy of each env.
4. Verify the smoke test passes per env.
5. Delete the old value from the dashboard.
6. Note the rotation date in `security-ops.md` change log below.

Rotating `SESSION_SECRET` invalidates every existing session. Plan it
for off-peak.

## Dependency hygiene

Once a week, the on-call:

```bash
cd app
pnpm audit                       # surface CVEs
pnpm outdated                    # surface drift
```

- Critical CVE → patch within 7 days; sev-2 if exploitable in our
  shape.
- High CVE → next sprint.
- Medium / Low → backlog.

We rely on Dependabot for the automatic part (configured per Phase 6
pre-launch checklist).

## Penetration testing

| Tier | When | Tool |
|---|---|---|
| Baseline | Before the first public preview | OWASP ZAP baseline scan against the staging URL. |
| Deeper | Before any external customer pilot | Engage a contractor or extend ZAP coverage. |
| Continuous | Always | Dependabot + `pnpm audit`. |

Findings go in `docs/sdlc/phase-7-operations/sec-findings/` (folder
appears on first run) and have an owner + due date.

## Privacy

Threat model says: no PII in logs. The privacy guardrails:

- The pre-merge checklist (Phase 5) has a "no PII in logs" line.
- The quarterly observability review (Phase 7 observability doc) re-
  checks the log shapes.
- The MockProvider deliberately uses the fictional seed clients only;
  it has no real client data baked in.
- An export-on-request path is documented in the README. We can hand
  a customer a JSON of "everything we have about them" if asked.

## Access control

We have very little to share, so the rules are simple:

- The Cloudflare account is owned by the company; the Tech Lead has
  admin, no one else does today.
- GitHub repo: write for the team, admin for the Tech Lead.
- The 1Password vault: shared with the team; the bundle inside is
  unsealed only during a DR scenario.
- Production data: nobody reads it for fun. Inspecting drafts in D1
  requires a written ticket and a 2-person check.

## Audit log

Every secret rotation, every restore drill, every penetration test,
and every customer-data inspection is logged in this section.

| Date | Action | Actor | Note |
|---|---|---|---|
| (none yet) | — | — | Phase 7 not activated. |

The audit log is append-only. We never delete rows.

## Reviews

| Cadence | Who | What |
|---|---|---|
| Weekly | On-call | `pnpm audit` and Dependabot triage. |
| Monthly | Tech Lead | Rotation calendar adherence. |
| Quarterly | Tech Lead + Product | Threat model re-read; this doc reviewed. |
| Annually | Tech Lead | Full external pentest (when product is past demo). |
