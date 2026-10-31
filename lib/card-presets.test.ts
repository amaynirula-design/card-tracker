import { describe, expect, it } from "vitest";
import { CARD_PRESETS, findPreset } from "./card-presets";

describe("card presets", () => {
  it("gives every preset its own id", () => {
    const ids = CARD_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every preset a base rate for Everything Else", () => {
    const missing = CARD_PRESETS.filter((preset) => !preset.rates["Everything Else"]);
    expect(missing).toEqual([]);
  });

  it("sets every preset's point value to the 1¢ base value", () => {
    const others = CARD_PRESETS.filter((preset) => preset.pointValueCents !== 1);
    expect(others).toEqual([]);
  });

  it("earns 3× on gas with the Chase Sapphire Preferred", () => {
    expect(findPreset("chase-sapphire-preferred")?.rates.Gas).toBe(3);
  });
});
