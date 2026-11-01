"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppMark } from "./app-mark";
import { IconCard, IconChart, IconPerson, IconReceipt, IconRoute, IconStar } from "./icons";

// The app's main sections. Best Card comes first: it's the app's main answer.
const TABS = [
  { href: "/cards/best", label: "Best Card", Icon: IconRoute },
  { href: "/purchases", label: "Purchases", Icon: IconReceipt },
  { href: "/starred", label: "Starred", Icon: IconStar },
  { href: "/dashboard", label: "Dashboard", Icon: IconChart },
  { href: "/cards", label: "Cards", Icon: IconCard },
];

function isActive(pathname: string, href: string) {
  // Best Card's address sits under /cards, but it's its own tab.
  if (href === "/cards" && pathname.startsWith("/cards/best")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <AppMark />
      <span className="code text-small">Card Tracker</span>
    </span>
  );
}

// On phones: the name and Account at the top, and a tab bar fixed to the bottom.
// On wider screens: one rail down the left side with all of it.
export function AppNav() {
  const pathname = usePathname();
  // Add and edit screens have their own bar, and it replaces all of this on phones.
  const inSheet = /\/(new|edit)$/.test(pathname);
  const accountActive = pathname === "/account";

  return (
    <>
      <div className={`${inSheet ? "hidden" : "flex"} min-h-14 flex-wrap items-center justify-between gap-x-3 px-5 md:hidden`}>
        <Link href="/cards/best" aria-label="Card Tracker, Best Card">
          <Wordmark />
        </Link>
        <AccountLink className="-mr-2 px-2" />
      </div>

      <nav
        aria-label="Sections"
        className={`${inSheet ? "max-md:hidden" : ""} fixed inset-x-0 bottom-0 z-40 border-t border-[#c9cdea] bg-panel pb-[env(safe-area-inset-bottom)] [--focus:var(--ultramarine)] md:inset-y-0 md:[--focus:#fff] md:right-auto md:flex md:w-56 md:flex-col md:border-t-0 md:bg-ground md:px-4 md:pb-6 md:pt-8`}
      >
        <Link href="/cards/best" aria-label="Card Tracker, Best Card" className="mb-8 hidden px-2 md:block">
          <Wordmark />
        </Link>
        <ul className="flex md:flex-col md:gap-1">
          {TABS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href} className="min-w-0 flex-1 md:flex-none">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "narrow flex flex-col items-center gap-1 pb-2 pt-2.5 text-caption font-semibold leading-none transition-colors",
                    "md:flex-row md:gap-3 md:rounded-md md:px-3 md:py-2.5 md:text-small md:[font-stretch:100%]",
                    active
                      ? "text-ground md:bg-panel"
                      : "text-[#3a3f6b] hover:text-ink md:text-fg md:hover:bg-fill md:hover:text-fg",
                  ].join(" ")}
                >
                  <Icon filled={active} className="size-6 md:size-5" />
                  <span className="max-w-full truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <AccountLink
          className={`mt-auto hidden rounded-md px-3 md:flex ${accountActive ? "bg-panel text-ground" : "hover:bg-fill"}`}
          current={accountActive}
        />
      </nav>
    </>
  );
}

function AccountLink({ className = "", current }: { className?: string; current?: boolean }) {
  return (
    <Link
      href="/account"
      aria-current={current ? "page" : undefined}
      className={`flex min-h-11 items-center gap-2 text-small font-semibold transition-colors ${className}`}
    >
      <IconPerson className="size-5" />
      Account
    </Link>
  );
}
