import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/app/components/button";
import { CardFace } from "@/app/components/card-face";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { IconCard, IconPlus, IconTarget } from "@/app/components/icons";
import { LargeTitle } from "@/app/components/large-title";
import type { Card } from "@/lib/cards";
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

// Cards stacked like Apple Wallet: each one overlaps the last, leaving its name
// showing. The strip left showing is tall enough to tap.
function CardSection({ cards, header }: { cards: Card[]; header?: string }) {
  if (cards.length === 0) return null;
  return (
    <section className="space-y-1.5">
      {header && <h2 className="px-4 text-footnote uppercase tracking-wide text-label-secondary">{header}</h2>}
      <ul>
        {cards.map((card, index) => (
          <li key={card.id} className={`relative ${index > 0 ? "-mt-30" : ""}`}>
            <Link
              href={`/cards/${card.id}`}
              className="block rounded-2xl transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <CardFace card={card} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
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
