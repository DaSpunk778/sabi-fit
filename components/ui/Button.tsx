import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-5 text-[17px] font-extrabold transition-colors disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-hover",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-raised",
};

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
