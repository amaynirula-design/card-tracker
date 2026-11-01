import type { Metadata } from "next";
import { EmptyState } from "@/app/components/empty-state";
import { Screen } from "@/app/components/screen";
import { RouteFinder } from "@/app/components/route-finder";
import { CATEGORIES, isCategory, type Category } from "@/lib/categories";
import { getCards } from "../data";

export const metadata: Metadata = { title: "Best Card · Card Tracker" };

export default async function BestCardPage({ searchParams }: PageProps<"/cards/best">) {
  const requested = (await searchParams).category;
  const category: Category = typeof requested === "string" && isCategory(requested) ? requested : CATEGORIES[0];
  const cards = await getCards();

  if (!cards.some((card) => card.isActive)) {
    return (
      <Screen title="Which card should you use?">
        <EmptyState
          title="No open cards yet"
          text="Add the cards you carry, and this shows which one earns the most for each kind of purchase."
          href="/cards/new"
          action="Add a card"
        />
      </Screen>
    );
  }

  return <RouteFinder cards={cards} initialCategory={category} canLog />;
}
