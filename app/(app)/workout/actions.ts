"use server";

import { saveWorkout } from "@/lib/data/workouts";
import {
  isDayType,
  type ActiveWorkout,
  type WorkoutExercise,
  type WorkoutSet,
} from "@/types";

export type FinishResult = { ok: true } | { ok: false; error: string };

const MAX_EXERCISES = 40;
const MAX_SETS = 50;
const isWhole = (n: unknown): n is number =>
  typeof n === "number" && Number.isInteger(n);

/**
 * Same idea as parseNewExercise: this is a public endpoint, so check the
 * whole shape at runtime. Only finished sets are accepted, and every one
 * needs reps (and kg if it has a weight). Returns the clean workout or null.
 */
function parseFinishedWorkout(input: unknown): ActiveWorkout | null {
  if (typeof input !== "object" || input === null) return null;
  const { dayType, startedAt, exercises } = input as Record<string, unknown>;

  if (typeof dayType !== "string" || !isDayType(dayType)) return null;

  const started = typeof startedAt === "string" ? Date.parse(startedAt) : NaN;
  const now = Date.now();
  // Started in the past, and not more than two days ago.
  if (!Number.isFinite(started) || started > now + 60_000) return null;
  if (now - started > 2 * 24 * 60 * 60 * 1000) return null;

  if (!Array.isArray(exercises) || exercises.length === 0) return null;
  if (exercises.length > MAX_EXERCISES) return null;

  const clean: WorkoutExercise[] = [];
  for (const entry of exercises as unknown[]) {
    if (typeof entry !== "object" || entry === null) return null;
    const { exerciseId, sets } = entry as Record<string, unknown>;
    if (typeof exerciseId !== "string" || exerciseId.length > 64) return null;
    if (!Array.isArray(sets) || sets.length === 0 || sets.length > MAX_SETS) {
      return null;
    }

    const cleanSets: WorkoutSet[] = [];
    for (const set of sets as unknown[]) {
      if (typeof set !== "object" || set === null) return null;
      const { reps, weightKg, done } = set as Record<string, unknown>;
      if (done !== true) return null;
      if (!isWhole(reps) || reps < 0 || reps > 999) return null;
      if (
        weightKg !== null &&
        (typeof weightKg !== "number" || !(weightKg > 0) || weightKg > 1000)
      ) {
        return null;
      }
      cleanSets.push({ reps, weightKg, done: true });
    }
    clean.push({ exerciseId, sets: cleanSets });
  }

  return { dayType, startedAt: new Date(started).toISOString(), exercises: clean };
}

export async function finishWorkout(
  workout: ActiveWorkout,
): Promise<FinishResult> {
  const parsed = parseFinishedWorkout(workout);
  if (!parsed) {
    return { ok: false, error: "Something's off with this workout. Try again." };
  }

  try {
    await saveWorkout(parsed);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Couldn't save. Check your connection." };
  }
}
