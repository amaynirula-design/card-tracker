import type { Card } from "./cards";
import type { Category } from "./categories";
import { purchaseRewards } from "./rewards";

// The dashboard's numbers (feature 7), as plain functions with no database, so
// the dashboard test (PLAN.md section 4) can check them directly.

export type Period = "month" | "all";

// Just what the math needs from a purchase.
export type PurchaseForStats = {
  amount: number;
  category: Category;
  // "2026-10-29"
  date: string;
  card: Card;
};

export type CardTotal = {
  cardId: number;
  name: string;
  spend: number;
  rewards: number;
};

export type DashboardStats = {
  purchaseCount: number;
  totalSpend: number;
  totalRewards: number;
  // Rewards as a percent of spend, e.g. 2.33 means 2.33%. 0 when nothing was spent.
  effectiveRate: number;
  // Rewards per card, most first.
  byCard: CardTotal[];
};

// Keeps the purchases in the period. "This month" is the calendar month of
// `today` ("2026-10-29" → everything from "2026-10-01" to "2026-10-31").
export function inPeriod<T extends { date: string }>(purchases: T[], period: Period, today: string): T[] {
  if (period === "all") return purchases;
  const month = today.slice(0, 7);
  return purchases.filter((purchase) => purchase.date.slice(0, 7) === month);
}

export function dashboardStats(purchases: PurchaseForStats[]): DashboardStats {
  let totalSpend = 0;
  let totalRewards = 0;
  const cards = new Map<number, CardTotal>();

  for (const purchase of purchases) {
    const rewards = purchaseRewards(purchase.amount, purchase.card, purchase.category);
    totalSpend += purchase.amount;
    totalRewards += rewards;

    const total = cards.get(purchase.card.id) ?? {
      cardId: purchase.card.id,
      name: purchase.card.name,
      spend: 0,
      rewards: 0,
    };
    total.spend += purchase.amount;
    total.rewards += rewards;
    cards.set(purchase.card.id, total);
  }

  return {
    purchaseCount: purchases.length,
    totalSpend,
    totalRewards,
    effectiveRate: totalSpend > 0 ? (totalRewards / totalSpend) * 100 : 0,
    byCard: [...cards.values()].sort((a, b) => b.rewards - a.rewards),
  };
}

// 2.3333 → "2.33%"
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
