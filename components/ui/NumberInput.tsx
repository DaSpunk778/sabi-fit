"use client";

import { useState, type ComponentProps } from "react";

type NumberInputProps = Omit<
  ComponentProps<"input">,
  "value" | "onChange" | "type"
> & {
  /** Starting value. Read once when the box appears (see below). */
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Allow a decimal point, for kg. Reps are whole numbers. */
  decimal?: boolean;
  max?: number;
};

// A number box for reps and kg. It keeps the text you typed, because a plain
// number can't hold a half-typed "22." (it would turn into 22 and eat the dot).
// The parent gets a number, or null when the box is empty. `value` is only the
// starting text: the workout screen swaps the box out whenever a set is
// ticked, so nothing else changes it while it's on screen.
export function NumberInput({
  value,
  onValueChange,
  decimal = false,
  max = 999,
  className = "",
  ...props
}: NumberInputProps) {
  const [text, setText] = useState(value === null ? "" : String(value));

  return (
    <input
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      value={text}
      onChange={(e) => {
        const next = e.target.value.replace(",", ".");
        const allowed = decimal ? /^\d{0,4}(\.\d{0,2})?$/ : /^\d{0,4}$/;
        if (!allowed.test(next)) return; // ignore letters and extra dots

        const number = next === "" || next === "." ? null : Number(next);
        if (number !== null && number > max) return;

        setText(next);
        onValueChange(number);
      }}
      className={`h-11 w-full rounded-xl border border-line-strong bg-[#0F1113] p-0 text-center text-[17px] font-extrabold text-ink outline-none placeholder:text-faint focus:border-accent ${className}`}
      {...props}
    />
  );
}
