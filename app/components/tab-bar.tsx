"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCard, IconChart, IconReceipt, IconStar } from "./icons";

// The app's main sections, in PLAN.md order.
const TABS = [
  { href: "/purchases", label: "Purchases", Icon: IconReceipt },
  { href: "/starred", label: "Starred", Icon: IconStar },
  { href: "/dashboard", label: "Dashboard", Icon: IconChart },
  { href: "/cards", label: "Cards", Icon: IconCard },
];

// On phones: an iOS tab bar fixed to the bottom of the screen.
// On wider screens: a sidebar on the left, like iPad and Mac apps.
export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-separator bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 md:sticky md:top-14 md:h-[calc(100dvh-3.5rem)] md:w-56 md:shrink-0 md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
    >
      <ul className="flex justify-around md:flex-col md:justify-start md:gap-0.5 md:px-3 md:pt-8">
        {TABS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1 md:flex-none">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex flex-col items-center gap-0.5 pb-1 pt-2 text-[10px] font-medium transition-colors",
                  "md:flex-row md:gap-3 md:rounded-[10px] md:px-3 md:py-2 md:text-[15px]",
                  active
                    ? "text-accent md:bg-fill md:text-label"
                    : "text-label-secondary hover:text-label md:hover:bg-fill",
                ].join(" ")}
              >
                <Icon className={["size-6 md:size-5", active ? "md:text-accent" : ""].join(" ")} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
