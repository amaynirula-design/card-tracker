import { describe, expect, it } from "vitest";
import { suggestCategory } from "./category-suggestions";

describe("category suggestions", () => {
  it("suggests a category for well-known merchants", () => {
    expect(suggestCategory("Starbucks")).toBe("Dining");
    expect(suggestCategory("Safeway")).toBe("Groceries");
    expect(suggestCategory("Chevron")).toBe("Gas");
    expect(suggestCategory("Delta")).toBe("Travel");
    expect(suggestCategory("Amazon")).toBe("Online Shopping");
    expect(suggestCategory("Netflix")).toBe("Streaming");
    expect(suggestCategory("CVS")).toBe("Drug Stores");
    expect(suggestCategory("BART")).toBe("Transit");
  });

  it("ignores capitals, punctuation, and store numbers", () => {
    expect(suggestCategory("TRADER JOE’S #123")).toBe("Groceries");
    expect(suggestCategory("trader joe's")).toBe("Groceries");
    expect(suggestCategory("In-N-Out Burger")).toBe("Dining");
    expect(suggestCategory("Disney+")).toBe("Streaming");
    expect(suggestCategory("Café Strada")).toBe("Dining");
  });

  it("tells Uber Eats apart from Uber", () => {
    expect(suggestCategory("Uber Eats")).toBe("Dining");
    expect(suggestCategory("Uber")).toBe("Transit");
  });

  it("only matches whole words", () => {
    expect(suggestCategory("Seashell Gifts")).toBeUndefined();
    expect(suggestCategory("Bartlett Hardware")).toBeUndefined();
  });

  it("leaves stores that sell a bit of everything for you to choose", () => {
    expect(suggestCategory("Target")).toBeUndefined();
    expect(suggestCategory("Walmart")).toBeUndefined();
    expect(suggestCategory("Costco")).toBeUndefined();
  });

  it("suggests nothing for an unknown merchant or a blank name", () => {
    expect(suggestCategory("Moe's Books")).toBeUndefined();
    expect(suggestCategory("   ")).toBeUndefined();
  });
});
