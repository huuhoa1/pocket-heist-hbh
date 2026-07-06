# Spec for expired-heist-card

branch: claude/feature/expired-heist-card
figma_component (if used): N/A

## Summary

Build an `ExpiredHeistCard` component to replace the plain title list currently used for the "All Expired Heists" section on the `/heists` page. The card should display the same key details as `HeistCard` (title link, assignee, creator, deadline) and always show the final status badge, since `finalStatus` is guaranteed to be non-null for expired heists. The visual design should match `HeistCard` exactly, using the same card surface, grid layout, typography, and spacing, so all three sections on `/heists` feel consistent.

## Functional Requirements

- `ExpiredHeistCard` accepts a `Heist` object as a prop and renders:
  - The heist title as a `Link` to `/heists/[id]`
  - The assignee's codename (fallback to uid if codename is absent)
  - The creator's codename (fallback to uid if codename is absent)
  - The deadline date in a human-readable format
  - A status badge for `finalStatus` — always shown, since expired heists always have a `finalStatus` of `"success"` or `"failure"`
- The `/heists` page replaces the expired section's plain `<ul>` list with the new `ExpiredHeistCard` components in the same 3-column responsive grid already used for active and assigned sections
- A matching `ExpiredHeistCardSkeleton` loading placeholder is shown in the grid while the expired data loads (3 skeletons, same as the other sections)
- Both components live in `components/ExpiredHeistCard/` following the existing component structure (`.tsx`, `.module.css`, `index.ts`)
- The component reuses design tokens and styles consistent with `HeistCard` — same card surface, border, rounding, padding, and typography

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- `finalStatus` should always be non-null for expired heists (enforced by the `useHeists("expired")` hook's client-side filter), but if it is somehow null, the badge should be omitted gracefully
- Long titles should truncate or wrap without breaking the card layout, consistent with `HeistCard`
- If `assignedToCodename` or `createdByCodename` is absent, fall back to the uid

## Acceptance Criteria

- `ExpiredHeistCard` renders title, assignee, deadline, creator, and a status badge
- The title is a Next.js `Link` pointing to `/heists/[id]`
- The status badge is always rendered for expired heists (success = green, failure = red)
- `ExpiredHeistCardSkeleton` matches the outer dimensions of `ExpiredHeistCard` and animates with a shimmer
- The expired section on `/heists` renders cards in the same 3-column responsive grid as active and assigned sections
- Skeletons are shown while `loading` is true; empty state is shown when the array is empty
- Visual appearance is consistent with `HeistCard` — the two components should be indistinguishable in layout and spacing

## Open Questions

- Should `ExpiredHeistCard` be a thin wrapper around `HeistCard` (passing the heist prop through and always showing the badge), or a fully separate component? A wrapper would reduce duplication; a separate component keeps the two independent.
- Should the expired section heading ("All Expired Heists") have any visual distinction from the active/assigned headings to signal a different state?

## Testing Guidelines

Create a test file at `tests/components/ExpiredHeistCard.test.tsx`. Keep tests light:

- `ExpiredHeistCard` renders the heist title as a link to `/heists/[id]`
- `ExpiredHeistCard` renders the assignee codename, creator codename, and deadline
- `ExpiredHeistCard` always renders the status badge (success and failure variants)
- `ExpiredHeistCardSkeleton` renders without errors
