"use client";

import { useEffect, useState } from "react";
import { formatElapsed } from "@/lib/workout";

// "18:42": how long the workout has been running. Its own tiny component so
// only this text re-renders every second, not the screen around it.
export function ElapsedTime({ startedAt }: { startedAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <>{formatElapsed(now - Date.parse(startedAt))}</>;
}
