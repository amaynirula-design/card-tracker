import { bestCardFor } from "./best-card";
import { CARD_PRESETS, type CardPreset } from "./card-presets";
import { rewardPercent, type Card } from "./cards";
import { CATEGORIES, type Category } from "./categories";

// Card suggestions: which preset cards you don't have yet would earn you more on
// what you actually spend. Plain functions with no database, so they can be tested.
//
// The idea, for each card in the preset list:
//   1. Scale your logged purchases up to a year.
//   2. In each category, compare what the new card earns with the best card you
//      already have open there. Only the gains count: you'd keep using your
//      current card wherever it's better.
//   3. Subtract the annual fee.
// Perks (like a dining credit) are listed with what they're worth, but they only
// count if you'd really use them, so a card that needs them to break even is
// marked that way instead of ranked as a sure win.

// Fewer days than this of history would scale a single purchase up to a silly
// yearly number, so a short history is treated as one month.
const MIN_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export type SpendInput = { amount: number; category: Category; date: string };

export type YearlySpend = {
  // Dollars a year in each category you've spent in.
  byCategory: Partial<Record<Category, number>>;
  total: number;
  // How many days of purchases the estimate is based on.
  days: number;
};

// Your spending scaled to a year: everything from your first purchase to today.
export function yearlySpend(purchases: SpendInput[], today: string): YearlySpend {
  if (purchases.length === 0) return { byCategory: {}, total: 0, days: 0 };

  const first = purchases.reduce((earliest, purchase) => (purchase.date < earliest ? purchase.date : earliest), today);
  const span = Math.round((Date.parse(today) - Date.parse(first)) / DAY_MS) + 1;
  const days = Math.max(MIN_DAYS, span);
  const scale = 365 / days;

  const byCategory: Partial<Record<Category, number>> = {};
  let total = 0;
  for (const { amount, category } of purchases) {
    byCategory[category] = (byCategory[category] ?? 0) + amount * scale;
    total += amount * scale;
  }
  return { byCategory, total, days: span };
}

export type CategoryGain = {
  category: Category;
  // What you spend there in a year.
  spend: number;
  // What your best open card earns there now, and what the new card would.
  currentPercent: number;
  newPercent: number;
  // Extra dollars a year.
  gain: number;
};

export type Suggestion = {
  preset: CardPreset;
  // Extra rewards a year on your spending, before the fee.
  extraRewards: number;
  // extraRewards minus the annual fee: what the card adds before any perks.
  net: number;
  // The most the listed perks are worth in a year, if you use all of them.
  perksValue: number;
  // "rewards": it pays for itself on rewards alone.
  // "perks": only if you use enough of its credits to cover the rest of the fee.
  worthIt: "rewards" | "perks";
  // How much of the perks you'd need to use to cover the rest of the fee (0 for "rewards").
  perksNeeded: number;
  // Where the extra rewards come from, biggest first.
  gains: CategoryGain[];
};

// Below a few dollars a year isn't worth opening a card for.
const MIN_WORTH = 5;

// Whether you already have this card. Matches on the name, ignoring capitals and
// spaces, so a card added from the preset (or typed the same way) counts.
function owns(cards: Pick<Card, "name">[], preset: CardPreset): boolean {
  const clean = (text: string) => text.trim().replace(/\s+/g, " ").toLowerCase();
  return cards.some((card) => clean(card.name) === clean(preset.name));
}

function asCard(preset: CardPreset): Card {
  const { name, rewardType, pointValueCents, annualFee, rates } = preset;
  return { id: -1, name, rewardType, pointValueCents, annualFee, isActive: true, rates };
}

// Every preset you don't have, valued against your spending.
export function scoreCards(cards: Card[], spend: YearlySpend, presets: CardPreset[] = CARD_PRESETS): Suggestion[] {
  return presets.filter((preset) => !owns(cards, preset)).map((preset) => score(cards, spend, preset));
}

function score(cards: Card[], spend: YearlySpend, preset: CardPreset): Suggestion {
  const candidate = asCard(preset);
  const gains: CategoryGain[] = [];

  for (const category of CATEGORIES) {
    const amount = spend.byCategory[category] ?? 0;
    if (amount <= 0) continue;
    const currentPercent = bestCardFor(cards, category).percent;
    const newPercent = rewardPercent(candidate, category);
    if (newPercent <= currentPercent) continue;
    gains.push({
      category,
      spend: amount,
      currentPercent,
      newPercent,
      gain: (amount * (newPercent - currentPercent)) / 100,
    });
  }
  gains.sort((a, b) => b.gain - a.gain);

  const extraRewards = gains.reduce((sum, each) => sum + each.gain, 0);
  const net = extraRewards - preset.annualFee;
  const perksValue = (preset.perks ?? []).reduce((sum, perk) => sum + (perk.value ?? 0), 0);
  const onRewards = net >= MIN_WORTH;

  return {
    preset,
    extraRewards,
    net,
    perksValue,
    worthIt: onRewards ? "rewards" : "perks",
    perksNeeded: onRewards ? 0 : -net,
    gains,
  };
}

// The cards worth suggesting, best first, at most `limit` of them. A card is in
// if it pays for itself on rewards alone, or if its perks could cover the rest of
// the fee. They're ranked by what they'd add a year if you used every perk, and
// each one says whether it needs the perks to be worth it.
// A card that doesn't earn you anything extra is never suggested for its perks
// alone: the app is about rewards on what you already buy.
export function suggestCards(
  cards: Card[],
  spend: YearlySpend,
  limit = 3,
  presets: CardPreset[] = CARD_PRESETS,
): Suggestion[] {
  if (spend.total <= 0) return [];
  return scoreCards(cards, spend, presets)
    .filter((each) => each.extraRewards > 0)
    .filter((each) => each.worthIt === "rewards" || each.perksValue >= each.perksNeeded + MIN_WORTH)
    .sort((a, b) => withPerks(b) - withPerks(a))
    .slice(0, limit);
}

// What a card adds in a year if you use every one of its perks.
export function withPerks(suggestion: Suggestion): number {
  return suggestion.net + suggestion.perksValue;
}
