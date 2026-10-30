# Prompts: feature 9, missed rewards (my feature)

## Prompt 1 (me)

> i merged before you move on what else is left rn?

Claude Code listed what's left: features 9 and 10, Test 1 (data isolation, not started), Test 2's screenshots, schema.md, the README, the Plan vs. Reality table, the redesign, the stranger test, my 5+ real entries, and the reflection and submission.

## Prompt 2 (me)

> ok get started with feature 9

## What Claude Code did

- Opened Issue #22 with the feature 9 user story and created `feature/missed-rewards` from main.
- Wrote the math as plain functions in `lib/missed.ts`, with no database:
  - `missedFor(purchase, cards)`: what the best card for that category would have earned, minus what the card I used earned. "Best" is the same rule as feature 8: open cards only, with points valued at my point value.
  - It never goes negative. If I used a card I've since closed and it beat every open card, that's not a miss. Amounts under half a cent don't count, which hides rounding noise.
  - `missedSummary(purchases, cards)`: the total missed, how many purchases missed out, and **which category cost the most**, with the card to use there instead.
- **On each purchase's page**, under Rewards:
  - When the wrong card was used: "**Missed** — [best card] would have earned $X", with the amount missed.
  - Otherwise: "**Best card ✓** — Nothing missed on Dining".
- **On the dashboard**, a new tile right under Rewards earned. This is the "signature" number the design review suggested.
  - "**Missed this month**" (or "Missed rewards" on All Time): the total, "left on the table on N purchases", and one tip, e.g. "Use [card] for Dining to save the most ($1.50)."
  - With nothing missed: "You used your best card every time. Nothing missed."

## How it was tested

On my account at phone size, with temporary data that was deleted afterwards:
- Two cards: a Dining card (3% Dining, 1% else) and a flat card (1.5% on everything).
- Three purchases:

| Purchase | Card used | Earned | Best | Missed |
|---|---|---|---|---|
| $100 Dining | flat card | $1.50 | Dining card $3.00 | **$1.50** |
| $40 Groceries | Dining card | $0.40 | flat card $0.60 | **$0.20** |
| $50 Dining | Dining card | $1.50 | (same card) | **$0, Best card ✓** |

- The dashboard showed **Missed this month $1.70**, "left on the table on 2 purchases", and "Use Test Dining Card for Dining to save the most ($1.50)". All correct.
- Claude Code also wrote 4 Vitest checks for the missed-rewards math (correct difference, zero on the best card, closed cards ignored, and the monthly total and biggest category). All 4 passed.

## What went wrong / caught along the way

- **The missed-rewards tests aren't in this PR, on purpose.** Vitest is only on the test branch (`test/dashboard-stat`), which is waiting for my red/green screenshots and isn't merged yet. If this PR included a test file that imports Vitest, the **Vercel build would fail**: the build checks every TypeScript file, and Vitest isn't installed on main yet. It builds fine on Claude Code's laptop, which is exactly why it would have been easy to miss. The tests are saved and get added once the test PR is merged.
