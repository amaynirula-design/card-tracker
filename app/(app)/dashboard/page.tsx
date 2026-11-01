import type { Metadata } from "next";
import { EmptyState } from "@/app/components/empty-state";
import { Screen } from "@/app/components/screen";
import { Row, Section } from "@/app/components/rows";
import { cardCodes } from "@/lib/card-codes";
import { dashboardStats, formatPercent, inPeriod, type Period } from "@/lib/dashboard";
import { formatMoney, formatMonth, todayInAppTimeZone } from "@/lib/format";
import { missedSummary, type MissedSummary } from "@/lib/missed";
import { getCards } from "../cards/data";
import { getPurchases } from "../purchases/data";
import { PeriodSwitch } from "./period-switch";
import { RewardsChart } from "./rewards-chart";
import { RewardsRoute } from "./rewards-route";

export const metadata: Metadata = { title: "Dashboard · Card Tracker" };

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const period: Period = (await searchParams).period === "all" ? "all" : "month";
  const today = todayInAppTimeZone();
  const [purchases, cards] = await Promise.all([getPurchases(), getCards()]);
  const inRange = inPeriod(purchases, period, today);
  const stats = dashboardStats(inRange);
  const missed = missedSummary(inRange, cards);
  const codes = cardCodes(cards);
  const empty = stats.purchaseCount === 0;

  return (
    <Screen
      title="Dashboard"
      lead={
        <>
          <div className="mt-4">
            <PeriodSwitch period={period} />
          </div>
          {!empty && (
            <Missed
              when={period === "month" ? `in ${formatMonth(today)}` : "so far"}
              purchaseCount={stats.purchaseCount}
              earned={stats.totalRewards}
              missed={missed}
            />
          )}
        </>
      }
    >
      {empty ? (
        <EmptyState
          title={period === "month" && purchases.length > 0 ? "Nothing yet this month" : "No purchases yet"}
          text={
            period === "month" && purchases.length > 0
              ? "Switch to All time to see everything, or log this month's first purchase."
              : "Log a few purchases and your rewards show up here."
          }
          href="/purchases/new"
          action="Add a purchase"
        />
      ) : (
        <div className="space-y-9">
          <Section>
            <Row
              title="Total rewards"
              trailing={<span className="text-lead font-extrabold">{formatMoney(stats.totalRewards)}</span>}
            />
            <Row
              title="Total spend"
              trailing={<span className="text-lead font-extrabold">{formatMoney(stats.totalSpend)}</span>}
            />
            <Row
              title="Effective rate"
              subtitle="Back on every dollar"
              trailing={<span className="text-lead font-extrabold">{formatPercent(stats.effectiveRate)}</span>}
            />
          </Section>

          <section>
            <h2 className="text-small font-bold">Rewards by card</h2>
            {stats.byCard.length > 1 && stats.byCard[0].rewards > stats.byCard[1].rewards && (
              <p className="mt-1 text-fg-soft">{stats.byCard[0].name} earned the most.</p>
            )}
            <div className="mt-3">
              <RewardsChart
                data={stats.byCard.map(({ cardId, name, rewards }) => {
                  const card = cards.find((each) => each.id === cardId);
                  return { id: cardId, name, rewards, isActive: card?.isActive ?? false, code: codes.get(cardId) };
                })}
              />
            </div>
          </section>
        </div>
      )}
    </Screen>
  );
}

// The dashboard's headline (feature 9): what using the wrong card cost in one
// sentence, the one change that fixes most of it, then the route.
function Missed({
  when,
  purchaseCount,
  earned,
  missed,
}: {
  // "in October 2026" or "so far".
  when: string;
  purchaseCount: number;
  earned: number;
  missed: MissedSummary;
}) {
  const biggest = missed.biggest;
  const purchases = purchaseCount === 1 ? "purchase" : "purchases";
  return (
    <section aria-label="Missed rewards" className="mt-5">
      {missed.totalMissed > 0 ? (
        <>
          <p className="wide text-title font-extrabold leading-[1.15] tracking-tight">
            You left{" "}
            <span className="tabular whitespace-nowrap rounded-[5px] bg-missed px-1.5 text-ink">
              {formatMoney(missed.totalMissed)}
            </span>{" "}
            on the table {when}.
          </p>
          <p className="mt-2 leading-snug text-fg-soft">
            Across {missed.missedCount} of {purchaseCount} {purchases}.
            {biggest && biggest.bestCards.length > 0 && (
              <>
                {" "}
                Use <span className="font-bold text-fg">{biggest.bestCards.map((card) => card.name).join(" or ")}</span>{" "}
                for {biggest.category} to save the most ({formatMoney(biggest.missed)}).
              </>
            )}
          </p>
        </>
      ) : (
        <>
          <p className="wide text-title font-extrabold leading-[1.15] tracking-tight">
            You used your best card every time {when}.
          </p>
          <p className="mt-2 leading-snug text-fg-soft">
            Across {purchaseCount} {purchases}.
          </p>
        </>
      )}
      <RewardsRoute earned={earned} missed={missed.totalMissed} />
    </section>
  );
}
