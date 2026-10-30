import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteCard, saveCard } from "../../actions";
import { CardForm } from "../../card-form";
import { getCard } from "../../data";

export const metadata: Metadata = { title: "Edit Card · Card Tracker" };

export default async function EditCardPage({ params }: PageProps<"/cards/[id]/edit">) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();

  return (
    <CardForm
      card={card}
      action={saveCard.bind(null, card.id)}
      deleteAction={deleteCard.bind(null, card.id)}
      cancelHref={`/cards/${card.id}`}
    />
  );
}
