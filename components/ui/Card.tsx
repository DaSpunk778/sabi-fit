import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"section">) {
  return (
    <section
      className={`rounded-[18px] border border-line bg-surface ${className}`}
      {...props}
    />
  );
}
