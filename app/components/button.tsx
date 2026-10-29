import Link from "next/link";

// Apple-style buttons: "filled" for the main action on a screen, "tinted" for
// secondary actions, "plain" for text-only links.
type Variant = "filled" | "tinted" | "plain";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[opacity,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  filled: "bg-accent text-on-accent hover:opacity-90",
  tinted: "bg-accent-soft text-accent hover:opacity-80",
  plain: "text-accent hover:opacity-70",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-[50px] px-6 text-[17px]",
};

export function buttonClasses(variant: Variant = "filled", size: Size = "md", className = "") {
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
