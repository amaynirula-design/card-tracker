# Prompts: plan (PR #1)

## Prompt 1 (me)

> Read CLAUDE.md and PLAN.md in this folder. Then:
>
> 1. Set this folder up as a git repo and create a new public GitHub repo called `card-tracker` under my account `amaynirula-design`. The first commit on main should contain ONLY a one-line README.md. Do not commit CLAUDE.md or PLAN.md to main.
> 2. Ask me the open questions listed in CLAUDE.md, and confirm the PLAN.md changes it lists before applying them.
> 3. Open GitHub Issue #1 for the plan, create a branch `plan`, add PLAN.md and CLAUDE.md, save this prompt in `prompts/plan.md`, and open a PR that says `closes #1`. Don't merge it; I'll merge it myself.

## What Claude Code did

- There was no `PLAN.md` in the folder; the file was named `PLAN_1.md`. Claude Code read it and later asked me how to handle it. I chose to rename it to `PLAN.md` (the name CLAUDE.md uses).
- Ran `git init`, committed only a one-line `README.md` to main, and created the public repo `amaynirula-design/card-tracker` with the GitHub CLI. CLAUDE.md and the plan were left out of main.
- Asked me the four open questions from CLAUDE.md. My answers:
  - App name: **Card Tracker**.
  - Custom features: Best card for a category, Missed rewards, and **Card presets** instead of CSV import.
  - Design: I said to change it. When asked what I wanted, I answered: "It's up to you to decide on what the design should look like. I just want it to look very sophisticated. It should have a light/dark option, and it should look very much like how Apple does it."
  - Supabase: no project created yet.
- For the five PLAN.md changes listed in CLAUDE.md, I asked "what do you suggest?" Claude Code recommended all five and gave a reason for each (for example, the old section 5 line said I'd used Claude Code "all semester," which wasn't true). I said yes to all five.
- Claude Code suggested two extras and I accepted both: a rule that a star can only point at my own purchases, and replacing CLAUDE.md's open questions with a "Decisions made" list.

## Changes in PLAN.md

- Removed the DRAFT and DECIDE comments; kept the closing Plan vs. Reality reminder (my choice).
- Section 2: feature 10 is now Card presets.
- Section 3: users is now our own table, filled by a signup trigger; added the row-level-security rules (purchases can only use my own cards, stars can only point at my own purchases); said where presets live.
- Section 5: true coding-agent line; removed Papa Parse; sign-up line mentions the trigger.
- Section 6: rewritten as an Apple-style design with System / Light / Dark modes. Claude Code checked the old teal (#00A19C) for contrast: it's only 3.2:1 on white, so light mode uses a deeper #007C77 (5.1:1) and dark mode keeps #00A19C.
- Section 7: presets are now the riskiest feature and the first cut; added the capped/rotating-categories line.
