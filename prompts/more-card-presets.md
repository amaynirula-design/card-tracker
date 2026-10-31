# Prompts: adding more card presets (stranger test)

## Prompt 1 (me)

> OK i did the stranger test: top 3 complaints. 1. some of the cashback/miles on these cards are incorrect. 2. we have to choose the catgories ourselvers so there can be a risk of misidentifying a purchase. 3. some of my credit cards arent listed here. can we add more cards?

This PR is complaint 3. Complaint 1 is in `prompts/stranger-test-rates.md`.

## What Claude Code did

- Used Issue #40 and created `feature/more-card-presets` on top of the rates fix, because both change the same file.
- Added 17 cards, taking the list from 15 to 32.
- **Chase:** Freedom Flex, Freedom Rise.
- **American Express:** Platinum.
- **Capital One:** VentureOne, Quicksilver, Savor Student, Quicksilver Student.
- **Citi:** Strata Premier, Costco Anywhere Visa.
- **Discover:** it Student Cash Back, it Student Chrome, it Miles.
- **Wells Fargo:** Autograph.
- **Bank of America (new):** Customized Cash Rewards, Unlimited Cash Rewards, Travel Rewards.
- **U.S. Bank (new):** Cash+.
- **Plan vs. Reality:** added one row.

Claude Code chose this list itself, as common cards plus student cards for a college class. It didn't ask which cards my tester was missing, so one of theirs may still not be here.

## How it was checked

- 16 of the 17 came from the issuer's own page, loaded in October 2026.
- **Amex Platinum's page didn't load.** Its rates and $895 fee came from search results of Amex's pages plus NerdWallet and Bankrate.
- All point values are the 1¢ base value. The pages read here didn't state what a point or mile is worth, so that's Claude Code's assumption for the new points cards.
- Type check, lint, and the no-database tests all pass, including the checks that every preset has its own id and a base rate.

## What went wrong / caught along the way

- **Not tested in the browser:** the card picker needs my login.
- **Pick-your-own cards are approximate.** Customized Cash is set to Online Shopping, and Cash+ has no bonus categories filled in. The note on each tells you to set your own.
- **The list is longer now.** 32 cards are grouped by issuer, but there's no search in the picker.
