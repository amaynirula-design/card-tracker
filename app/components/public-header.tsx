import Link from "next/link";
import { Wordmark } from "./app-nav";

// The top of the pages people see before they log in.
export function PublicHeader({ action }: { action?: React.ReactNode }) {
  return (
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 px-5 md:px-10">
      <Link href="/" aria-label="Card Tracker, home">
        <Wordmark />
      </Link>
      {action}
    </header>
  );
}
