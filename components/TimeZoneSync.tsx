"use client";

import { useEffect, useTransition } from "react";
import { saveTimeZone } from "@/app/(app)/actions";

// The server can't know the phone's time zone, and "today" / "this week"
// depend on it. This tells the server whenever its idea of the zone is wrong.
export function TimeZoneSync({
  serverTimeZone,
}: {
  serverTimeZone: string | null;
}) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && timeZone !== serverTimeZone) {
      startTransition(() => saveTimeZone(timeZone));
    }
  }, [serverTimeZone]);

  return null;
}
