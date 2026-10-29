import { ButtonLink } from "@/app/components/button";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { CATEGORY_COLORS } from "@/lib/categories";
import { formatDate, formatMoney, formatMonth } from "@/lib/format";
import type { Purchase } from "@/lib/purchases";
import { StarButton } from "./star-button";

// Pieces shared by the Purchases and Starred screens.

// Purchases in grouped lists, one per month.
export function PurchaseList({ purchases }: { purchases: Purchase[] }) {
  return (
    <div className="mt-6 space-y-8">
      {groupByMonth(purchases).map(([month, items]) => (
        <GroupedSection key={month} header={month}>
          {items.map((purchase) => (
            <PurchaseRow key={purchase.id} purchase={purchase} />
          ))}
        </GroupedSection>
      ))}
    </div>
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
      leading={<StarButton purchaseId={purchase.id} starred={purchase.starred} merchant={purchase.merchant} />}
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

export function EmptyState({
  icon,
  title,
  text,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  // The button below the text, if any.
  href?: string;
  action?: string;
}) {
  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        {icon}
      </span>
      <h2 className="mt-5 text-[22px] font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-label-secondary">{text}</p>
      {href && action && (
        <ButtonLink href={href} size="lg" className="mt-6 w-full max-w-xs">
          {action}
        </ButtonLink>
      )}
    </div>
  );
}
