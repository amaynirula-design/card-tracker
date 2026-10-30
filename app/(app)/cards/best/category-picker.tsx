"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { IconSelector } from "@/app/components/icons";
import { CATEGORIES, type Category } from "@/lib/categories";

// A grouped row with the phone's own picker for the category. Picking one
// updates the address (?category=Dining) and the answer below.
export function CategoryPicker({ category }: { category: Category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex h-12 items-center justify-between gap-3 rounded-2xl bg-surface px-4 shadow-panel focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
      <span className="text-[17px]">Category</span>
      <span className="relative flex items-center gap-1 text-label-secondary" aria-busy={pending}>
        <select
          value={category}
          onChange={(event) =>
            startTransition(() =>
              router.replace(`/cards/best?category=${encodeURIComponent(event.target.value)}`, { scroll: false }),
            )
          }
          className="cursor-pointer appearance-none bg-transparent text-right text-[17px] text-label outline-none"
        >
          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <IconSelector className="size-4" />
      </span>
    </label>
  );
}
