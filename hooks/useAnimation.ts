"use client";

import { useEffect, useState } from "react";

/**
 * The current time, refreshed every animation frame (about 60 times a
 * second) while `running` is true, so countdowns and progress lines move
 * smoothly.
 *
 * Browsers pause animation frames while the tab is hidden or the phone is
 * locked. When you come back, the next frame reads the real clock, and a
 * timer built on a timestamp (`endsAt`) is right again immediately.
 */

export function useAnimationNow(running: boolean): number {
    const [now, setNow] = useState(() => Date.now());

   useEffect(() => {
    if (!running) return;

    let frame = requestAnimationFrame(function tick() {
      setNow(Date.now());
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [running]);

  return now;
}
