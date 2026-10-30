import type { Metadata } from "next";
import { IconStar } from "@/app/components/icons";
import { LargeTitle } from "@/app/components/large-title";
import { getStarredPurchases } from "../purchases/data";
import { EmptyState, PurchaseList } from "../purchases/purchase-list";

export const metadata: Metadata = { title: "Starred · Card Tracker" };

// Purchases you flagged to come back to, like a charge to dispute or a return to make.
export default async function StarredPage() {
  const purchases = await getStarredPurchases();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-5 md:pt-10">
      <LargeTitle>Starred</LargeTitle>

      {purchases.length === 0 ? (
        <EmptyState
          icon={<IconStar className="size-8" />}
          title="No starred purchases"
          text="Tap the star on a purchase to flag it for later, like a charge to dispute or a return to make."
        />
      ) : (
        <PurchaseList purchases={purchases} />
      )}
    </main>
  );
}
