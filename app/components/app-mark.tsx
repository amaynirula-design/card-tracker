import { useId } from "react";

// The Card Tracker logo: a card on a teal rounded square, like an app icon.
// Keep it in sync with app/icon.svg (the browser-tab icon).
export function AppMark({ className = "size-8" }: { className?: string }) {
  // A unique id per logo, so two logos on one page don't share a gradient.
  const gradientId = useId();
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14B8B1" />
          <stop offset="1" stopColor="#007C77" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14.5" fill={`url(#${gradientId})`} />
      <rect x="13" y="19" width="38" height="26" rx="5" fill="none" stroke="#fff" strokeWidth="3.5" />
      <path d="M13 27h38" stroke="#fff" strokeWidth="3.5" />
      <path d="M19.5 37.5h8" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
