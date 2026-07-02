# Spec for heist-card-component

branch: claude/feature/heist-card-component
figma_component: https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=14-15&t=Yi5eGmjp7G4Bp27p-1

> **Note:** Design reference could not be retrieved automatically — the Figma MCP plugin requires Editor access on the file. See the Figma link above for visual reference.

## Summary

Build a `HeistCard` component and a `HeistCardSkeleton` loading placeholder. The card displays a single `Heist` object's key details; the title links to the heist's detail page (`/heists/:id`). Both components are used on the `/heists` page: the skeleton is shown while data loads, and the card is shown for the active and assigned-by-me result sets. Expired heists continue to display only their titles in a plain list (no card). Cards are arranged in a responsive 3-column grid.

## Functional Requirements

- `HeistCard` accepts a `Heist` object as a prop and renders:
  - The heist title as a link to `/heists/[id]`
  - The assignee's codename
  - The deadline date (human-readable)
  - The creator's codename
  - A visual indicator for `finalStatus` if present (success / failure / null)
- The `/heists/[id]` detail page should exist as a route stub but render no content yet
- `HeistCardSkeleton` renders a placeholder card of the same dimensions as `HeistCard`, with animated pulse blocks in place of each text element
- Both components live in `components/HeistCard/` following the existing component structure (`.tsx`, `.module.css`, `index.ts`)
- The `/heists` page uses `HeistCard` for the "Your Active Heists" and "Heists You've Assigned" sections
- The "All Expired Heists" section keeps its existing title-only list (no card)
- While `loading` is true for active or assigned sections, the grid shows 3 `HeistCardSkeleton` placeholders
- Cards are laid out in a 3-column responsive grid (fewer columns on narrow viewports)

## Figma Design Reference

- File: https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=14-15&t=Yi5eGmjp7G4Bp27p-1
- Component name: Heist Card
- Key visual constraints: use existing design tokens — dark surface background (`--color-light` or `--color-lighter`), `--color-primary` for accent/link, `--color-body` for metadata text, `--color-heading` for the title, rounded corners consistent with other components, subtle border

## Possible Edge Cases

- A heist with a very long title should not break the card layout — truncate or wrap gracefully
- The deadline may be in the past for active heists (edge case in data) — display the date as-is without special treatment
- If `assignedToCodename` or `createdByCodename` is missing, fall back to the uid
- The skeleton should not flash briefly for fast loads — consider only showing skeletons after a short delay, or accept the flash as acceptable at this stage

## Acceptance Criteria

- `HeistCard` renders title, assignee, deadline, and creator with correct data from the `Heist` prop
- The heist title is a Next.js `Link` pointing to `/heists/[id]`
- `HeistCardSkeleton` has the same outer dimensions as `HeistCard` and shows animated placeholder blocks
- The `/heists` page shows skeletons in the active and assigned sections while loading, and real cards after data arrives
- Cards render in a 3-column grid
- The expired section is unchanged (title list only, no cards)
- No content is added to the `/heists/[id]` page

## Open Questions

- Should the card show the full deadline timestamp or a relative label (e.g. "Expires in 12h")?
- Should the `finalStatus` badge only appear on active cards if status is set, or is that only relevant for expired heists?
- Should the grid collapse to 2 columns on tablet and 1 column on mobile, or is 3-column fixed acceptable for now?

## Testing Guidelines

Create test files in `./tests/components/` for `HeistCard` and `HeistCardSkeleton`. Keep tests light:

- `HeistCard` renders the heist title as a link to `/heists/[id]`
- `HeistCard` renders the assignee codename, creator codename, and deadline
- `HeistCardSkeleton` renders without errors and has the expected skeleton structure
