import { formatMoney } from "@/lib/format";
import { earnedShare } from "@/lib/missed";

// How much of the rewards you could have earned you actually did, drawn as one
// route to scale: solid for what you earned, dashed orange for what you missed.
// The numbers are in text underneath, so the line never carries the meaning on its own.
export function RewardsRoute({ earned, missed }: { earned: number; missed: number }) {
  const share = earnedShare(earned, missed);
  return (
    <div className="mt-5">
      <div aria-hidden="true" className="relative mx-1.5 h-3.5">
        <span className="absolute inset-y-1 left-0 bg-white" style={{ width: `${share}%` }} />
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 border-t-[3px] border-dashed border-missed"
          style={{ left: `${share}%` }}
        />
        <Stop left={0} className="bg-white" />
        <Stop left={share} className="bg-white" />
        {missed > 0 && <Stop left={100} className="bg-missed" />}
      </div>
      <p className="tabular mt-2 flex flex-wrap justify-between gap-x-4 text-small">
        <span>Earned {formatMoney(earned)}</span>
        <span className="text-fg-soft">of {formatMoney(earned + missed)} possible</span>
      </p>
    </div>
  );
}

function Stop({ left, className }: { left: number; className: string }) {
  return (
    <span
      className={`absolute top-0 size-3.5 -translate-x-1/2 rounded-full ${className}`}
      style={{ left: `${left}%` }}
    />
  );
}
