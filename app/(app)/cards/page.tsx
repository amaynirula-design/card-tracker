import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { IconCard, IconPlus, IconTarget } from "@/app/components/icons";
import { LargeTitle } from "@/app/components/large-title";
import { REWARD_TYPE_LABELS, rateSummary, type Card } from "@/lib/cards";
import { getCards } from "./data";

export const metadata: Metadata = { title: "Cards · Card Tracker" };

export default async function CardsPage() {
  const cards = await getCards();
  const open = cards.filter((card) => card.isActive);
  const closed = cards.filter((card) => !card.isActive);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-5 md:pt-10">
      <LargeTitle
        action={
          cards.length > 0 && (
            <ButtonLink href="/cards/new" variant="tinted" className="h-9 rounded-full px-4">
              <IconPlus className="size-4" />
              Add
            </ButtonLink>
          )
        }
      >
        Cards
      </LargeTitle>

      {cards.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 space-y-8">
          {open.length > 0 && (
            <GroupedSection>
              <ListRow
                href="/cards/best"
                icon={<IconTarget className="size-[18px]" />}
                title="Best Card for a Category"
                subtitle="Which card to use at checkout"
              />
            </GroupedSection>
          )}
          <CardSection cards={open} header={closed.length > 0 ? "Open" : undefined} />
          {closed.length > 0 && <CardSection cards={closed} header="Closed" />}
        </div>
      )}
    </main>
  );
}

function CardSection({ cards, header }: { cards: Card[]; header?: string }) {
  if (cards.length === 0) return null;
  return (
    <GroupedSection header={header}>
      {cards.map((card) => (
        <ListRow
          key={card.id}
          href={`/cards/${card.id}`}
          title={card.name}
          subtitle={`${REWARD_TYPE_LABELS[card.rewardType]} · ${rateSummary(card)}`}
        />
      ))}
    </GroupedSection>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 flex flex-col items-center text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-fill text-label-secondary">
        <IconCard className="size-8" />
      </span>
      <h2 className="mt-5 text-title2 font-semibold tracking-tight">Add your first card</h2>
      <p className="mt-2 max-w-xs text-subhead leading-relaxed text-label-secondary">
        Tell Card Tracker what each of your cards earns, and it can work out your rewards.
      </p>
      <ButtonLink href="/cards/new" size="lg" className="mt-6 w-full max-w-xs">
        Add a Card
      </ButtonLink>
    </div>
  );
}
