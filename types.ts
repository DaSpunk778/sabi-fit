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


/** Narrows an unknown URL segment to a DayType. */
export function isDayType(value: string): value is DayType {
  return (DAY_TYPES as readonly string[]).includes(value);
}