# Retro Template

Three flavours of retrospective, one template each. Length scales
with the unit being reviewed.

## Sprint retro (30-45 min, end of sprint)

### Goal

Find one thing to keep doing and one thing to change before next
sprint.

### Format

15 minutes silent writing on three buckets, then 15-30 minutes of
discussion.

| Bucket | Prompt |
|---|---|
| ⊕ Keep | "What worked and we want to keep doing?" |
| △ Change | "What didn't work? What slowed us down?" |
| ◯ Try | "What could we try next sprint?" |

### Output

- One action item with an owner and a due date for the next sprint.
- Filed under `docs/sdlc/phase-8-evolution/retros/sprint-NN.md`.

### Don't

- Don't blame people; critique systems and processes.
- Don't list 10 things to change. Pick one.

---

## Release retro (60 min, after every minor/major release)

### Goal

Take stock of what shipped, what we learned about delivering it, and
how the next release should be different.

### Format

| Section | Time |
|---|---|
| 1. The release in one slide | 5 min |
| 2. What surprised us? | 10 min |
| 3. What hurt? | 15 min |
| 4. What worked unusually well? | 10 min |
| 5. What do we change before the next release? | 15 min |
| 6. Action items | 5 min |

### Output

- A page at `docs/sdlc/phase-8-evolution/retros/release-vX.Y.Z.md`
  with the answers to sections 2-5 (each a short paragraph, not
  bullets) and a table for section 6.
- The action items go in GitHub Issues with the label
  `release-retro`.

### Mandatory questions

- Did the release-day checklist (Phase 6) get used as written?
- Did any alert fire that we did not have a runbook for?
- Was the rollback runbook readable under time pressure?
- Were the acceptance criteria from Phase 5 still accurate?

---

## Program retro (half-day, after every major version)

### Goal

Look at the whole arc — the SDLC phases, the cross-team work, the
roadmap accuracy. The next program's Phase 0 starts from this
output.

### Format

| Section | Time |
|---|---|
| 1. The version in one paragraph | 15 min |
| 2. Charter & decisions: did the locked decisions in Phase 0 hold? | 30 min |
| 3. Plan vs reality: roadmap, budget, scope | 30 min |
| 4. Architecture: did the ADRs survive contact with reality? | 30 min |
| 5. Quality: defects per sprint, escaped defects, MTTR | 30 min |
| 6. Operations: SLO burn, incident count and severity | 30 min |
| 7. Customer signal: NPS, retention, the most-asked-for feature | 30 min |
| 8. People: morale, on-call fatigue, growth | 30 min |
| 9. What we'd do differently | 60 min |
| 10. Inputs to v(N+1) charter | 30 min |

### Output

- A document at
  `docs/sdlc/phase-8-evolution/retros/program-vX.0.md`.
- A list of inputs to the next program's Phase 0 (locked decisions,
  open questions, dropped scope).
- A celebration. Genuinely.

### Don't

- Don't make this a status update. Status was last week.
- Don't promise everything raised here will be fixed. Pick the
  highest-leverage 3-5.

---

## When to skip a retro

The only valid reasons to skip:

- The sprint produced nothing because the team was OOO. Run a
  10-minute "what's our state" sync instead.
- The release was a hotfix < 24 hours after the previous. Roll the
  retro into the next release's session.

If you find yourself skipping retros for any other reason, that *is*
the retro.

## Where the retros live

```
docs/sdlc/phase-8-evolution/retros/
  sprint-NN.md
  release-vX.Y.Z.md
  program-v1.0.md
  cutover-retro.md    ← required, per cutover-plan.md
```

Anyone can read any of them. We treat them as institutional memory.
