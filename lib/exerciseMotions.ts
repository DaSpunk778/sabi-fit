import { isExerciseMotion, type ExerciseMotion } from "@/types";

/**
 * Which animation each built-in exercise uses, by name. A fallback for
 * exercises whose `motion` isn't set in the database. Exercises not listed
 * show a still dumbbell.
 */
export const MOTION_BY_EXERCISE: Partial<Record<string, ExerciseMotion>> = {
  // Chest
  "Push-ups": "pushup",
  "Wide Push-ups": "pushup",
  "Diamond Push-ups": "pushup",
  "Decline Push-ups": "pushup",
  "Dumbbell Floor Press": "press",
  "Bench Press": "press",
  "Dumbbell Pullover": "pullover",
  "Dumbbell Fly": "fly",
  // Biceps
  "Dumbbell Curl": "curl",
  "Hammer Curl": "curl",
  "Concentration Curl": "curl",
  // Arms
  "Close-grip Push-ups": "pushup",
  // Shoulders
  "Dumbbell Shoulder Press": "overhead_press",
  "Pike Push-ups": "pushup",
  // Back
  "One-arm Dumbbell Row": "row",
  // Legs
  "Goblet Squat": "squat",
  "Bodyweight Squats": "squat",
};

/** The motion saved on the exercise if it's a real one, else the name list's. */
export function motionFor(exercise: {
  name: string;
  motion?: string | null;
}): ExerciseMotion | null {
  if (isExerciseMotion(exercise.motion)) return exercise.motion;
  return MOTION_BY_EXERCISE[exercise.name] ?? null;
}
