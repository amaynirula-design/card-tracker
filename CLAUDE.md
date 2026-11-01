# Card Tracker: project context for Claude Code

This file is the handoff for anyone (human or agent) working in this repo. Read it and PLAN.md before doing anything.

## What this is

A solo web app for my Intro to Coding class (UC Berkeley Haas). It tracks my credit cards, the purchases I make, and the rewards I earn, and tells me which card to use for each spending category. The full design is in PLAN.md.

I'm the product owner and the approver. You (the agent) do most of the building, but every decision about what to build is mine. If something in PLAN.md is unclear or you think it should change, ask me first. Don't quietly change the design.

**Due: Wed Nov 4, 2026, before class.** Target: all features merged and live by Sat Oct 31, so I have time for the "stranger test" and a fix PR.

## Hard rules from the assignment (these are graded)

1. **Nothing is committed directly to main.** Every change goes Issue → feature branch → pull request → I merge it. This includes this file and PLAN.md.
2. **The feature loop, for every feature:**
   - Open a GitHub Issue with the feature's user story copied from PLAN.md section 2.
   - Create a branch from main named for the feature (e.g. `feature/stars`).
   - Build only that feature on the branch. One feature per PR; small PRs.
   - Save my key prompts AND a short summary of your responses in `prompts/<feature>.md` on the same branch. Log honestly, including when something went wrong. I'll quote these in my reflection.
   - Push and open a PR into main. The description says what changed and includes `closes #N`.
   - I merge it myself. Don't merge for me.
   - After merge, the live URL (Vercel) must update.
   If you can't create Issues or PRs from here (for example the GitHub CLI isn't set up), tell me and I'll do those steps on github.com.
3. **PLAN.md is PR #1** and must be merged before any feature PR.
4. **Never rewrite the original plan.** At the end, we only ADD a "Plan vs. Reality" table at the bottom of PLAN.md:
   `| Planned feature | Shipped / Changed / Cut | Status (Done/Backlogged) | Learning | What changed and why (one line) |`
5. **Minimum 9 merged PRs** (plan + 8 features). We plan for more.
6. **At least 5 real entries** of my own data on the live app by the due date. No placeholder text.

## Required ("spine") features

1. Sign up / log in / log out from inside the app. Every account is a row in OUR `users` table. Each user sees only their own data.
2. Data model: `users` + at least 2 of our own tables, connected by a relationship.
3. Full CRUD on purchases: add, list, detail page, edit, delete with an "are you sure?" confirmation.
4. Validation: required fields can't be blank, with a friendly message.
5. Stars: a single `stars` junction table (user_id + purchase_id). A "Starred" view.
6. Find things: search or filter, plus sort.
7. Dashboard: at least one chart and 2–3 summary stats computed from real data.

Plus 3 features of my own (PLAN.md section 2, items 8–10): Best card for a category, Missed rewards, Card presets.

## Tests (two required, in Vitest)

- **Data isolation:** User B can't see User A's purchases or cards, including by direct link to a detail page.
- **Dashboard stat:** the total-rewards / effective-rate numbers calculate correctly (exact scenario in PLAN.md section 4).

For each test's PR I need: a plain-English explanation of what it checks; a "red then green" run (you temporarily break the feature, I screenshot the failing test, you revert, I screenshot it passing); and one sentence on a real change that would break it. Keep the rewards math in plain functions so the dashboard test doesn't need a database. The isolation test needs real row-level security, so run it against Supabase (a separate test project or local Supabase), not mocks.

## Stack (from PLAN.md section 5)

Next.js, Supabase (Postgres + Auth, email/password), Vercel hosting with auto-deploy on merge to main, Recharts, Vitest.

Secrets: never commit keys. The Supabase URL and anon key go in `.env.local` (gitignored) and in Vercel's environment variables. I enter the service-role key myself if one is needed.

## Decisions made (Oct 28, 2026, before PR #1)

- App name: **Card Tracker**.
- Custom features: Best card for a category, Missed rewards, **Card presets** (replaced CSV import; no Papa Parse).
- Design: Apple-style, sophisticated, with System / Light / Dark modes. Teal accent `#00A19C` in dark mode, `#007C77` in light mode (for contrast on white). Details in PLAN.md section 6.
- PLAN.md changes applied: public `users` table filled by a signup trigger; true coding-agent line in section 5; RLS so a purchase can only use my own cards and a star can only point at my own purchases; risk line on capped/rotating cards; DRAFT/DECIDE comments removed.
- Supabase: no project yet. I need to create one and share the URL + anon key before feature 1.

## Decisions made (Oct 31, 2026, full redesign)

- Design: the Apple style above is replaced by **System Map**, a 1960s airline route map world, built with the Impeccable plugin. Ultramarine ground, pale land panels, Archivo with its width axis, three-letter codes. Yellow only means the winning route; orange only means missed rewards. One appearance, no light/dark switch. `DESIGN.md` is the design system; `PRODUCT.md` is the product record. PLAN.md section 6 stays as written; the change is in Plan vs. Reality.
- Best Card (`/cards/best`) is the first tab and where logging in lands.

## Demo (Wed Nov 4, 5 min hard stop)

Live sign-up of a new account, log in to my real account and show real data, dashboard and stars, let the class pick something (star / search / add), answer one question. The app needs to be fast and reliable for a brand-new account, with no setup friction.

## Other deliverables we'll write later

- `schema.md` (root): every table, columns, and relationships in plain English or a diagram; at least 4 tables (users, purchases, cards/reward_rates, stars). Compare to PLAN.md section 3.
- `README.md`: what the app does, live URL, tools used, how to run it locally.
