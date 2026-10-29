import { isCategory, type Category } from "./categories";

// Search, filter, and sort for the purchase list (feature 6). They live in the
// page address, e.g. /purchases?q=coffee&category=Dining&sort=largest, so a
// reload or a shared link keeps them.

export const SORTS = {
  newest: "Newest first",
  oldest: "Oldest first",
  largest: "Largest amount",
} as const;

export type Sort = keyof typeof SORTS;

export type PurchaseFilters = {
  // Text to look for in the merchant name.
  q: string;
  cardId: number | null;
  category: Category | null;
  sort: Sort;
};

type SearchParams = Record<string, string | string[] | undefined>;

// Reads the filters from the address, ignoring anything that isn't valid.
export function parseFilters(params: SearchParams): PurchaseFilters {
  const one = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
  };
  const card = one("card");
  const category = one("category");
  const sort = one("sort");
  return {
    q: one("q").slice(0, 80),
    cardId: /^\d+$/.test(card) ? Number(card) : null,
    category: isCategory(category) ? category : null,
    sort: sort in SORTS ? (sort as Sort) : "newest",
  };
}

// Whether any search or filter is narrowing the list (sorting doesn't count).
export function isFiltering(filters: PurchaseFilters): boolean {
  return Boolean(filters.q || filters.cardId || filters.category);
}
