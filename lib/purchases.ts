import type { Card } from "./cards";
import type { Category } from "./categories";

export type Purchase = {
  id: number;
  merchant: string;
  amount: number;
  category: Category;
  // "2026-10-29"
  date: string;
  notes: string | null;
  card: Card;
  // Whether the logged-in user has starred it.
  starred: boolean;
};
