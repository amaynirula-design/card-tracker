import Link from "next/link";

// "primary" for the main action on a screen, "secondary" for the others, "text"
// for links. Their colors come from the zone they sit in (see globals.css).
type Variant = "primary" | "secondary" | "text";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-bold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-action text-on-action hover:bg-action-hover",
  secondary: "border border-current text-fg hover:bg-fill",
  text: "text-fg underline decoration-1 underline-offset-4 hover:decoration-2",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-small",
  lg: "h-12 px-6 text-body",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = "") {
  return [base, variants[variant], sizes[size], className].join(" ");
}

export function Button({
  variant,
  size,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
