import type { Workout } from "@/types";

/** One line on the plan screen: an exercise, and how many sets of it. */
export type PlanItem = {
  exerciseId: string;
  sets: number;
};

/** How many sets an exercise starts with when you add it to a plan. */
export const DEFAULT_SETS = 3;

/**
 * Turn the last workout of this day type into a starting plan:
 * same exercises, same number of sets, but the sets start empty.
 */
export function planFromWorkout(workout: Workout | undefined): PlanItem[] {
  if (!workout) return [];

  return workout.exercises.map((entry) => ({
    exerciseId: entry.exerciseId,
    sets: entry.sets.length,
  }));
}

/** Append exercises to the end of a plan, skipping any already in it. */
export function addToPlan(plan: PlanItem[], exerciseIds: string[]): PlanItem[] {
  const planned = new Set(plan.map((item) => item.exerciseId));
  const added = exerciseIds
    .filter((id) => !planned.has(id))
    .map((exerciseId) => ({ exerciseId, sets: DEFAULT_SETS }));
  return [...plan, ...added];
}

export function totalSets(plan: PlanItem[]): number {
  return plan.reduce((sum, item) => sum + item.sets, 0);
}
