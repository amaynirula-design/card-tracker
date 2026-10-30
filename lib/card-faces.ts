import type { Card } from "./cards";

// Each card's color on its card face. It comes from the card's id, so there's
// nothing to set up and a card keeps its color. White text passes contrast
// (4.5:1 or better) on all of these, in both light and dark mode.
// The order keeps similar colors apart, since cards added in a row sit side by side.
const FACE_COLORS = ["#007c77", "#7a5210", "#3a3a3c", "#3f4a9c", "#2e6b45", "#7b3f73"];

export const CLOSED_FACE_COLOR = "#636366";

export function cardFaceColor(card: Pick<Card, "id" | "isActive">): string {
  return card.isActive ? FACE_COLORS[card.id % FACE_COLORS.length] : CLOSED_FACE_COLOR;
}
