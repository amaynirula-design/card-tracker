import Link from "next/link";
import { Wordmark } from "./app-nav";

// The black bar at the top of the pages people see before they log in.
export function PublicHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="night">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl flex-wrap items-center justify-between gap-x-3 px-5 md:px-10">
        <Link href="/" aria-label="Card Tracker, home">
          <Wordmark />
        </Link>
        {action}
      </div>
    </header>
  );
}
