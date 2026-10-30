import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { IconChevronLeft } from "@/app/components/icons";
import { formatNumber, formatRate, rateFor } from "@/lib/cards";
import { CATEGORY_COLORS } from "@/lib/categories";
import { formatDate, formatMoney } from "@/lib/format";
import { missedFor } from "@/lib/missed";
import { purchaseRewards } from "@/lib/rewards";
import { getCards } from "../../cards/data";
import { getPurchase } from "../data";
import { StarButton } from "../star-button";

export async function generateMetadata({ params }: PageProps<"/purchases/[id]">): Promise<Metadata> {
  const purchase = await getPurchase((await params).id);
  return { title: `${purchase?.merchant ?? "Not found"} · Card Tracker` };
}

export default async function PurchasePage({ params }: PageProps<"/purchases/[id]">) {
  const { id } = await params;
  const [purchase, cards] = await Promise.all([getPurchase(id), getCards()]);
  if (!purchase) notFound();

  const { card } = purchase;
  const missed = missedFor(purchase, cards);
  const bestNames = missed.bestCards.map((best) => best.name).join(" or ");
  const rewards = purchaseRewards(purchase.amount, card, purchase.category);
  const rate = formatRate(card, rateFor(card, purchase.category));
  const points = purchase.amount * rateFor(card, purchase.category);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-4">
      <nav className="-ml-1.5 flex items-center justify-between">
        <Link href="/purchases" className="flex items-center text-[17px] text-accent hover:opacity-70">
          <IconChevronLeft className="size-6" />
          Purchases
        </Link>
        <div className="flex items-center gap-2">
          <StarButton purchaseId={purchase.id} starred={purchase.starred} merchant={purchase.merchant} size="lg" />
          <Link href={`/purchases/${purchase.id}/edit`} className="text-[17px] text-accent hover:opacity-70">
            Edit
          </Link>
        </div>
      </nav>

      {/* Like a transaction in Apple Wallet: the amount large, then who and when. */}
      <div className="mt-8 flex flex-col items-center text-center">
        <p className="tabular text-[48px] font-bold leading-none tracking-tight">{formatMoney(purchase.amount)}</p>
        <h1 className="mt-3 text-[22px] font-semibold tracking-tight">{purchase.merchant}</h1>
        <p className="mt-1 text-[15px] text-label-secondary">{formatDate(purchase.date)}</p>
      </div>

      <div className="mt-8 space-y-8">
        <GroupedSection>
          <ListRow title="Card" trailing={card.name} />
          <ListRow
            title="Category"
            trailing={
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[purchase.category] }}
                />
                {purchase.category}
              </span>
            }
          />
        </GroupedSection>

        <GroupedSection
          header="Rewards"
          footer={
            card.rewardType === "points"
              ? `${formatNumber(points)} points at ${formatNumber(card.pointValueCents)}¢ each.`
              : undefined
          }
        >
          <ListRow
            title="Earned"
            subtitle={`${rate} on ${purchase.category}`}
            trailing={<span className="tabular font-semibold text-accent">{formatMoney(rewards)}</span>}
          />
          {/* Feature 9: what the best card for this category would have earned. */}
          {missed.missed > 0 ? (
            <ListRow
              title="Missed"
              subtitle={`${bestNames} would have earned ${formatMoney(missed.bestRewards)}`}
              trailing={<span className="tabular font-semibold text-label">{formatMoney(missed.missed)}</span>}
            />
          ) : (
            missed.bestCards.length > 0 && (
              <ListRow title="Best card" subtitle={`Nothing missed on ${purchase.category}`} trailing="✓" />
            )
          )}
        </GroupedSection>

        {purchase.notes && (
          <GroupedSection header="Notes">
            <li className="whitespace-pre-wrap px-4 py-3 text-[17px] leading-snug">{purchase.notes}</li>
          </GroupedSection>
        )}
      </div>
    </main>
  );
}
