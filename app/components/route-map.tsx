"use client";

import { useEffect, useRef, useState } from "react";
import { cardColor } from "@/lib/card-colors";
import { cardCodes } from "@/lib/card-codes";
import { formatNumber, type Card } from "@/lib/cards";
import { CATEGORY_CODES, type Category } from "@/lib/categories";
import { labelRows, routeScale, routeStops } from "@/lib/route-map";

// The app's signature: the category is the origin on the left, and a route flies
// to each of your open cards. How far a card sits along the axis is what a dollar
// earns there, on one scale that stays put from category to category. The winner
// is the thick yellow route. Everything here is also in the ranked list beside the
// map, as text, so the map never carries the meaning on its own.

const WIDTH = 390;
const HEIGHT = 250;
const ORIGIN = 30;
const END = 360;
const BASELINE = 186;
// A route's control point, as a share of its length. The peak is half of this.
const LIFT = 0.84;
const LABEL_WIDTH = 42;
const LABEL_ROWS = [BASELINE + 38, BASELINE + 58];

// Moves numbers toward new values with a quick ease-out, so routes swing to their
// new stops. Done by hand because Safari can't animate an SVG path's shape in CSS.
function useTween(targets: number[]) {
  const [values, setValues] = useState(targets);
  const current = useRef(targets);
  const key = targets.join(",");

  useEffect(() => {
    const goal = key.split(",").map(Number);
    const begin = current.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 420;
    const start = performance.now();
    let frame = 0;

    function step(now: number) {
      const progress = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      const next = goal.map((value, index) => begin[index] + (value - begin[index]) * eased);
      current.current = next;
      setValues(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [key]);

  return values;
}

export function RouteMap({ cards, category }: { cards: Card[]; category: Category }) {
  const open = cards.filter((card) => card.isActive);
  const stops = routeStops(open, category);
  const codes = cardCodes(cards);
  const scale = routeScale(open);
  const step = scale > 10 ? 5 : scale > 6 ? 2 : 1;
  const ticks = Array.from({ length: Math.floor(scale / step) }, (_, index) => (index + 1) * step);

  const xFor = (percent: number) => ORIGIN + (percent / scale) * (END - ORIGIN);

  // One animated value per card, in a fixed order, so each route keeps its identity.
  const percents = useTween(open.map((card) => stops.find((stop) => stop.card === card)?.percent ?? 0));
  const shownPercent = (card: Card) => percents[open.indexOf(card)] ?? 0;

  // The origin's label is placed first, then the best cards.
  const rows = labelRows([ORIGIN, ...stops.map((stop) => xFor(stop.percent))], LABEL_WIDTH, LABEL_ROWS.length).slice(1);

  const winner = stops[0];
  const winnerX = xFor(shownPercent(winner.card));
  const peak = BASELINE - (winnerX - ORIGIN) * (LIFT / 2);

  const summary = stops
    .map((stop) => `${stop.card.name} ${formatNumber(stop.percent)}%`)
    .join(", ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`${category}, percent back by card: ${summary}.`}
      className="block w-full"
    >
      {/* The axis, in percent back. */}
      <line x1={ORIGIN} x2={END} y1={BASELINE} y2={BASELINE} stroke="var(--line)" strokeWidth="1.5" />
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={xFor(tick)} x2={xFor(tick)} y1={BASELINE} y2={BASELINE + 6} stroke="var(--fg-soft)" strokeWidth="1.5" />
          <text
            x={xFor(tick)}
            y={BASELINE + 20}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="var(--fg-soft)"
            className="tabular"
          >
            {tick}%
          </text>
        </g>
      ))}

      {/* Quieter routes first, so the winner draws on top. */}
      {[...stops].reverse().map(({ card, winner: won }) => {
        const toX = xFor(shownPercent(card));
        const length = toX - ORIGIN;
        return (
          <path
            key={card.id}
            d={`M${ORIGIN} ${BASELINE}Q${(ORIGIN + toX) / 2} ${BASELINE - length * LIFT} ${toX} ${BASELINE}`}
            fill="none"
            stroke={won ? "var(--winner)" : cardColor(card)}
            strokeWidth={won ? 6 : 2.5}
            strokeLinecap="round"
            strokeDasharray={won ? undefined : "3 7"}
            className="route"
          />
        );
      })}

      <circle cx={ORIGIN} cy={BASELINE} r="9" fill="#fff" />
      {stops.map(({ card, winner: won }) => (
        <circle
          key={card.id}
          cx={xFor(shownPercent(card))}
          cy={BASELINE}
          r={won ? 9 : 6}
          fill={won ? "var(--winner)" : cardColor(card)}
        />
      ))}

      <text
        x={(ORIGIN + winnerX) / 2}
        y={peak - 12}
        textAnchor="middle"
        fontSize="38"
        fontWeight="800"
        fill="var(--winner)"
        className="tabular wide"
      >
        {formatNumber(winner.percent)}%
      </text>

      <text x={ORIGIN} y={LABEL_ROWS[0]} textAnchor="middle" fontSize="15" fill="#fff" className="code">
        {CATEGORY_CODES[category]}
      </text>
      {stops.map(({ card, winner: won }, index) => {
        const row = rows[index];
        if (row === null) return null;
        return (
          <text
            key={card.id}
            x={Math.min(xFor(shownPercent(card)), WIDTH - LABEL_WIDTH / 2)}
            y={LABEL_ROWS[row]}
            textAnchor="middle"
            fontSize="15"
            fill={won ? "var(--winner)" : "#fff"}
            className="code"
          >
            {codes.get(card.id)}
          </text>
        );
      })}
    </svg>
  );
}
