import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/app/components/button";
import { CardTag, CategoryTag } from "@/app/components/code-tag";
import { Screen } from "@/app/components/screen";
import { Row, Section } from "@/app/components/rows";
import { cardCodes } from "@/lib/card-codes";
import {
  REWARD_TYPE_LABELS,
  formatNumber,
  formatRate,
  rateFor,
  rewardPercent,
} from "@/lib/cards";
import { CATEGORIES, FALLBACK_CATEGORY } from "@/lib/categories";
import { getCard, getCards } from "../data";

export async function generateMetadata({ params }: PageProps<"/cards/[id]">): Promise<Metadata> {
  const card = await getCard((await params).id);
  return { title: `${card?.name ?? "Not found"} · Card Tracker` };
}

export default async function CardPage({ params }: PageProps<"/cards/[id]">) {
  const { id } = await params;
  const [card, cards] = await Promise.all([getCard(id), getCards()]);
  if (!card) notFound();

  const base = rateFor(card, FALLBACK_CATEGORY);
  const details = [
    REWARD_TYPE_LABELS[card.rewardType],
    card.rewardType === "points" && `${formatNumber(card.pointValueCents)}¢ per point`,
    card.annualFee > 0 ? `$${formatNumber(card.annualFee)} annual fee` : "No annual fee",
    !card.isActive && "Closed",
  ].filter(Boolean);

  return (
    <Screen
      title={card.name}
      back={{ href: "/cards", label: "Cards" }}
      action={
        <ButtonLink href={`/cards/${card.id}/edit`} variant="secondary" className="h-10">
          Edit
        </ButtonLink>
      }
      lead={
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <CardTag card={card} code={cardCodes(cards).get(card.id)} />
          <p className="text-small text-fg-soft">{details.join(" · ")}</p>
        </div>
      }
    >
      <Section
        header="What it earns"
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
            <Row
              key={category}
              tag={<CategoryTag category={category} />}
              title={category}
              subtitle={
                card.rewardType === "points"
                  ? `About ${formatNumber(rewardPercent(card, category))}% back`
                  : undefined
              }
              trailing={
                <span className={isBonus ? "font-extrabold" : "text-fg-soft"}>
                  {formatRate(card, rateFor(card, category))}
                  {ownRate === undefined && " · base"}
                </span>
              }
            />
          );
        })}
      </Section>
    </Screen>
  );
}
