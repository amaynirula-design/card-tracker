# Prompts: test 2, dashboard stat (total rewards earned)

## Prompt 1 (me)

> i have merged the PR but lets take a break. i am in class and cant take ss's rn

Claude Code offered to prepare the test while I was in class, so it would be ready for my screenshots later.

## Prompt 2 (me)

> ok elts prep the test then

## What Claude Code did

- Opened Issue #19 with the test from PLAN.md section 4 and created the `test/dashboard-stat` branch from main.
- Installed **Vitest** (PLAN.md section 5) and added `npm test`, which prints each test's name.
- Wrote `lib/dashboard.test.ts`, which is PLAN.md's scenario word for word:
  - **Given** one cash back card earning 3% on Dining and 1% on Everything Else, with a $100 Dining purchase and a $50 Groceries purchase this month,
  - **when** the dashboard's numbers are worked out,
  - **then** total spend is **$150.00**, total rewards earned is **$3.50**, and the effective rate is **2.33%**.
  - A second check: a $500 purchase from last month is left out of "this month".
- The test calls the **same functions the Dashboard page uses** (`inPeriod`, `dashboardStats`, `formatMoney`, `formatPercent`), with no database. That's why feature 7 kept the math in plain functions.
- Ran it: 2 tests passed.
- **Rehearsed the red-then-green run** so it goes quickly when I'm back:
  - It temporarily broke the "fallback" rule in `lib/cards.ts`, so a category without its own rate earned 0% instead of the card's Everything Else rate.
  - Both tests failed with **Expected "$3.50", Received "$3.00"**: the Groceries purchase earned nothing.
  - It undid the change and the tests passed again. Nothing broken was committed.

## What went wrong / caught along the way

- The first run printed a yellow warning about the config file's format. Claude Code renamed `vitest.config.ts` to `vitest.config.mts` so the output (and my screenshots) are clean.

## The red-then-green run

Later, with time for screenshots, I ran `npm test` myself:

- Before the run, Claude Code brought this branch up to date with main, so the test ran against the finished app (all 10 features).
- **Red:** Claude Code made the same temporary change to `lib/cards.ts`. I ran the test and took a screenshot (`docs/screenshots/test-2-red.png`): 2 failed, Expected "$3.50", Received "$3.00".
- **Green:** Claude Code undid the change with `git checkout`, I ran it again and took a screenshot (`docs/screenshots/test-2-green.png`): 2 passed. The broken version was never committed.
- A small mix-up: I clicked "Ran it, check it" from the step before, so Claude Code read my terminal, saw only the earlier passing run, and told me the failing run hadn't happened yet instead of assuming it had.
