import "server-only";
import { isCategory } from "@/lib/categories";
import type { PurchaseFilters } from "@/lib/purchase-filters";
import type { Purchase } from "@/lib/purchases";
import { createClient } from "@/lib/supabase/server";
import { CARD_COLUMNS, toCard, type CardRow } from "../cards/data";

// Reading purchases from the database. Row-level security means these only
// ever return the logged-in user's own purchases.

// Each purchase comes with its card (and the card's rates), for rewards, and
// your star on it if you starred it.
const PURCHASE_COLUMNS = `id, merchant, amount, category, purchase_date, notes, card:cards (${CARD_COLUMNS}), stars (id)`;

type PurchaseRow = {
  id: number;
  merchant: string;
  amount: number;
  category: string;
  purchase_date: string;
  notes: string | null;
  card: CardRow;
  stars: { id: number }[];
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
    starred: row.stars.length > 0,
  };
}

// Your purchases, searched, filtered, and sorted (newest first by default).
// The database does the work, so only matching purchases are sent.
export async function getPurchases(filters: Partial<PurchaseFilters> = {}): Promise<Purchase[]> {
  const supabase = await createClient();
  let query = supabase.from("purchases").select(PURCHASE_COLUMNS);

  if (filters.q) {
    // "ilike" = contains, ignoring upper/lower case. % and _ are wildcards
    // there, so a search for "50%" has them escaped to mean themselves.
    const escaped = filters.q.replace(/[\\%_]/g, (char) => `\\${char}`);
    query = query.ilike("merchant", `%${escaped}%`);
  }
  if (filters.cardId) query = query.eq("card_id", filters.cardId);
  if (filters.category) query = query.eq("category", filters.category);

  if (filters.sort === "largest") {
    query = query.order("amount", { ascending: false }).order("purchase_date", { ascending: false });
  } else {
    const ascending = filters.sort === "oldest";
    query = query.order("purchase_date", { ascending }).order("created_at", { ascending });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as PurchaseRow[]).map(toPurchase);
}

// Only starred purchases, newest first. "!inner" keeps just the purchases that
// have a matching row in the stars table.
export async function getStarredPurchases(): Promise<Purchase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select(PURCHASE_COLUMNS.replace("stars (id)", "stars!inner (id)"))
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
