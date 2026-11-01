import { bestCardFor } from "./best-card";
import { rewardPercent, type Card } from "./cards";
import { CATEGORIES, type Category } from "./categories";

// The numbers behind the Best Card route map, as plain functions. A category is
// the origin, and each open card is a stop along one axis of "% back".

export type RouteStop = {
  card: Card;
  // What a dollar earns on this card in this category, e.g. 4 means 4% back.
  percent: number;
  winner: boolean;
};

// The axis always starts at 0 and ends here. It doesn't change from one category
// to the next, so a stop's distance always means the same thing and two
// categories can be compared by eye. It only depends on the cards you carry.
const SHORTEST_SCALE = 5;

export function routeScale(cards: Card[]): number {
  const percents = cards
    .filter((card) => card.isActive)
    .flatMap((card) => CATEGORIES.map((category) => rewardPercent(card, category)));
  return Math.max(SHORTEST_SCALE, Math.ceil(Math.max(0, ...percents)));
}

// Every open card for this category, ranked, best first.
export function routeStops(cards: Card[], category: Category): RouteStop[] {
  const best = bestCardFor(cards, category);
  return cards
    .filter((card) => card.isActive)
    .map((card) => ({
      card,
      percent: rewardPercent(card, category),
      winner: best.cards.includes(card),
    }))
    .sort((a, b) => b.percent - a.percent);
}

// Stops can land close together, so their labels go on separate rows. Given each
// label's center, in the order they should get first pick, this returns its row,
// or null when no row has room (every card is still named in the list below the map).
export function labelRows(centers: number[], labelWidth: number, rowCount: number): (number | null)[] {
  const placed: number[][] = Array.from({ length: rowCount }, () => []);
  return centers.map((center) => {
    const row = placed.findIndex((taken) => taken.every((other) => Math.abs(other - center) >= labelWidth));
    if (row === -1) return null;
    placed[row].push(center);
    return row;
  });
}
