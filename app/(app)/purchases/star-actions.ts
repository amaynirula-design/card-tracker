"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Stars or unstars a purchase: adds or removes one row in the stars table.
// Row-level security only allows starring your own purchases.
export async function setStarred(purchaseId: number, starred: boolean): Promise<void> {
  const supabase = await createClient();
  if (starred) {
    const { error } = await supabase.from("stars").insert({ purchase_id: purchaseId });
    // 23505: it was already starred (say, from another tab), which is fine.
    if (error && error.code !== "23505") throw new Error("Couldn't star this purchase.");
  } else {
    const { error } = await supabase.from("stars").delete().eq("purchase_id", purchaseId);
    if (error) throw new Error("Couldn't unstar this purchase.");
  }
  // Every screen that shows stars (list, detail, Starred) should be fresh.
  revalidatePath("/", "layout");
}
