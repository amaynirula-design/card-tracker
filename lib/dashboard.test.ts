import { describe, expect, it } from "vitest";
import type { Card } from "./cards";
import { dashboardStats, formatPercent, inPeriod, type PurchaseForStats } from "./dashboard";
import { formatMoney } from "./format";

// Test 2 from PLAN.md section 4: the dashboard's total rewards earned.
//
// Given a user has one cash back card earning 3% on Dining and 1% on
// Everything Else, and logs a $100 Dining purchase and a $50 Groceries
// purchase this month, when they open the dashboard, then total spend shows
// $150.00, total rewards earned shows $3.50, and effective reward rate shows 2.33%.
//
// It runs the same functions the Dashboard page uses, with no database.

const TODAY = "2026-10-29";

const cashBackCard: Card = {
  id: 1,
  name: "Cash Back Card",
  rewardType: "cashback",
  pointValueCents: 1,
  annualFee: 0,
  isActive: true,
  // Groceries has no rate of its own, so it falls back to Everything Else.
  rates: { Dining: 3, "Everything Else": 1 },
};

const purchasesThisMonth: PurchaseForStats[] = [
  { amount: 100, category: "Dining", date: "2026-10-12", card: cashBackCard },
  { amount: 50, category: "Groceries", date: "2026-10-20", card: cashBackCard },
];

describe("dashboard stats (PLAN.md test 2)", () => {
  it("shows $150.00 spent, $3.50 earned, and a 2.33% effective rate", () => {
    const stats = dashboardStats(inPeriod(purchasesThisMonth, "month", TODAY));

    // $100 + $50
    expect(formatMoney(stats.totalSpend)).toBe("$150.00");
    // $100 × 3% = $3.00 on Dining, plus $50 × 1% = $0.50 on Groceries
    expect(formatMoney(stats.totalRewards)).toBe("$3.50");
    // $3.50 ÷ $150.00 = 2.333…%
    expect(formatPercent(stats.effectiveRate)).toBe("2.33%");
  });

  it("leaves out purchases from other months when showing this month", () => {
    const lastMonth: PurchaseForStats = {
      amount: 500,
      category: "Dining",
      date: "2026-09-30",
      card: cashBackCard,
    };
    const stats = dashboardStats(inPeriod([...purchasesThisMonth, lastMonth], "month", TODAY));

    expect(formatMoney(stats.totalSpend)).toBe("$150.00");
    expect(formatMoney(stats.totalRewards)).toBe("$3.50");
  });
});
