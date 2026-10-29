// The fixed spending categories (PLAN.md section 3). The database only accepts these.
export const CATEGORIES = [
  "Dining",
  "Groceries",
  "Gas",
  "Travel",
  "Online Shopping",
  "Streaming",
  "Drug Stores",
  "Transit",
  "Everything Else",
] as const;

export type Category = (typeof CATEGORIES)[number];

// A card's rate for this category is used for any category it has no rate for.
export const FALLBACK_CATEGORY: Category = "Everything Else";

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
