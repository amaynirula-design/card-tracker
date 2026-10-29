"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ConfirmState } from "@/app/components/confirm-dialog";
import { createClient } from "@/lib/supabase/server";

// What the purchase form shows after a failed save, plus what was typed so
// nothing is lost.
export type PurchaseFormState = {
  error?: string;
  values?: Record<string, string>;
};

// "$1,234.50" → 1234.5; anything else that isn't a number → null.
function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

// Saves a new purchase (purchaseId null) or changes an existing one.
export async function savePurchase(
  purchaseId: number | null,
  _prev: PurchaseFormState,
  formData: FormData,
): Promise<PurchaseFormState> {
  const values = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)]),
  );

  const purchase = {
    merchant: (values.merchant ?? "").trim(),
    amount: parseAmount(values.amount ?? ""),
    purchase_date: values.purchase_date || null,
    category: values.category || null,
    card_id: values.card_id ? Number(values.card_id) : null,
    notes: (values.notes ?? "").trim() || null,
  };

  // The database turns away anything incomplete (blank merchant, an amount of
  // zero, someone else's card...). Friendly messages per field are feature 4.
  const supabase = await createClient();
  const failed = { error: "We couldn't save this purchase. Check that every field is filled in.", values };

  let id = purchaseId;
  if (id === null) {
    const { data, error } = await supabase.from("purchases").insert(purchase).select("id").single();
    if (error) return failed;
    id = data.id as number;
  } else {
    // Row-level security makes this match nothing if the purchase isn't yours.
    const { data, error } = await supabase.from("purchases").update(purchase).eq("id", id).select("id");
    if (error) return failed;
    if (data.length === 0) return { error: "This purchase no longer exists.", values };
  }

  revalidatePath("/purchases");
  redirect(`/purchases/${id}`);
}

export async function deletePurchase(purchaseId: number): Promise<ConfirmState> {
  const supabase = await createClient();
  const { error } = await supabase.from("purchases").delete().eq("id", purchaseId);
  if (error) return { error: "We couldn't delete this purchase. Please try again." };

  revalidatePath("/purchases");
  redirect("/purchases");
}
