# ADR-008: Tailwind CSS + shadcn/ui Component Primitives

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Design lead, engineering lead
- **Phase:** 2 — Analysis & Planning

## Context

The prototype uses Tailwind via CDN and FontAwesome via CDN. NFR-1 sets
a first-paint budget of 1.5s; CDN Tailwind ships unused styles and hurts
that budget. We also need a component primitive layer for dialogs,
popovers (compose popup), command menus (autocomplete recipients), and
form controls.

## Decision

- **Tailwind CSS** compiled at build time, configured in `app/tailwind.config.ts`.
- **shadcn/ui** for component primitives (built on Radix), copied into
  `app/components/ui/` per the shadcn convention.
- **lucide-react** for icons (replaces FontAwesome).
- A small `app/components/outlook/` layer composes shadcn primitives into
  the Outlook-style ribbon, folder tree, message list, reading pane, and
  popup compose.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Microsoft Fluent UI | Authentic Outlook feel | Heavy bundle; brand confusion | Rejected for prototype |
| Chakra / MUI | Mature | Heavier; less customisable to Outlook aesthetic | Rejected |
| Headless UI + Tailwind | Lightweight | Smaller surface than Radix; fewer patterns | Close, but shadcn's catalog is broader |
| Tailwind + shadcn/ui | Lean, customisable, copy-in components | Components live in our repo (more files) | **Chosen** |

## Consequences

- **Positive:** smaller bundle, faster first paint.
- **Positive:** components are local, easy to theme to a light/dark
  Outlook look.
- **Negative:** small chore to copy in components.
- **Risk:** drifting from shadcn upstream. Mitigation: track shadcn
  version in a comment header per component file.

## References

- Phase 1 NFR-1, NFR-6
