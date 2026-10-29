# Prompts: feature 3, log purchases (create / read / update / delete)

## Prompt 1 (me)

> Merge is done. Also, does it need to have 9 PRs or 9 features? I'm wondering about this project

## What Claude Code did

- Answered from the assignment rubric: **both** are graded, separately.
  - Spine (4 points): all **10 features** (7 required + my 3 custom) must work on the live URL.
  - Feature loop (2 points): **at least 9 merged PRs**, each with its own Issue, branch, and prompt log.
  - We had 4 merged PRs at that point. Features 3–10 make 12, and schema/README, the stranger-test fix, and Plan vs. Reality push it past that.
- Opened Issue #9 with the feature 3 user story and created `feature/purchases` from main.
- Wrote the SQL for the **purchases** table (`supabase/migrations/20261030000000_purchases.sql`), following PLAN.md section 3:
  - Merchant, amount (must be more than $0), category (one of the 9), date, optional notes, the card used, and the user.
  - **Row-level security:** you can only see and change your own purchases, and the database rejects a purchase that points at anyone else's card. This is the "card ownership" rule we added to the plan before PR #1.
  - A card that has purchases can't be deleted. The Delete Card alert from feature 2 now says to close the card instead.
- Built the navigation from PLAN.md section 6:
  - A **tab bar** at the bottom on phones and a **sidebar** on wider screens. It has Purchases and Cards for now; Starred and Dashboard get added when those features are built.
  - Signed-in users now land on Purchases. Email, "Member since", and Log out moved to an **Account** page, opened from a person icon in the top bar.
- Built the purchase screens:
  - **List:** purchases grouped under month headings, newest first, like Apple Card. Each row shows merchant, a small colored dot for the category, the card, the amount, and the date. New accounts are pointed to add a card first, then a purchase.
  - **Detail:** the amount in large type with merchant and date, then the card, the category, and **rewards earned** on this purchase (using the rewards math from PLAN.md), plus notes.
  - **Add / Edit:** the same slide-up sheet as cards, with Merchant, Amount, Date (defaults to today), Category, Card, and Notes. Closed cards aren't offered for new purchases.
  - **Delete:** a red "Delete Purchase" button on the edit screen, using the same "are you sure?" alert as cards.
- Moved the form building blocks into one shared file, so card and purchase forms look the same.
- Kept per-field "friendly messages" out of this PR because they're feature 4. For now, the database refuses incomplete purchases and the form shows one general message.

## What went wrong / caught along the way

- After moving the signed-in pages into a new folder, the build failed on a garbled file that the running dev server writes automatically (a list of the app's pages). It wasn't our code. Claude Code stopped the dev server, deleted that generated folder, rebuilt, and restarted. The build then passed.
