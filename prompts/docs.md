# Prompts: docs (schema.md and README)

## Prompt 1 (me)

> Merged, go on

(After merging feature 10, the last feature.)

## What Claude Code did

- Opened Issue #26 and created `docs/schema-readme` from main.
- Wrote **schema.md** from the actual SQL in `supabase/migrations/`, not from memory:
  - All 5 tables (users, cards, reward_rates, purchases, stars) with every column and its real type.
  - A diagram, and the relationships in plain English: users → cards, cards → reward_rates, users → purchases, cards → purchases (one-to-many), and users ↔ purchases through stars (many-to-many).
  - The privacy rules (row-level security) table by table.
  - What's calculated rather than stored (rewards, missed rewards, best card), and why presets aren't a table.
  - **A "Compared to the plan" section.** The tables, relationships, and rules match PLAN.md section 3. The differences are the plan's plain-English types becoming real database types (uuid ids so users match Supabase Auth, exact `numeric` for money, timestamps) plus extra safety rules: one rate per category, database checks behind the friendly messages, and cards with purchases can't be deleted.
- Rewrote the one-line **README.md**:
  - What the app does and the live URL.
  - Every feature in one table.
  - The tools, including Claude Code and the Issue → branch → PR workflow.
  - Step-by-step "run it locally" (with the SQL files in order), and where things are in the code.
- Added **`.env.example`** with placeholder values, so the "run it locally" steps have a file to copy. The real `.env.local` with my keys stays out of git (checked with `git check-ignore`).

## What went wrong / caught along the way

- The `.gitignore` already allowed a `.env.example`, but the file had never been created. The README's setup steps would have pointed to a file that didn't exist.
- `npm test` in the README only works once the test PR (Vitest) is merged. That PR is waiting on my red/green screenshots.
