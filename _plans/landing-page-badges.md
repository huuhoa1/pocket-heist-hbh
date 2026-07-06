# Plan: Landing Page Badges

## Context

The splash page (`app/(public)/page.tsx`) is a centred flex column with `gap: 3rem` between sections. The new `BadgeShowcase` is inserted as a new flex child between the `.specs` strip and the `.body` paragraph — no layout changes to existing elements needed.

The `.splash` container has `max-width: 640px` and `overflow` unset, so the badge row needs its own `overflow-x: auto` to scroll horizontally on narrow screens without breaking the outer layout.

---

## Files to Create

### `components/Badge/Badge.tsx`

Accepts two props: `emoji: string` and `label: string`. Renders a single pill-shaped badge element displaying the emoji followed by the label on one line.

---

### `components/Badge/BadgeShowcase.tsx`

No props. Renders a horizontally scrollable row containing 6 hardcoded `<Badge>` instances:

- 🏆 Top Stapler Thief
- 🕵️ Most Suspicious Coworker
- 🗑️ Bin Diver General
- 📎 Paperclip Kingpin
- ☕ Coffee Saboteur
- 🧻 Toilet Roll Hoarder

---

### `components/Badge/Badge.module.css`

`@reference "../../app/globals.css"`

- `.badge` — pill shape (`border-radius: 999px`), `bg-lighter` surface, `border border-light`, horizontal padding `0.75rem`, vertical padding `0.375rem`, `text-body` colour, small font size (`0.8rem`), `white-space: nowrap`, `flex-shrink: 0`
- `.showcase` — `display: flex`, `gap: 0.625rem`, `overflow-x: auto`, full width (`width: 100%`), hide scrollbar (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`)

---

### `components/Badge/index.ts`

```
export { default } from "./Badge"
export { BadgeShowcase } from "./BadgeShowcase"
```

---

### `tests/components/Badge.test.tsx`

Tests:
1. `Badge` renders the emoji and label text
2. `BadgeShowcase` renders at least 4 badge elements

---

## Files to Modify

### `app/(public)/page.tsx`

- Import `BadgeShowcase` from `@/components/Badge`
- Add `<BadgeShowcase />` between the `<div className={styles.specs}>` block and the `<p className={styles.body}>` paragraph

---

## Verification

1. `npm test` — all tests pass including the 2 new Badge tests
2. `npm run dev` — visit `/`; badge row appears between the specs strip and the body copy, all 6 badges visible, row scrolls on narrow viewport
