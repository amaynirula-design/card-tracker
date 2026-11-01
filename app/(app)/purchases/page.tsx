import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { EmptyState } from "@/app/components/empty-state";
import { IconPlus } from "@/app/components/icons";
import { Screen } from "@/app/components/screen";
import { isFiltering, parseFilters } from "@/lib/purchase-filters";
import { getCards } from "../cards/data";
import { getPurchases } from "./data";
import { PurchaseFiltersBar } from "./purchase-filters-bar";
import { PurchaseList } from "./purchase-list";

export const metadata: Metadata = { title: "Purchases · Card Tracker" };

export default async function PurchasesPage({ searchParams }: PageProps<"/purchases">) {
  const filters = parseFilters(await searchParams);
  const [purchases, cards] = await Promise.all([getPurchases(filters), getCards()]);
  const hasOpenCard = cards.some((card) => card.isActive);
  const filtering = isFiltering(filters);

  return (
    <Screen
      title="Purchases"
      action={
        (purchases.length > 0 || filtering) &&
        hasOpenCard && (
          <ButtonLink href="/purchases/new" className="h-10">
            <IconPlus className="size-4" />
            Add
          </ButtonLink>
        )
      }
      lead={
        (purchases.length > 0 || filtering) && (
          <PurchaseFiltersBar
            filters={filters}
            cards={cards.map(({ id, name }) => ({ id, name }))}
            resultCount={purchases.length}
          />
        )
      }
    >
      {purchases.length === 0 && filtering ? (
        <EmptyState
          title="No matching purchases"
          text="Try a different search, or clear the filters to see everything."
        />
      ) : purchases.length === 0 ? (
        hasOpenCard ? (
          <EmptyState
            title="Log your first purchase"
            text="Add what you bought and which card you used, and Card Tracker works out what you earned."
            href="/purchases/new"
            action="Add a purchase"
          />
        ) : (
          <EmptyState
            title="Start with a card"
            text="Add the cards you carry first. Then every purchase can be logged against one of them."
            href="/cards/new"
            action="Add a card"
          />
        )
      ) : (
        <PurchaseList purchases={purchases} cards={cards} byMonth={filters.sort !== "largest"} />
      )}
    </Screen>
  );
}
