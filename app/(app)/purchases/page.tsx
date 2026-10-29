import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { IconCard, IconPlus, IconReceipt } from "@/app/components/icons";
import { getCards } from "../cards/data";
import { getPurchases } from "./data";
import { EmptyState, PurchaseList } from "./purchase-list";

export const metadata: Metadata = { title: "Purchases · Card Tracker" };

export default async function PurchasesPage() {
  const [purchases, cards] = await Promise.all([getPurchases(), getCards()]);
  const hasOpenCard = cards.some((card) => card.isActive);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[34px] font-bold leading-tight tracking-tight">Purchases</h1>
        {purchases.length > 0 && hasOpenCard && (
          <ButtonLink href="/purchases/new" variant="tinted" className="h-9 rounded-full px-4">
            <IconPlus className="size-4" />
            Add
          </ButtonLink>
        )}
      </div>

      {purchases.length === 0 ? (
        hasOpenCard ? (
          <EmptyState
            icon={<IconReceipt className="size-8" />}
            title="Log your first purchase"
            text="Add what you bought and which card you used, and Card Tracker works out what you earned."
            href="/purchases/new"
            action="Add a purchase"
          />
        ) : (
          <EmptyState
            icon={<IconCard className="size-8" />}
            title="Start with a card"
            text="Add the cards you carry first. Then every purchase can be logged against one of them."
            href="/cards/new"
            action="Add a card"
          />
        )
      ) : (
        <PurchaseList purchases={purchases} />
      )}
    </main>
  );
}
