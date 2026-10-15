"use client";

import { useState, type ComponentProps } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type TextFieldProps = ComponentProps<"input"> & { label: string };

export function TextField({ label, type = "text", ...props }: TextFieldProps) {
  const isPassword = type === "password";
  const [shown, setShown] = useState(false);

  return (
    <label className="flex flex-col gap-2">
      <span className="label">{label}</span>
      {/* The inset shadow thickens the focus border to 2px without shifting the layout */}
      <span className="flex h-14 items-center gap-2.5 rounded-[14px] border border-line-strong bg-surface pr-1.5 pl-4 focus-within:border-accent focus-within:shadow-[inset_0_0_0_1px_var(--color-accent)]">
        <input
          type={isPassword && shown ? "text" : type}
          className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-ink outline-none placeholder:text-faint"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            className="inline-flex size-11 flex-none items-center justify-center rounded-lg text-muted hover:text-ink"
          >
            {shown ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </span>
    </label>
  );
}
