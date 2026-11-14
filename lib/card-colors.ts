import type { Card } from "./cards";

// Each card's color: a soft tint that sits quietly on white. It comes from the
// card's id, so there's nothing to set up and a card keeps its color. Dark ink
// text passes contrast (4.5:1 or better) on all of these. Forest green and
// orange are left out: those mean the winning card and missed rewards.
// The order keeps similar colors apart, since cards added in a row sit side by side.
const FLEET_COLORS = ["#c5dccf", "#ead9b8", "#d9c9e4", "#ebc8b8", "#d5dda9", "#e8c4cf"];

export const CLOSED_CARD_COLOR = "#c2c7c4";

export function cardColor(card: Pick<Card, "id" | "isActive">): string {
  return card.isActive ? FLEET_COLORS[card.id % FLEET_COLORS.length] : CLOSED_CARD_COLOR;
}
