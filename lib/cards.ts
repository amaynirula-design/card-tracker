import { CATEGORIES, FALLBACK_CATEGORY, type Category } from "./categories";

// Plain types and helpers for cards. No database code here, so pages, forms,
// and tests can all use them.

export type RewardType = "cashback" | "points";

export type Card = {
  id: number;
  name: string;
  rewardType: RewardType;
  // What one point is worth, in cents. Always 1 for cash back cards.
  pointValueCents: number;
  annualFee: number;
  isActive: boolean;
  // Only the categories the card has its own rate for.
  rates: Partial<Record<Category, number>>;
};

export const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  cashback: "Cash back",
  points: "Points",
};

// The card's rate for a category, falling back to its Everything Else rate.
export function rateFor(card: Card, category: Category): number {
  return card.rates[category] ?? card.rates[FALLBACK_CATEGORY] ?? 0;
}

// Cents earned per dollar spent in a category, i.e. the "% back" in dollars.
// Cash back: the rate itself. Points: points per dollar × cents per point.
export function rewardPercent(card: Card, category: Category): number {
  const rate = rateFor(card, category);
  return card.rewardType === "cashback" ? rate : rate * card.pointValueCents;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// "3%" for cash back, "3×" for points.
export function formatRate(card: Pick<Card, "rewardType">, rate: number): string {
  return card.rewardType === "cashback" ? `${formatNumber(rate)}%` : `${formatNumber(rate)}×`;
}

// A one-line summary for card lists: the best bonus categories, or the base rate.
export function rateSummary(card: Card): string {
  const base = rateFor(card, FALLBACK_CATEGORY);
  const bonuses = CATEGORIES.filter(
    (category) => category !== FALLBACK_CATEGORY && (card.rates[category] ?? 0) > base,
  ).sort((a, b) => (card.rates[b] ?? 0) - (card.rates[a] ?? 0));

  if (bonuses.length === 0) return `${formatRate(card, base)} on everything`;
  const shown = bonuses.slice(0, 2).map((category) => `${formatRate(card, card.rates[category]!)} ${category}`);
  const more = bonuses.length > 2 ? ` +${bonuses.length - 2} more` : "";
  return shown.join(", ") + more;
}
