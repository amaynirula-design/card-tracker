# Prompts: feature 7, dashboard

## Prompt 1 (me)

> Merged, go on

## What Claude Code did

Before building, it flagged a problem with the plan: the dashboard shows "total spend **this month**", but the demo is on **Wed Nov 4**, when "this month" would only include Nov 1–4. It asked me which period to show:

- This month + All time switch (recommended)
- This month only, as planned
- Pick any month

## Decision (me)

I chose **This month + All time switch**. It's a small addition to the plan: the dashboard still opens on This Month, as PLAN.md says, and in the demo I can tap All Time to show everything.

## What Claude Code did next

- Opened Issue #17 with the feature 7 user story and created `feature/dashboard` from main.
- Installed **Recharts** (the chart library in PLAN.md section 5).
- Wrote the dashboard math as plain functions in `lib/dashboard.ts`, with no database code, so the dashboard test (PLAN.md section 4) can check it directly:
  - `inPeriod`: keeps this calendar month's purchases, or all of them.
  - `dashboardStats`: total spend, total rewards (using the rewards math from PLAN.md), effective rate (rewards ÷ spend), and rewards per card.
- "This month" uses **California time**. The server runs on UTC, which would start November 7–8 hours early here.
- Built the **Dashboard** tab (between Starred and Cards, as in PLAN.md):
  - A This Month / All Time switch across the top, like the D / W / M / Y switch in the Health app.
  - A large **Rewards earned** tile with "on $X of spending" underneath.
  - **Total spend** and **Effective rate** tiles side by side.
  - A **Rewards by card** bar chart with rounded teal bars, no gridlines, and the dollar amount at the end of each bar. The bars run sideways so card names fit on a phone.
  - Friendly empty states ("Nothing yet this month" / "No purchases yet").

## How it was tested

On my account, with temporary test data that was deleted afterwards. It recreated **the exact scenario from the dashboard test in PLAN.md section 4**: a cash back card earning 3% on Dining and 1% on everything else, with a $100 Dining purchase and a $50 Groceries purchase this month.

- **This Month** showed **$150.00** total spend, **$3.50** rewards earned, and **2.33%** effective rate, exactly what the plan says it should.
- It also added a points card (1.5¢ a point, 4× Dining) with a $20 Dining purchase in September:
  - This Month didn't change.
  - **All Time** showed $170.00 spent and $4.70 earned ($3.50 + 20 × 4 × 1.5¢ = $1.20), at 2.76%.
  - The chart showed two bars.
- Checked at phone and desktop width, in dark and light mode. After deleting the test data, the empty state showed.

## What went wrong / caught along the way

- **The period switch didn't fit at first.** Next to the "October 2026 · 2 purchases" label, the switch squeezed "This Month" and "All Time" onto two lines each. Fixed by giving the switch its own full-width row under the title.
- A light-mode screenshot taken mid-transition looked like some labels had disappeared. A second screenshot after the transition showed everything was fine.

## Next

The **dashboard test** (Vitest, PLAN.md section 4) gets its own PR right after this one, with the red-then-green run and screenshots.
