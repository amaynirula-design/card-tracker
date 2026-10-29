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
