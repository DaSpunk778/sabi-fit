"use server";

import { cookies } from "next/headers";
import { TIME_ZONE_COOKIE, isValidTimeZone } from "@/lib/timezone";

// Setting the cookie makes Next re-render the current page with the new zone.
export async function saveTimeZone(timeZone: string) {
  if (!isValidTimeZone(timeZone)) return;

  (await cookies()).set(TIME_ZONE_COOKIE, timeZone, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
