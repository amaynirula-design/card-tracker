import type { Metadata } from "next";
import { EmptyState } from "@/app/components/empty-state";
import { Screen } from "@/app/components/screen";
import { getCards } from "../cards/data";
import { getStarredPurchases } from "../purchases/data";
import { PurchaseList } from "../purchases/purchase-list";

export const metadata: Metadata = { title: "Starred · Card Tracker" };

// Purchases you flagged to come back to, like a charge to dispute or a return to make.
export default async function StarredPage() {
  const [purchases, cards] = await Promise.all([getStarredPurchases(), getCards()]);

  return (
    <Screen title="Starred">
      {purchases.length === 0 ? (
        <EmptyState
          title="No starred purchases"
          text="Tap the star on a purchase to flag it for later, like a charge to dispute or a return to make."
        />
      ) : (
        <PurchaseList purchases={purchases} cards={cards} />
      )}
    </Screen>
  );
}
