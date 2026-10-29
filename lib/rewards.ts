import { rewardPercent, type Card } from "./cards";
import type { Category } from "./categories";

// The rewards math from PLAN.md section 3, as plain functions (no database),
// so the dashboard test can check it directly.

// Dollars earned on one purchase:
//   cash back: amount × rate ÷ 100
//   points:    amount × rate × point value in cents ÷ 100
export function purchaseRewards(amount: number, card: Card, category: Category): number {
  return (amount * rewardPercent(card, category)) / 100;
}
