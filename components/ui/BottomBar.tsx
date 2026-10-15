// Pinned bar for a screen's main action, lined up with the 480px app column.
// Give the screen's content `pb-32` so nothing hides behind it.
export function BottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-120 -translate-x-1/2 border-t border-[#1F2226] bg-bg px-5 pt-4 pb-8">
      {children}
    </div>
  );
}
