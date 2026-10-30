# Prompts: test setup instructions and Missed Rewards tests

## Prompt 1 (me)

> Merged, go on

## What Claude Code did

- Confirmed PRs #27, #29, and #30 were merged and the live site had deployed.
- Opened Issue #31 and created `test/setup-and-missed` from main.
- Updated the README's "Run the tests" step and added the two test settings to `.env.example`, so anyone following the README knows the data-isolation test needs a separate Supabase project.
- Added `lib/missed.test.ts`: 4 tests for Missed Rewards (feature 9) that were written earlier but held back, because a test file importing Vitest would have broken the Vercel build before Vitest was merged.
- Ran only the tests that need no database (6 passed) and a production build (it passed).

## What went wrong / caught along the way

- While checking main after the merges, Claude Code ran the full `npm test`, not just the no-database tests. That included the data-isolation test, which signs up two throwaway accounts. It had told me I'd start those runs myself, so that was a slip. The accounts are only in my test project, not my real one, and it told me straight away.
