import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/app/components/button";
import { CardTag, CategoryTag } from "@/app/components/code-tag";
import { Screen } from "@/app/components/screen";
import { Row, Section } from "@/app/components/rows";
import { cardCodes } from "@/lib/card-codes";
import { formatNumber, formatRate, rateFor } from "@/lib/cards";
import { formatDate, formatMoney } from "@/lib/format";
import { missedFor } from "@/lib/missed";
import { purchaseRewards } from "@/lib/rewards";
import { getCards } from "../../cards/data";
import { getPurchase } from "../data";
import { StarButton } from "../star-button";

export async function generateMetadata({ params }: PageProps<"/purchases/[id]">): Promise<Metadata> {
  const purchase = await getPurchase((await params).id);
  return { title: `${purchase?.merchant ?? "Not found"} · Card Tracker` };
}

export default async function PurchasePage({ params }: PageProps<"/purchases/[id]">) {
  const { id } = await params;
  const [purchase, cards] = await Promise.all([getPurchase(id), getCards()]);
  if (!purchase) notFound();

  const { card } = purchase;
  const missed = missedFor(purchase, cards);
  const bestNames = missed.bestCards.map((best) => best.name).join(" or ");
  const rewards = purchaseRewards(purchase.amount, card, purchase.category);
  const rate = formatRate(card, rateFor(card, purchase.category));
  const points = purchase.amount * rateFor(card, purchase.category);

  return (
    <Screen
      title={purchase.merchant}
      back={{ href: "/purchases", label: "Purchases" }}
      lead={
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          <div>
            <p className="tabular wide text-display font-extrabold leading-none tracking-tight">
              {formatMoney(purchase.amount)}
            </p>
            <p className="mt-2 text-small text-fg-soft">{formatDate(purchase.date)}</p>
          </div>
          <div className="flex items-center gap-1">
            <StarButton purchaseId={purchase.id} starred={purchase.starred} merchant={purchase.merchant} size="lg" />
            <ButtonLink href={`/purchases/${purchase.id}/edit`} variant="secondary" className="h-10">
              Edit
            </ButtonLink>
          </div>
        </div>
      }
    >
      <div className="space-y-9">
        <Section>
          <Row tag={<CardTag card={card} code={cardCodes(cards).get(card.id)} />} title={card.name} subtitle="Card" />
          <Row tag={<CategoryTag category={purchase.category} />} title={purchase.category} subtitle="Category" />
        </Section>

        <Section
          header="Rewards"
          footer={
            card.rewardType === "points"
              ? `${formatNumber(points)} points at ${formatNumber(card.pointValueCents)}¢ each.`
              : undefined
          }
        >
          <Row
            title="Earned"
            subtitle={`${rate} on ${purchase.category}`}
            trailing={<span className="font-bold">{formatMoney(rewards)}</span>}
          />
          {/* Feature 9: what the best card for this category would have earned. */}
          {missed.missed > 0 ? (
            <Row
              title={
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-missed" />
                  Missed
                </span>
              }
              subtitle={`${bestNames} would have earned ${formatMoney(missed.bestRewards)}`}
              trailing={<span className="font-bold text-missed-ink">{formatMoney(missed.missed)}</span>}
            />
          ) : (
            missed.bestCards.length > 0 && <Row title="Best card" subtitle={`Nothing missed on ${purchase.category}`} />
          )}
        </Section>

        {purchase.notes && (
          <Section header="Notes">
            <li className="whitespace-pre-wrap border-b border-line py-3 leading-snug">{purchase.notes}</li>
          </Section>
        )}
      </div>
    </Screen>
  );
}
