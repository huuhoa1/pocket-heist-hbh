# Plan: Create Heist Form

## Context

`app/(dashboard)/heists/create/page.tsx` is currently a stub with only a heading. This plan wires it into a working form that writes to Firestore and redirects on success.

Existing building blocks to reuse:
- `lib/db.ts` — Firestore instance
- `types/firestore/index.ts` — `CreateHeistInput`, `heistConverter`, `COLLECTIONS`
- `hooks/useUser` — provides `uid` and `displayName` for the current user
- `useRouter` from `next/navigation` — for the redirect

---

## Files to Modify

### `app/(dashboard)/heists/create/page.tsx`

Add `"use client"` directive. The component needs:

**State:**
- `users: { id: string; codename: string }[]` — populated from Firestore on mount (default `[]`)
- `isLoadingUsers: boolean` — true while the users collection is being fetched
- `isSubmitting: boolean` — true during the Firestore write
- `error: string | null` — Firestore write error message

**On mount (`useEffect`):**
- Call `getDocs(collection(db, COLLECTIONS.USERS))` and map each doc to `{ id, codename }`
- Store the result in `users` state; set `isLoadingUsers` to false

**`handleSubmit(event)`:**
1. Prevent default
2. Read `title`, `description`, and `assignedTo` (the selected user's id) from the form
3. Look up the selected user in `users` to get `assignedToCodename`
4. Get `createdBy` (uid) and `createdByCodename` (`displayName ?? uid`) from `useUser()`
5. Build `CreateHeistInput`:
   - `createdAt: serverTimestamp()`
   - `deadline: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000))`
   - `finalStatus: null`
6. Set `isSubmitting` true, call `addDoc(collection(db, COLLECTIONS.HEISTS), input)`
7. On success: `router.push('/heists')`
8. On failure: set `error` to the error message, set `isSubmitting` false

**JSX:**
- Existing `<h2 className="form-title">Create a New Heist</h2>` heading stays
- `<form>` with `onSubmit={handleSubmit}`:
  - Title: `<input type="text" name="title" required />`
  - Description: `<textarea name="description" required />`
  - Assignee: `<select name="assignedTo" required>` — options mapped from `users`; show a "Loading targets…" disabled option while `isLoadingUsers`; show a "No users found" disabled option if the list is empty after loading
  - Submit `<button>` disabled while `isSubmitting || isLoadingUsers`; label "Planning…" while submitting
- Error `<p>` rendered below the button when `error` is set

---

## Files to Create

### `app/(dashboard)/heists/create/create-heist.module.css`

```
@reference "../../../../globals.css";
```

Styles:
- `.formWrapper` — centres the form, applies max-width (matches `.page-content` pattern)
- `.field` — flex column, gap between label and input
- `.label` — small uppercase tracking style (body colour)
- `.input`, `.textarea`, `.select` — full width, dark background (using `--color-lighter`), body-coloured text, border using a subtle rgba, rounded corners, padding
- `.error` — reuses the same pattern as AuthForm's `.error` (text-error, text-sm, text-center)

---

### `tests/app/create-heist.test.tsx`

Mock the following (all `vi.mock` calls hoisted before imports):
- `@/hooks/useUser` — returns `{ user: { uid: 'user-1' }, uid: 'user-1', displayName: 'IronFoxVault', ... }`
- `next/navigation` — `useRouter: () => ({ push: mockPush })`
- `@/lib/db` — `{ default: {} }`
- `firebase/firestore` — `getDocs`, `addDoc`, `collection`, `serverTimestamp`, `Timestamp`, `query`

**`getDocs` mock setup:** return a snapshot with two fake user docs: `{ id: 'user-1', codename: 'IronFoxVault' }` and `{ id: 'user-2', codename: 'SilentRavenCache' }`.

**Tests:**
1. Renders the form with title, description, and assignee fields
2. Populates the assignee dropdown from the `users` collection on mount
3. Calls `addDoc` with the correct `CreateHeistInput` shape when submitted
4. `createdAt` in the submitted data is `serverTimestamp()` and `deadline` is a `Timestamp` ~48h from now
5. `createdBy` and `createdByCodename` match the mocked `useUser` values
6. `router.push('/heists')` is called after a successful submit
7. Displays an error message when `addDoc` rejects
8. Submit button is disabled while submission is in progress

---

## Verification

1. `npm test` — all tests pass including the new create-heist tests
2. `npm run dev` — visit `/heists/create` while logged in; form renders with users in the dropdown
3. Submit with valid inputs; verify document appears in Firestore Console under `heists`; browser redirects to `/heists`
4. Submit with Firestore rules blocking the write; verify error message appears
