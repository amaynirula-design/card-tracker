import Link from "next/link";
import { IconChevronLeft } from "./icons";

// Every screen's frame: the title on the ultramarine ground, then the screen's
// content on a land panel that ends with its content. "lead" sits on the ground
// under the title, and "back" above it.
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

// The pale panel. It stops after its last item, with rounded corners and a strip
// of ground below, so you can see where the page ends. The space below also keeps
// the panel clear of the phone tab bar.
export const landPanelClasses =
  "land rounded-[1.25rem] px-5 pb-8 pt-5 mb-[calc(5.5rem+env(safe-area-inset-bottom))] md:mb-10 md:px-8 md:pt-8";

export function Land({ children }: { children: React.ReactNode }) {
  return <div className={`${landPanelClasses} md:mx-10 md:max-w-[44rem]`}>{children}</div>;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="-ml-1.5 mb-2 inline-flex min-h-11 items-center gap-0.5 text-small font-semibold">
      <IconChevronLeft className="size-5" />
      {label}
    </Link>
  );
}
