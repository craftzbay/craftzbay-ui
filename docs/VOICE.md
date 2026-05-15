# Content & voice guidelines

The visual system is refined-minimal; the writing should be too. Three adjectives
describe our voice:

- **Precise** — every word earns its place. Cut filler.
- **Calm** — never alarmist, never breathless. Even errors stay measured.
- **Helpful** — explain what happened, then what to do next.

We are not casual ("hey there!"), not corporate ("kindly note"), not jargon-y
("synergise"). We sound like a competent colleague.

## Button labels

- Verb-first, sentence case: **Save changes**, **Send invite**, **Delete project**.
- Max 3 words preferred, 4 maximum.
- Match the verb to the action.
  - `Save` for updates, `Create` for new objects, `Send` for messages, `Delete`
    for destructive removal, `Archive` for reversible removal, `Connect` for
    integrations, `Continue` for multi-step flows.
- ❌ "OK" / "Submit" / "Click here" / "Yes, please" — replace with the action.
- ❌ "Are you sure?" as a button — that's a question, not an action. Use
  **Delete project** as the confirm button instead.

## Error messages — what / why / what to do

Three sentences max. Order:

1. **What happened.** Concrete, no blame on the user.
2. **Why** (only if it adds clarity).
3. **What to do.** Always offer a next step.

Examples:

> **Payment failed.** Your card was declined by the bank. Update your billing
> info to retry.

> **Couldn't import users.** Two rows are missing email addresses. Fix rows 3
> and 5 and re-upload.

> **Session expired.** Sign in again to continue.

Avoid:

- ❌ "Oops, something went wrong!" — vague and over-friendly.
- ❌ "Internal server error" — leaks implementation, useless to user.
- ❌ "Invalid input" — say which input and how to fix it.

## Empty state copy formula

```
[Why this is empty]. [What to do next].
```

- ✅ "No projects yet. Create one to start tracking work."
- ✅ "No results match your filters. Try clearing them or searching for something else."
- ❌ "Nothing to see here!" — cute, but unhelpful.
- ❌ "404: Resource not found" — system speak.

## Confirmation copy

- Title states the action as a question: **Delete project?**
- Description states the consequence: "This permanently deletes the project and
  its 24 documents."
- Confirm button repeats the action: **Delete project** (not "Yes").
- Cancel button: just **Cancel**.

## Dates, numbers, currency

- Dates: locale-aware via `Intl.DateTimeFormat`. Default format is medium
  (`12 May 2026`).
- Times: 24-hour or 12-hour based on the user locale, never force one.
- Relative time for recent events: "2 minutes ago", "Yesterday", "Last week".
  After 7 days, switch to absolute.
- Numbers: `Intl.NumberFormat` with `useGrouping: true` (e.g. `2,840`).
- Currency: include the code or symbol — `$20.00`, `€20.00`, `₮20,000`.
- Percentages: one decimal max (`98.4%`, not `98.42%`).

## Sentence case

UI text is sentence case, including page titles, button labels, headers, and
table column names. Reserve Title Case for proper nouns (Linear, Vercel).

## Voice in motion

- Loading: `Saving…` not `Loading…` when you know what's happening.
- Success: `Saved`, `Sent`, `Imported` — past tense, single word.
- Disable buttons during action; re-enable on success or failure.
