import { bestCardFor } from "./best-card";
import type { Card } from "./cards";
import type { Category } from "./categories";
import { purchaseRewards } from "./rewards";

// Missed rewards (feature 9), as plain functions with no database: how much
// more a purchase would have earned on the best card for its category.
// "Best" follows feature 8: open cards only, points valued at the point value.

export type MissedForPurchase = {
  // Dollars left on the table; 0 when the card used was the best (or better).
  missed: number;
  // What the best card(s) would have earned on this purchase.
  bestRewards: number;
  // The card(s) that would have earned the most. Empty if there are no open cards.
  bestCards: Card[];
};

// Below half a cent isn't worth calling "missed" (and hides rounding noise).
const MIN_MISSED = 0.005;

export function missedFor(
  purchase: { amount: number; category: Category; card: Card },
  cards: Card[],
): MissedForPurchase {
  const best = bestCardFor(cards, purchase.category);
  const earned = purchaseRewards(purchase.amount, purchase.card, purchase.category);
  const bestRewards = (purchase.amount * best.percent) / 100;
  const missed = bestRewards - earned;
  return {
    // A closed card that earned more than any open card isn't a miss.
    missed: missed >= MIN_MISSED ? missed : 0,
    bestRewards,
    bestCards: best.cards,
  };
}

export type MissedSummary = {
  totalMissed: number;
  // How many purchases weren't on the best card.
  missedCount: number;
  // The category that cost the most, and the card to use there instead.
  biggest: { category: Category; missed: number; bestCards: Card[] } | null;
};

export function missedSummary(
  purchases: { amount: number; category: Category; card: Card }[],
  cards: Card[],
): MissedSummary {
  let totalMissed = 0;
  let missedCount = 0;
  const byCategory = new Map<Category, number>();

  for (const purchase of purchases) {
    const { missed } = missedFor(purchase, cards);
    if (missed === 0) continue;
    totalMissed += missed;
    missedCount += 1;
    byCategory.set(purchase.category, (byCategory.get(purchase.category) ?? 0) + missed);
  }

  let biggest: MissedSummary["biggest"] = null;
  for (const [category, missed] of byCategory) {
    if (!biggest || missed > biggest.missed) {
      biggest = { category, missed, bestCards: bestCardFor(cards, category).cards };
    }
  }

  return { totalMissed, missedCount, biggest };
}
