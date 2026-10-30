import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardFace } from "@/app/components/card-face";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { IconChevronLeft } from "@/app/components/icons";
import {
  formatNumber,
  formatRate,
  rateFor,
  rewardPercent,
} from "@/lib/cards";
import { CATEGORIES, FALLBACK_CATEGORY } from "@/lib/categories";
import { getCard } from "../data";

export async function generateMetadata({ params }: PageProps<"/cards/[id]">): Promise<Metadata> {
  const card = await getCard((await params).id);
  return { title: `${card?.name ?? "Not found"} · Card Tracker` };
}

export default async function CardPage({ params }: PageProps<"/cards/[id]">) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();

  const base = rateFor(card, FALLBACK_CATEGORY);
  const details = [
    card.rewardType === "points" && `${formatNumber(card.pointValueCents)}¢ per point`,
    card.annualFee > 0 ? `$${formatNumber(card.annualFee)} annual fee` : "No annual fee",
  ].filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-4">
      <nav className="-ml-1.5 flex items-center justify-between">
        <Link href="/cards" className="flex min-h-11 items-center text-body text-accent hover:opacity-70">
          <IconChevronLeft className="size-6" />
          Cards
        </Link>
        <Link href={`/cards/${card.id}/edit`} className="flex min-h-11 items-center text-body text-accent hover:opacity-70">
          Edit
        </Link>
      </nav>

      <div className="mt-3">
        <CardFace card={card} heading />
      </div>
      <p className="mt-3 px-1 text-subhead text-label-secondary">
        {details.join(" · ")}
        {!card.isActive && " · Closed"}
      </p>

      <div className="mt-8">
        <GroupedSection
          header="What It Earns"
          footer={
            card.rewardType === "points"
              ? "Points per dollar, and what that's worth in cash at your point value. \"Base\" rates come from Everything Else."
              : "Cash back per dollar. \"Base\" rates come from Everything Else."
          }
        >
          {CATEGORIES.map((category) => {
            const ownRate = card.rates[category];
            const isBonus = ownRate !== undefined && category !== FALLBACK_CATEGORY && ownRate > base;
            return (
              <ListRow
                key={category}
                title={category}
                subtitle={
                  card.rewardType === "points"
                    ? `About ${formatNumber(rewardPercent(card, category))}% back`
                    : undefined
                }
                trailing={
                  <span className={["tabular", isBonus ? "font-semibold text-label" : ""].join(" ")}>
                    {formatRate(card, rateFor(card, category))}
                    {ownRate === undefined && " · base"}
                  </span>
                }
              />
            );
          })}
        </GroupedSection>
      </div>
    </main>
  );
}
