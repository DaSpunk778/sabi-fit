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

/** Sets done, and sets planned — the "4 / 13 sets" in the header. */
export function setCounts(workout: ActiveWorkout) {
    let done = 0;
    let total = 0;
    for (const entry of workout.exercises) {
        total = total + entry.sets.length;
        done = done + entry.sets.filter((set) => set.done).length;
    }
    return { done, total };
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
    if (!set || set.reps === null) return "-";
    if (kind === "bodyweight" || set.weightKg == null) return String(set.reps);
    return `${set.weightKg} x ${set.reps}`;
}



