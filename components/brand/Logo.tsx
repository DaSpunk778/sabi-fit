type DumbbellIconProps = {
  size?: number;
  strokeWidth?: number;
};

// Feather has no dumbbell, so this glyph is drawn by hand in the same style.
export function DumbbellIcon({ size = 24, strokeWidth = 2 }: DumbbellIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12" />
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center bg-accent text-bg"
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      <DumbbellIcon size={Math.round(size * 0.58)} strokeWidth={2.7} />
    </span>
  );
}
