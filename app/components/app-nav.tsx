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

// A black bar across the top of every signed-in screen: the name, the sections,
// and Account. On phones the sections move to a tab bar fixed to the bottom,
// where a thumb reaches them.
export function AppNav() {
  const pathname = usePathname();
  // Add and edit screens have their own bar, and it replaces all of this on phones.
  const inSheet = /\/(new|edit)$/.test(pathname);
  const accountActive = pathname === "/account";

  return (
    <>
      <header className={`night ${inSheet ? "max-md:hidden" : ""}`}>
        <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center gap-x-6 px-5 md:px-10">
          <Link href="/cards/best" aria-label="Card Tracker, Best Card" className="shrink-0">
            <Wordmark />
          </Link>

          <nav aria-label="Sections" className="hidden min-w-0 md:block">
            <ul className="flex gap-1">
              {TABS.map(({ href, label }) => {
                const active = isActive(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex min-h-11 items-center whitespace-nowrap rounded-[4px] px-3 text-small font-semibold transition-colors",
                        active ? "bg-fill text-fg" : "text-fg-soft hover:bg-fill hover:text-fg",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/account"
            aria-current={accountActive ? "page" : undefined}
            className={[
              "ml-auto flex min-h-10 shrink-0 items-center gap-2 rounded-[4px] px-3 text-small font-semibold text-on-action transition-colors",
              accountActive ? "bg-action-hover" : "bg-action hover:bg-action-hover",
            ].join(" ")}
          >
            <IconPerson className="size-5" />
            Account
          </Link>
        </div>
      </header>

      <nav
        aria-label="Sections"
        className={`land fixed inset-x-0 bottom-0 z-40 border-t border-line pb-[env(safe-area-inset-bottom)] md:hidden ${
          inSheet ? "hidden" : ""
        }`}
      >
        <ul className="flex">
          {TABS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href} className="min-w-0 flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex flex-col items-center gap-1 pb-2 pt-2.5 text-caption font-semibold leading-none transition-colors",
                    active ? "text-action" : "text-fg-soft hover:text-fg",
                  ].join(" ")}
                >
                  <Icon filled={active} className="size-6" />
                  <span className="max-w-full truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
