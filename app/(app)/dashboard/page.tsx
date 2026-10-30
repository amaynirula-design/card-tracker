import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { IconChart } from "@/app/components/icons";
import { LargeTitle } from "@/app/components/large-title";
import { dashboardStats, formatPercent, inPeriod, type Period } from "@/lib/dashboard";
import { formatMoney, formatMonth, todayInAppTimeZone } from "@/lib/format";
import { missedSummary, type MissedSummary } from "@/lib/missed";
import { getCards } from "../cards/data";
import { getPurchases } from "../purchases/data";
import { PeriodSwitch } from "./period-switch";
import { RewardsChart } from "./rewards-chart";

export const metadata: Metadata = { title: "Dashboard · Card Tracker" };

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const period: Period = (await searchParams).period === "all" ? "all" : "month";
  const today = todayInAppTimeZone();
  const [purchases, cards] = await Promise.all([getPurchases(), getCards()]);
  const inRange = inPeriod(purchases, period, today);
  const stats = dashboardStats(inRange);
  const missed = missedSummary(inRange, cards);
  const periodLabel = period === "month" ? formatMonth(today) : "All time";

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-5 md:pt-10">
      <LargeTitle>Dashboard</LargeTitle>

      <div className="mt-4">
        <PeriodSwitch period={period} />
      </div>
      <p className="mt-3 px-1 text-subhead text-label-secondary">
        {periodLabel} · {stats.purchaseCount} {stats.purchaseCount === 1 ? "purchase" : "purchases"}
      </p>

      {stats.purchaseCount === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-fill text-label-secondary">
            <IconChart className="size-8" />
          </span>
          <h2 className="mt-5 text-title2 font-semibold tracking-tight">
            {period === "month" && purchases.length > 0 ? "Nothing yet this month" : "No purchases yet"}
          </h2>
          <p className="mt-2 max-w-xs text-subhead leading-relaxed text-label-secondary">
            {period === "month" && purchases.length > 0
              ? "Switch to All Time to see everything, or log this month's first purchase."
              : "Log a few purchases and your rewards show up here."}
          </p>
          <ButtonLink href="/purchases/new" size="lg" className="mt-6 w-full max-w-xs">
            Add a Purchase
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <MissedHero period={period} missed={missed} />

          <div className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-4">
            <Tile label="Rewards Earned">
              <Stat>{formatMoney(stats.totalRewards)}</Stat>
            </Tile>
            <Tile label="Total Spend">
              <Stat>{formatMoney(stats.totalSpend)}</Stat>
            </Tile>
            <div className="[grid-column:1/-1]">
              <Tile label="Effective Rate">
                <Stat>{formatPercent(stats.effectiveRate)}</Stat>
                <p className="mt-1.5 text-footnote text-label-secondary">back on every dollar</p>
              </Tile>
            </div>
          </div>

          <Tile label="Rewards by Card">
            {stats.byCard.length > 1 && stats.byCard[0].rewards > stats.byCard[1].rewards && (
              <p className="-mt-1 mb-3 text-subhead">{stats.byCard[0].name} earned the most.</p>
            )}
            <div className="-mx-1 mt-1">
              <RewardsChart data={stats.byCard.map(({ name, rewards }) => ({ name, rewards }))} />
            </div>
          </Tile>
        </div>
      )}
    </main>
  );
}

// The app's one bold moment (feature 9): what using the wrong card cost, in a
// single large sentence, and the one change that fixes most of it.
function MissedHero({ period, missed }: { period: Period; missed: MissedSummary }) {
  const biggest = missed.biggest;
  return (
    <section aria-label="Missed rewards" className="px-1 pb-3 pt-2">
      {missed.totalMissed > 0 ? (
        <>
          <p className="text-large-title font-bold leading-tight tracking-tight text-label-secondary">
            You left <span className="tabular text-label">{formatMoney(missed.totalMissed)}</span> on the table{" "}
            {period === "month" ? "this month" : "so far"}.
          </p>
          <p className="mt-3 text-subhead text-label-secondary">
            Across {missed.missedCount} {missed.missedCount === 1 ? "purchase" : "purchases"}.
            {biggest && biggest.bestCards.length > 0 && (
              <>
                {" "}
                Use <span className="font-semibold text-label">{biggest.bestCards.map((card) => card.name).join(" or ")}</span>{" "}
                for {biggest.category} to save the most ({formatMoney(biggest.missed)}).
              </>
            )}
          </p>
        </>
      ) : (
        <p className="text-large-title font-bold leading-tight tracking-tight text-label-secondary">
          You used your <span className="text-label">best card</span> every time.
        </p>
      )}
    </section>
  );
}

function Stat({ children }: { children: React.ReactNode }) {
  return <p className="tabular text-title1 font-bold leading-none tracking-tight">{children}</p>;
}

// A rounded summary panel with a small label on top.
function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow-panel">
      <h2 className="mb-3 text-subhead font-semibold text-label-secondary">{label}</h2>
      {children}
    </section>
  );
}
