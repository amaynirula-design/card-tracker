import { describe, expect, it } from "vitest";
import { CLOSED_CARD_COLOR, cardColor } from "./card-colors";

describe("card colors", () => {
  it("gives a card the same color every time", () => {
    expect(cardColor({ id: 15, isActive: true })).toBe(cardColor({ id: 15, isActive: true }));
  });

  it("gives cards added one after another different colors", () => {
    const colors = [1, 2, 3, 4, 5, 6].map((id) => cardColor({ id, isActive: true }));
    expect(new Set(colors).size).toBe(6);
  });

  it("shows a closed card in gray", () => {
    expect(cardColor({ id: 15, isActive: false })).toBe(CLOSED_CARD_COLOR);
  });
});
