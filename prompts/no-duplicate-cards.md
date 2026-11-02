# Prompts: stopping the same card being added twice

## Prompt 1 (me)

> Is there a way for me to delete cards or prevent adding multiple cards? Because I can do that right now

Claude Code checked the code first. Deleting already worked: Delete card is on a card's edit screen, and it's refused if purchases still use that card. Nothing stopped duplicates, so it recommended a friendly message when a name is already used, with no database change.

## Prompt 2 (me)

> Yes, block them

## What Claude Code did

- Opened Issue #47 and created `feature/no-duplicate-cards` from main.
- **The check:** saving a card now looks at your other cards. If one has the same name, ignoring capitals and extra spaces, the form shows "You already have a card named…" and nothing is saved.
- **Each person's list is separate:** row-level security means the check only sees your own cards, so two people can both have a Sapphire Preferred.
- **Closed cards count:** a closed card still holds its name.
- **Tests:** added 6 no-database tests for the name check.
- **Plan vs. Reality:** added one row.

## How it was checked

- **The save step:** a temporary test ran the real save code against a fake database, in 6 cases. A refused name wrote nothing, and a failed name check showed the normal save error. The test was deleted and isn't in this PR.
- **The message:** seen at phone width on a local copy with a fake login and fake data. The fakes were removed and those files match main again.
- **Type check, lint, build, and the 47 no-database tests:** all pass.

## What went wrong / caught along the way

- **The first version would have trapped duplicates.** It refused any save where another card shared the name, so a card with an older copy couldn't be edited or closed without renaming it. And closing a card is what the app tells you to do with a card that has purchases. Claude Code caught this after testing the first version, and now only a change of name is checked.
- **The first temporary test didn't run,** because its setup file was outside the project and couldn't find Vitest. Moved it in and it worked.
- **Not tested:** a real save on the live database, a real iPhone, or a screen reader. The check is only in the app, not a database rule, so two saves at the exact same moment could still both go through.
