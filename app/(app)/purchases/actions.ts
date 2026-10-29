"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ConfirmState } from "@/app/components/confirm-dialog";
import { validatePurchase, type PurchaseErrors } from "@/lib/purchase-validation";
import { createClient } from "@/lib/supabase/server";

// What the purchase form shows after a failed save: a friendly message per
// field, or one for the whole form, plus what was typed so nothing is lost.
export type PurchaseFormState = {
  errors?: PurchaseErrors;
  error?: string;
  values?: Record<string, string>;
};

// Saves a new purchase (purchaseId null) or changes an existing one.
export async function savePurchase(
  purchaseId: number | null,
  _prev: PurchaseFormState,
  formData: FormData,
): Promise<PurchaseFormState> {
  const values = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)]),
  );

  // Friendly checks first (blank fields, an amount of $0 or less...).
  const { purchase, errors } = validatePurchase(values);
  if (errors) return { errors, values };

  // The database still checks everything, including that the card is yours.
  const supabase = await createClient();
  const failed = { error: "We couldn't save this purchase. Please try again.", values };

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
