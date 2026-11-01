import type { Card } from "./cards";

// Each card's color, like an airline's livery. It comes from the card's id, so
// there's nothing to set up and a card keeps its color. Dark ink text passes
// contrast (4.5:1 or better) on all of these, and they all stand out on the
// ultramarine ground. Yellow and orange are left out: those mean the winning
// route and missed rewards.
// The order keeps similar colors apart, since cards added in a row sit side by side.
const FLEET_COLORS = ["#25d6c8", "#ff8fc4", "#a8e05f", "#c9a8ff", "#6fc8ff", "#d9deff"];

export const CLOSED_CARD_COLOR = "#a6a9c4";

export function cardColor(card: Pick<Card, "id" | "isActive">): string {
  return card.isActive ? FLEET_COLORS[card.id % FLEET_COLORS.length] : CLOSED_CARD_COLOR;
}
