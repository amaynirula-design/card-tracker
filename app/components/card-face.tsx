import { cardFaceColor } from "@/lib/card-faces";
import { REWARD_TYPE_LABELS, rateSummary, type Card } from "@/lib/cards";

// A card drawn like a card in Apple Wallet: its name, type, and best rates on
// its own color. Never an issuer's logo, and never a card number.
export function CardFace({ card, heading = false }: { card: Card; heading?: boolean }) {
  const Name = heading ? "h1" : "p";
  return (
    <div
      className="flex h-44 flex-col justify-between rounded-2xl px-4 py-3.5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_-4px_12px_rgb(0_0_0/0.15)]"
      style={{ backgroundColor: cardFaceColor(card) }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <Name className="min-w-0 truncate text-body font-semibold">{card.name}</Name>
        <span className="shrink-0 text-footnote">{REWARD_TYPE_LABELS[card.rewardType]}</span>
      </div>
      <p className="text-subhead font-medium leading-snug">{rateSummary(card)}</p>
    </div>
  );
}
