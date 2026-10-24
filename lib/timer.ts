/**
 * Rest timer maths. Pure functions: nothing here reads the clock,
 * the caller passes `now` (milliseconds, from Date.now()).
 */

/** Until Settings exists, every rest is 1:30 (the spec's default). */
export const DEFAULT_REST_SECONDS = 90;

/** When a rest starting now should end. */
export function restEndsAt(now: number, restSeconds: number): number {
    return now + restSeconds * 1000;
}

/** Milliseconds left, never below zero. */
export function remainingMs(endsAt: number, now: number): number {
    return Math.max(0, endsAt - now);
}

/** How much of the rest is used up, from 0 to 1, for the progress ring. */
export function restProgress(
  endsAt: number,
  totalMs: number,
  now: number,
): number {
  if (totalMs <= 0) return 1;
  const left = remainingMs(endsAt, now);
  return Math.min(1, Math.max(0, 1 - left / totalMs)); //0 indicates start, 1 indicates stop
}

/**
 * "1:30", "0:49", "0:01". Rounds seconds up, so the screen never
 * shows 0:00 while there's still a moment of rest left.
 */

export function formatRest(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}