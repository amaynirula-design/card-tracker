import "server-only";
import { isCategory } from "@/lib/categories";
import type { Purchase } from "@/lib/purchases";
import { createClient } from "@/lib/supabase/server";
import { CARD_COLUMNS, toCard, type CardRow } from "../cards/data";

// Reading purchases from the database. Row-level security means these only
// ever return the logged-in user's own purchases.

// Each purchase comes with its card (and the card's rates), for rewards.
const PURCHASE_COLUMNS = `id, merchant, amount, category, purchase_date, notes, card:cards (${CARD_COLUMNS})`;

type PurchaseRow = {
  id: number;
  merchant: string;
  amount: number;
  category: string;
  purchase_date: string;
  notes: string | null;
  card: CardRow;
};

function toPurchase(row: PurchaseRow): Purchase {
  return {
    id: row.id,
    merchant: row.merchant,
    amount: Number(row.amount),
    category: isCategory(row.category) ? row.category : "Everything Else",
    date: row.purchase_date,
    notes: row.notes,
    card: toCard(row.card),
  };
}

// All purchases, newest first.
export async function getPurchases(): Promise<Purchase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select(PURCHASE_COLUMNS)
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as PurchaseRow[]).map(toPurchase);
}

// One purchase by its id from the URL, or null if it doesn't exist or isn't yours.
export async function getPurchase(id: string): Promise<Purchase | null> {
  if (!/^\d+$/.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select(PURCHASE_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toPurchase(data as unknown as PurchaseRow) : null;
}
