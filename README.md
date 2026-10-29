# Card Tracker

Know which credit card to use for every purchase, and see what your cards actually earn you.

**Live app:** https://card-tracker-swart-five.vercel.app

Card Tracker is a web app for people who carry several credit cards. You add your cards and what they earn in each spending category, log your purchases, and the app works out your rewards. It tells you which card to use for each kind of purchase, and how much you left on the table by using the wrong one. It's built mobile-first, in the style of an Apple app, with light and dark mode.

Built for Intro to Coding (UC Berkeley Haas, Fall 2026). The design and plan are in [PLAN.md](PLAN.md); the database is described in [schema.md](schema.md).

## What it does

| Feature | |
|---|---|
| **Sign up, log in, log out** | Email and password. Each person sees only their own data. |
| **My cards** | Name, cash back or points, what a point is worth to you, annual fee, and a rate for each category. Close a card to keep its history. |
| **Card presets** | Pick from 15 common cards (Chase, Amex, Capital One, Citi, Apple Card, …) to fill in the rates, then edit anything. |
| **Purchases** | Add, list, open, edit, and delete, with an "are you sure?" alert. Each shows the rewards it earned. |
| **Validation** | Friendly messages for anything missing, or an amount of $0 or less. |
| **Stars** | Star a purchase to come back to (a return, a charge to dispute) and see them all in **Starred**. |
| **Find things** | Search merchants, filter by card or category, and sort by newest, oldest, or largest. |
| **Dashboard** | Rewards earned, total spend, effective reward rate, and a rewards-by-card chart, for this month or all time. |
| **Best card** | Pick a category to see which of your cards earns the most for it (ties shown, points valued at your point value). |
| **Missed rewards** | Each purchase shows how much more your best card would have earned; the dashboard totals it and tells you the one change that would save the most. |

No card numbers are ever stored. A card is just a name you choose.

## Tools

- **[Next.js](https://nextjs.org) 16** (React 19, App Router, TypeScript): pages and server logic in one project
- **[Tailwind CSS](https://tailwindcss.com) 4**: styling, with light and dark design tokens in `app/globals.css`
- **[Supabase](https://supabase.com)**: Postgres database, email/password sign-in, and row-level security so each user only sees their own rows
- **[Vercel](https://vercel.com)**: hosting; every merge to `main` deploys the live app automatically
- **[Recharts](https://recharts.org)**: the dashboard chart
- **[Vitest](https://vitest.dev)**: tests
- **[Claude Code](https://claude.com/claude-code)**: my coding agent. Every change went Issue → branch → pull request, which I reviewed and merged. My prompts and a summary of its work for each feature are in [`prompts/`](prompts/).

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer and a free [Supabase](https://supabase.com) project.

1. **Get the code**

   ```bash
   git clone https://github.com/amaynirula-design/card-tracker.git
   cd card-tracker
   npm install
   ```

2. **Set up the database.** In your Supabase project, open **SQL Editor** and run each file in [`supabase/migrations/`](supabase/migrations/) **in date order** (users, cards, purchases, stars). For instant sign-up, turn off email confirmation in **Authentication → Sign In / Providers → Email**.

3. **Connect the app.** Copy `.env.example` to `.env.local` and fill in your project's URL and publishable key (**Project Settings → API**). `.env.local` is never committed.

4. **Start it**

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000 and create an account.

5. **Run the tests**

   ```bash
   npm test
   ```

## Where things are

| Path | What's there |
|---|---|
| `app/(auth)/` | Sign up and log in |
| `app/(app)/` | The signed-in screens: purchases, starred, dashboard, cards, account |
| `app/components/` | Shared pieces: buttons, grouped lists, forms, the tab bar, the "are you sure?" alert |
| `lib/` | Plain functions with no database: rewards math, dashboard stats, best card, missed rewards, card presets, validation |
| `lib/supabase/`, `proxy.ts` | Connecting to Supabase and keeping signed-out visitors out of private pages |
| `supabase/migrations/` | The SQL for every table and privacy rule |
| `prompts/` | The prompt log for each pull request |
