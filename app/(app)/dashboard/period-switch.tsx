"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SegmentedControl } from "@/app/components/segmented-control";
import type { Period } from "@/lib/dashboard";

// This Month / All Time, like the D W M Y switch in the Health app.
export function PeriodSwitch({ period }: { period: Period }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <SegmentedControl
      ariaLabel="Time period"
      stretch
      value={period}
      onChange={(next) =>
        startTransition(() => router.replace(next === "all" ? "/dashboard?period=all" : "/dashboard", { scroll: false }))
      }
      options={[
        { value: "month", label: "This Month" },
        { value: "all", label: "All Time" },
      ]}
    />
  );
}
