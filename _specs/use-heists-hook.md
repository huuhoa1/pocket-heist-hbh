# Spec for use-heists-hook

branch: claude/feature/use-heists-hook
figma_component (if used): N/A

## Summary

Create a `useHeists` hook in the `hooks/` directory that subscribes to real-time heist data from Firestore and returns a typed array of `Heist` objects. The hook accepts a mode argument that determines which Firestore query to run. Once the hook exists, use it in `app/(dashboard)/heists/page.tsx` to display the heist titles for each of the three result sets currently shown on that page.

## Functional Requirements

- The hook is named `useHeists` and lives in `hooks/useHeists.ts`
- It accepts a single argument: a mode string, either `'active'` or `'expired'`
- It uses Firestore's `onSnapshot` for real-time updates — the returned array reflects the live Firestore state
- It returns an object with `heists: Heist[]` and `loading: boolean`
- **`'active'` mode:** returns all heists where `assignedTo` matches the current user's uid AND where `deadline` is in the future (i.e., has not passed)
- **`'expired'` mode:** returns all heists where the `deadline` has passed AND `finalStatus` is not null — regardless of which user is involved
- The hook uses `useUser` internally to get the current user's uid for the `'active'` query
- The hook cleans up the Firestore listener (unsubscribes) when the component unmounts or the mode changes
- `app/(dashboard)/heists/page.tsx` uses `useHeists` to populate the three sections:
  - "Your Active Heists" — heists assigned to the current user with a future deadline (`'active'` mode)
  - "Heists You've Assigned" — heists created by the current user with a future deadline (requires an additional `'assigned-by-me'` mode or a separate query — see Open Questions)
  - "All Expired Heists" — heists with a passed deadline and a non-null `finalStatus` (`'expired'` mode)
- Each section renders only the heist titles as a list

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- The current user may have no heists in any category — each section should render gracefully when the array is empty (e.g., a short "No heists yet" message)
- The `loading` state should prevent rendering stale or empty lists before the first snapshot arrives
- If the user's uid is not yet available (auth still loading), the `'active'` query should not fire until it is
- Firestore `where` filters on `deadline` require a composite index — this may need to be created in the Firebase console

## Acceptance Criteria

- `useHeists('active')` returns only heists where `assignedTo === currentUser.uid` and `deadline > now`
- `useHeists('expired')` returns only heists where `deadline < now` and `finalStatus !== null`
- The returned `heists` array updates automatically when Firestore data changes (real-time)
- The listener is cleaned up on unmount with no memory leaks
- The heists page renders a list of titles in each of the three sections using the hook
- Empty states are handled without errors

## Open Questions

- The heists page has three sections, but only two modes are defined. "Heists You've Assigned" (created by the current user, not yet expired) likely needs a third mode — `'assigned-by-me'` (heists where `createdBy === currentUser.uid` and `deadline > now`). Should this be added to the hook, or handled with a separate query?
- Should the `'active'` and `'assigned-by-me'` sections overlap if the current user assigned a heist to themselves?
- Should the hook accept `Timestamp` for the deadline comparison, or compare using `new Date()` converted to a `Timestamp`?

## Testing Guidelines

Create a test file at `tests/hooks/useHeists.test.ts`. Mock `firebase/firestore` and `@/hooks/useUser`. Focus on:

- `'active'` mode: `onSnapshot` is called with a query filtering by `assignedTo === uid` and `deadline > now`
- `'expired'` mode: `onSnapshot` is called with a query filtering by `deadline < now` and `finalStatus !== null`
- The returned `heists` array reflects the snapshot data mapped to `Heist` objects via `heistConverter`
- `loading` starts as `true` and becomes `false` after the first snapshot
- The unsubscribe function returned by `onSnapshot` is called on unmount
