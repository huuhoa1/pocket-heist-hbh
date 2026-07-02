# Plan: useHeists Hook for Real-Time Heist Data

## Context

The heists page at `app/(dashboard)/heists/page.tsx` currently shows three static section headings. This plan creates a `useHeists` hook backed by Firestore `onSnapshot` and wires it into the page to show live heist titles in each section.

The spec defines two modes; a third (`'assigned-by-me'`) is added here to cover the "Heists You've Assigned" section on the page (heists created by the current user that haven't expired yet).

---

## Firestore Query Notes

**Firestore constraint:** range filters (`<`, `>`) and not-equals (`!=`) across different fields in the same query are not allowed. This affects the `'expired'` mode:

- `'active'`: `where('assignedTo', '==', uid)` + `where('deadline', '>', Timestamp.now())` — equality + range on one field ✓ (requires a composite index on `assignedTo` + `deadline`)
- `'assigned-by-me'`: `where('createdBy', '==', uid)` + `where('deadline', '>', Timestamp.now())` — same pattern ✓ (requires a composite index on `createdBy` + `deadline`)
- `'expired'`: can only use `where('deadline', '<', Timestamp.now())` in Firestore; the `finalStatus !== null` check must be done client-side after the snapshot arrives

---

## Files to Create

### `hooks/useHeists.ts`

Add `"use client"` directive. Export a `HeistMode` type: `'active' | 'assigned-by-me' | 'expired'`.

**State:**
- `heists: Heist[]` (default `[]`)
- `loading: boolean` (default `true`)

**`useEffect` depending on `[mode, uid]`:**

Build a Firestore query based on `mode`:

- `'active'`: query the `heists` collection where `assignedTo == uid` and `deadline > Timestamp.now()`
- `'assigned-by-me'`: query the `heists` collection where `createdBy == uid` and `deadline > Timestamp.now()`
- `'expired'`: query the `heists` collection where `deadline < Timestamp.now()`

For `'active'` and `'assigned-by-me'`, skip the subscription entirely if `uid` is null (return early from the effect).

Attach the query to `collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)` so that `heistConverter.fromFirestore` is applied to every document automatically.

Subscribe with `onSnapshot(query, callback)`:
- In the callback, map `snapshot.docs` to their data via `doc.data()` (already converted by the converter)
- For `'expired'` mode, additionally filter the results to only those where `finalStatus !== null`
- Set `heists` to the mapped array and `loading` to `false`

Return the unsubscribe function from the effect so it is called on unmount and on mode/uid change.

**Return:** `{ heists, loading }`

---

### `tests/hooks/useHeists.test.tsx`

Use `renderHook` from `@testing-library/react`.

Mock (all `vi.mock` calls before imports):
- `firebase/firestore` — `onSnapshot`, `collection`, `query`, `where`, `Timestamp`
- `@/lib/db` — `{ default: {} }`
- `@/hooks/useUser` — `useUser`

`onSnapshot` mock pattern: call the snapshot callback synchronously with a fake snapshot, return a mock unsubscribe function.

**Tests:**
1. `'active'` mode: `where` is called with `'assignedTo'`, `'=='`, the current uid
2. `'active'` mode: `where` is called with `'deadline'`, `'>'`, a Timestamp
3. `'assigned-by-me'` mode: `where` is called with `'createdBy'`, `'=='`, the current uid
4. `'expired'` mode: `where` is called with `'deadline'`, `'<'`, a Timestamp
5. `loading` is `true` before the snapshot fires, `false` after
6. The returned `heists` array reflects the snapshot docs mapped through `heistConverter`
7. For `'expired'` mode, only heists with `finalStatus !== null` are returned
8. The unsubscribe function is called when the hook unmounts

---

## Files to Modify

### `app/(dashboard)/heists/page.tsx`

Add `"use client"` directive (required to call hooks).

Import `useHeists`. Call it three times, once per section:

- `activeHeists = useHeists('active')`
- `assignedByMeHeists = useHeists('assigned-by-me')`
- `expiredHeists = useHeists('expired')`

In each section, render a list of heist titles. While `loading` is true, show a brief loading indicator. If the array is empty after loading, show a short empty-state message (e.g., "No heists here yet."). The `<h2>` headings stay unchanged.

---

## Verification

1. `npm test` — all tests pass including the 8 new `useHeists` tests
2. `npm run dev` — log in, visit `/heists`; if there are heists in Firestore the titles appear under the correct section in real time
3. Create a new heist from `/heists/create` and confirm it appears live in the "Heists You've Assigned" section without a page refresh
4. Firebase Console: if composite index errors appear in the browser console, create the required indexes for `assignedTo + deadline` and `createdBy + deadline`
