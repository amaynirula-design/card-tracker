"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatMoney } from "@/lib/format";

const ROW_HEIGHT = 48;
const MAX_NAME_LENGTH = 16;

// Rewards earned by card, as horizontal bars (card names read better down the
// side than squeezed under columns on a phone). Rounded bars and no gridlines,
// like the Health app.
export function RewardsChart({ data }: { data: { name: string; rewards: number }[] }) {
  const summary = data.map((card) => `${card.name} ${formatMoney(card.rewards)}`).join(", ");

  return (
    <div role="img" aria-label={`Rewards by card: ${summary}`} style={{ height: data.length * ROW_HEIGHT + 8 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 72, bottom: 4, left: 0 }} barCategoryGap={10}>
          <XAxis type="number" hide domain={[0, "dataMax"]} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--label-secondary)", fontSize: 13 }}
            tickFormatter={(name: string) =>
              name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH - 1)}…` : name
            }
          />
          <Bar dataKey="rewards" fill="var(--accent)" radius={[0, 6, 6, 0]} minPointSize={3} isAnimationActive={false}>
            <LabelList
              dataKey="rewards"
              position="right"
              formatter={(value) => formatMoney(Number(value))}
              style={{ fill: "var(--label)", fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
