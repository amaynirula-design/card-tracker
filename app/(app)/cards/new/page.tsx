import type { Metadata } from "next";
import { GroupedSection, ListRow } from "@/app/components/grouped-list";
import { IconPlus } from "@/app/components/icons";
import { SheetBar } from "@/app/components/sheet-bar";
import { PRESETS_UPDATED, findPreset, presetsByIssuer, type CardPreset } from "@/lib/card-presets";
import { REWARD_TYPE_LABELS, rateSummary } from "@/lib/cards";
import { saveCard } from "../actions";
import { CardForm } from "../card-form";

export const metadata: Metadata = { title: "New Card · Card Tracker" };

// Adding a card is two steps, like adding a card in Wallet: pick which card it
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
    <main className="sheet-in mx-auto w-full max-w-xl flex-1 px-4 pb-16">
      <SheetBar title="Add a Card" cancelHref="/cards" />

      <p className="mt-2 px-4 text-subhead leading-snug text-label-secondary">
        Pick your card and its rewards are filled in for you. You can change anything before saving.
      </p>

      <div className="mt-6 space-y-8">
        <GroupedSection>
          <ListRow
            href="/cards/new?manual"
            icon={<IconPlus className="size-[18px]" />}
            title="Enter Rates Yourself"
            subtitle="For a card that isn't listed"
          />
        </GroupedSection>

        {presetsByIssuer().map(([issuer, presets]) => (
          <GroupedSection key={issuer} header={issuer}>
            {presets.map((preset) => (
              <ListRow
                key={preset.id}
                href={`/cards/new?preset=${preset.id}`}
                title={preset.name}
                subtitle={`${REWARD_TYPE_LABELS[preset.rewardType]} · ${rateSummary(presetDefaults(preset))}`}
                trailing={preset.annualFee > 0 ? `$${preset.annualFee}` : undefined}
              />
            ))}
          </GroupedSection>
        ))}

        <p className="px-4 text-footnote leading-snug text-label-secondary">
          Rates are from {PRESETS_UPDATED} and simplified to one rate per category; issuers change them. Card
          names belong to their issuers. No card numbers are ever stored.
        </p>
      </div>
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
