"use client";

import Link from "next/link";
import { useState } from "react";
import { bestCardFor } from "@/lib/best-card";
import { cardCodes } from "@/lib/card-codes";
import { formatNumber, formatRate, rateFor, type Card } from "@/lib/cards";
import { CATEGORIES, CATEGORY_CODES, type Category } from "@/lib/categories";
import { routeStops } from "@/lib/route-map";
import { CardTag, CategoryTag } from "./code-tag";
import { RouteMap } from "./route-map";
import { Row, RowContent, Section, rowClasses } from "./rows";

// Best Card (feature 8): pick a category code and the map and the answer change
// right away, with no trip to the server. All the rates are already here. The
// address updates too, so a link or a refresh lands on the same category.
export function RouteFinder({
  cards,
  initialCategory,
  headingLevel = "h1",
  intro,
  mapNote,
  canLog = false,
  children,
  updateAddress = true,
}: {
  cards: Card[];
  initialCategory: Category;
  headingLevel?: "h1" | "h2";
  // Above the question, on the ground.
  intro?: React.ReactNode;
  // Under the map, on the ground.
  mapNote?: string;
  // Show a way to log the purchase after the answer.
  canLog?: boolean;
  // Below the answer, on land.
  children?: React.ReactNode;
  updateAddress?: boolean;
}) {
  const [category, setCategory] = useState(initialCategory);
  const stops = routeStops(cards, category);
  const best = bestCardFor(cards, category);
  const others = stops.filter((stop) => !stop.winner);
  const codes = cardCodes(cards);
  const Heading = headingLevel;

  function choose(next: Category) {
    setCategory(next);
    if (updateAddress) {
      window.history.replaceState(null, "", `?category=${encodeURIComponent(next)}`);
    }
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-stretch">
      <div className="px-5 pb-4 pt-3 md:px-10 md:pt-10">
        <div className="lg:mx-auto lg:max-w-xl">
          {intro}
          <Heading
            className={`wide font-extrabold leading-[1.05] tracking-tight ${
              headingLevel === "h1" ? "text-headline" : "text-title"
            }`}
          >
            Which card for {category.toLowerCase()}?
          </Heading>

          <div
            role="group"
            aria-label="Category"
            className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(max(3rem,18%),1fr))] gap-1.5 xl:grid-cols-9"
          >
            {CATEGORIES.map((option) => {
              const selected = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  aria-label={option}
                  title={option}
                  onClick={() => choose(option)}
                  className={[
                    "code h-11 rounded-[7px] text-[0.9375rem] transition-colors duration-150",
                    selected ? "bg-winner text-ink" : "bg-fill text-fg hover:bg-fill-strong",
                  ].join(" ")}
                >
                  {CATEGORY_CODES[option]}
                </button>
              );
            })}
          </div>

          <div className="mt-3 lg:mt-6">
            <RouteMap cards={cards} category={category} />
            {mapNote && <p className="text-small text-fg-soft">{mapNote}</p>}
          </div>
        </div>
      </div>

      <div className="land flex-1 rounded-t-[1.25rem] px-5 pb-28 pt-5 md:px-10 md:pb-12 lg:rounded-tr-none lg:pt-10">
        <section aria-live="polite">
          <h2 className="wide text-title font-extrabold leading-[1.1] tracking-tight">
            Use {best.cards.map((card) => card.name).join(" or ")}
          </h2>
          {best.cards.length > 1 && (
            <p className="mt-1 font-semibold">Tied for {category.toLowerCase()}.</p>
          )}
          {best.cards.map((card) => (
            <p key={card.id} className="mt-2 flex items-center gap-2 text-fg-soft">
              <CardTag card={card} code={codes.get(card.id)} winner />
              <span>
                {best.cards.length > 1 && `${card.name}: `}
                {earningsLine(card, category)}
              </span>
            </p>
          ))}
        </section>

        {others.length > 0 && (
          <div className="mt-4">
            <Section>
              {others.map(({ card, percent }) => (
                <Row
                  key={card.id}
                  tag={<CardTag card={card} code={codes.get(card.id)} />}
                  title={card.name}
                  trailing={<span className="font-bold">{formatNumber(percent)}%</span>}
                />
              ))}
            </Section>
          </div>
        )}

        {canLog && (
          <p className="mt-2">
            <Link href="/purchases/new" className="text-link inline-flex min-h-11 items-center">
              Log a purchase
            </Link>
          </p>
        )}

        <div className="mt-9">
          <Section
            header="Every category"
            footer="Points cards are compared by what their points are worth to you, using each card's point value. Rates are simplified to one per category, so spending caps and rotating categories aren't reflected."
          >
            {CATEGORIES.map((each) => {
              const winner = bestCardFor(cards, each);
              return (
                <li key={each} className="border-b border-line">
                  <button
                    type="button"
                    aria-pressed={each === category}
                    onClick={() => {
                      choose(each);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`${rowClasses} w-full transition-colors hover:bg-fill aria-pressed:bg-fill`}
                  >
                    <RowContent
                      tag={<CategoryTag category={each} />}
                      title={each}
                      subtitle={winner.cards.map((card) => card.name).join(" · ")}
                      trailing={<span className="font-bold">{formatNumber(winner.percent)}%</span>}
                    />
                  </button>
                </li>
              );
            })}
          </Section>
        </div>

        {children}
      </div>
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
