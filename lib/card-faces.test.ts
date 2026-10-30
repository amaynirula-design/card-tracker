import { describe, expect, it } from "vitest";
import { CLOSED_FACE_COLOR, cardFaceColor } from "./card-faces";

describe("card face colors", () => {
  it("gives a card the same color every time", () => {
    expect(cardFaceColor({ id: 15, isActive: true })).toBe(cardFaceColor({ id: 15, isActive: true }));
  });

  it("gives cards added one after another different colors", () => {
    const colors = [1, 2, 3, 4, 5, 6].map((id) => cardFaceColor({ id, isActive: true }));
    expect(new Set(colors).size).toBe(6);
  });

  it("shows a closed card in gray", () => {
    expect(cardFaceColor({ id: 15, isActive: false })).toBe(CLOSED_FACE_COLOR);
  });
});
