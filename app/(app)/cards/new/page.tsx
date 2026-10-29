import type { Metadata } from "next";
import { saveCard } from "../actions";
import { CardForm } from "../card-form";

export const metadata: Metadata = { title: "New card · Card Tracker" };

export default function NewCardPage() {
  return <CardForm action={saveCard.bind(null, null)} cancelHref="/cards" />;
}
