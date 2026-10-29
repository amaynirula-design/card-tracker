import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCards } from "../../../cards/data";
import { deletePurchase, savePurchase } from "../../actions";
import { getPurchase } from "../../data";
import { PurchaseForm } from "../../purchase-form";

export const metadata: Metadata = { title: "Edit purchase · Card Tracker" };

export default async function EditPurchasePage({ params }: PageProps<"/purchases/[id]/edit">) {
  const { id } = await params;
  const [purchase, cards] = await Promise.all([getPurchase(id), getCards()]);
  if (!purchase) notFound();

  // Open cards, plus this purchase's card even if it has since been closed.
  const choices = cards.filter((card) => card.isActive || card.id === purchase.card.id);

  return (
    <PurchaseForm
      purchase={purchase}
      cards={choices}
      action={savePurchase.bind(null, purchase.id)}
      deleteAction={deletePurchase.bind(null, purchase.id)}
      cancelHref={`/purchases/${purchase.id}`}
    />
  );
}
