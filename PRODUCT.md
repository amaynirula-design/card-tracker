# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Points enthusiasts: people who hold several credit cards, know what a multiplier is, and care about getting the best return on each purchase. They use the app on a phone, usually right before or right after paying. The app is also a graded class project, demoed live on Nov 4, 2026.

## Product Purpose

Card Tracker tells you which of your cards earns the most for a spending category, records your purchases, and shows what your cards really earned. Success is using the right card at checkout and seeing what the wrong card cost you.

## Positioning

It's built around your own wallet. It compares only the cards you hold, using your own point values, and it turns every purchase into what you earned against what you could have earned.

## Operating Context

- Mostly one-handed on a phone, at a register or just after paying.
- The first question after logging in is which card to use.
- Logging a purchase takes a few fields and should take seconds.
- Rewards are calculated when needed, never stored, so editing a card updates every purchase.

## Capabilities and Constraints

- Sign up, log in, and log out. Each person sees only their own data.
- Cards: add from 32 presets or by hand, edit, close, and delete. Rates are simplified to one rate per category.
- Nine fixed categories: Dining, Groceries, Gas, Travel, Online Shopping, Streaming, Drug Stores, Transit, Everything Else.
- Purchases: add, list, detail, edit, delete with confirmation, search, filter, and sort. The category can be suggested from the merchant.
- Stars and a Starred view.
- Best card for a category, with ties shown.
- Dashboard: a chart plus total spend, rewards earned, effective rate, and missed rewards, for this month or all time.
- No card numbers, expiry dates, CVVs, or account numbers are stored. Issuer logos aren't used.
- Next.js, Tailwind, Recharts, Supabase, and Vercel. Everything must stay fast and reliable for a live demo with a brand-new account.

## Brand Commitments

- The name is Card Tracker.
- It must not look like a bank, and it must not look like a generic AI template.
- Phone-first.

## Evidence on Hand

- Live app: https://card-tracker-swart-five.vercel.app
- Real data: the owner's own cards and purchases.
- Stranger test feedback is logged in `prompts/stranger-test-rates.md`, `prompts/more-card-presets.md`, and `prompts/category-suggestions.md`.
- There are no testimonials, customer counts, or benchmarks. Don't invent any.

## Product Principles

- Answer first: the right card comes before everything else.
- Show the math: rates and point values are visible, and enthusiasts can correct them.
- Respect the expert: use the language of multipliers and point values without over-explaining.
- Be honest about simplification: when a rate is approximate, say so.

## Accessibility & Inclusion

Keep the current standard: 4.5:1 text contrast, text that scales to 200%, full keyboard use, labels on icon-only controls, meaning that isn't carried by color alone, and support for Reduce Motion.
