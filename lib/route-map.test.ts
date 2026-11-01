import { describe, expect, it } from "vitest";
import { topRate, type Card } from "./cards";
import { labelRows, routeScale, routeStops } from "./route-map";

const card = (id: number, overrides: Partial<Card> = {}): Card => ({
  id,
  name: `Card ${id}`,
  rewardType: "cashback",
  pointValueCents: 1,
  annualFee: 0,
  isActive: true,
  rates: { "Everything Else": 1 },
  ...overrides,
});

describe("top rate", () => {
  it("compares points cards by what the points are worth", () => {
    const points = card(1, {
      rewardType: "points",
      pointValueCents: 1.5,
      rates: { Dining: 4, "Everything Else": 1 },
    });
    expect(topRate(points)).toEqual({ category: "Dining", percent: 6 });
  });
});

describe("route map", () => {
  it("ranks open cards, best first, and leaves out closed ones", () => {
    const low = card(1);
    const high = card(2, { rates: { Dining: 3, "Everything Else": 1 } });
    const closed = card(3, { isActive: false, rates: { Dining: 9, "Everything Else": 1 } });
    const stops = routeStops([low, high, closed], "Dining");
    expect(stops.map((stop) => stop.card.id)).toEqual([2, 1]);
    expect(stops.map((stop) => stop.winner)).toEqual([true, false]);
  });

  it("marks every card tied for the top as a winner", () => {
    const stops = routeStops([card(1), card(2)], "Gas");
    expect(stops.every((stop) => stop.winner)).toBe(true);
  });

  it("keeps one scale across categories, set by the best rate you carry", () => {
    const cards = [card(1, { rates: { Groceries: 6.5, "Everything Else": 1 } })];
    expect(routeScale(cards)).toBe(7);
  });

  it("never shrinks the scale below 5%", () => {
    expect(routeScale([card(1)])).toBe(5);
    expect(routeScale([])).toBe(5);
  });

  it("ignores closed cards when setting the scale", () => {
    expect(routeScale([card(1, { isActive: false, rates: { Gas: 12, "Everything Else": 1 } })])).toBe(5);
  });
});

describe("label rows", () => {
  it("keeps far-apart labels on the first row", () => {
    expect(labelRows([300, 200, 100], 40, 2)).toEqual([0, 0, 0]);
  });

  it("moves a crowded label to the next row", () => {
    expect(labelRows([300, 280], 40, 2)).toEqual([0, 1]);
  });

  it("leaves a label out when no row has room", () => {
    expect(labelRows([300, 290, 280], 40, 2)).toEqual([0, 1, null]);
  });
});
