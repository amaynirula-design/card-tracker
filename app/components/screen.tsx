import Link from "next/link";
import { IconChevronLeft } from "./icons";

// Every screen's frame: the title on the sage ground, then the screen's
// content on a land panel that ends with its content. "lead" sits on the ground
// under the title, and "back" above it.
export function Screen({
  title,
  eyebrow,
  action,
  back,
  lead,
  children,
}: {
  title: React.ReactNode;
  // A small green label above the title.
  eyebrow?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col">
      <div className="w-full px-5 pb-6 pt-6 md:px-10 md:pt-12">
        {back && <BackLink {...back} />}
        {eyebrow && <p className="mb-1 text-small font-semibold text-action">{eyebrow}</p>}
        {/* At large text sizes, the action wraps under the title instead of squeezing it. */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="display min-w-0 flex-[1_1_12rem] break-words text-headline leading-[1.05]">
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

// The white panel. It stops after its last item, with rounded corners and a strip
// of ground below, so you can see where the page ends.
export const landPanelClasses = "land mb-10 rounded-xl px-5 pb-8 pt-5 md:px-8 md:pt-8";

export function Land({ children }: { children: React.ReactNode }) {
  return <div className={`${landPanelClasses} md:mx-10`}>{children}</div>;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="-ml-1.5 mb-2 inline-flex min-h-11 items-center gap-0.5 text-small font-semibold">
      <IconChevronLeft className="size-5" />
      {label}
    </Link>
  );
}
