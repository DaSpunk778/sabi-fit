import Link from "next/link";
import type { ComponentProps } from "react";

// 44px square icon button that navigates (back arrows, settings).
export function IconLink({
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`inline-flex size-11 flex-none items-center justify-center rounded-xl border border-line-strong bg-surface text-ink transition-colors hover:bg-raised ${className}`}
      {...props}
    />
  );
}
