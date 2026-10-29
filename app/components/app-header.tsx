import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { AppMark } from "./app-mark";

// The frosted, see-through bar at the top of every page. Content blurs as it
// scrolls underneath.
export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-background/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg">
          <AppMark className="size-7" />
          <span className="text-[17px] font-semibold tracking-tight">Card Tracker</span>
        </Link>
        <ThemeSwitch />
      </div>
    </header>
  );
}
