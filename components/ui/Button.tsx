import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";
type Size = "lg" | "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold transition-colors disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-hover",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-raised",
};

// One size class per button. Never pass min-h / px / text through className
// to change the size: when two classes set the same thing, Tailwind picks the
// one later in its CSS file, not the one written later in className.
const sizes: Record<Size, string> = {
  lg: "min-h-14 px-5 text-[17px]", // main actions (Start, Create account)
  md: "min-h-11 px-4.5 text-[17px]", // in a header (Finish)
  sm: "min-h-11 px-3.5 text-sm", // small inline actions (+15s, Skip)
};

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
