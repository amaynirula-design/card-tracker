# Prompts: complete redesign (System Map)

## Prompt 1 (me)

> i want you to use the impecabble plugin to compleltey re-do the UI for this website. no need to follow the apple website anymore, compleltey re-do it

Claude Code opened Issue #45 and asked me four questions through the plugin. My answers: the audience is points enthusiasts; after logging in, lead with which card to use; the only thing I must keep is the phone-first layout; it must not look like a bank or look AI-generated.

## Prompt 2 (me)

Claude Code made four design directions as sketches and opened a page to choose between them. That page closed before I picked one, so it asked me again in the chat. I picked **System Map**, which it had recommended.

## What Claude Code did

- **New look:** a 1960s airline route map. Ultramarine background, pale panels, one type family (Archivo, using its width settings), and three-letter codes for categories (DIN, GRO, GAS) and cards (CSP).
- **The signature:** on Best Card, pick a category and a route flies from it to each of your cards. How far a card sits along the line is what a dollar earns there. The line's scale stays the same between categories, so you can compare them by eye. The winner is the thick yellow route. Every number on the map is also in the list next to it as plain text.
- **Best Card comes first:** it's now the first tab and where logging in lands. Changing category is instant, because the rates are already on the page.
- **Rebuilt every screen:** welcome, log in, sign up, Best Card, Purchases, purchase detail, add and edit forms, Starred, Dashboard, Cards, card detail, Account, and not found.
- **Color rules:** yellow only means the winner, orange only means missed rewards.
- **Removed, because I only asked to keep phone-first:** the System / Light / Dark switch, the wallet card faces, and the rewards ring. The numbers behind them are unchanged. The ring became a straight route line.
- **No change to how anything works:** data isolation, validation, category suggestions, the "are you sure?" dialogs, and the rewards math.
- **Tests:** added 19 no-database tests for the card codes and the route map math. The card color tests moved with the renamed file.
- **Added:** `PRODUCT.md` and `DESIGN.md` from the plugin, two Plan vs. Reality rows, and updates to the README and CLAUDE.md. The README also said 15 card presets, which was out of date, so it now says 32.

## Mistakes, and how they were caught

- **A file name that would have broken the deploy.** Claude Code named a shared component `page.tsx`. In Next.js that filename means "this is a page", so the type check and the production build both failed on it. The screens had looked fine in the dev server, so the deploy would have been the first place it broke. Renamed to `screen.tsx`.
- **Purchase rows:** a long card name ran into the date. Found by looking at the phone screen. The row now shows the card's code and the category, and the full card name is still read out to screen readers.
- **Text at 200% on the narrowest phone:** the header pushed Account off the screen, and a title beside a button broke one letter per line. Both fixed.
- **The sketch broke a rule of the plugin:** it had a small label above a heading, which the plugin bans. The heading now says "Use American Express Gold" instead.

## What the design review found

The plugin has a separate reviewer that checks finished work against the design rules. It sent the build back with eight fixes. Claude Code made them, and the reviewer sent back a second round on three of them:

- **The dashboard chart looked like a default chart,** with card names cut off. Each row now has the card's code, full name, and amount, with the amounts in one column. The first version still cut names off at large text sizes and put each bar closer to the next row than its own, so the rows were rebuilt so names wrap.
- **Card codes weren't unique.** Six codes were shared by more than one preset, so two of my cards could both say CSP. Claude Code's first fix made them unique by swapping a letter, and the reviewer sent that back: it turned Citi Strata Premier into CSR, which points people read as Chase Sapphire Reserve, and a card's code could change depending on what else was in the wallet. Every preset now has a fixed code picked by hand, and a test checks they're all different.
- **The earned / missed line drew the wrong proportion.** The dots squeezed it, so it showed 11% missed when the real number was 18.6%. It's now drawn to scale.
- **Two small labels broke the plugin's rule** about labels above headings. The purchase count moved into the sentence ("Across 3 of 5 purchases"), and the welcome page's heading sizes were fixed.
- **Keyboard focus was invisible on the phone tab bar:** a white ring on a white bar.
- **The missed amount was too low in contrast** on the blue. It now sits on an orange tag with dark text.
- **Best Card had no next step,** so it now has a Log a purchase link. The first version was a big button that pushed the ranked cards down the screen, so it became a plain link under them. It doesn't fill anything in, because that would be a new feature for me to decide.
- **Best Card now says rates are simplified,** so caps and rotating categories aren't reflected.

## How it was tested

I was logged out in the browser Claude Code used, and it doesn't type my password. To see the real signed-in screens, it temporarily swapped the data files for fake cards and purchases, checked every screen at phone and desktop sizes, then put the files back and confirmed they matched git exactly. Nothing was saved to the database.

The reviewer's final verdict was "ship", but it only covers the fixes it scored on Best Card and Dashboard. Claude Code checked the other screens itself. The reviewer did not.

So these were checked with fake data, not my real account: every signed-in screen, the delete dialog (opened, not confirmed), and failed saves. **Not tested:** a real save, a real delete, or starring against the database, and a real iPhone.
