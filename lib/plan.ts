import type { Workout } from "@/types";

/** One line on the plan screen: an exercise, and how many sets of it. */
export type PlanItem = {
    exerciseId: string;
    sets: number;
};

/**
 * Turn the last workout of this day type into a starting plan:
 * same exercises, same number of sets, but the sets start empty.
 */

export function planFromWorkout(workout: Workout | undefined): PlanItem[] {
    if(!workout) return [];

    return workout.exercises.map((entry) => ({
        exerciseId: entry.exerciseId,
        sets: entry.sets.length,
    }));
    
}

export function totalSets(plan: PlanItem[]): number {
    return plan.reduce((sum, item) => sum + item.sets, 0);

}