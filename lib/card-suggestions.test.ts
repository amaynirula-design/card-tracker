import { describe, expect, it } from "vitest";
import type { CardPreset } from "./card-presets";
import { scoreCards, suggestCards, yearlySpend } from "./card-suggestions";
import type { Card } from "./cards";

// A wallet with one 2% everywhere card.
const doubleCash: Card = {
  id: 1,
  name: "Citi Double Cash",
  rewardType: "cashback",
  pointValueCents: 1,
  annualFee: 0,
  isActive: true,
  rates: { "Everything Else": 2 },
};

// Made-up presets, so the numbers in these tests never change when the real list does.
const diningNoFee: CardPreset = {
  id: "dining-no-fee",
  issuer: "Test",
  name: "Dining No Fee",
  rewardType: "cashback",
  pointValueCents: 1,
  annualFee: 0,
  rates: { Dining: 3, "Everything Else": 1 },
};
const diningWithFee: CardPreset = {
  id: "dining-with-fee",
  issuer: "Test",
  name: "Dining With Fee",
  rewardType: "points",
  pointValueCents: 1,
  annualFee: 325,
  rates: { Dining: 4, "Everything Else": 1 },
  perks: [{ label: "Dining credit", value: 120 }, { label: "Ride credit", value: 120 }, { label: "Lounge access" }],
};
const travelOnly: CardPreset = {
  id: "travel-only",
  issuer: "Test",
  name: "Travel Only",
  rewardType: "points",
  pointValueCents: 1,
  annualFee: 95,
  rates: { Travel: 5, "Everything Else": 1 },
  perks: [{ label: "Big hotel credit", value: 500 }],
};
const presets = [diningNoFee, diningWithFee, travelOnly];

describe("yearlySpend", () => {
  it("scales a year of history as it is", () => {
    const spend = yearlySpend([{ amount: 3650, category: "Dining", date: "2025-11-14" }], "2026-11-13");
    expect(spend.days).toBe(365);
    expect(spend.byCategory.Dining).toBeCloseTo(3650);
  });

  it("treats less than a month of history as one month", () => {
    // $100 over 3 days would be $12,000+ a year; over 30 days it's about $1,217.
    const spend = yearlySpend([{ amount: 100, category: "Dining", date: "2026-11-11" }], "2026-11-13");
    expect(spend.total).toBeCloseTo((100 * 365) / 30);
    expect(spend.days).toBe(3);
  });

  it("is empty with no purchases", () => {
    expect(yearlySpend([], "2026-11-13")).toEqual({ byCategory: {}, total: 0, days: 0 });
  });
});

describe("card suggestions", () => {
  // $500 of dining over 30 days: about $6,083 a year.
  const dining = yearlySpend([{ amount: 500, category: "Dining", date: "2026-10-15" }], "2026-11-13");

  it("counts only what a new card beats your best card by", () => {
    const [noFee] = scoreCards([doubleCash], dining, [diningNoFee]);
    // 3% instead of 2% on about $6,083 of dining.
    expect(noFee.extraRewards).toBeCloseTo((6083.33 * 1) / 100, 1);
    expect(noFee.worthIt).toBe("rewards");
  });

  it("subtracts the annual fee, and says when perks are needed to break even", () => {
    const [withFee] = scoreCards([doubleCash], dining, [diningWithFee]);
    // 4% instead of 2%: about $121.67 more, minus the $325 fee.
    expect(withFee.extraRewards).toBeCloseTo(121.67, 1);
    expect(withFee.net).toBeCloseTo(-203.33, 1);
    expect(withFee.worthIt).toBe("perks");
    expect(withFee.perksValue).toBe(240);
    expect(withFee.perksNeeded).toBeCloseTo(203.33, 1);
  });

  it("ranks cards by what they add a year counting their perks, and skips cards that add nothing", () => {
    // Dining No Fee adds about $60.83. Dining With Fee adds -$203.33 + $240 of perks = about $36.67.
    const suggested = suggestCards([doubleCash], dining, 3, presets).map((each) => each.preset.id);
    // Travel Only earns nothing extra on dining, so its big hotel credit doesn't get it suggested.
    expect(suggested).toEqual(["dining-no-fee", "dining-with-fee"]);
  });

  it("leaves out a card whose perks can't cover what's left of the fee", () => {
    const pricey = { ...diningWithFee, annualFee: 600 };
    expect(suggestCards([doubleCash], dining, 3, [pricey])).toEqual([]);
  });

  it("doesn't suggest a card you already have", () => {
    const owned = { ...doubleCash, id: 2, name: "  dining NO fee " };
    const ids = scoreCards([doubleCash, owned], dining, presets).map((each) => each.preset.id);
    expect(ids).not.toContain("dining-no-fee");
  });

  it("ignores closed cards when working out your current best", () => {
    const closedDiningCard: Card = { ...doubleCash, id: 3, name: "Old Dining Card", isActive: false, rates: { Dining: 5 } };
    const [noFee] = scoreCards([doubleCash, closedDiningCard], dining, [diningNoFee]);
    expect(noFee.extraRewards).toBeGreaterThan(0);
  });

  it("suggests nothing without any purchases", () => {
    expect(suggestCards([doubleCash], yearlySpend([], "2026-11-13"), 3, presets)).toEqual([]);
  });

  it("with the real preset list, heavy dining and only a 2% card puts the Amex Gold in the top three", () => {
    const heavyDining = yearlySpend([{ amount: 1500, category: "Dining", date: "2026-10-15" }], "2026-11-13");
    const ids = suggestCards([doubleCash], heavyDining, 3).map((each) => each.preset.id);
    expect(ids).toContain("amex-gold");
  });
});

describe("perks in the ranking", () => {
  it("lets a fee card with big perks beat a no-fee card that earns a little more", () => {
    // $18,250 of dining a year. No Fee adds 1% = $182.50. With Fee adds 2% = $365, minus $325, plus $240 = $280.
    const heavy = yearlySpend([{ amount: 1500, category: "Dining", date: "2026-10-15" }], "2026-11-13");
    const [first, second] = suggestCards([doubleCash], heavy, 3, presets);
    expect(first.preset.id).toBe("dining-with-fee");
    expect(first.worthIt).toBe("rewards");
    expect(second.preset.id).toBe("dining-no-fee");
  });
});
