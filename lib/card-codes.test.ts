import { describe, expect, it } from "vitest";
import { CARD_PRESETS } from "./card-presets";
import { PRESET_CODES, cardCodes, codeFromName } from "./card-codes";

describe("codes made from a name", () => {
  it("uses the first letters of a three-word name", () => {
    expect(codeFromName("Acme Travel Visa")).toBe("ATV");
  });

  it("works for two words, one word, and punctuation", () => {
    expect(codeFromName("Acme Card")).toBe("ACA");
    expect(codeFromName("zephyr")).toBe("ZEP");
    expect(codeFromName("Trader Joe's Rewards")).toBe("TJR");
  });

  it("still shows something for a name with no letters", () => {
    expect(codeFromName("✈️")).toBe("•••");
  });
});

describe("preset codes", () => {
  it("covers every preset", () => {
    expect(CARD_PRESETS.filter((preset) => !PRESET_CODES[preset.name])).toEqual([]);
  });

  it("gives every preset a different three-character code", () => {
    const codes = CARD_PRESETS.map((preset) => PRESET_CODES[preset.name]);
    expect(new Set(codes).size).toBe(CARD_PRESETS.length);
    expect(codes.every((code) => code.length === 3)).toBe(true);
  });
});

describe("wallet codes", () => {
  const sapphire = { name: "Chase Sapphire Preferred" };
  const reserve = { name: "Chase Sapphire Reserve" };
  const strata = { name: "Citi Strata Premier" };

  it("gives a preset the same code whatever order cards were added", () => {
    const expected = ["CSP", "CSR", "CIP"];
    const first = cardCodes([{ id: 1, ...sapphire }, { id: 2, ...reserve }, { id: 3, ...strata }]);
    const second = cardCodes([{ id: 1, ...strata }, { id: 2, ...sapphire }, { id: 3, ...reserve }]);
    expect([first.get(1), first.get(2), first.get(3)]).toEqual(expected);
    expect([second.get(2), second.get(3), second.get(1)]).toEqual(expected);
  });

  it("keeps a preset's code after another card is deleted", () => {
    expect(cardCodes([{ id: 3, ...strata }]).get(3)).toBe("CIP");
  });

  it("never gives a card of your own a preset's code", () => {
    const codes = cardCodes([{ id: 1, name: "Credit Silver Rewards" }]);
    expect(codeFromName("Credit Silver Rewards")).toBe("CSR");
    expect(codes.get(1)).not.toBe("CSR");
  });

  it("keeps two cards of your own apart", () => {
    const codes = cardCodes([
      { id: 1, name: "Acme Travel Visa" },
      { id: 2, name: "Acme Teal Visa" },
    ]);
    expect(codes.get(1)).toBe("ATV");
    expect(codes.get(2)).not.toBe("ATV");
  });

  it("stays unique even for identical names", () => {
    const cards = [1, 2, 3, 4, 5, 6].map((id) => ({ id, name: "Gold" }));
    expect(new Set(cardCodes(cards).values()).size).toBe(6);
    const twins = [1, 2].map((id) => ({ id, ...sapphire }));
    expect(new Set(cardCodes(twins).values()).size).toBe(2);
  });
});
