"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { CardTag } from "@/app/components/code-tag";
import { formatMoney } from "@/lib/format";

const BAR_HEIGHT = 8;

type Row = { id: number; name: string; rewards: number; isActive: boolean; code: string | undefined };

// Rewards earned by card. Each row is the card's code, full name, and amount, with
// its bar right underneath, so a long name can wrap and the row just grows. Every
// bar is drawn on one scale from zero, set by the card that earned the most.
export function RewardsChart({ data }: { data: Row[] }) {
  const summary = data.map((card) => `${card.name} ${formatMoney(card.rewards)}`).join(", ");
  const most = Math.max(...data.map((card) => card.rewards));

  return (
    <ul role="img" aria-label={`Rewards by card: ${summary}`} className="space-y-5">
      {data.map((card) => (
        <li key={card.id}>
          <div className="flex items-start gap-2">
            <CardTag card={card} code={card.code} />
            <span className="min-w-0 flex-1 break-words pt-1 text-small font-semibold leading-snug">{card.name}</span>
            <span className="tabular pt-1 text-small font-bold leading-snug">{formatMoney(card.rewards)}</span>
          </div>
          <div className="mt-1.5" style={{ height: BAR_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[card]} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={0}>
                <XAxis type="number" hide domain={[0, most]} />
                <YAxis type="category" dataKey="name" hide />
                <Bar dataKey="rewards" fill="var(--action)" radius={2} minPointSize={3} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </li>
      ))}
    </ul>
  );
}
