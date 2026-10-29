import { isCategory, type Category } from "./categories";

// Checks a purchase form before anything is saved (feature 4). Plain code with
// no database, so it's easy to read and test. The database has its own rules
// too, as a backstop.

export type PurchaseField = "merchant" | "amount" | "purchase_date" | "category" | "card_id" | "notes";

export type PurchaseErrors = Partial<Record<PurchaseField, string>>;

// A purchase that passed every check, ready for the database.
export type ValidPurchase = {
  merchant: string;
  amount: number;
  purchase_date: string;
  category: Category;
  card_id: number;
  notes: string | null;
};

export const MAX_MERCHANT_LENGTH = 80;
export const MAX_NOTES_LENGTH = 500;
const MAX_AMOUNT = 1_000_000;

export function validatePurchase(
  values: Record<string, string>,
): { purchase: ValidPurchase; errors?: never } | { purchase?: never; errors: PurchaseErrors } {
  const errors: PurchaseErrors = {};

  const merchant = (values.merchant ?? "").trim();
  if (!merchant) errors.merchant = "Enter where you made this purchase, like “Trader Joe’s”.";
  else if (merchant.length > MAX_MERCHANT_LENGTH) {
    errors.merchant = `Keep the merchant under ${MAX_MERCHANT_LENGTH} characters.`;
  }

  // "$1,234.50" → 1234.5
  const rawAmount = (values.amount ?? "").replace(/[$,\s]/g, "");
  const amount = Math.round(Number(rawAmount) * 100) / 100;
  if (!rawAmount) errors.amount = "Enter how much you spent.";
  else if (!Number.isFinite(amount)) errors.amount = "Enter the amount as a number, like 42.50.";
  else if (amount <= 0) errors.amount = "The amount needs to be more than $0.";
  else if (amount >= MAX_AMOUNT) errors.amount = "That amount looks too large. Check it and try again.";

  const date = values.purchase_date ?? "";
  if (!date) errors.purchase_date = "Pick the date of the purchase.";
  else if (!isRealDate(date)) errors.purchase_date = "Pick a real date.";

  const category = values.category ?? "";
  if (!isCategory(category)) errors.category = "Choose a category.";

  const cardId = Number(values.card_id);
  if (!values.card_id || !Number.isInteger(cardId)) errors.card_id = "Choose the card you used.";

  const notes = (values.notes ?? "").trim();
  if (notes.length > MAX_NOTES_LENGTH) errors.notes = `Keep notes under ${MAX_NOTES_LENGTH} characters.`;

  if (Object.keys(errors).length > 0) return { errors };

  return {
    purchase: {
      merchant,
      amount,
      purchase_date: date,
      category: category as Category,
      card_id: cardId,
      notes: notes || null,
    },
  };
}

// "2026-10-29" is real; "2026-02-30" and "yesterday" aren't.
function isRealDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
