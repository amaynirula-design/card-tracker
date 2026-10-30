import Link from "next/link";
import { isSignedIn } from "@/lib/auth";
import { AppMark } from "./app-mark";
import { AccountButton } from "./large-title";

// The frosted, see-through bar at the top of the page. Content blurs as it
// scrolls underneath. Signed-in phone screens don't have it: they start with
// the page's own title, like an iOS app.
export async function AppHeader() {
  const signedIn = await isSignedIn();

  return (
    <header
      className={[
        "frosted sticky top-0 z-40 border-b border-separator bg-background/75 backdrop-blur-xl backdrop-saturate-150",
        signedIn ? "max-md:hidden" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href={signedIn ? "/purchases" : "/"} className="flex items-center gap-2.5 rounded-lg">
          <AppMark className="size-7" />
          <span className="text-body font-semibold tracking-tight">Card Tracker</span>
        </Link>
        {signedIn && <AccountButton />}
      </div>
    </header>
  );
}
