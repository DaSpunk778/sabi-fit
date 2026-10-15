import type { ComponentProps } from "react";

type ChipProps = ComponentProps<"button"> & { selected?: boolean };

// Pill-shaped toggle for filters (muscle groups, day types).
export function Chip({ selected = false, className = "", ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex h-9 flex-none items-center rounded-full border px-3.5 text-[13px] font-bold whitespace-nowrap transition-colors ${
        selected
          ? "border-accent bg-accent text-bg"
          : "border-line-strong bg-surface text-[#C9CDD1] hover:bg-raised"
      } ${className}`}
      {...props}
    />
  );
}
