# Prompts: fixing wrong rewards on card presets (stranger test)

## Prompt 1 (me)

> OK i did the stranger test: top 3 complaints. 1. some of the cashback/miles on these cards are incorrect. 2. we have to choose the catgories ourselvers so there can be a risk of misidentifying a purchase. 3. some of my credit cards arent listed here. can we add more cards?

Claude Code split this up: complaint 1 (this PR), complaint 3 (its own PR), and complaint 2 left for me to decide on, because it's a new feature.

## What Claude Code did

- Opened Issue #39 and created `fix/preset-rates` from main.
- Checked all 15 presets against current terms, using the issuer's own page where it loaded.
- **Fixed one wrong rate:** the Chase Sapphire Preferred was missing 3× on gas.
- **Fixed two out-of-date point values:** the Sapphire Preferred was set to 1.25¢ and the Sapphire Reserve to 1.5¢. Chase's base value for new points has been 1¢ since June 2025, so these two cards showed too many rewards. Both are now 1¢, and their notes say so.
- **Corrected or added notes:** Amex Gold's restaurant cap, Venture X's travel bonuses, Venture's travel bonus, Citi Custom Cash's billing cycle, Prime Visa's 5% list, and Savor's entertainment rate. Venture and Venture X now say they earn miles, shown as points.
- **Date:** the app now says rates are from October 2026 instead of mid-2026.
- **Tests:** added 4 no-database tests for the presets.
- **Plan vs. Reality:** added one row.

## How it was checked

- **Issuer pages that loaded:** Sapphire Preferred, Sapphire Reserve, Freedom Unlimited, Savor, Venture X, Venture, Double Cash, Discover it, Active Cash, Apple Card, and Amex Gold's rates.
- **Pages that didn't load:** Blue Cash Preferred, Blue Cash Everyday, Citi Custom Cash, Prime Visa, and Amex Gold's fee. Those came from search results of the issuers' pages plus NerdWallet and Bankrate.
- **Point values:** came from NerdWallet and Bankrate, not from Chase's own site.
- **Type check, lint, and the 16 no-database tests:** all pass.

## What went wrong / caught along the way

- **My list was wrong.** The app said its rates were from mid-2026, but the Sapphire point values were more than a year old. Claude Code had written those presets, and my tester caught it, not Claude Code.
- **Saved cards don't update.** A preset is copied when a card is saved, so anyone who already added a Sapphire card still has the old numbers until they edit it. That includes my own card.
- **Not tested in the browser:** the card picker needs my login, so this was checked by the tests and by printing each preset's summary line.
- **Still simplified:** real cards don't fit one rate per category. The stranger may also have meant a simplified rate, like 4× on all travel for the Sapphire Reserve, and I can't be sure which ones they noticed.
