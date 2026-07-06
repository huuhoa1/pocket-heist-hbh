# Plan: Expired Heist Card

## Context

The "All Expired Heists" section on `/heists` currently renders a plain `<ul>` list of titles. The other two sections (active, assigned) already use `HeistCard` in a 3-column grid.

`HeistCard` already handles the status badge — it renders it whenever `finalStatus` is non-null. Expired heists always have a non-null `finalStatus` (enforced by `useHeists("expired")`'s client-side filter). There is no behaviour difference between an expired card and an active card — the only difference is that the badge will always be visible. Creating a separate `ExpiredHeistCard` component would be pure duplication.

The plan is therefore minimal: update the expired section in `app/(dashboard)/heists/page.tsx` to use the existing `HeistCard` and `HeistCardSkeleton` components in the same grid layout as the other sections.

---

## Files to Modify

### `app/(dashboard)/heists/page.tsx`

Replace the expired section's `<ul>` list with the card grid pattern already used for active and assigned:

- While `expiredLoading` is true: render `<div className={styles.grid}>` with 3 `<HeistCardSkeleton />` instances
- When `expiredHeists.length === 0`: render `<p className={styles.emptyState}>No expired heists yet.</p>`
- When `expiredHeists.length > 0`: render `<div className={styles.grid}>` with a `<HeistCard key={h.id} heist={h} />` per heist

No other files need to change — `HeistCard`, `HeistCardSkeleton`, `heists.module.css`, and the grid styles are all already in place.

---

## Files to Create

### `tests/app/heists-expired-section.test.tsx`

Render `<HeistsPage />` with a mocked `useHeists` that returns expired heists with `finalStatus` set. Tests:

1. Shows 3 skeleton cards in the expired section while `expiredLoading` is true
2. Shows "No expired heists yet." when expired array is empty
3. Renders a `HeistCard` per expired heist in the grid
4. The status badge is visible on each expired card (since `finalStatus` is never null)

---

## Verification

1. `npm test` — all tests pass including the new expired section tests
2. `npm run dev` — visit `/heists`; the expired section now shows cards in the same 3-column grid as the other sections, with the status badge always visible
