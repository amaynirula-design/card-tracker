import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/button";
import { IconChart } from "@/app/components/icons";
import { dashboardStats, formatPercent, inPeriod, type Period } from "@/lib/dashboard";
import { formatMoney, formatMonth, todayInAppTimeZone } from "@/lib/format";
import { missedSummary } from "@/lib/missed";
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
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-10">
      <h1 className="text-[34px] font-bold leading-tight tracking-tight">Dashboard</h1>

      <div className="mt-4">
        <PeriodSwitch period={period} />
      </div>
      <p className="mt-3 px-1 text-[15px] text-label-secondary">
        {periodLabel} · {stats.purchaseCount} {stats.purchaseCount === 1 ? "purchase" : "purchases"}
      </p>

      {stats.purchaseCount === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <IconChart className="size-8" />
          </span>
          <h2 className="mt-5 text-[22px] font-semibold tracking-tight">
            {period === "month" && purchases.length > 0 ? "Nothing yet this month" : "No purchases yet"}
          </h2>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-label-secondary">
            {period === "month" && purchases.length > 0
              ? "Switch to All Time to see everything, or log this month's first purchase."
              : "Log a few purchases and your rewards show up here."}
          </p>
          <ButtonLink href="/purchases/new" size="lg" className="mt-6 w-full max-w-xs">
            Add a purchase
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {/* The headline number, largest, like the top tile in the Health app. */}
          <Tile label="Rewards earned" accent>
            <p className="tabular text-[40px] font-bold leading-none tracking-tight">{formatMoney(stats.totalRewards)}</p>
            <p className="mt-2 text-[15px] text-label-secondary">
              on {formatMoney(stats.totalSpend)} of spending
            </p>
          </Tile>

          {/* Feature 9: what using the wrong card cost, and the one change that fixes most of it. */}
          <Tile label={period === "month" ? "Missed this month" : "Missed rewards"}>
            {missed.totalMissed > 0 ? (
              <>
                <p className="tabular text-[40px] font-bold leading-none tracking-tight">
                  {formatMoney(missed.totalMissed)}
                </p>
                <p className="mt-2 text-[15px] text-label-secondary">
                  left on the table on {missed.missedCount} {missed.missedCount === 1 ? "purchase" : "purchases"}
                </p>
                {missed.biggest && missed.biggest.bestCards.length > 0 && (
                  <p className="mt-3 border-t border-separator pt-3 text-[15px]">
                    Use <span className="font-semibold">{missed.biggest.bestCards.map((card) => card.name).join(" or ")}</span>{" "}
                    for {missed.biggest.category} to save the most ({formatMoney(missed.biggest.missed)}).
                  </p>
                )}
              </>
            ) : (
              <p className="text-[17px]">You used your best card every time. Nothing missed.</p>
            )}
          </Tile>

          <div className="grid grid-cols-2 gap-4">
            <Tile label="Total spend">
              <p className="tabular text-[28px] font-bold leading-none tracking-tight">{formatMoney(stats.totalSpend)}</p>
            </Tile>
            <Tile label="Effective rate">
              <p className="tabular text-[28px] font-bold leading-none tracking-tight">
                {formatPercent(stats.effectiveRate)}
              </p>
              <p className="mt-1.5 text-[13px] text-label-secondary">back on every dollar</p>
            </Tile>
          </div>

          <Tile label="Rewards by card">
            <div className="-mx-1 mt-1">
              <RewardsChart data={stats.byCard.map(({ name, rewards }) => ({ name, rewards }))} />
            </div>
          </Tile>
        </div>
      )}
    </main>
  );
}

// A rounded summary panel with a small label on top.
function Tile({ label, accent, children }: { label: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow-panel">
      <h2 className={["mb-3 text-[15px] font-semibold", accent ? "text-accent" : "text-label-secondary"].join(" ")}>
        {label}
      </h2>
      {children}
    </section>
  );
}
