import { rewardPercent, type Card } from "./cards";
import type { Category } from "./categories";

// Best card for a category (feature 8), as a plain function. Cards are compared
// by what a dollar actually earns: "% back" for cash back, and points per dollar
// × the point value for points cards, so the two kinds compare fairly.

export type BestCard = {
  // Every card tied for the top, in the order given.
  cards: Card[];
  // What the best card(s) earn, e.g. 5 means 5% back. 0 with no cards.
  percent: number;
};

// Rates like 1.5 × 1.25¢ can come out as 1.8750000000000002, so "tied" means
// equal to a ten-thousandth of a percent.
const TIE_TOLERANCE = 0.0001;

// Only open cards count: a closed card can't be used at checkout.
export function bestCardFor(cards: Card[], category: Category): BestCard {
  const open = cards.filter((card) => card.isActive);
  if (open.length === 0) return { cards: [], percent: 0 };

  const percent = Math.max(...open.map((card) => rewardPercent(card, category)));
  return {
    cards: open.filter((card) => percent - rewardPercent(card, category) < TIE_TOLERANCE),
    percent,
  };
}
