import { formatMoney } from "@/lib/format";
import { earnedShare } from "@/lib/missed";

// The dashboard's one bold moment: how much of the rewards you could have earned
// you actually did, as a ring like the Activity rings. The numbers are in text
// in the middle, so the ring never carries the meaning on its own.
export function RewardsRing({ earned, missed }: { earned: number; missed: number }) {
  return (
    <div className="relative mx-auto aspect-square w-52 max-w-full">
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="43" fill="none" stroke="var(--fill-strong)" strokeWidth="12" />
        <circle
          cx="50"
          cy="50"
          r="43"
          fill="none"
          stroke="var(--accent-fill)"
          strokeWidth="12"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${earnedShare(earned, missed)} 100`}
          className="ring-in"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-footnote text-label-secondary">Earned</p>
        <p className="tabular text-title1 font-bold leading-tight tracking-tight">{formatMoney(earned)}</p>
        <p className="tabular text-footnote text-label-secondary">of {formatMoney(earned + missed)} possible</p>
      </div>
    </div>
  );
}
