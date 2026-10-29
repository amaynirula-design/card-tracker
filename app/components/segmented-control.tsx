"use client";

// An iOS-style segmented control: a row of options where exactly one is selected.

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
  size = "md",
  stretch = false,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
  // Fill the whole row, with equal-width options.
  stretch?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={[stretch ? "flex w-full" : "inline-flex", "rounded-[9px] bg-fill p-0.5"].join(" ")}
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
              "flex items-center justify-center whitespace-nowrap rounded-[7px] font-medium transition-[background-color,color,box-shadow] duration-200",
              stretch ? "flex-1" : "",
              size === "sm" ? "h-7 min-w-9 px-2 text-[13px]" : "h-8 min-w-16 px-3 text-sm",
              selected
                ? "bg-segment text-label shadow-[0_1px_3px_rgb(0_0_0/0.12),0_1px_1px_rgb(0_0_0/0.04)]"
                : "text-label-secondary hover:text-label",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
