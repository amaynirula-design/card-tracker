import Link from "next/link";
import { isSignedIn } from "@/lib/auth";
import { ThemeSwitch } from "./theme-switch";
import { AppMark } from "./app-mark";
import { IconPerson } from "./icons";

// The frosted, see-through bar at the top of every page. Content blurs as it
// scrolls underneath. Signed-in users also get a button for their account.
export async function AppHeader() {
  const signedIn = await isSignedIn();

  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-background/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href={signedIn ? "/purchases" : "/"} className="flex items-center gap-2.5 rounded-lg">
          <AppMark className="size-7" />
          <span className="text-[17px] font-semibold tracking-tight">Card Tracker</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          {signedIn && (
            <Link
              href="/account"
              aria-label="Account"
              title="Account"
              className="flex size-8 items-center justify-center rounded-full text-accent transition-opacity hover:opacity-70"
            >
              <IconPerson className="size-7" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
