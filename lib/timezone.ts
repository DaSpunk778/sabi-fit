import { cookies } from "next/headers";

export const TIME_ZONE_COOKIE = "tz";

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * The user's time zone, as reported by their browser (see TimeZoneSync).
 * null on the very first request, before the browser has told us.
 */
export async function getTimeZone(): Promise<string | null> {
  const value = (await cookies()).get(TIME_ZONE_COOKIE)?.value;
  return value && isValidTimeZone(value) ? value : null;
}
