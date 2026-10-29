# Prompts: feature 5, stars

## Prompt 1 (me)

> Merged, go on

## What Claude Code did

- Opened Issue #13 with the feature 5 user story and created `feature/stars` from main.
- Wrote the SQL for the **stars** junction table (`supabase/migrations/20261030010000_stars.sql`), as in PLAN.md section 3:
  - One row means "this user starred this purchase": `user_id` + `purchase_id`. Unstarring deletes the row.
  - A user can star a purchase only once (user_id + purchase_id is unique).
  - **Row-level security:** you only see your own stars, and you can only star your own purchases (the "star ownership" rule we added to the plan before PR #1).
  - Deleting a purchase removes its star.
- Built the star:
  - A star on the left of every purchase row, and a larger one next to Edit on the purchase's detail page.
  - Tapping it fills it with the teal accent **right away**. The database is updated in the background, and if saving fails, the star flips back.
  - Screen readers hear "Star Trader Joe's" / "Unstar Trader Joe's".
- Built the **Starred** tab (between Purchases and Cards, in PLAN.md's order): your starred purchases grouped by month, with a friendly empty state explaining what stars are for.
- Moved the purchase rows into one shared list, so Purchases and Starred look identical.

## Prompt 2 (me)

> Done, test it

(I had run the stars SQL in Supabase.) The browser pane had logged me out in the meantime, so Claude Code asked me to log in rather than typing my password, and I replied:

> Logged in

## What Claude Code did

Tested on my account at phone size, with a temporary test card and two purchases ("Test dinner" $100 Dining, "Test return" $40 Online Shopping):

- **Starred tab, empty:** showed "No starred purchases" and what stars are for.
- **Star from the list:** tapping the star on "Test return" filled it teal instantly, and the tap didn't open the purchase. "Test return" then appeared in the Starred tab.
- **Star from the detail page:** starred "Test dinner" from its page. Both purchases then showed in Starred.
- **Unstar:** the star emptied straight away and stayed empty after a reload, and the purchase left Starred.
- **Delete a starred purchase:** deleted "Test dinner" while it was starred, and the Starred tab was empty again. The database removes the star with the purchase.
- Deleted the remaining test purchase and the test card, so my account is back to no cards and no purchases.

## What went wrong / caught along the way

- **Seen once, couldn't reproduce:** the first time Claude Code starred "Test dinner" from its detail page (clicking right as the page finished loading), a screenshot two seconds later showed the star empty. But the purchase *was* starred in the database, it was in the Starred tab, and the star was filled after a reload. Claude Code tried four more times, including clicking the instant the page loaded, and the star showed correctly every time. Logged here in case it shows up again during the stranger test.
- The dev server had stopped between sessions, so Claude Code restarted it before testing.
