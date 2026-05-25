# Design System

**Phase:** 3 — Design (UX)
**Status:** Approved (tokens and primitives baseline)
**Date:** 2026-05-24

Built on Tailwind CSS + shadcn/ui (ADR-008) with a light Outlook-inspired
theme. The canonical Figma library will mirror these tokens.

---

## 1. Color tokens (CSS variables)

Tokens are defined in `app/styles/globals.css` and consumed via Tailwind
`theme.extend.colors`. Both light and dark themes are required.

### Base palette

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | `#0B1220` | Page background |
| `--color-surface` | `#F7F8FA` | `#0F172A` | Pane backgrounds |
| `--color-surface-2` | `#FFFFFF` | `#111827` | Cards, popovers |
| `--color-border` | `#E5E7EB` | `#1F2937` | Hairlines |
| `--color-text` | `#0F172A` | `#E5E7EB` | Body text |
| `--color-text-muted` | `#475569` | `#94A3B8` | Secondary text |

### Brand and accents

| Token | Hex | Use |
|---|---|---|
| `--color-brand` | `#1E40AF` (fa-blue) | Primary actions, links, focus rings |
| `--color-brand-hover` | `#1D4ED8` | Hover state |
| `--color-accent` | `#D97706` (fa-gold) | Highlights, "AI" indicators |
| `--color-success` | `#059669` (fa-green) | Confirmations |
| `--color-warning` | `#D97706` | Warnings |
| `--color-danger` | `#DC2626` | Errors, destructive actions |

### Segment colors (10)

Match prototype: purple, blue, green, teal, orange, indigo, cyan, pink,
amber, rose. Used for chips and segment dots only — never as the sole
signal.

---

## 2. Typography

| Style | Tailwind classes | Use |
|---|---|---|
| Display | `text-2xl font-semibold tracking-tight` | Page titles |
| H1 | `text-xl font-semibold` | Section heads |
| H2 | `text-lg font-semibold` | Card titles |
| Body | `text-sm` | Most UI |
| Body strong | `text-sm font-medium` | List item primary |
| Caption | `text-xs text-muted` | Meta info |
| Mono | `font-mono text-xs` | IDs in dev dashboard only |

Font stack: system fonts (`-apple-system, Segoe UI, Roboto, ...`). No
custom webfonts; supports the NFR-1 first-paint budget.

---

## 3. Spacing and layout

Tailwind default scale. Conventions:

- 4px (`1`) for icon-to-text gaps.
- 8px (`2`) inside compact controls.
- 12px (`3`) inside cards.
- 16px (`4`) between sections.
- 24px (`6`) between major blocks.
- 32px (`8`) above page titles.

Radii: `rounded-md` for buttons and inputs, `rounded-lg` for cards.

Shadows: lean. `shadow-sm` for raised list rows, `shadow-md` for the
compose popup, `shadow-lg` for combobox dropdowns.

---

## 4. Component primitives (shadcn/ui catalog)

Components copied into `app/components/ui/`. Required for MVP:

- `Button`, `IconButton`
- `Input`, `Textarea`, `Label`, `Form`
- `Dialog` (used for compose popup)
- `Popover`, `Tooltip`, `DropdownMenu`
- `Command` (for recipient autocomplete and command palette)
- `Tabs`
- `Toast`
- `Avatar`
- `Badge` (segment chips)
- `Separator`
- `ScrollArea`
- `Toggle`, `ToggleGroup` (depth selector)
- `Sheet` (mobile left rail)
- `Card`

---

## 5. Composed components (Outlook layer)

Live under `app/components/outlook/`:

| Component | Purpose |
|---|---|
| `RibbonBar` | Outlook ribbon with tabs and button groups. |
| `LeftRail` | Folder tree + favorites + segments + settings entry. |
| `MessageList` | Virtualized list with sender/subject/preview. |
| `MessageRow` | Single list row with importance, unread, flags. |
| `ReadingPane` | Message body + collapsible Client Insights. |
| `ClientInsightsCard` | Profile + household card; reused in compose side panel. |
| `ComposeWindow` | Dialog hosting To/Subject/Body + AIDraftBar + side panel. |
| `AiDraftBar` | Depth selector + AI Draft + Regenerate + autosave status. |
| `FollowUpSuggestions` | List of up to 3 add-able items. |
| `FollowUpList` | Grouped by client, with done/snooze. |

---

## 6. Iconography

- Library: `lucide-react`. Banned: FontAwesome (replaced from prototype).
- 16px in compact controls; 20px in ribbon; 24px in empty states.
- Every icon-only button needs `aria-label` and a tooltip.

---

## 7. Motion

Restrained. We use motion to signal state changes only.

| Pattern | Duration | Easing |
|---|---|---|
| Popover open/close | 120ms | `ease-out` |
| Dialog open | 180ms | `ease-out` |
| Streaming caret pulse | 1s loop | `ease-in-out` |
| Toast in/out | 150ms | `ease-out` |

Respect `prefers-reduced-motion`: disable non-essential animations.

---

## 8. Accessibility baseline

- WCAG 2.1 AA color contrast for text on backgrounds in both themes.
- Focus ring: 2px solid `--color-brand`, 2px offset.
- All interactive elements reachable by keyboard.
- Trap focus inside `Dialog` (compose); restore focus to the trigger on
  close.
- Forms expose `aria-describedby` for error messages.
- Live regions:
  - `aria-live="polite"` for autosave status.
  - `aria-live="assertive"` only for blocking errors.
- Skip-to-content link at the top of every page.

---

## 9. Theming rules

- Theme = `light | dark | system`. Default `system`.
- `html.dark` toggles dark variables.
- Choice persisted in `localStorage` and synced across tabs via the
  `storage` event.

---

## 10. Asset checklist for Figma

Once the Figma library is created, it should contain:

- All color tokens as styles.
- Typography styles.
- Component variants for each primitive listed above.
- Annotated wireframes for W1 to W8.
- Empty states, loading states, error states for the compose flow.
- Dark theme variants for every screen.
