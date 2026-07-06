# Spec for footer-component

branch: claude/feature/footer-component
figma_component (if used): N/A

## Summary

Build a `Footer` component that displays a copyright notice — "Pocket Heist. All rights given" followed by the current year — and render it on every page of the application. The footer should appear at the bottom of both the public layout (splash, login, signup) and the dashboard layout (heists pages).

## Functional Requirements

- The `Footer` component renders a single line of text: `© <current year> Pocket Heist. All rights given.`
- The year is dynamically generated at render time from the current date — it should not be hardcoded
- The component is added to the root layout (`app/layout.tsx`) so it appears on every page without duplicating it across individual layouts
- The footer sits below all page content and is visually separated from it
- Styling should be consistent with the existing design system: muted body text colour, small font size, centred

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- The footer should not interfere with the centred login/signup forms or the splash page layout — it should sit naturally below the page content without affecting vertical centering of other elements
- On very short viewports the footer should not overlap content

## Acceptance Criteria

- `Footer` component exists in `components/Footer/` following the standard component structure
- The rendered text includes the current year and the exact phrase "Pocket Heist. All rights given"
- The footer is visible on `/`, `/login`, `/signup`, and `/heists`
- Styling uses muted text colour and is clearly subordinate to the page content

## Open Questions

- Should the footer be sticky to the bottom of the viewport on short pages, or simply flow at the end of the document?

## Testing Guidelines

Create a test file at `tests/components/Footer.test.tsx`:

- Renders the copyright text including the current year
- Renders the "Pocket Heist. All rights given" phrase
