"use client";

import { useEffect } from "react";
import { beep, buzz } from "@/lib/beep";
import { useRestTimer } from "@/stores/restTimer";

// Beeps and buzzes once when a rest runs out, on any app screen.
//
// It checks the clock four times a second instead of setting one long
// timer: a locked phone pauses timers, and when you come back, a rest that
// ended minutes ago shouldn't suddenly beep. So it only alerts if it notices
// the end within two seconds.
export function RestAlarm() {
  const endsAt = useRestTimer((s) => s.endsAt);

  useEffect(() => {
    if (endsAt === null) return;

    const check = setInterval(() => {
      const late = Date.now() - endsAt;
      if (late < 0) return; // still resting
      clearInterval(check);
      if (late < 2000) {
        beep();
        buzz();
      }
    }, 250);

    // A new rest, +15s (new endsAt) or Skip (null) cancels this one.
    return () => clearInterval(check);
  }, [endsAt]);

  return null;
}
