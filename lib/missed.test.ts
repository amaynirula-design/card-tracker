import { describe, expect, it } from "vitest";
import type { Card } from "./cards";
import { earnedShare, missedFor, missedSummary } from "./missed";

// Feature 9: how much more the best card would have earned.

const card = (id: number, rates: Card["rates"], extra: Partial<Card> = {}): Card => ({
  id,
  name: `Card ${id}`,
  rewardType: "cashback",
  pointValueCents: 1,
  annualFee: 0,
  isActive: true,
  rates,
  ...extra,
});

const diningCard = card(1, { Dining: 3, "Everything Else": 1 });
const flatCard = card(2, { "Everything Else": 1.5 });
const cards = [diningCard, flatCard];

describe("missed rewards", () => {
  it("is the best card's rewards minus what the card used earned", () => {
    // $100 Dining on the 1.5% card: earned $1.50, best (3%) would be $3.00.
    const result = missedFor({ amount: 100, category: "Dining", card: flatCard }, cards);
    expect(result.missed).toBeCloseTo(1.5);
    expect(result.bestCards).toEqual([diningCard]);
  });

  it("is zero when the best card was used", () => {
    expect(missedFor({ amount: 100, category: "Dining", card: diningCard }, cards).missed).toBe(0);
  });

  it("never counts a closed card as the best", () => {
    const closed = card(3, { "Everything Else": 10 }, { isActive: false });
    const result = missedFor({ amount: 100, category: "Gas", card: flatCard }, [...cards, closed]);
    expect(result.missed).toBe(0);
  });

  it("adds up a month and names the costliest category", () => {
    const summary = missedSummary(
      [
        { amount: 100, category: "Dining", card: flatCard }, // missed $1.50
        { amount: 40, category: "Groceries", card: diningCard }, // missed $0.20
        { amount: 50, category: "Dining", card: diningCard }, // missed $0
      ],
      cards,
    );
    expect(summary.totalMissed).toBeCloseTo(1.7);
    expect(summary.missedCount).toBe(2);
    expect(summary.biggest?.category).toBe("Dining");
    expect(summary.biggest?.bestCards).toEqual([diningCard]);
  });
});

describe("the dashboard ring", () => {
  it("is the share of possible rewards you earned", () => {
    expect(earnedShare(3, 1)).toBe(75);
  });

  it("is full when nothing was missed", () => {
    expect(earnedShare(3.5, 0)).toBe(100);
  });

  it("is empty when nothing could have been earned", () => {
    expect(earnedShare(0, 0)).toBe(0);
  });
});
