# Prompts: feature 10, card presets (my feature)

## Prompt 1 (me)

> Merged, go on

## What Claude Code did

- Opened Issue #24 with the feature 10 user story and created `feature/card-presets` from main.
- Built presets as a **pick-your-card step**, like adding a card in Wallet. Tapping Add on the Cards tab (or any "Add a card" button) now opens **Add a Card**:
  - A list of **15 common U.S. cards** grouped by issuer: Chase, American Express, Capital One, Citi, Discover, Wells Fargo, Apple, and Amazon. Each shows its type, its best rates, and its annual fee.
  - An **Enter Rates Yourself** row at the top, for a card that isn't listed.
- **Picking a card** opens the usual New Card form with everything filled in: name, reward type, point value, annual fee, and every category rate. I can change anything before saving. Under the form, a note explains what the fixed rates leave out, e.g. "4× at U.S. supermarkets is capped at $25,000 a year."
- **Saving copies the values into my own card** (the normal `cards` and `reward_rates` rows), so editing my card later never changes the preset. As PLAN.md section 3 says, the presets are a list in the code (`lib/card-presets.ts`), not a database table.
- **Cards with caps, rotating categories, or travel-portal bonuses are approximated with one fixed rate per category**, and their notes say so (PLAN.md section 7's risk). For example:
  - Citi Custom Cash's 5% is set on Dining, "change it to yours".
  - Discover it's rotating 5% isn't filled in, "add this quarter's category yourself".
- Every preset page says the rates are from mid-2026 and to check them against the card's terms.
- Point values are a starting guess (e.g. 1.25¢ for Sapphire Preferred, 1¢ for Amex Gold) that I can change to what points are worth to me.

## How it was tested

On my account at phone size, with a test card that was deleted afterwards:

- **Add a card** on the Cards tab opened the picker with all 15 cards grouped by issuer.
- Picking **American Express Gold** filled in points, 1¢, $325, 4× Dining, 4× Groceries, 3× Travel, 1× everything else, and its note.
- **Edited before saving** (renamed it, and changed the point value to 2¢), then saved. The card page showed "About 8% back" on Dining (4 × 2¢), so the edits stuck.
- **Opened the Amex Gold preset again:** it still said 1¢, so editing my card didn't change the preset.
- **Enter Rates Yourself** opened a blank form. An unknown preset in the address fell back to the picker.
- **Cleared the name** on a Sapphire Preferred preset and saved: the friendly "Give this card a name" message showed, and the preset's values (points, 1.25¢, 3× Dining, $95) stayed filled in.

## What went wrong / caught along the way

- Nothing broke. The honest limit, which PLAN.md section 7 called out as my least-sure feature: the preset rates come from what Claude Code knew as of mid-2026, and issuers change them. They're simplified to one rate per category, so I should check my own cards' rates when I add them.
