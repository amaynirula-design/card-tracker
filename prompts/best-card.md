# Prompts: feature 8, best card for a category (my feature)

## Prompt 1 (me)

> i have used 67% of my 5 hour limit and it resets soon.. what can you do in the next 15ish mins to use it up more so that we can front load some of these tasks

## What Claude Code did

It picked feature 8, because it needs no new database table (so no SQL step for me) and could be built, tested, and put up as a PR in about 15 minutes.

- Opened Issue #20 with the feature 8 user story and created `feature/best-card` from main.
- Wrote the comparison as a plain function, `bestCardFor` in `lib/best-card.ts`, with no database:
  - Cards are compared by what a dollar actually earns. Cash back counts as its %, and **points count as points per dollar × my point value**, so a 2× points card at 1.5¢ counts as 3%, the same as a 3% cash back card.
  - **Ties** return every tied card. Tiny rounding differences (like 1.8750000000000002) still count as a tie.
  - **Closed cards are skipped**, since they can't be used at checkout.
- Built the **Best Card** screen (`/cards/best`), opened from a new "Best Card for a Category" row at the top of the Cards tab:
  - A Category row with the phone's own picker (defaults to Dining).
  - The answer, large: "Use for Dining: [card]", with how it earns, e.g. "2× points at 1.5¢ ≈ 3% back". Ties say "Tied for Dining" and list each card.
  - An **Every Category** list showing the winner and % for all 9 categories at a glance. Tapping one switches the answer to it.
  - The category is in the page address (`?category=Groceries`).
  - Used title case for the new labels ("Add a Card", "Every Category"), following the design review.

## How it was tested

On my account at phone size, with 3 temporary cards that were deleted afterwards:

| Card | Setup | Expected |
|---|---|---|
| Test A Cash | cash back, 3% Dining, 1% else | ties on Dining |
| Test B Points | 1.5¢ points, 2× Dining, 1× else | ties on Dining (2 × 1.5 = 3%), wins everything else at 1.5% |
| Test C Closed | 5% on everything, **closed** | never shown |

- Dining: "Tied for Dining", listing Test A Cash ("3% back") and Test B Points ("2× points at 1.5¢ ≈ 3% back").
- Every other category: Test B Points at 1.5%. The closed 5% card never appeared.
- Switching the picker to Groceries changed the answer and the address to `?category=Groceries`.
- With no cards, it showed "No open cards yet" and an "Add a Card" button.

## What went wrong / caught along the way

- Nothing broke. The only thing to watch: if two different points values happen to land on the same % (e.g. 2× at 1.5¢ vs 3% cash back), the app treats them as a true tie on purpose, because they earn the same money.
