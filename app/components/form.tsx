// Building blocks for forms in the style of iOS Settings: grouped sections,
// rows with the label on the left and the value on the right.

export const inputClasses =
  "h-11 w-full min-w-0 bg-transparent text-right text-body tabular outline-none placeholder:text-label-tertiary";

// Number inputs next to a unit grow with what's typed, so "$" or "%" sits right
// beside the number.
export const numberClasses =
  "h-11 min-w-[2ch] max-w-full bg-transparent text-right text-body text-label tabular outline-none placeholder:text-label-tertiary [field-sizing:content]";

export function FormSection({
  header,
  footer,
  error,
  children,
}: {
  header?: string;
  footer?: string;
  // One message, or several (one per field with a problem).
  error?: string | (string | undefined)[];
  children: React.ReactNode;
}) {
  const errors = (Array.isArray(error) ? error : [error]).filter(Boolean);
  return (
    <section className="space-y-1.5">
      {header && (
        <h2 className="px-4 text-footnote uppercase tracking-wide text-label-secondary">{header}</h2>
      )}
      <div className="overflow-hidden rounded-2xl bg-surface shadow-panel [&>*+*]:border-t [&>*+*]:border-separator">
        {children}
      </div>
      {errors.length > 0 && (
        <div role="alert" className="space-y-0.5 px-4 text-footnote leading-snug text-danger">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}
      {footer && <p className="px-4 text-footnote leading-snug text-label-secondary">{footer}</p>}
    </section>
  );
}

// A form row: label on the left, input on the right, like iOS Settings.
// A row with a problem gets a red label.
export function Field({
  label,
  invalid,
  children,
}: {
  label: string;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 px-4 has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-inset has-[select:focus-visible]:ring-accent">
      <span className={["shrink-0 text-body", invalid ? "text-danger" : ""].join(" ")}>{label}</span>
      <span className="flex min-w-0 flex-1 justify-end">{children}</span>
    </label>
  );
}

// A small unit before or after the number, like "$" or "%".
export function Affix({
  before,
  after,
  children,
}: {
  before?: string;
  after?: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex w-full max-w-48 items-center justify-end gap-1 text-body text-label-secondary">
      {before}
      {children}
      {after && <span className="shrink-0">{after}</span>}
    </span>
  );
}
