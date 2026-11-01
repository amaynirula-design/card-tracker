// Building blocks for forms: a label above each box, with the problem named
// under the section it belongs to.

const boxClasses = "rounded-md border border-field-line bg-panel text-ink aria-[invalid=true]:border-danger";

export const inputClasses = `h-12 w-full min-w-0 px-3 text-body placeholder:text-fg-soft ${boxClasses}`;

// The number inside an Affix, which draws the box around it.
export const numberClasses =
  "h-full w-full min-w-0 bg-transparent text-body tabular outline-none placeholder:text-fg-soft";

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
    <section className="space-y-3">
      {header && <h2 className="wide text-lead font-extrabold tracking-tight">{header}</h2>}
      <div className="space-y-4">{children}</div>
      {errors.length > 0 && (
        <div role="alert" className="space-y-0.5 text-small font-semibold leading-snug text-danger">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}
      {footer && <p className="text-small leading-snug text-fg-soft">{footer}</p>}
    </section>
  );
}

// A label with its box underneath. A field with a problem gets a red label.
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
    <label className="block">
      <span className={["mb-1.5 block text-small font-bold", invalid ? "text-danger" : ""].join(" ")}>{label}</span>
      {children}
    </label>
  );
}

// A box holding a number and its unit, like "$" or "%".
export function Affix({
  before,
  after,
  className = "",
  children,
}: {
  before?: string;
  after?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`flex h-12 items-center gap-1 px-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-action has-aria-invalid:border-danger ${boxClasses} ${className}`}
    >
      {before && <span className="text-fg-soft">{before}</span>}
      {children}
      {after && <span className="shrink-0 text-small text-fg-soft">{after}</span>}
    </span>
  );
}
