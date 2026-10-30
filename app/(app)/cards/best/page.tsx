import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/app/components/button";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { IconChevronLeft, IconTarget } from "@/app/components/icons";
import { bestCardFor } from "@/lib/best-card";
import { formatNumber, formatRate, rateFor, type Card } from "@/lib/cards";
import { CATEGORIES, isCategory, type Category } from "@/lib/categories";
import { getCards } from "../data";
import { CategoryPicker } from "./category-picker";

export const metadata: Metadata = { title: "Best Card · Card Tracker" };

export default async function BestCardPage({ searchParams }: PageProps<"/cards/best">) {
  const requested = (await searchParams).category;
  const category: Category = typeof requested === "string" && isCategory(requested) ? requested : "Dining";
  const cards = await getCards();
  const best = bestCardFor(cards, category);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-4">
      <nav className="-ml-1.5">
        <Link href="/cards" className="inline-flex min-h-11 items-center text-body text-accent hover:opacity-70">
          <IconChevronLeft className="size-6" />
          Cards
        </Link>
      </nav>
      <h1 className="mt-4 text-large-title font-bold leading-tight tracking-tight">Best Card</h1>
      <p className="mt-1 text-body text-label-secondary">Which card to use at checkout.</p>

      {best.cards.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-fill text-label-secondary">
            <IconTarget className="size-8" />
          </span>
          <h2 className="mt-5 text-title2 font-semibold tracking-tight">No open cards yet</h2>
          <p className="mt-2 max-w-xs text-subhead leading-relaxed text-label-secondary">
            Add the cards you carry, and this shows which one earns the most for each kind of purchase.
          </p>
          <ButtonLink href="/cards/new" size="lg" className="mt-6 w-full max-w-xs">
            Add a Card
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <div className="space-y-4">
            <CategoryPicker category={category} />

            {/* The answer, large: which card to reach for. */}
            <section aria-live="polite" className="rounded-2xl bg-surface p-5 shadow-panel">
              <h2 className="text-subhead font-semibold text-label-secondary">
                {best.cards.length > 1 ? `Tied for ${category}` : `Use for ${category}`}
              </h2>
              <ul className="mt-2 space-y-3">
                {best.cards.map((card) => (
                  <li key={card.id}>
                    <p className="text-title1 font-bold leading-tight tracking-tight">{card.name}</p>
                    <p className="mt-0.5 text-subhead text-label-secondary">{earningsLine(card, category)}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <GroupedSection
            header="Every Category"
            footer="Points cards are compared by what their points are worth to you, using each card's point value."
          >
            {CATEGORIES.map((each) => {
              const winner = bestCardFor(cards, each);
              return (
                <ListRow
                  key={each}
                  href={`/cards/best?category=${encodeURIComponent(each)}`}
                  title={each}
                  subtitle={winner.cards.map((card) => card.name).join(" · ")}
                  trailing={
                    <span className={["tabular", each === category ? "font-semibold text-label" : ""].join(" ")}>
                      {formatNumber(winner.percent)}%
                    </span>
                  }
                />
              );
            })}
          </GroupedSection>
        </div>
      )}
    </main>
  );
}

// "3% back" for cash back; "4× points at 1.25¢ ≈ 5% back" for points.
function earningsLine(card: Card, category: Category): string {
  const rate = rateFor(card, category);
  if (card.rewardType === "cashback") return `${formatRate(card, rate)} back`;
  const percent = rate * card.pointValueCents;
  return `${formatRate(card, rate)} points at ${formatNumber(card.pointValueCents)}¢ ≈ ${formatNumber(percent)}% back`;
}
