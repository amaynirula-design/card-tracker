import type { Card } from "./cards";

// Three-letter codes for cards, like airport codes. Every preset has a fixed code
// chosen by hand, so a card always has the same code in any wallet and no code
// reads as a different card (CSR is always Chase Sapphire Reserve). Any other card
// gets one made from its name.
export const PRESET_CODES: Record<string, string> = {
  "Chase Sapphire Preferred": "CSP",
  "Chase Sapphire Reserve": "CSR",
  "Chase Freedom Unlimited": "CFU",
  "Chase Freedom Flex": "CFF",
  "Chase Freedom Rise": "CFR",
  "American Express Gold": "AMG",
  "American Express Platinum": "AMP",
  "Blue Cash Preferred": "BCP",
  "Blue Cash Everyday": "BCE",
  "Capital One Savor": "SVR",
  "Capital One Savor Student": "SVS",
  "Capital One Venture X": "VTX",
  "Capital One Venture": "VEN",
  "Capital One VentureOne": "VE1",
  "Capital One Quicksilver": "QSV",
  "Capital One Quicksilver Student": "QSS",
  "Citi Double Cash": "CDC",
  "Citi Custom Cash": "CCC",
  "Citi Strata Premier": "CIP",
  "Costco Anywhere Visa": "CAV",
  "Discover it Cash Back": "DCB",
  "Discover it Student Cash Back": "DSB",
  "Discover it Student Chrome": "DSC",
  "Discover it Miles": "DIM",
  "Wells Fargo Active Cash": "WFA",
  "Wells Fargo Autograph": "WFG",
  "Customized Cash Rewards": "BCC",
  "Unlimited Cash Rewards": "BUC",
  "Travel Rewards": "BTR",
  "U.S. Bank Cash+": "USC",
  "Apple Card": "APL",
  "Prime Visa": "PRM",
};

const RESERVED = new Set(Object.values(PRESET_CODES));

// A code from a name's own words: "Acme Travel Visa" is ATV, "Acme Card" is ACA,
// "Zephyr" is ZEP.
export function codeFromName(name: string): string {
  const words = name
    .toUpperCase()
    .replace(/['’]/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  if (words.length === 0) return "•••";
  if (words.length === 1) return words[0].slice(0, 3);
  if (words.length === 2) return words[0][0] + words[1].slice(0, 2);
  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("");
}

// Every card's code, unique within your wallet. Presets get their fixed codes
// first. A card with its own name can't take a preset's code, and if two of them
// would match, the newer one swaps its last letter for one from the end of its name.
export function cardCodes(cards: Pick<Card, "id" | "name">[]): Map<number, string> {
  const codes = new Map<number, string>();
  const used = new Set<string>();
  const oldestFirst = [...cards].sort((a, b) => a.id - b.id);

  for (const card of oldestFirst) {
    const code = PRESET_CODES[card.name];
    if (code && !used.has(code)) {
      codes.set(card.id, code);
      used.add(code);
    }
  }

  for (const card of oldestFirst) {
    if (codes.has(card.id)) continue;
    const base = PRESET_CODES[card.name] ?? codeFromName(card.name);
    const letters = [...card.name.toUpperCase().replace(/[^A-Z0-9 ]/g, "").split(" ").reverse().join("")];
    const numbers = Array.from({ length: cards.length }, (_, index) => String(index + 2));
    const tries = [base, ...[...letters, ...numbers].map((end) => base.slice(0, 2) + end)];
    const code = tries.find((each) => !used.has(each) && !RESERVED.has(each)) ?? base;
    codes.set(card.id, code);
    used.add(code);
  }
  return codes;
}
