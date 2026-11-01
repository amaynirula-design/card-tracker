import Link from "next/link";
import { IconChevronRight } from "./icons";

// Lists on land: plain rows between thin rules, with the value in one
// right-aligned column so amounts and rates line up down the whole screen.

export function Section({
  header,
  footer,
  children,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      {header && <h2 className="mb-2 text-small font-bold">{header}</h2>}
      <ul className="border-t border-line">{children}</ul>
      {footer && <p className="mt-2 text-small leading-snug text-fg-soft">{footer}</p>}
    </section>
  );
}

// A row in a Section. With an href, the whole row is a link and gets a chevron.
// "tag" is a code before the title; "leading" is a button (like a star) that sits
// beside the link, not inside it.
export function Row({
  tag,
  title,
  subtitle,
  trailing,
  href,
  leading,
}: {
  tag?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  leading?: React.ReactNode;
}) {
  const content = (
    <RowContent
      tag={tag}
      title={title}
      subtitle={subtitle}
      trailing={trailing}
      chevron={Boolean(href)}
    />
  );
  return (
    <li className="flex items-stretch border-b border-line">
      {leading && <div className="-ml-2.5 flex shrink-0 items-center">{leading}</div>}
      {href ? (
        <Link href={href} className={`${rowClasses} transition-colors hover:bg-fill`}>
          {content}
        </Link>
      ) : (
        <div className={rowClasses}>{content}</div>
      )}
    </li>
  );
}

export const rowClasses = "flex min-h-14 min-w-0 flex-1 items-center gap-3 py-2.5";

export function RowContent({
  tag,
  title,
  subtitle,
  trailing,
  chevron,
}: {
  tag?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  chevron?: boolean;
}) {
  return (
    <>
      {tag}
      {/* At large text sizes, the trailing value wraps under the title. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3">
        <div className="min-w-0 flex-[1_1_6rem] text-left">
          <p className="font-semibold leading-snug">{title}</p>
          {subtitle && <p className="mt-0.5 text-small leading-snug text-fg-soft">{subtitle}</p>}
        </div>
        {trailing && <div className="tabular ml-auto min-w-0 text-right">{trailing}</div>}
      </div>
      {chevron && <IconChevronRight className="size-4 shrink-0 text-fg-soft" />}
    </>
  );
}
