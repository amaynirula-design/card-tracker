# Prompts: feature 6, find things (search, filter, sort)

## Prompt 1 (me)

> Merged, go on

## What Claude Code did

- Opened Issue #15 with the feature 6 user story and created `feature/find` from main.
- Built search, filters, and sort on the Purchases screen:
  - **Search field** in the iOS style (gray, rounded, with a clear button). It finds purchases whose merchant contains what you type, ignoring upper/lower case, and searches as you type after a short pause.
  - **Three pill menus:** All cards / All categories / Newest first. Each opens the phone's own picker, and a pill turns teal while it's narrowing the list.
  - **Sort:** newest, oldest, or largest amount. Largest amount shows one plain list without month headings, because months don't fit that order.
  - With a search or filter on, a line shows how many purchases match, with a **Clear** button.
  - When nothing matches: "No matching purchases. Try a different search, or clear the filters to see everything."
- **Where the work happens:** the database does the searching, filtering, and sorting, and only matching purchases are sent back.
- **The filters live in the page address**, e.g. `/purchases?q=coffee&category=Dining&sort=largest`, so reloading or sharing the link keeps them. Anything invalid in the address is ignored.
- Search characters like `%` and `_` are special in database searches (they mean "anything"), so they're escaped. A search for "50%" looks for "50%" literally.

## Prompt 2 (me, while it was testing)

> do you think it makes sense to invoke the /apple-design skill now or later?

## What Claude Code said

Later: right after feature 10 and before the stranger test, because:

- The dashboard, Best card, Missed rewards, and Card presets screens don't exist yet. A redesign now would have to be redone for them.
- The remaining features are graded, and the redesign is polish.
- The stranger should test the final design, so their struggle is worth fixing.

## How it was tested

On my account at phone size, with 2 temporary test cards and 6 test purchases (Blue Bottle Coffee, Trader Joe's, Shell, Peet's Coffee, United Airlines, "50% Off Store") that were deleted afterwards:

- Typing **"COFFEE"** in capitals found both coffee shops. The cursor stayed in the field, and the address became `?q=COFFEE`.
- Adding the **card filter** (Test Cash) narrowed it to just Peet's Coffee.
- **Clear** brought back all 6 and emptied the search field.
- **Category** Dining → the 2 coffee shops. With **Largest amount** they showed as one list with no month headings.
- **Largest amount**, all purchases: $312 → $84.20 → $45 → $20 → $6.50 → $5.25. Correct.
- **Oldest first:** Sep 15 → Oct 28, with September before October. Correct.
- **Reloading** a link with `?q=50%&category=Online Shopping` kept both filters and found the right purchase.
- Searching for just **"%"** found only "50% Off Store", not everything, so the escaping works.
- Searching **"zzzz"** showed "No matching purchases".

## What went wrong / caught along the way

- Nothing broke this time. One small thing noticed: on a narrow phone, the third pill ("Newest first") is cut off at the edge until you scroll the row sideways, like iOS filter rows. Left as is, but worth watching in the stranger test.
