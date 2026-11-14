import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { CategoryTag } from "@/app/components/code-tag";
import { EmptyState } from "@/app/components/empty-state";
import { Row, Section } from "@/app/components/rows";
import { Screen } from "@/app/components/screen";
import { PERKS_UPDATED, PRESETS_UPDATED } from "@/lib/card-presets";
import { suggestCards, withPerks, yearlySpend, type Suggestion } from "@/lib/card-suggestions";
import { formatNumber } from "@/lib/cards";
import { formatWholeMoney as money, todayInAppTimeZone } from "@/lib/format";
import { getPurchases } from "../../purchases/data";
import { getCards } from "../data";

export const metadata: Metadata = { title: "Cards Worth Adding · Card Tracker" };

// Card suggestions: preset cards you don't have that would earn more on what you
// actually spend, with their fee and perks counted. The math is in
// lib/card-suggestions.ts.
export default async function SuggestedCardsPage() {
  const [cards, purchases] = await Promise.all([getCards(), getPurchases()]);
  const spend = yearlySpend(purchases, todayInAppTimeZone());
  const suggestions = suggestCards(cards, spend);

  return (
    <Screen
      title="Cards worth adding"
      eyebrow="Suggestions"
      back={{ href: "/cards", label: "Cards" }}
      lead={
        spend.total > 0 && (
          <p className="mt-3 leading-relaxed text-fg-soft">
            Based on {spend.days === 1 ? "1 day" : `${spend.days} days`} of purchases, you spend about{" "}
            <span className="tabular font-semibold text-fg">{money(spend.total)}</span> a year.
            Each card below is compared with the best card you already have in each category.
          </p>
        )
      }
    >
      {spend.total <= 0 ? (
        <EmptyState
          title="Log a few purchases first"
          text="Suggestions come from what you actually spend, so they appear once you've logged some purchases."
          href="/purchases/new"
          action="Add a purchase"
        />
      ) : suggestions.length === 0 ? (
        <EmptyState
          title="Your cards already cover you"
          text="No card in our list would earn you enough more on your spending to be worth adding. Check back as you log more."
        />
      ) : (
        <div className="space-y-10">
          {suggestions.map((suggestion) => (
            <SuggestionSection key={suggestion.preset.id} suggestion={suggestion} />
          ))}
          <p className="text-small leading-snug text-fg-soft">
            An estimate, not financial advice. It scales your purchases so far to a year and uses one rate per
            category, so spending caps and rotating categories aren&rsquo;t reflected. Rates are from {PRESETS_UPDATED}{" "}
            and perks from {PERKS_UPDATED}; issuers change both, and approval isn&rsquo;t guaranteed. Check the
            card&rsquo;s terms before you apply.
          </p>
        </div>
      )}
    </Screen>
  );
}

function SuggestionSection({ suggestion }: { suggestion: Suggestion }) {
  const { preset, extraRewards, net, perksValue, worthIt, perksNeeded, gains } = suggestion;
  const fee = preset.annualFee;
  const perks = preset.perks ?? [];

  return (
    <Section header={preset.name}>
      {/* The verdict, then where it comes from. */}
      <div className="py-4">
        <p className="display text-title leading-tight">
          {worthIt === "rewards" ? (
            <>
              About <span className="tabular font-semibold text-action">{money(net)}</span> more a
              year
            </>
          ) : (
            <>Worth it if you use its credits</>
          )}
        </p>
        <p className="mt-2 text-small leading-snug text-fg-soft">
          {worthIt === "rewards" ? (
            fee > 0 ? (
              <>
                {money(extraRewards)} in extra rewards, minus the {money(fee)} annual fee.
                {perksValue > 0 && <> Up to {money(perksValue)} more if you use its credits.</>}
              </>
            ) : (
              <>In extra rewards, with no annual fee.</>
            )
          ) : (
            <>
              {money(extraRewards)} in extra rewards doesn&rsquo;t cover the {money(fee)} fee
              by itself. Using about {money(perksNeeded)} of its {money(perksValue)} in credits
              would. Used in full, it adds about {money(withPerks(suggestion))} a year.
            </>
          )}
        </p>
      </div>

      {gains.slice(0, 3).map((gain) => (
        <Row
          key={gain.category}
          tag={<CategoryTag category={gain.category} />}
          title={gain.category}
          subtitle={`${formatNumber(gain.newPercent)}% instead of ${formatNumber(gain.currentPercent)}% on about ${money(
            Math.round(gain.spend),
          )} a year`}
          trailing={<span className="font-bold">+{money(gain.gain)}</span>}
        />
      ))}

      {perks.length > 0 && (
        <div className="pt-4">
          <h3 className="text-small font-semibold">Perks that offset the fee</h3>
          <ul className="mt-2 space-y-1.5 text-small leading-snug">
            {perks.map((perk) => (
              <li key={perk.label} className="flex justify-between gap-4">
                <span>{perk.label}</span>
                {perk.value !== undefined && <span className="tabular shrink-0 font-semibold">{money(perk.value)}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-5">
        <ButtonLink href={`/cards/new?preset=${preset.id}`} variant="secondary" className="w-full sm:w-auto">
          Add this card
        </ButtonLink>
      </div>
    </Section>
  );
}
