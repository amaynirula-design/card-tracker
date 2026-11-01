import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { CardTag, CategoryTag } from "@/app/components/code-tag";
import { EmptyState } from "@/app/components/empty-state";
import { IconPlus } from "@/app/components/icons";
import { Screen } from "@/app/components/screen";
import { Row, Section } from "@/app/components/rows";
import { cardCodes } from "@/lib/card-codes";
import { REWARD_TYPE_LABELS, formatNumber, topRate, type Card } from "@/lib/cards";
import { getCards } from "./data";

export const metadata: Metadata = { title: "Cards · Card Tracker" };

export default async function CardsPage() {
  const cards = await getCards();
  const ranked = [...cards].sort((a, b) => topRate(b).percent - topRate(a).percent);
  const open = ranked.filter((card) => card.isActive);
  const closed = ranked.filter((card) => !card.isActive);
  const codes = cardCodes(cards);

  return (
    <Screen
      title="Cards"
      action={
        cards.length > 0 && (
          <ButtonLink href="/cards/new" className="h-10">
            <IconPlus className="size-4" />
            Add
          </ButtonLink>
        )
      }
    >
      {cards.length === 0 ? (
        <EmptyState
          title="Add your first card"
          text="Tell Card Tracker what each of your cards earns, and it can work out your rewards."
          href="/cards/new"
          action="Add a card"
        />
      ) : (
        <div className="space-y-9">
          <CardSection cards={open} codes={codes} header="Open, by top rate" />
          <CardSection cards={closed} codes={codes} header="Closed" />
        </div>
      )}
    </Screen>
  );
}

// Every card shows the same facts in the same places, so they compare at a glance.
function CardSection({ cards, codes, header }: { cards: Card[]; codes: Map<number, string>; header: string }) {
  if (cards.length === 0) return null;
  return (
    <Section header={header}>
      {cards.map((card) => {
        const top = topRate(card);
        return (
          <Row
            key={card.id}
            href={`/cards/${card.id}`}
            tag={<CardTag card={card} code={codes.get(card.id)} />}
            title={card.name}
            subtitle={`${REWARD_TYPE_LABELS[card.rewardType]} · ${
              card.annualFee > 0 ? `$${formatNumber(card.annualFee)} fee` : "No fee"
            }`}
            trailing={
              <span className="flex items-center gap-2">
                <span className="font-bold">{formatNumber(top.percent)}%</span>
                <CategoryTag category={top.category} />
              </span>
            }
          />
        );
      })}
    </Section>
  );
}
