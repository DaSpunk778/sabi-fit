"use server";

import { createExercise } from "@/lib/data/exercises";
import { isDayType, type Exercise, type NewExercise } from "@/types";

// `ok` tells TypeScript which shape came back: check it and the other
// fields are known (`exercise` when true, `error` when false).
export type CreateExerciseResult =
  | { ok: true; exercise: Exercise }
  | { ok: false; error: string };

/**
 * The NewExercise type only helps the code that calls this. A server action
 * is a public endpoint, so at runtime anyone can send anything: treat the
 * input as unknown and check every field before it reaches the database.
 * Returns the cleaned-up exercise, or a message saying what's wrong.
 */
function parseNewExercise(input: unknown): NewExercise | string {
  if (typeof input !== "object" || input === null) {
    return "Something went wrong. Try again.";
  }
  const { name, muscle, kind, defaultWeightKg } = input as Record<
    string,
    unknown
  >;

  if (typeof name !== "string" || !name.trim()) {
    return "Give your exercise a name.";
  }
  if (name.trim().length > 60) return "Keep the name under 60 characters.";
  if (typeof muscle !== "string" || !isDayType(muscle)) {
    return "Pick a muscle group.";
  }
  if (kind !== "weighted" && kind !== "bodyweight") {
    return "Pick weighted or bodyweight.";
  }

  let weight: number | null = null;
  if (kind === "weighted" && defaultWeightKg != null) {
    if (
      typeof defaultWeightKg !== "number" ||
      !Number.isFinite(defaultWeightKg) ||
      defaultWeightKg <= 0 ||
      defaultWeightKg > 500
    ) {
      return "Weight should be a number between 0 and 500 kg.";
    }
    weight = defaultWeightKg;
  }

  return { name: name.trim(), muscle, kind, defaultWeightKg: weight };
}

export async function createCustomExercise(
  input: NewExercise,
): Promise<CreateExerciseResult> {
  const parsed = parseNewExercise(input);
  if (typeof parsed === "string") return { ok: false, error: parsed };

  try {
    return { ok: true, exercise: await createExercise(parsed) };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "Couldn't save it. Check your connection and try again.",
    };
  }
}
