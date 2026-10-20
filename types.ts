export const DAY_TYPES = [
  "chest",
  "biceps",
  "arms",
  "shoulders",
  "back",
  "legs",
] as const;

export type DayType = (typeof DAY_TYPES)[number];
export type ExerciseKind = "weighted" | "bodyweight";

/** The looping figures an exercise can show (components/exercise). */
export const EXERCISE_MOTIONS = [
  "pushup",
  "press",
  "pullover",
  "fly",
  "curl",
  "overhead_press",
  "row",
  "squat",
] as const;

export type ExerciseMotion = (typeof EXERCISE_MOTIONS)[number];

/** Checks a value (say, from the database) really is one of the motions. */
export function isExerciseMotion(value: unknown): value is ExerciseMotion {
  return (
    typeof value === "string" &&
    (EXERCISE_MOTIONS as readonly string[]).includes(value)
  );
}

export interface WorkoutSet {
  reps: number | null;
  weightKg: number | null;
  done: boolean;
}


export interface WorkoutExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface Exercise {
  id: string;
  /** null for built-in exercises */
  userId: string | null;
  name: string;
  muscle: DayType;
  kind: ExerciseKind;
  defaultWeightKg: number | null;
  goalReps: number | null;
}

/** What you fill in to create your own exercise. */
export interface NewExercise {
  name: string;
  muscle: DayType;
  kind: ExerciseKind;
  defaultWeightKg: number | null;
}

/** A finished, saved workout */
export interface Workout {
  id: string;
  dayType: DayType;
  startedAt: string;
  endedAt: string;
  exercises: WorkoutExercise[];
}

/**
 * A workout in progress. Lives only on this phone (localStorage) until you
 * finish it — that's what makes a dropped signal mid-session harmless.
 * No `id`: it doesn't exist in the database yet.
 */

export interface ActiveWorkout {
  dayType: DayType;
  startedAt: string;
  exercises: WorkoutExercise[];
}

/** Narrows an unknown URL segment to a DayType. */
export function isDayType(value: string): value is DayType {
  return (DAY_TYPES as readonly string[]).includes(value);
}