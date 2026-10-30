"use client";

import { useOptimistic, useTransition } from "react";
import { IconStar } from "@/app/components/icons";
import { setStarred } from "./star-actions";

// The star on a purchase. It fills with the accent color the moment you tap it,
// while the database catches up in the background; if saving fails, it flips back.
export function StarButton({
  purchaseId,
  starred,
  merchant,
  size = "md",
}: {
  purchaseId: number;
  starred: boolean;
  merchant: string;
  size?: "md" | "lg";
}) {
  const [shown, setShown] = useOptimistic(starred);
  const [, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      setShown(!shown);
      await setStarred(purchaseId, !shown);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={shown}
      aria-label={shown ? `Unstar ${merchant}` : `Star ${merchant}`}
      title={shown ? "Unstar" : "Star"}
      className={[
        "flex size-11 items-center justify-center rounded-full transition-[color,transform] duration-150 active:scale-90",
        shown ? "text-accent" : "text-label-tertiary hover:text-label-secondary",
      ].join(" ")}
    >
      <IconStar filled={shown} className={size === "lg" ? "size-6" : "size-[22px]"} />
    </button>
  );
}
