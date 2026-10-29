import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { IconCard, IconPlus, IconReceipt } from "@/app/components/icons";
import { CATEGORY_COLORS } from "@/lib/categories";
import { formatDate, formatMoney, formatMonth } from "@/lib/format";
import type { Purchase } from "@/lib/purchases";
import { getCards } from "../cards/data";
import { getPurchases } from "./data";

export const metadata: Metadata = { title: "Purchases · Card Tracker" };

export default async function PurchasesPage() {
  const [purchases, cards] = await Promise.all([getPurchases(), getCards()]);
  const hasOpenCard = cards.some((card) => card.isActive);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[34px] font-bold leading-tight tracking-tight">Purchases</h1>
        {purchases.length > 0 && hasOpenCard && (
          <ButtonLink href="/purchases/new" variant="tinted" className="h-9 rounded-full px-4">
            <IconPlus className="size-4" />
            Add
          </ButtonLink>
        )}
      </div>

      {purchases.length === 0 ? (
        hasOpenCard ? (
          <EmptyState
            icon={<IconReceipt className="size-8" />}
            title="Log your first purchase"
            text="Add what you bought and which card you used, and Card Tracker works out what you earned."
            href="/purchases/new"
            action="Add a purchase"
          />
        ) : (
          <EmptyState
            icon={<IconCard className="size-8" />}
            title="Start with a card"
            text="Add the cards you carry first. Then every purchase can be logged against one of them."
            href="/cards/new"
            action="Add a card"
          />
        )
      ) : (
        <div className="mt-6 space-y-8">
          {groupByMonth(purchases).map(([month, items]) => (
            <GroupedSection key={month} header={month}>
              {items.map((purchase) => (
                <PurchaseRow key={purchase.id} purchase={purchase} />
              ))}
            </GroupedSection>
          ))}
        </div>
      )}
    </main>
  );
}

// Like Apple Card: purchases under a heading for each month, newest first.
function groupByMonth(purchases: Purchase[]): [string, Purchase[]][] {
  const groups = new Map<string, Purchase[]>();
  for (const purchase of purchases) {
    const month = formatMonth(purchase.date);
    groups.set(month, [...(groups.get(month) ?? []), purchase]);
  }
  return [...groups];
}

function PurchaseRow({ purchase }: { purchase: Purchase }) {
  return (
    <ListRow
      href={`/purchases/${purchase.id}`}
      title={purchase.merchant}
      subtitle={
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[purchase.category] }}
          />
          <span className="truncate">
            {purchase.category} · {purchase.card.name}
          </span>
        </span>
      }
      trailing={
        <span className="flex flex-col items-end">
          <span className="tabular text-label">{formatMoney(purchase.amount)}</span>
          <span className="text-[13px]">{formatDate(purchase.date)}</span>
        </span>
      }
    />
  );
}

function EmptyState({
  icon,
  title,
  text,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        {icon}
      </span>
      <h2 className="mt-5 text-[22px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-label-secondary">{text}</p>
      <ButtonLink href={href} size="lg" className="mt-6 w-full max-w-xs">
        {action}
      </ButtonLink>
    </div>
  );
}
