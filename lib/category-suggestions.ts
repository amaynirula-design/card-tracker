import type { Category } from "./categories";

// Suggests a category from the merchant's name, for the New Purchase screen. A
// plain list of names, with no AI and nothing sent anywhere. The first match
// wins, so "Uber Eats" is listed under Dining before "Uber" under Transit.
//
// Stores that sell a bit of everything, like Target, Walmart, and Costco, are
// left out on purpose: card issuers treat them differently, so the person
// should choose. "Everything Else" is left out because it's nothing's best guess.
const MERCHANT_WORDS: [Category, string[]][] = [
  [
    "Dining",
    [
      "uber eats", "doordash", "grubhub", "starbucks", "peets", "philz", "blue bottle", "dunkin", "chipotle",
      "mcdonalds", "burger king", "wendys", "taco bell", "kfc", "popeyes", "chick fil a", "in n out",
      "shake shack", "five guys", "panera", "sweetgreen", "cava", "panda express", "dominos", "pizza hut",
      "jack in the box", "restaurant", "cafe", "coffee", "pizza", "pizzeria", "sushi", "taqueria", "bakery",
      "grill", "diner", "bistro", "ramen", "boba",
    ],
  ],
  [
    "Groceries",
    [
      "trader joes", "whole foods", "safeway", "berkeley bowl", "kroger", "albertsons", "aldi", "publix",
      "wegmans", "h mart", "99 ranch", "sprouts", "instacart", "grocery", "groceries", "supermarket",
    ],
  ],
  ["Gas", ["shell", "chevron", "exxon", "mobil", "arco", "valero", "bp", "gas station"]],
  [
    "Travel",
    [
      "delta", "united airlines", "american airlines", "southwest", "jetblue", "alaska airlines", "airlines",
      "airways", "airbnb", "vrbo", "expedia", "booking com", "marriott", "hilton", "hyatt", "hotel", "hertz",
      "enterprise rent a car", "avis",
    ],
  ],
  ["Online Shopping", ["amazon", "ebay", "etsy", "shein", "temu"]],
  [
    "Streaming",
    [
      "netflix", "hulu", "spotify", "disney plus", "hbo max", "youtube premium", "youtube tv", "apple music",
      "peacock", "paramount plus",
    ],
  ],
  ["Drug Stores", ["cvs", "walgreens", "rite aid", "duane reade", "pharmacy", "drugstore"]],
  ["Transit", ["uber", "lyft", "bart", "muni", "caltrain", "clipper", "ac transit", "amtrak", "mta", "parking"]],
];

// "Trader Joe’s #123" → "trader joes 123", so spelling details don't matter.
function simplify(merchant: string): string {
  return merchant
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’.]/g, "")
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function suggestCategory(merchant: string): Category | undefined {
  // Spaces around both sides match whole words, so "shell" isn't in "Seashell".
  const name = ` ${simplify(merchant)} `;
  return MERCHANT_WORDS.find(([, words]) => words.some((word) => name.includes(` ${word} `)))?.[0];
}
