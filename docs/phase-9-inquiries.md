# Phase 9 — Client acquisition and project inquiries

## Goal

Help potential clients understand what JRC Techworks builds and make it easy to start a specific project conversation, without adding a paid service or a backend.

## Changes

- The primary homepage action takes visitors to the project inquiry area; the portfolio remains a secondary action.
- Each of the six service cards links to `/?service=<service name>#contact` to preselect that category in the project brief.
- The contact section asks for a name, reply email, service, approximate timeline, and project overview.
- Visitors can open a prefilled email draft addressed to `jhonreyc2001@gmail.com`, or copy the complete brief into a different messaging app.
- Direct email, Facebook, GitHub, and LinkedIn remain visible below the brief.
- Project case-study pages close with a relevant inquiry link.

## Privacy and delivery

The form has no server endpoint, database, analytics event, or background submission.
It never claims a message was sent. Visitors must review and press Send in their email app. When no email app is configured, the copy option is a fallback. A visitor's contact details are held only in the form's current browser state and in the draft or clipboard they explicitly create.

## Verification checklist

- TypeScript: `npm run typecheck`
- Static production build: `npm run build`
- Check the six service categories and their inquiry links.
- Confirm valid query parameters preselect a category and invalid ones do not.
- Confirm browser-native required-field and email validation, accessible field labels, and status feedback.
- Confirm the brief includes all form answers and addresses the owner's configured email.
- Check 390px and desktop layouts, with special attention to two-column fields and contact links.
- Verify no form claims to send messages automatically, and no user data is sent to the site.

## Future option (not in this phase)

If an actual website-to-inbox submission is later desired, add a secure server-side endpoint, abuse prevention, clear consent/privacy copy, and an approved sending provider. Do not silently convert the draft into an automatic submission.
