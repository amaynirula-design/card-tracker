"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CATEGORIES, FALLBACK_CATEGORY, type Category } from "@/lib/categories";
import type { ConfirmState } from "@/app/components/confirm-dialog";
import type { RewardType } from "@/lib/cards";
import { createClient } from "@/lib/supabase/server";

// What the card form shows after a failed save: a message per field, plus
// what was typed so nothing is lost.
export type CardFormState = {
  errors?: Partial<Record<"name" | "pointValue" | "annualFee" | "rates" | "form", string>>;
  values?: Record<string, string>;
};

const MAX_NAME_LENGTH = 60;
const MAX_RATE = 100;

// "$95", "1.5x", "3 %" all become numbers; blank stays blank (null).
function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[$,%×x\s]/gi, "");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : NaN;
}

// Saves a new card (cardId null) or changes an existing one, with its rates.
export async function saveCard(
  cardId: number | null,
  _prev: CardFormState,
  formData: FormData,
): Promise<CardFormState> {
  const values = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)]),
  );
  const errors: NonNullable<CardFormState["errors"]> = {};

  const name = (values.name ?? "").trim();
  if (!name) errors.name = "Give this card a name, like “Sapphire Preferred”.";
  else if (name.length > MAX_NAME_LENGTH) errors.name = `Keep the name under ${MAX_NAME_LENGTH} characters.`;

  const rewardType: RewardType = values.reward_type === "points" ? "points" : "cashback";

  let pointValueCents = 1;
  if (rewardType === "points") {
    const parsed = parseNumber(values.point_value_cents ?? "");
    if (parsed === null || Number.isNaN(parsed) || parsed <= 0 || parsed > 100) {
      errors.pointValue = "Enter what one point is worth to you in cents, like 1.25.";
    } else {
      pointValueCents = parsed;
    }
  }

  const fee = parseNumber(values.annual_fee ?? "");
  if (fee !== null && (Number.isNaN(fee) || fee < 0 || fee > 10000)) {
    errors.annualFee = "Enter the annual fee in dollars, or leave it blank for no fee.";
  }

  const rates = new Map<Category, number>();
  const blankCategories: Category[] = [];
  for (const category of CATEGORIES) {
    const parsed = parseNumber(values[`rate:${category}`] ?? "");
    if (parsed === null) {
      blankCategories.push(category);
    } else if (Number.isNaN(parsed) || parsed < 0 || parsed > MAX_RATE) {
      errors.rates = `Each rate needs to be a number from 0 to ${MAX_RATE}.`;
    } else {
      rates.set(category, parsed);
    }
  }
  if (!rates.has(FALLBACK_CATEGORY) && !errors.rates) {
    errors.rates = "Enter an Everything Else rate. It's used for every category you leave blank.";
  }

  if (Object.keys(errors).length > 0) return { errors, values };

  const card = {
    name,
    reward_type: rewardType,
    point_value_cents: pointValueCents,
    annual_fee: fee ?? 0,
    // The "open" switch is only on the edit form; new cards are always open.
    is_active: cardId === null ? true : values.is_active === "on",
  };

  const supabase = await createClient();
  const failed = { errors: { form: "We couldn't save this card. Please try again." }, values };

  let id = cardId;
  if (id === null) {
    const { data, error } = await supabase.from("cards").insert(card).select("id").single();
    if (error) return failed;
    id = data.id as number;
  } else {
    // Row-level security makes this match nothing if the card isn't yours.
    const { data, error } = await supabase.from("cards").update(card).eq("id", id).select("id");
    if (error) return failed;
    if (data.length === 0) return { errors: { form: "This card no longer exists." }, values };
  }

  const { error: ratesError } = await supabase.from("reward_rates").upsert(
    [...rates].map(([category, rate]) => ({ card_id: id, category, rate })),
    { onConflict: "card_id,category" },
  );
  const { error: clearError } = blankCategories.length
    ? await supabase.from("reward_rates").delete().eq("card_id", id).in("category", blankCategories)
    : { error: null };

  if (ratesError || clearError) {
    // Don't leave a brand-new card behind without its rates.
    if (cardId === null) await supabase.from("cards").delete().eq("id", id);
    return failed;
  }

  revalidatePath("/cards");
  redirect(`/cards/${id}`);
}

// Deletes a card for good, along with its rates (the database removes them).
export async function deleteCard(cardId: number): Promise<ConfirmState> {
  const supabase = await createClient();
  // Row-level security makes this match nothing if the card isn't yours.
  const { error } = await supabase.from("cards").delete().eq("id", cardId);
  // 23503: purchases still point at this card, so the database keeps it.
  if (error?.code === "23503") {
    return { error: "This card has purchases, so it can't be deleted. Turn off “Card is open” instead." };
  }
  if (error) return { error: "We couldn't delete this card. Please try again." };

  revalidatePath("/cards");
  redirect("/cards");
}
