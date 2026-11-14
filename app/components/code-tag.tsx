import { cardColor } from "@/lib/card-colors";
import type { Card } from "@/lib/cards";
import { CATEGORY_CODES, type Category } from "@/lib/categories";

const tagClasses =
  "code tabular inline-flex h-7 min-w-14 shrink-0 items-center justify-center rounded-[4px] px-1.5 text-small leading-none";

// A card's three-letter code on its own color: pass the code from cardCodes, so
// it's unique in your wallet. The winner's tag is forest green. The full
// name is always next to it on screen, so screen readers skip the code.
export function CardTag({
  card,
  code,
  winner = false,
}: {
  card: Pick<Card, "id" | "isActive">;
  code: string | undefined;
  winner?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`${tagClasses} ${winner ? "bg-winner text-on-winner" : "text-ink"}`}
      style={winner ? undefined : { backgroundColor: cardColor(card) }}
    >
      {code}
    </span>
  );
}

export function CategoryTag({ category }: { category: Category }) {
  return (
    <span aria-hidden="true" className={`${tagClasses} bg-fill text-fg`}>
      {CATEGORY_CODES[category]}
    </span>
  );
}
