// The Card Tracker logo: one yellow route between two stops. It draws on the
// ultramarine ground, so it has no background of its own.
// Keep it in sync with app/icon.svg (the browser-tab icon).
export function AppMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="8 16 48 36" aria-hidden="true" className={className}>
      <path d="M13 45Q32 -1 51 45" fill="none" stroke="var(--winner)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="13" cy="45" r="6" fill="#fff" />
      <circle cx="51" cy="45" r="6" fill="var(--winner)" />
    </svg>
  );
}
