import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { LargeTitle } from "@/app/components/large-title";
import { IconCard, IconPlus, IconReceipt, IconSearch } from "@/app/components/icons";
import { isFiltering, parseFilters } from "@/lib/purchase-filters";
import { getCards } from "../cards/data";
import { getPurchases } from "./data";
import { PurchaseFiltersBar } from "./purchase-filters-bar";
import { EmptyState, PurchaseList } from "./purchase-list";

export const metadata: Metadata = { title: "Purchases · Card Tracker" };

export default async function PurchasesPage({ searchParams }: PageProps<"/purchases">) {
  const filters = parseFilters(await searchParams);
  const [purchases, cards] = await Promise.all([getPurchases(filters), getCards()]);
  const hasOpenCard = cards.some((card) => card.isActive);
  const filtering = isFiltering(filters);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-5 md:pt-10">
      <LargeTitle
        action={
          (purchases.length > 0 || filtering) &&
          hasOpenCard && (
            <ButtonLink href="/purchases/new" variant="tinted" className="h-9 rounded-full px-4">
              <IconPlus className="size-4" />
              Add
            </ButtonLink>
          )
        }
      >
        Purchases
      </LargeTitle>

      {(purchases.length > 0 || filtering) && (
        <PurchaseFiltersBar
          filters={filters}
          cards={cards.map(({ id, name }) => ({ id, name }))}
          resultCount={purchases.length}
        />
      )}

      {purchases.length === 0 && filtering ? (
        <EmptyState
          icon={<IconSearch className="size-8" />}
          title="No matching purchases"
          text="Try a different search, or clear the filters to see everything."
        />
      ) : purchases.length === 0 ? (
        hasOpenCard ? (
          <EmptyState
            icon={<IconReceipt className="size-8" />}
            title="Log your first purchase"
            text="Add what you bought and which card you used, and Card Tracker works out what you earned."
            href="/purchases/new"
            action="Add a Purchase"
          />
        ) : (
          <EmptyState
            icon={<IconCard className="size-8" />}
            title="Start with a card"
            text="Add the cards you carry first. Then every purchase can be logged against one of them."
            href="/cards/new"
            action="Add a Card"
          />
        )
      ) : (
        <PurchaseList purchases={purchases} byMonth={filters.sort !== "largest"} />
      )}
    </main>
  );
}
