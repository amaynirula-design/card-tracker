import { describe, expect, it } from "vitest";
import { hasCardNamed } from "./cards";

const cards = [
  { id: 1, name: "Chase Sapphire Preferred" },
  { id: 2, name: "Capital One Venture X" },
];

describe("hasCardNamed", () => {
  it("finds a card with the same name", () => {
    expect(hasCardNamed(cards, "Chase Sapphire Preferred", null)).toBe(true);
  });

  it("ignores capitals and extra spaces", () => {
    expect(hasCardNamed(cards, "  chase   SAPPHIRE preferred ", null)).toBe(true);
  });

  it("allows a different name", () => {
    expect(hasCardNamed(cards, "Chase Sapphire Reserve", null)).toBe(false);
  });

  it("lets a card keep its own name when it's edited", () => {
    expect(hasCardNamed(cards, "Chase Sapphire Preferred", 1)).toBe(false);
  });

  it("stops an edit from taking another card's name", () => {
    expect(hasCardNamed(cards, "Capital One Venture X", 1)).toBe(true);
  });

  it("lets an older duplicate be edited if its name stays the same", () => {
    const copies = [...cards, { id: 3, name: "Capital One Venture X" }];
    expect(hasCardNamed(copies, "Capital One Venture X", 3)).toBe(false);
  });
});
