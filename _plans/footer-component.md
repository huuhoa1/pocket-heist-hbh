# Plan: Footer Component

## Context

The root layout (`app/layout.tsx`) wraps every page via `<AuthProvider>{children}</AuthProvider>`. Adding `<Footer />` here is the single change needed to make it appear on all pages — no per-layout duplication required.

The year must be computed at render time. Since `app/layout.tsx` is a Server Component by default (no `"use client"`), `new Date().getFullYear()` works directly — no `useEffect` needed.

---

## Files to Create

### `components/Footer/Footer.tsx`

A Server Component (no directive needed). Renders a `<footer>` element containing:

```
© {new Date().getFullYear()} Pocket Heist. All rights given.
```

Uses a CSS Module class for styling.

---

### `components/Footer/Footer.module.css`

`@reference "../../app/globals.css"`

- `.footer` — `text-body` colour, small font size (`0.75rem`), centred text, padding top and bottom (`1.5rem`), `margin-top: auto` so it naturally sits at the bottom when the page uses a flex column layout

---

### `components/Footer/index.ts`

```
export { default } from "./Footer"
```

---

### `tests/components/Footer.test.tsx`

Two tests:

1. Renders the current year in the output
2. Renders the phrase "Pocket Heist. All rights given"

---

## Files to Modify

### `app/layout.tsx`

- Import `Footer` from `@/components/Footer`
- Add `<Footer />` as a sibling after `{children}` inside `<AuthProvider>`, so it appears beneath the page content on every route:

```tsx
<AuthProvider>
  {children}
  <Footer />
</AuthProvider>
```

No other layouts need changing.

---

## Verification

1. `npm test` — all tests pass including the 2 new Footer tests
2. `npm run dev` — visit `/`, `/login`, `/signup`; the footer appears at the bottom of each page with the correct year and copy
