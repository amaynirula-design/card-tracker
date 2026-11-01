"use client";

// A row of options where exactly one is selected.

type Option<T extends string> = {
  value: T;
  label: React.ReactNode;
  // Spoken by screen readers and shown on hover, for icon-only options.
  title?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  stretch = false,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  // Fill the whole row, with equal-width options.
  stretch?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={[stretch ? "flex w-full" : "inline-flex", "gap-1 rounded-md bg-fill p-1"].join(" ")}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.title}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={[
              "flex h-9 min-w-16 items-center justify-center whitespace-nowrap rounded px-3 text-small font-bold transition-colors duration-150",
              stretch ? "flex-1" : "",
              selected ? "bg-action text-on-action" : "text-fg hover:bg-fill-strong",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
