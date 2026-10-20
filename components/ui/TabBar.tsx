import Link from "next/link";
import type { ReactNode } from "react";
import { FiClock, FiTrendingUp } from "react-icons/fi";
import { DumbbellIcon } from "@/components/brand/Logo";

export type TabId = "today" | "history" | "progress";

const tabs : { id: TabId; href: string; label: string; icon: ReactNode }[] = [
  { id: "today", href: "/app", label: "Today", icon: <DumbbellIcon size={22} /> },
  { id: "history", href: "/history", label: "History", icon: <FiClock size={22} /> },
  { id: "progress",href: "/progress", label: "Progress", icon: <FiTrendingUp size={22} /> },
];

// Only the three tab screens show the bar; deeper screens (plan, workout,
// settings…) use the bottom of the screen for their own main action.
// Screens that show it need `pb-25` so content clears the bar.
export function TabBar({ active }: { active: TabId }) {

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-1/2 z-10 grid h-21 w-full max-w-120 -translate-x-1/2 grid-cols-3 border-t border-[#1F2226] bg-[#0F1113]/70 px-6 pt-2 pb-6 backdrop-blur-xl"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${
              isActive ? "text-accent" : "text-dim hover:text-ink"
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
