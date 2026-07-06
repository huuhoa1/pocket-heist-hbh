# Spec for landing-page-badges

branch: claude/feature/landing-page-badges
figma_component (if used): N/A

## Summary

Add a `BadgeShowcase` component to the splash/landing page (`app/(public)/page.tsx`) that displays a row of humorous achievement-style badges. The badges are purely decorative — static, hardcoded copy that teases the kinds of titles players can earn in Pocket Heist. They serve as social proof/flavour text to entice new visitors to sign up.

## Functional Requirements

- A `Badge` component renders a single badge with an emoji icon and a short funny label (e.g. "🏆 Top Stapler Thief", "🕵️ Most Suspicious Coworker", "🗑️ Bin Diver General")
- A `BadgeShowcase` component renders a curated, hardcoded list of 4–6 badges in a horizontal scrollable row
- The badges are purely static — no props required at the call site, no data fetching
- `BadgeShowcase` is placed on the splash page between the specs strip and the body copy paragraph
- Both components live in `components/Badge/` following the standard component structure (`.tsx`, `.module.css`, `index.ts`)

## Possible Edge Cases

- On narrow viewports the badge row should scroll horizontally rather than wrap, so the layout stays compact
- Badge labels should be short enough to fit on one line — no wrapping inside a badge

## Acceptance Criteria

- At least 4 badge instances are rendered on the splash page
- Each badge has an emoji and a short humorous label
- The badge row is horizontally scrollable on small screens
- The visual style is consistent with the existing dark theme (rounded pill shape, subtle border or background, muted-to-heading text colours)
- The component is visible on `/` between the specs strip and the body paragraph

## Open Questions

- Should the badges have a subtle hover effect (e.g. slight lift or glow) to feel interactive, even though they are purely decorative?
- What are the final badge names? Some candidates: "🏆 Top Stapler Thief", "🕵️ Most Suspicious Coworker", "🗑️ Bin Diver General", "📎 Paperclip Kingpin", "☕ Coffee Saboteur", "🧻 Toilet Roll Hoarder"

## Testing Guidelines

Create a test file at `tests/components/Badge.test.tsx`:

- `Badge` renders the provided emoji and label text
- `BadgeShowcase` renders at least 4 badge elements
