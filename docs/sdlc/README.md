# SDLC Documentation

This directory tracks the Software Development Life Cycle deliverables for
this project, phase by phase. Each document is the single source of truth
for its phase and is updated through formal change requests, not ad-hoc
edits.

## Phases

| Phase | Title | Status | Document |
|---|---|---|---|
| 0 | Scope & Project Charter | Approved | [phase-0-scope.md](./phase-0-scope.md) |
| 1 | Requirements & Discovery | Approved | [phase-1-requirements/](./phase-1-requirements/) |
| 2 | Analysis & Planning | Approved | [phase-2-planning/](./phase-2-planning/) |
| 3 | Design | Approved | [phase-3-design/](./phase-3-design/) |
| 4 | Implementation | In progress (Sprints 0-2 done, on `develop` branch) | [phase-4-implementation/](./phase-4-implementation/) |
| 5 | Testing & QA | Not started | _pending_ |
| 6 | Deployment & Release | Not started | _pending_ |
| 7 | Operations & Maintenance | Not started | _pending_ |
| 8 | Evolution & Retirement | Not started | _pending_ |

## How to use this directory

- Read the latest phase document before contributing to that phase.
- Do not edit closed phases without a change request recorded in the
  document's change-log section.
- New artifacts (diagrams, specs, ADRs) live in subfolders named after the
  phase that produced them, for example `phase-3-design/adrs/`.
