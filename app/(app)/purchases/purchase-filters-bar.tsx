"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { IconChevronDown, IconClear, IconSearch } from "@/app/components/icons";
import { CATEGORIES } from "@/lib/categories";
import { SORTS, isFiltering, type PurchaseFilters, type Sort } from "@/lib/purchase-filters";

// The search field and filter menus above the purchase list. Every change
// updates the page address (?q=...&card=...), and the server sends back the
// matching purchases.
export function PurchaseFiltersBar({
  filters,
  cards,
  resultCount,
}: {
  filters: PurchaseFilters;
  // Every card, including closed ones, so old purchases can still be found.
  cards: { id: number; name: string }[];
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(filters.q);
  const [pending, startTransition] = useTransition();
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Changes some filters and keeps the rest. A blank value removes it.
  function update(changes: Partial<Record<"q" | "card" | "category" | "sort", string>>) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      if (value && !(key === "sort" && value === "newest")) params.set(key, value);
      else params.delete(key);
    }
    const search = params.toString();
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    });
  }

  // Search as you type, but wait for a short pause instead of on every key.
  function search(value: string) {
    setQuery(value);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => update({ q: value.trim() }), 250);
  }

  function clearAll() {
    clearTimeout(typingTimer.current);
    setQuery("");
    update({ q: "", card: "", category: "" });
  }

  const cardName = cards.find((card) => card.id === filters.cardId)?.name;

  return (
    <div className="mt-4 space-y-3" aria-busy={pending}>
      <div className="flex h-11 items-center gap-2 rounded-md bg-panel px-3 text-[#3a3f6b] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white">
        <IconSearch className="size-[18px] shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(event) => search(event.target.value)}
          placeholder="Search merchants"
          aria-label="Search purchases by merchant"
          enterKeyHint="search"
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-[#3a3f6b] [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => search("")}
            aria-label="Clear search"
            className="shrink-0 text-[#3a3f6b] hover:text-ink"
          >
            <IconClear className="size-[18px]" />
          </button>
        )}
      </div>

      {/* The fade at the end hints that the row scrolls. */}
      <div className="-mx-5 -my-1.5 flex gap-2 overflow-x-auto py-1.5 pl-5 pr-10 [mask-image:linear-gradient(to_left,transparent,black_2.5rem)] [scrollbar-width:none] md:mx-0 md:pl-0">
        <FilterMenu
          label="Card"
          display={cardName ?? "All cards"}
          active={Boolean(cardName)}
          value={cardName ? String(filters.cardId) : ""}
          onChange={(card) => update({ card })}
        >
          <option value="">All cards</option>
          {cards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.name}
            </option>
          ))}
        </FilterMenu>
        <FilterMenu
          label="Category"
          display={filters.category ?? "All categories"}
          active={Boolean(filters.category)}
          value={filters.category ?? ""}
          onChange={(category) => update({ category })}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </FilterMenu>
        <FilterMenu
          label="Sort"
          display={SORTS[filters.sort]}
          active={filters.sort !== "newest"}
          value={filters.sort}
          onChange={(sort) => update({ sort })}
        >
          {(Object.keys(SORTS) as Sort[]).map((sort) => (
            <option key={sort} value={sort}>
              {SORTS[sort]}
            </option>
          ))}
        </FilterMenu>
      </div>

      {isFiltering(filters) && (
        <div className="flex items-center justify-between text-small">
          <span className="text-fg-soft" aria-live="polite">
            {pending ? "Searching…" : `${resultCount} ${resultCount === 1 ? "purchase" : "purchases"}`}
          </span>
          <button type="button" onClick={clearAll} className="font-semibold underline underline-offset-4">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

// A pill that opens the phone's own picker (a real dropdown sits on top of it,
// invisible), solid white when it's narrowing the list.
function FilterMenu({
  label,
  display,
  active,
  value,
  onChange,
  children,
}: {
  label: string;
  display: string;
  active: boolean;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={[
        "relative flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-md pl-3 pr-2 text-small font-semibold transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white",
        active ? "bg-panel text-ink" : "bg-fill text-fg hover:bg-fill-strong",
      ].join(" ")}
    >
      <span className="whitespace-nowrap">{display}</span>
      <IconChevronDown className="size-4 opacity-70" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="absolute -inset-y-1.5 inset-x-0 cursor-pointer appearance-none opacity-0"
      >
        {children}
      </select>
    </label>
  );
}
