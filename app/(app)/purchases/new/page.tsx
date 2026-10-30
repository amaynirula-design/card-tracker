import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCards } from "../../cards/data";
import { savePurchase } from "../actions";
import { PurchaseForm } from "../purchase-form";

export const metadata: Metadata = { title: "New Purchase · Card Tracker" };

export default async function NewPurchasePage() {
  const cards = (await getCards()).filter((card) => card.isActive);
  // A purchase needs a card to go on.
  if (cards.length === 0) redirect("/cards/new");

  return <PurchaseForm cards={cards} action={savePurchase.bind(null, null)} cancelHref="/purchases" />;
}
