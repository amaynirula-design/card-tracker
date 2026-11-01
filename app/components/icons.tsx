// Small line icons, all drawn on a 24px grid with the same stroke.
// They draw with currentColor, so they take the text color of their parent.

type IconProps = { className?: string };
// The tab bar's icons fill in when their tab is selected.
type TabIconProps = IconProps & { filled?: boolean };

function Svg({
  className = "size-5",
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconCard({ filled, ...props }: TabIconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill={filled ? "currentColor" : "none"} />
      <path d="M2.5 9.5h19M6 15h4" stroke={filled ? "var(--panel)" : "currentColor"} />
    </Svg>
  );
}

// Best Card's tab: a route between two stops, like the map on that screen.
export function IconRoute({ filled, ...props }: TabIconProps) {
  return (
    <Svg {...props}>
      <path d="M5 18Q12 -2 19 18" strokeWidth={filled ? 3 : undefined} />
      <circle cx="5" cy="18" r="2.5" fill={filled ? "currentColor" : "none"} />
      <circle cx="19" cy="18" r="2.5" fill={filled ? "currentColor" : "none"} />
    </Svg>
  );
}

export function IconReceipt({ filled, ...props }: TabIconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" fill={filled ? "currentColor" : "none"} />
      <path d="M9 8h6M9 12h6" stroke={filled ? "var(--panel)" : "currentColor"} />
    </Svg>
  );
}

export function IconChart({ filled, ...props }: TabIconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeWidth={filled ? 3.2 : undefined} />
    </Svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m9 5 7 7-7 7" />
    </Svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m15 5-7 7 7 7" />
    </Svg>
  );
}

export function IconPerson(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </Svg>
  );
}

// Filled when starred, outlined when not.
export function IconStar({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...props}>
      <path
        d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9L12 3.2Z"
        fill={filled ? "currentColor" : "none"}
      />
    </Svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </Svg>
  );
}

// A filled circle with an × in it, for clearing a search field.
export function IconClear(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className ?? "size-5"}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="m8.5 8.5 7 7m0-7-7 7" stroke="var(--panel)" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}
