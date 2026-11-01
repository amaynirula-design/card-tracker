import { CardTag } from "@/app/components/code-tag";
import { Row, Section } from "@/app/components/rows";
import { cardCodes } from "@/lib/card-codes";
import type { Card } from "@/lib/cards";
import { formatDate, formatMoney, formatMonth } from "@/lib/format";
import type { Purchase } from "@/lib/purchases";
import { StarButton } from "./star-button";

// The list shared by the Purchases and Starred screens: one section per month,
// or one plain list when months don't fit the order (like largest amount first).
export function PurchaseList({
  purchases,
  cards,
  byMonth = true,
}: {
  purchases: Purchase[];
  // All your cards, for their codes.
  cards: Card[];
  byMonth?: boolean;
}) {
  const codes = cardCodes(cards);
  if (!byMonth) {
    return (
      <Section>
        {purchases.map((purchase) => (
          <PurchaseRow key={purchase.id} purchase={purchase} code={codes.get(purchase.card.id)} />
        ))}
      </Section>
    );
  }
  return (
    <div className="space-y-9">
      {groupByMonth(purchases).map(([month, items]) => (
        <Section key={month} header={month}>
          {items.map((purchase) => (
            <PurchaseRow key={purchase.id} purchase={purchase} code={codes.get(purchase.card.id)} />
          ))}
        </Section>
      ))}
    </div>
  );
}

// Purchases under a heading for each month, newest first.
function groupByMonth(purchases: Purchase[]): [string, Purchase[]][] {
  const groups = new Map<string, Purchase[]>();
  for (const purchase of purchases) {
    const month = formatMonth(purchase.date);
    groups.set(month, [...(groups.get(month) ?? []), purchase]);
  }
  return [...groups];
}

function PurchaseRow({ purchase, code }: { purchase: Purchase; code: string | undefined }) {
  return (
    <Row
      href={`/purchases/${purchase.id}`}
      leading={<StarButton purchaseId={purchase.id} starred={purchase.starred} merchant={purchase.merchant} />}
      tag={<CardTag card={purchase.card} code={code} />}
      title={<span className="line-clamp-2 break-words">{purchase.merchant}</span>}
      subtitle={
        <>
          {purchase.category}
          <span className="sr-only">, {purchase.card.name}</span>
        </>
      }
      trailing={
        <span className="flex flex-col items-end">
          <span className="font-bold">{formatMoney(purchase.amount)}</span>
          <span className="text-small text-fg-soft">{formatDate(purchase.date)}</span>
        </span>
      }
    />
  );
}
