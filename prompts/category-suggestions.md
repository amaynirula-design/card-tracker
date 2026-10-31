# Prompts: suggesting a category from the merchant (stranger test)

## Prompt 1 (me)

> OK i did the stranger test: top 3 complaints. 1. some of the cashback/miles on these cards are incorrect. 2. we have to choose the catgories ourselvers so there can be a risk of misidentifying a purchase. 3. some of my credit cards arent listed here. can we add more cards?

Claude Code fixed complaints 1 and 3 in PRs #41 and #42. It said complaint 2 was optional for the assignment, and suggested a simple merchant lookup with no AI or API key.

## Prompt 2 (me)

> Yes, build it

## What Claude Code did

- Opened Issue #43 and created `feature/category-suggestions` on top of `feature/more-card-presets`, because all three PRs add a row to the same table in PLAN.md.
- **The lookup:** a built-in list of merchant names for each category, in `lib/category-suggestions.ts`. Nothing is sent anywhere.
- **New Purchase screen:** as you type the merchant, Category fills in, and a line underneath says it was suggested and to change it if it's wrong. An unknown merchant leaves Category on "Choose".
- **Your choice wins:** once you pick a category yourself, typing in Merchant no longer changes it.
- **Edit screen:** nothing changes, so editing a purchase's merchant can't quietly change its category.
- **Tests:** added 6 no-database tests.
- **Plan vs. Reality:** added one row.

## Decisions Claude Code made

- **Target, Walmart, and Costco get no suggestion.** They sell a bit of everything and card issuers treat them differently, so you choose.
- **Whole words only,** so "Seashell Gifts" doesn't count as Shell.

## How it was tested

The form needs my login, so Claude Code tested it on a temporary local page with fake cards and a fake save, then deleted the page. Nothing was saved to the database.

- **Starbucks, Chevron, Uber Eats, and Safeway** each filled in the right category and showed the line.
- **Moe's Books** left Category on "Choose" and showed no line.
- **After a failed save,** the suggestion stayed, and a new merchant still updated it.
- **After picking Travel by hand,** typing Safeway left it on Travel.
- **On the edit screen,** changing the merchant left the category alone.
- Type check, lint, and the no-database tests all pass.

## What went wrong / caught along the way

- **The first browser run was messy.** The select-all shortcut didn't work there, so test names ran together. Claude Code said so and reran it cleanly.
- **The temporary page gave a 404 at first** because the local server hadn't noticed it yet. A retry worked.
- **Not tested:** a real save to the database, a real iPhone, or a screen reader.
- **It's a guess, not the bank's answer.** Your card issuer decides how a merchant counts, so a suggestion can differ from what the bank does. The list also only knows the merchants on it, so plenty will still say "Choose".
