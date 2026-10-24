"use client";

import { Button } from "@/components/ui/Button";
import { useAnimationNow } from "@/hooks/useAnimation";
import { formatRest, remainingMs, restProgress } from "@/lib/timer";
import { useRestTimer } from "@/stores/restTimer";

// The floating bar at the bottom of the workout screen while you rest.
// It shows nothing when you're not resting. Tapping the time opens the
// full-screen timer (RestScreen) via `?rest`, like the picker's `?add`.
export function RestBar() {
  const endsAt = useRestTimer((s) => s.endsAt);
  const totalMs = useRestTimer((s) => s.totalMs);
  const addTime = useRestTimer((s) => s.addTime);
  const skip = useRestTimer((s) => s.skip);
  const now = useAnimationNow(endsAt !== null);

  if (endsAt === null) return null;

  const left = remainingMs(endsAt, now);
  const over = left === 0;
  // The thin line along the bottom shrinks as the rest runs out.
  const lineWidth = `${(1 - restProgress(endsAt, totalMs, now)) * 100}%`;

  return (
    <div
      role="timer"
      aria-label="Rest timer"
      className="fixed bottom-6 left-1/2 z-20 flex h-16 w-[calc(100%-1.5rem)] max-w-114 -translate-x-1/2 items-center gap-3 overflow-hidden rounded-[18px] border border-accent bg-raised pr-2 pl-4 shadow-[0_12px_32px_rgba(0,0,0,.5)]"
    >
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.75 bg-accent"
        style={{ width: lineWidth }}
      />
      <button
        type="button"
        onClick={() => window.history.pushState(null, "", "?rest")}
        aria-label="Open rest timer"
        className="flex flex-1 items-center gap-3 self-stretch text-left"
      >
        <span className="text-xs font-extrabold tracking-[.08em] text-accent">
          {over ? "GO" : "REST"}
        </span>
        <span className="display text-[30px] leading-none">
          {formatRest(left)}
        </span>
      </button>
      <Button variant="secondary" size="sm" onClick={() => addTime(15)}>
        +15s
      </Button>
      <Button size="sm" onClick={skip}>
        {over ? "Done" : "Skip"}
      </Button>
    </div>
  );
}
