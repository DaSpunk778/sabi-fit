import type {
  ActiveWorkout,
  Exercise,
  ExerciseKind,
  WorkoutExercise,
  WorkoutSet,
} from "@/types";
import type { PlanItem } from "./plan";

/** Turn a plan into empty sets, ready to log. */
export function workoutFromPlan(
  plan: PlanItem[],
  exercises: Exercise[],
): WorkoutExercise[] {
  const byId = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  return plan.map((item) => {
    const exercise = byId.get(item.exerciseId);
    // Weighted moves start at the weight you usually use; bodyweight has none.
    const weightKg =
      exercise?.kind === "weighted" ? exercise.defaultWeightKg : null;

    return {
      exerciseId: item.exerciseId,
      sets: Array.from({ length: item.sets }, () => ({
        reps: null,
        weightKg,
        done: false,
      })),
    };
  });
}

/** Sets done, and sets planned: the "4 / 13 sets" in the header. */
export function setCounts(workout: ActiveWorkout) {
  let done = 0;
  let total = 0;
  for (const entry of workout.exercises) {
    total = total + entry.sets.length;
    done = done + entry.sets.filter((set) => set.done).length;
  }
  return { done, total };
}

/** The first set not ticked yet, in workout order: the one you're on. */
export function currentSet(
  workout: ActiveWorkout,
): { exerciseId: string; setIndex: number } | null {
  for (const entry of workout.exercises) {
    const setIndex = entry.sets.findIndex((set) => !set.done);
    if (setIndex !== -1) return { exerciseId: entry.exerciseId, setIndex };
  }
  return null;
}

/**
 * What actually gets saved: finished sets only, and no exercise you never
 * started. An empty result means there's nothing worth saving.
 */
export function finishedExercises(workout: ActiveWorkout): WorkoutExercise[] {
  return workout.exercises
    .map((entry) => ({
      ...entry,
      sets: entry.sets.filter((set) => set.done),
    }))
    .filter((entry) => entry.sets.length > 0);
}

/** "30" for bodyweight, "25 × 11" for weighted, "—" when there's no history. */
export function formatSet(
  set: WorkoutSet | undefined,
  kind: ExerciseKind,
): string {
  if (!set || set.reps === null) return "—";
  if (kind === "bodyweight" || set.weightKg === null) return String(set.reps);
  return `${set.weightKg} × ${set.reps}`;
}

/** Time since the workout started: "4:05", "18:42" or "1:02:07". */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`;
}
