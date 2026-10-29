import type { Card } from "./cards";

// Card presets (feature 10): common U.S. credit cards with their rewards filled
// in. A built-in list in the code, not a database table (PLAN.md section 3).
// Picking one fills in the New Card form; saving copies the values into the
// user's own card, so editing that card never changes the preset.
//
// Rates are as of mid-2026 and issuers change them. Caps, rotating categories,
// and portal bonuses are approximated with one fixed rate per category, and the
// note says so (PLAN.md section 7). Point values are a starting guess that each
// person can change.

export type CardPreset = Omit<Card, "id" | "isActive"> & {
  id: string;
  issuer: string;
  // What the fixed rates leave out, shown under the form.
  note?: string;
};

export const PRESETS_UPDATED = "mid-2026";

export const CARD_PRESETS: CardPreset[] = [
  {
    id: "chase-sapphire-preferred",
    issuer: "Chase",
    name: "Chase Sapphire Preferred",
    rewardType: "points",
    pointValueCents: 1.25,
    annualFee: 95,
    rates: { Dining: 3, Streaming: 3, Travel: 2, "Everything Else": 1 },
    note: "3× on online groceries and 5× on travel booked through Chase aren't separate categories here.",
  },
  {
    id: "chase-sapphire-reserve",
    issuer: "Chase",
    name: "Chase Sapphire Reserve",
    rewardType: "points",
    pointValueCents: 1.5,
    annualFee: 795,
    rates: { Dining: 3, Travel: 4, "Everything Else": 1 },
    note: "Travel is set to 4× (flights and hotels booked directly). 8× through Chase Travel isn't tracked separately.",
  },
  {
    id: "chase-freedom-unlimited",
    issuer: "Chase",
    name: "Chase Freedom Unlimited",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { Dining: 3, "Drug Stores": 3, "Everything Else": 1.5 },
    note: "Earns Chase points, shown here as cash back at 1¢ each.",
  },
  {
    id: "amex-gold",
    issuer: "American Express",
    name: "American Express Gold",
    rewardType: "points",
    pointValueCents: 1,
    annualFee: 325,
    rates: { Dining: 4, Groceries: 4, Travel: 3, "Everything Else": 1 },
    note: "4× at U.S. supermarkets is capped at $25,000 a year. Travel is 3× on flights booked directly with airlines.",
  },
  {
    id: "amex-blue-cash-preferred",
    issuer: "American Express",
    name: "Blue Cash Preferred",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 95,
    rates: { Groceries: 6, Streaming: 6, Gas: 3, Transit: 3, "Everything Else": 1 },
    note: "6% at U.S. supermarkets is capped at $6,000 a year, then 1%.",
  },
  {
    id: "amex-blue-cash-everyday",
    issuer: "American Express",
    name: "Blue Cash Everyday",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { Groceries: 3, "Online Shopping": 3, Gas: 3, "Everything Else": 1 },
    note: "Each 3% category is capped at $6,000 a year, then 1%.",
  },
  {
    id: "capital-one-savor",
    issuer: "Capital One",
    name: "Capital One Savor",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { Dining: 3, Groceries: 3, Streaming: 3, "Everything Else": 1 },
  },
  {
    id: "capital-one-venture-x",
    issuer: "Capital One",
    name: "Capital One Venture X",
    rewardType: "points",
    pointValueCents: 1,
    annualFee: 395,
    rates: { "Everything Else": 2 },
    note: "10× on hotels and 5× on flights booked through Capital One Travel aren't tracked separately.",
  },
  {
    id: "capital-one-venture",
    issuer: "Capital One",
    name: "Capital One Venture",
    rewardType: "points",
    pointValueCents: 1,
    annualFee: 95,
    rates: { "Everything Else": 2 },
  },
  {
    id: "citi-double-cash",
    issuer: "Citi",
    name: "Citi Double Cash",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { "Everything Else": 2 },
    note: "1% when you buy plus 1% when you pay.",
  },
  {
    id: "citi-custom-cash",
    issuer: "Citi",
    name: "Citi Custom Cash",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { Dining: 5, "Everything Else": 1 },
    note: "5% goes to your top category each month (up to $500). It's set here as Dining — change it to yours.",
  },
  {
    id: "discover-it-cash-back",
    issuer: "Discover",
    name: "Discover it Cash Back",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { "Everything Else": 1 },
    note: "The 5% categories rotate every quarter, so they aren't filled in. Add this quarter's category yourself.",
  },
  {
    id: "wells-fargo-active-cash",
    issuer: "Wells Fargo",
    name: "Wells Fargo Active Cash",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { "Everything Else": 2 },
  },
  {
    id: "apple-card",
    issuer: "Apple",
    name: "Apple Card",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { "Everything Else": 2 },
    note: "2% when you pay with Apple Pay (1% with the physical card). 3% at Apple and select stores isn't a category here.",
  },
  {
    id: "prime-visa",
    issuer: "Amazon",
    name: "Prime Visa",
    rewardType: "cashback",
    pointValueCents: 1,
    annualFee: 0,
    rates: { "Online Shopping": 5, Dining: 2, Gas: 2, Transit: 2, "Everything Else": 1 },
    note: "5% is at Amazon and Whole Foods with a Prime membership, set here as Online Shopping.",
  },
];

export function findPreset(id: string | undefined): CardPreset | undefined {
  return CARD_PRESETS.find((preset) => preset.id === id);
}

// The presets grouped by issuer, in list order, for the picker.
export function presetsByIssuer(): [string, CardPreset[]][] {
  const groups = new Map<string, CardPreset[]>();
  for (const preset of CARD_PRESETS) {
    groups.set(preset.issuer, [...(groups.get(preset.issuer) ?? []), preset]);
  }
  return [...groups];
}
