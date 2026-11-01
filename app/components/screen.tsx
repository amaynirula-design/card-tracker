import Link from "next/link";
import { IconChevronLeft } from "./icons";

// Every screen's frame: the title on the ultramarine ground, then the screen's
// content on a land panel that runs to the bottom of the page. "lead" sits on
// the ground under the title, and "back" above it.
export function Screen({
  title,
  action,
  back,
  lead,
  children,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  back?: { href: string; label: string };
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="w-full max-w-3xl px-5 pb-6 pt-3 md:px-10 md:pt-10">
        {back && <BackLink {...back} />}
        {/* At large text sizes, the action wraps under the title instead of squeezing it. */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="wide min-w-0 flex-[1_1_12rem] break-words text-headline font-extrabold leading-[1.05] tracking-tight">
            {title}
          </h1>
          {action}
        </div>
        {lead}
      </div>
      <Land>{children}</Land>
    </main>
  );
}

// The pale panel. The padding at the bottom keeps the last row clear of the
// phone tab bar.
export function Land({ children }: { children: React.ReactNode }) {
  return (
    <div className="land flex-1 rounded-t-[1.25rem] px-5 pb-28 pt-5 md:ml-10 md:mr-10 md:max-w-[44rem] md:px-8 md:pb-12 md:pt-8">
      {children}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="-ml-1.5 mb-2 inline-flex min-h-11 items-center gap-0.5 text-small font-semibold">
      <IconChevronLeft className="size-5" />
      {label}
    </Link>
  );
}
