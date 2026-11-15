# Prompt log: cards worth adding (Issue #57)

Branch: `feature/card-suggestions`. Written Nov 13, 2026, after the demo. Not in the original plan.

## Prompt 1 (me, the end of a longer message about the redesign and email confirmation)

> Also, let's add another feature as well, which is recommended credit cards based on spending. So if somebody's spending a lot in dining but they don't have the Amex Gold, then they should maybe consider getting that card that they can use to offset some of the extras and get money back, right? And even like the perks of the Amex Gold, the other perks that make that card worth it even though it has an annual fee Start with that for now, and let's get to it

## Prompt 2 (me)

> continue

## Prompt 3 (me)

> Logged in

## What Claude Code did

- Opened Issue #57. Built it on top of the redesign branch, so the new page uses the new look.
- **Perks data.** Added a `perks` list to the 8 presets that charge an annual fee: Amex Gold, Amex Platinum, Sapphire Preferred, Sapphire Reserve, Venture X, Venture, Blue Cash Preferred and Strata Premier. Each perk has its yearly dollar value where it has one. For example, the Gold lists a $120 dining credit, $120 Uber Cash, a $100 Resy credit and an $84 Dunkin' credit.
- **The math** (`lib/card-suggestions.ts`, plain functions with no database):
  1. Scale my logged purchases up to a year. Less than a month of history counts as a month, so one big purchase doesn't become a silly yearly number.
  2. For each preset card I don't already have, in each category, count only how much it beats the best card I already have open there.
  3. Subtract the annual fee.
  4. If that's still negative, work out how much of the card's credits I'd need to use to cover the rest of the fee. Only suggest it if its credits can.
  5. Rank by what each card adds a year if I used every credit, and show the top 3.
- **The page** `/cards/suggested`, linked at the bottom of **Cards**:
  - Each card shows either "About $X more a year" or "Worth it if you use its credits", with the plain-English math.
  - Then the categories the extra rewards come from, the perks with their values, and an "Add this card" button that opens the card's preset form.
  - A note at the bottom says it's an estimate, not financial advice, and that caps, rotating categories and changing credits aren't reflected.
- **Tests:** 12 new no-database tests (`lib/card-suggestions.test.ts`), using made-up cards so the numbers never change when the real list does. One more test uses the real list.
- **Docs:** README feature table, a line in schema.md (no new tables) and a Plan vs. Reality row.

## How it was checked

- **With my real data**, at laptop and phone widths. With my 22 days of purchases (about $18,143 a year) it suggests:
  - **Blue Cash Preferred**: about $37 more a year on groceries (6% instead of my 4%). That doesn't cover its $95 fee alone, but about $58 of its $84 Disney credit would.
  - **Costco Anywhere Visa**: about $15 more a year on gas, with no fee.
- **It didn't suggest the Amex Gold**, because I already have it. That's correct.
- **Nothing scrolls sideways** on a phone.
- **Type check, lint, and all 65 no-database tests:** pass.

## What went wrong / caught along the way

- **The first ranking ignored perks once a card covered its fee.** A test with real presets and heavy dining showed five no-fee 3% dining cards beating the Amex Gold, even though its credits are worth $424 a year. That went against what I asked for, so Claude Code changed the ranking to count credits and label cards that depend on them.
- **The first draft of the scoring had a tangled type expression at the end.** Claude Code rewrote it cleanly before testing.
- **"Using about $63 of its credits would"** showed a $5 safety margin as if it were part of the fee gap. It now shows the real gap ($58). The margin is kept only for deciding whether to suggest the card.
- **The first look at the page showed the old blue design and a blank date.** The dev server was still serving files from before the branch switch. A restart fixed it; the code was fine.
- **The perk values are Claude Code's best knowledge as of November 2026, not checked against the issuers' sites.** I should check them before relying on this, and the page tells users to as well.
- **Not tested:** a brand-new account with no purchases (the empty message is written but not seen), a real iPhone, a screen reader.
- **This PR is stacked on #56 (redesign), which is stacked on #54 (email).** Merge those first.
