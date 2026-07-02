# Spec for create-heist-form

branch: claude/feature/create-heist-form
figma_component (if used): N/A

## Summary

Build out the Create Heist form at `/heists/create`. The form collects a title, description, and an assignee (selected from existing users in Firestore). On submission, a new document is written to the `heists` Firestore collection using the `CreateHeistInput` interface, with `createdAt` set to the server timestamp and `deadline` automatically calculated as 48 hours from creation. On success, the user is redirected to `/heists`.

## Functional Requirements

- The form has three fields: title (text), description (textarea), and assignee (dropdown/select populated from the `users` Firestore collection)
- The assignee dropdown displays each user's codename and stores their uid and codename internally
- On submission, a heist document is written to the `heists` collection using the `CreateHeistInput` interface
- `createdAt` is set to `serverTimestamp()` from Firestore
- `deadline` is set to a Firestore `Timestamp` 48 hours from the current time at submission
- `createdBy` and `createdByCodename` are taken from the currently authenticated user (via `useUser`)
- `assignedTo` and `assignedToCodename` are taken from the selected assignee
- `finalStatus` is set to `null`
- On successful submission, the user is redirected to `/heists`
- While the form is submitting, inputs and the submit button are disabled
- If the Firestore write fails, an error message is displayed

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- The `users` collection may be empty (no other users to assign to) — the form should handle this gracefully, either disabling the assignee field or showing a message
- A user could assign a heist to themselves — this should be allowed
- The Firestore write could fail (network error, rules violation) — the error should surface to the user without losing their form input
- The authenticated user's codename may not be set yet — fall back to their uid if `displayName` is null

## Acceptance Criteria

- Submitting the form with valid inputs creates a document in the `heists` collection with all required fields
- The created document matches the `CreateHeistInput` interface shape
- `createdAt` is a server timestamp and `deadline` is exactly 48 hours after submission time
- The assignee dropdown is populated from the `users` Firestore collection
- After a successful write, the browser navigates to `/heists`
- An error message is shown if the write fails
- The form cannot be submitted twice while a write is in progress

## Open Questions

- Should the assignee field default to the currently logged-in user, or be left blank until selected?
- Should there be any validation on title length or description length?

## Testing Guidelines

Create a test file in `./tests` for the create heist page. Focus on:

- Submitting the form calls `addDoc` (or `setDoc`) with the correct shape matching `CreateHeistInput`
- `createdAt` uses `serverTimestamp()` and `deadline` is a Timestamp approximately 48 hours from now
- `createdBy` and `createdByCodename` are sourced from the authenticated user
- `assignedTo` and `assignedToCodename` reflect the selected user from the dropdown
- On success, `router.push` is called with `/heists`
- On failure, an error message is rendered
- The submit button is disabled while the write is in progress
