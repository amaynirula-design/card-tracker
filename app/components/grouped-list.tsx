import Link from "next/link";
import { IconChevronRight } from "./icons";

// Rounded, grouped lists like iOS Settings: a section holds rows separated by
// thin dividers, with optional small text above (header) and below (footer).

export function GroupedSection({
  header,
  footer,
  children,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-1.5">
      {header && (
        <h2 className="px-4 text-[13px] font-normal uppercase tracking-wide text-label-secondary">
          {header}
        </h2>
      )}
      <div className="overflow-hidden rounded-2xl bg-surface shadow-panel">
        <ul>{children}</ul>
      </div>
      {footer && <p className="px-4 text-[13px] leading-snug text-label-secondary">{footer}</p>}
    </section>
  );
}

// A row in a GroupedSection. With an href, the whole row is a link and gets a
// chevron on the right, like iOS rows that open another screen. "leading" is a
// button on the left (like a star) that sits beside the link, not inside it.
export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  href,
  leading,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  leading?: React.ReactNode;
}) {
  const content = (
    <RowContent
      icon={icon}
      title={title}
      subtitle={subtitle}
      trailing={
        href ? (
          <span className="flex items-center gap-1.5">
            {trailing}
            <IconChevronRight className="size-4 text-label-tertiary" />
          </span>
        ) : (
          trailing
        )
      }
    />
  );

  const padding = leading ? "pl-0" : "pl-4";
  return (
    <li className="group flex items-stretch">
      {leading && <div className="flex shrink-0 items-center pl-1.5">{leading}</div>}
      {href ? (
        <Link
          href={href}
          className={`flex min-w-0 flex-1 items-center gap-3.5 ${padding} transition-colors hover:bg-fill active:bg-fill-strong`}
        >
          {content}
        </Link>
      ) : (
        <div className={`flex min-w-0 flex-1 items-center gap-3.5 ${padding}`}>{content}</div>
      )}
    </li>
  );
}

function RowContent({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <>
      {icon && (
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-accent-soft text-accent">
          {icon}
        </span>
      )}
      {/* The divider sits on this part only, so it starts after the icon, like iOS. */}
      <div className="flex min-w-0 flex-1 items-center gap-3 border-t border-separator py-3 pr-4 group-first:border-t-0">
        <div className="min-w-0 flex-1">
          <p className="text-[17px] leading-snug text-label">{title}</p>
          {subtitle && (
            <p className="mt-0.5 text-[15px] leading-snug text-label-secondary">{subtitle}</p>
          )}
        </div>
        {trailing && <div className="shrink-0 text-[17px] text-label-secondary">{trailing}</div>}
      </div>
    </>
  );
}
