import { ButtonLink } from "./button";

// Shown when a screen has nothing in it yet: a route with nowhere to go, what
// belongs here, and the next step.
export function EmptyState({
  title,
  text,
  href,
  action,
}: {
  title: string;
  text: string;
  // The button below the text, if any.
  href?: string;
  action?: string;
}) {
  return (
    <div className="py-10">
      <svg viewBox="0 0 120 48" aria-hidden="true" className="h-12 w-[7.5rem] text-action">
        <path
          d="M8 42Q60 -18 112 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="3 8"
        />
        <circle cx="8" cy="42" r="5" fill="currentColor" />
        <circle cx="112" cy="42" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <h2 className="wide mt-4 text-lead font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-body leading-relaxed text-fg-soft">{text}</p>
      {href && action && (
        <ButtonLink href={href} size="lg" className="mt-6 w-full max-w-xs">
          {action}
        </ButtonLink>
      )}
    </div>
  );
}
