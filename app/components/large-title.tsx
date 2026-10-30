import Link from "next/link";
import { IconPerson } from "./icons";

// A tab's big page title. There's no top bar on phones, so the account button
// sits at the end of this row, like the App Store. Wider screens have it in the
// top bar instead.
export function LargeTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-2">
      <h1 className="min-w-0 text-large-title font-bold leading-tight tracking-tight">{children}</h1>
      <div className="flex shrink-0 items-center gap-1">
        {action}
        <AccountButton className="md:hidden" />
      </div>
    </div>
  );
}

export function AccountButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/account"
      aria-label="Account"
      title="Account"
      className={`flex size-11 items-center justify-center rounded-full text-accent transition-opacity hover:opacity-70 ${className}`}
    >
      <IconPerson className="size-7" />
    </Link>
  );
}
