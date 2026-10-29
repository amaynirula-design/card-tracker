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

// Each category's small dot, using Apple's system colors (PLAN.md section 6).
export const CATEGORY_COLORS: Record<Category, string> = {
  Dining: "#ff9500",
  Groceries: "#34c759",
  Gas: "#ffcc00",
  Travel: "#007aff",
  "Online Shopping": "#af52de",
  Streaming: "#ff2d55",
  "Drug Stores": "#ff3b30",
  Transit: "#5ac8fa",
  "Everything Else": "#8e8e93",
};
