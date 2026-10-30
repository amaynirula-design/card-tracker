# Prompts: test 1, data isolation

## Prompt 1 (me)

Claude Code asked where the test should run: a separate test project, or my real project.

> Separate test project

## What Claude Code did

- Opened Issue #28 with the test from PLAN.md section 4 and created the `test/data-isolation` branch. It's based on `test/dashboard-stat`, because that's where Vitest is set up.
- Wrote `supabase/data-isolation.test.ts`, which runs against a real Supabase project with real row-level security, not mocks:
  - **Given** User A has one card and two purchases (one starred), and User B has just signed up,
  - **when** User B opens the purchases list, the cards list, the Starred list, and User A's purchase and card by direct link,
  - **then** the lists are empty and the direct links find nothing, which is what makes the app show "Not found."
- Added checks beyond the plan: User B can't edit or delete User A's purchase, can't add a purchase on User A's card, and can't star User A's purchase.
- Added a first check that User A **can** see their own data. Without it, a broken setup that returned nothing for anyone would pass every "User B sees nothing" check.
- Made it safe for my real data: the test only reads `TEST_` settings from `.env.test.local`, which is gitignored, so it can't pick up the real project from `.env.local`.

## First real run

I created the test project, sent Claude Code its link and publishable key, and it saved them in `.env.test.local` (gitignored) and confirmed all 5 tables existed. I started the first run myself, because it signs up two accounts on a hosted service. All 12 tests passed the first time (10 for isolation, 2 for the dashboard).

## What went wrong / caught along the way

- Local Supabase wasn't an option because Docker isn't installed, so the test couldn't be run until my test project exists.
