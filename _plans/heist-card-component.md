# Plan: Heist Card Component

## Context

The heists page already fetches live data via `useHeists` but renders only plain title lists. This plan introduces a `HeistCard` component and a `HeistCardSkeleton`, integrates them into the page's active and assigned sections, and adds a 3-column grid layout.

The `[id]` detail page stub already exists — no changes needed there.

An existing `Skeleton` component in `components/Skeleton/` provides the shimmer animation pattern; `HeistCardSkeleton` will follow the same pattern but with a layout matched to `HeistCard`.

---

## Files to Create

### `components/HeistCard/HeistCard.tsx`

Accepts a single `heist: Heist` prop. Renders a card surface containing:

- **Title** — `<Link href={/heists/${heist.id}}>` styled as the primary accent colour, truncated if too long
- **Target row** — label "Target" + `heist.assignedToCodename` (fallback: `heist.assignedTo`)
- **Assigned by row** — label "Assigned by" + `heist.createdByCodename` (fallback: `heist.createdBy`)
- **Deadline row** — label "Deadline" + formatted date (e.g. "3 Jul")
- **Status badge** — rendered only when `heist.finalStatus` is not null; shows "Success" or "Failure" with colour coding (`--color-success` / `--color-error`)

---

### `components/HeistCard/HeistCard.module.css`

`@reference "../../app/globals.css"`

- `.card` — dark surface (`bg-lighter`), rounded corners, border (`border-light`), padding
- `.title` — heading colour, font weight, `text-decoration: none`, hover colour (`text-primary`)
- `.meta` — flex row, small uppercase label + value side-by-side, body text colour
- `.label` — extra-small, muted, uppercase, wide letter-spacing
- `.footer` — flex row with deadline on the left and status badge on the right
- `.badge` — small pill with appropriate background/text for success/failure
- Define `@keyframes shimmer` locally (same as `Skeleton.module.css`) for the skeleton

---

### `components/HeistCard/HeistCardSkeleton.tsx`

No props. Renders a placeholder card matching `HeistCard`'s outer dimensions and padding, with shimmer blocks in place of each text element:

- A wide block for the title
- Two narrower rows for the meta fields
- A shorter block for the deadline footer

Uses classes from `HeistCard.module.css` (`.card`, `.skeletonLine`, `.skeletonShort`) to stay co-located.

---

### `components/HeistCard/index.ts`

```
export { default } from "./HeistCard"
export { HeistCardSkeleton } from "./HeistCardSkeleton"
```

---

### `app/(dashboard)/heists/heists.module.css`

`@reference "../../globals.css"`

- `.grid` — CSS grid, `grid-template-columns: repeat(3, 1fr)`, gap between cards, responsive: 2 columns at medium viewport, 1 column at small viewport
- `.sectionHeading` — styles for the `<h2>` if any section-specific treatment is needed
- `.emptyState` — muted body text for the "No heists yet" message

---

### `tests/components/HeistCard.test.tsx`

Mock `next/link` (or let it pass through — Next.js `Link` works in jsdom tests). Import a `fakeHeist` fixture matching the `Heist` interface.

Tests:
1. Renders the heist title as a link with `href="/heists/h1"`
2. Renders `assignedToCodename` and `createdByCodename`
3. Renders the formatted deadline date
4. Does not render a status badge when `finalStatus` is null
5. Renders a "Success" badge when `finalStatus` is `"success"`
6. `HeistCardSkeleton` renders without errors

---

## Files to Modify

### `app/(dashboard)/heists/page.tsx`

- Import `HeistCard`, `HeistCardSkeleton`, and the `heists.module.css` module
- For the **active** and **assigned-by-me** sections:
  - While `loading`, render a `<div className={styles.grid}>` containing 3 `<HeistCardSkeleton />` instances
  - After load, if `heists.length === 0`, render the existing empty-state `<p>`
  - After load, if `heists.length > 0`, render a `<div className={styles.grid}>` with a `<HeistCard>` per heist
- The **expired** section is unchanged (title list, no cards, no grid)

---

## Verification

1. `npm test` — all tests pass including the new HeistCard tests
2. `npm run dev` — visit `/heists` while logged in; active and assigned sections show skeleton cards during load, then real cards after data arrives
3. Click a heist title — navigates to `/heists/[id]` stub page
4. Visit `/heists/[id]` directly — renders "Heist Details" stub with no errors
