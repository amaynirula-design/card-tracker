import "server-only";
import type { Card, RewardType } from "@/lib/cards";
import { isCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/server";

// Reading cards from the database. Row-level security means these only ever
// return the logged-in user's own cards, so there's no user filter here.

export const CARD_COLUMNS =
  "id, name, reward_type, point_value_cents, annual_fee, is_active, reward_rates (category, rate)";

export type CardRow = {
  id: number;
  name: string;
  reward_type: RewardType;
  point_value_cents: number;
  annual_fee: number;
  is_active: boolean;
  reward_rates: { category: string; rate: number }[];
};

export function toCard(row: CardRow): Card {
  const rates: Card["rates"] = {};
  for (const { category, rate } of row.reward_rates) {
    if (isCategory(category)) rates[category] = Number(rate);
  }
  return {
    id: row.id,
    name: row.name,
    rewardType: row.reward_type,
    pointValueCents: Number(row.point_value_cents),
    annualFee: Number(row.annual_fee),
    isActive: row.is_active,
    rates,
  };
}

export async function getCards(): Promise<Card[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cards")
    .select(CARD_COLUMNS)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as CardRow[]).map(toCard);
}

// One card by its id from the URL, or null if it doesn't exist or isn't yours.
export async function getCard(id: string): Promise<Card | null> {
  if (!/^\d+$/.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cards")
    .select(CARD_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toCard(data as CardRow) : null;
}
