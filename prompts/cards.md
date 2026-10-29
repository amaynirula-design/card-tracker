# Prompts: feature 2, my cards (data model)

## Prompt 1 (me)

> Merged, go on

## What Claude Code did

- Checked GitHub first: PR #6 (feature 1) was still open, so the merge hadn't gone through yet. Rather than wait, it opened Issue #7 for feature 2 and started a branch on top of the feature 1 branch, planning to open the PR only after #6 was merged.

## Prompt 2 (me)

> PR#6 is now merged

## What Claude Code did

- Moved the `feature/cards` branch onto the updated main, so the PR only contains feature 2.
- Wrote the SQL for the two new tables (`supabase/migrations/20261029000000_cards.sql`), following PLAN.md section 3:
  - **cards**: name, reward type (cash back or points), point value in cents, annual fee, open/closed, linked to the user. No card numbers or other card details.
  - **reward_rates**: one rate per category per card, linked to the card. Only the 9 fixed categories are allowed, and a card can't have two rates for the same category.
  - Row-level security: you can only see and change your own cards, and only the rates on your own cards.
  - Deleting a user deletes their cards, and deleting a card deletes its rates.
- Built the screens in the iOS style:
  - **Cards**: your open cards (and closed ones in their own section), each with a one-line summary like "Points · 4× Dining, 3× Travel". With no cards yet, a friendly "Add your first card" screen.
  - **Card detail**: what the card earns in every category. Bonus categories are in teal, and categories that fall back to Everything Else are in gray. Points cards also show roughly what that's worth in cash, using my point value (for example 4× at 1.25¢ a point is "about 5% back").
  - **Add / Edit card**: slides up like an iOS sheet, with Cancel, the title, and Add/Done along the top. Switching between Cash back and Points changes the units (% or ×) and shows the point value field. Everything Else is required, and blank categories use it. The edit screen has a "Card is open" switch for closed cards.
  - **Home** now links to Cards with a count.
  - A "Not found" page for anything that doesn't exist or isn't yours.
- Friendly checks on the card form (name, point value, annual fee, rates). Anything already typed stays filled in after an error.
- Kept the math in plain functions (`lib/cards.ts`) with no database code, so the dashboard test can use them later.

## Prompt 3 (me)

> gonna go to sleep now we will continue tommorow

## What Claude Code did

- Kept going: lint and a production build passed, and it checked the add-card form in the browser at phone size in dark and light mode. Switching to Points, the errors for a blank form, and keeping typed values after an error all worked.
- Didn't open the PR yet, because the new tables aren't in Supabase yet. Saving a card and the list and detail pages still need a real test once I've run the SQL.

## What went wrong / caught along the way

- I said "Merged, go on" before the merge had actually gone through on GitHub. Claude Code noticed and built on the feature 1 branch in the meantime, so no time was lost.
- The browser pane was logged out, and Claude Code doesn't type my real password. To check how the add-card form looked, it briefly let that one page load without logging in on my laptop only, then put the guard back and confirmed that page sends logged-out visitors to Log in again. That change was never committed.
