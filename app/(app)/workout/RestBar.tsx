"use client";

import { useState } from "react";
import { FiMaximize2 } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { TapIcon } from "@/components/ui/TapIcon";
import { useAnimationNow } from "@/hooks/useAnimation";
import { formatRest, remainingMs, restProgress } from "@/lib/timer";
import { useRestTimer } from "@/stores/restTimer";

// Remembered on this phone once you've opened the full-screen timer.
const HINT_KEY = "sabi-fit.rest-hint-seen";

function hintAlreadySeen() {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false; // private mode or storage blocked: just keep showing the hint
  }
}

// The floating bar at the bottom of the workout screen while you rest.
// It shows nothing when you're not resting. Tapping the time opens the
// full-screen timer (RestScreen) via `?rest`, like the picker's `?add`.
// Until you've done that once, a tapping finger points it out.
export function RestBar() {
  const endsAt = useRestTimer((s) => s.endsAt);
  const totalMs = useRestTimer((s) => s.totalMs);
  const addTime = useRestTimer((s) => s.addTime);
  const skip = useRestTimer((s) => s.skip);
  const now = useAnimationNow(endsAt !== null);
  const [hintSeen, setHintSeen] = useState(
    () => typeof window !== "undefined" && hintAlreadySeen(),
  );

  if (endsAt === null) return null;

  const left = remainingMs(endsAt, now);
  const over = left === 0;
  // The thin line along the bottom shrinks as the rest runs out.
  const lineWidth = `${(1 - restProgress(endsAt, totalMs, now)) * 100}%`;

  function openRestScreen() {
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      // can't remember it; the hint will just show again next time
    }
    setHintSeen(true);
    window.history.pushState(null, "", "?rest");
  }

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
        onClick={openRestScreen}
        aria-label="Open rest timer"
        className="flex min-w-0 flex-1 items-center gap-3 self-stretch text-left"
      >
        <span className="text-xs font-extrabold tracking-[.08em] text-accent">
          {over ? "GO" : "REST"}
        </span>
        <span className="display text-[30px] leading-none">
          {formatRest(left)}
        </span>
        {hintSeen ? (
          <FiMaximize2 size={15} className="flex-none text-muted" aria-hidden />
        ) : (
          <span className="flex flex-none items-center gap-1 text-[11px] font-extrabold tracking-[.06em] text-accent">
            <TapIcon className="motion-safe:animate-tap" />
            TAP
          </span>
        )}
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
