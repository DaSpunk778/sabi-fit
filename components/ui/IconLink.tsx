import Link from "next/link";
import type { ComponentProps } from "react";

const iconButtonClass =
  "inline-flex size-11 flex-none items-center justify-center rounded-xl border border-line-strong bg-surface text-ink transition-colors hover:bg-raised";

// 44px square icon button that navigates (back arrows, settings).
export function IconLink({
  className = "",
  ...props
}: ComponentProps<typeof Link>) {
  return <Link className={`${iconButtonClass} ${className}`} {...props} />;
}

// Same look, for actions that don't navigate (closing a picker).
export function IconButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={`${iconButtonClass} ${className}`}
      {...props}
    />
  );
}
