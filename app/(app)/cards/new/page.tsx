import type { Metadata } from "next";
import { Land } from "@/app/components/screen";
import { Row, Section } from "@/app/components/rows";
import { SheetBar } from "@/app/components/sheet-bar";
import { PRESETS_UPDATED, findPreset, presetsByIssuer, type CardPreset } from "@/lib/card-presets";
import { REWARD_TYPE_LABELS, rateSummary } from "@/lib/cards";
import { saveCard } from "../actions";
import { CardForm } from "../card-form";

export const metadata: Metadata = { title: "New Card · Card Tracker" };

// Adding a card is two steps: pick which card it
// is (feature 10, presets), then check the filled-in form and save. Or skip
// the list and enter the rates yourself.
export default async function NewCardPage({ searchParams }: PageProps<"/cards/new">) {
  const params = await searchParams;
  const preset = findPreset(typeof params.preset === "string" ? params.preset : undefined);

  if (preset || params.manual !== undefined) {
    return (
      <CardForm
        defaults={preset && presetDefaults(preset)}
        note={
          preset &&
          [preset.note, `Preset rates are from ${PRESETS_UPDATED}; check them against your card's terms.`]
            .filter(Boolean)
            .join(" ")
        }
        action={saveCard.bind(null, null)}
        cancelHref="/cards/new"
      />
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <SheetBar title="Add a card" cancelHref="/cards" />
      <div className="pt-2" />
      <Land>
        <p className="leading-snug text-fg-soft">
          Pick your card and its rewards are filled in for you. You can change anything before saving.
        </p>

        <div className="mt-5 space-y-9">
          <Section>
            <Row href="/cards/new?manual" title="Enter rates yourself" subtitle="For a card that isn't listed" />
          </Section>

          {presetsByIssuer().map(([issuer, presets]) => (
            <Section key={issuer} header={issuer}>
              {presets.map((preset) => (
                <Row
                  key={preset.id}
                  href={`/cards/new?preset=${preset.id}`}
                  title={preset.name}
                  subtitle={`${REWARD_TYPE_LABELS[preset.rewardType]} · ${rateSummary(presetDefaults(preset))}`}
                  trailing={preset.annualFee > 0 ? `$${preset.annualFee}` : undefined}
                />
              ))}
            </Section>
          ))}

          <p className="text-small leading-snug text-fg-soft">
            Rates are from {PRESETS_UPDATED} and simplified to one rate per category; issuers change them. Card
            names belong to their issuers. No card numbers are ever stored.
          </p>
        </div>
      </Land>
    </main>
  );
}

// A preset as the starting values for the form (and for rateSummary, which
// needs a card's shape).
function presetDefaults(preset: CardPreset) {
  return {
    id: 0,
    isActive: true,
    name: preset.name,
    rewardType: preset.rewardType,
    pointValueCents: preset.pointValueCents,
    annualFee: preset.annualFee,
    rates: preset.rates,
  };
}
