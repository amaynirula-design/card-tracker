# Prompts: wallet card faces and the rewards ring

## Prompt 1 (me)

> The UI still looks the exact same. What have you changed?

Claude Code checked the live site, and the first redesign was there. It told me I was right: most of those changes were accessibility and behavior, some only show on phones, and the biggest one needs purchases, which my account didn't have. It also said it had oversold the PR by calling it a "big visual change."

## Prompt 2 (me)

> Make it bolder

Claude Code showed me three phone mockups first: A, Wallet (colored card faces), B, The gap (a ring of earned against possible rewards), and C, Teal canvas (a solid teal header). It recommended combining A and B, and warned that colored cards and a red amount break PLAN.md section 6's "everything else is grayscale."

## Prompt 3 (me)

> Build A and B together: Wallet card faces and The gap ring

## What Claude Code did

- Opened Issue #37 and created `design/wallet-and-ring` from main.
- **Card faces:** the Cards tab is now a stack of colored cards, like Apple Wallet, with the name, type, and best rates. A card's page and the Best Card answer show the same face.
- **Colors:** each card gets one of six colors from its id, so there's nothing to set up and no database change. A closed card is gray. There are no issuer logos and no card numbers.
- **The ring:** the dashboard opens on a ring showing rewards earned out of what was possible, with the numbers in text in the middle. It fills in once when the page opens, unless Reduce Motion is on. The "You left $X on the table" sentence sits under it, with the amount in red.
- **Plan vs. Reality:** added two rows to the table.
- **Tests:** added 3 tests for card colors and 3 for the ring's percentage.

## How it was tested

With my account logged in on my local copy, using two temporary cards and two temporary purchases that Claude Code deleted afterwards. My real card wasn't changed.

- **Ring math:** $3.50 earned of $5.25 possible, with $1.75 missed.
- **Stack:** tapping each card's strip opens the right card, and each strip is 56px tall.
- **Light and dark:** phone size in both, and desktop in dark mode.
- **200% text:** Cards, Dashboard, and a card's page all stay within the phone's width.
- **Contrast:** white text on all seven card colors is 5.06:1 or better. Red on the light background is 4.83:1.

## What went wrong / caught along the way

- **The stack was broken at first.** An earlier card's rates showed through the card on top of it. Claude Code fixed it so each card paints fully over the last.
- **Two colors were too close.** Teal and green sat next to each other, so cards added in a row looked alike. It reordered the colors, and moved the near-black one so my card wouldn't start out dark on the dark background.
- **The ring was too wide at 200% text.** It now stops at the width of the screen.
- **Not tested:** a real iPhone. The two exceptions to "teal means tappable" are now the chart's bars and the ring.
