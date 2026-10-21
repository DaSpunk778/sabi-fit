import type { Metadata } from "next";
import { getExercises } from "@/lib/data/exercises";
import { getWorkouts } from "@/lib/data/workouts";
import { bestOf, lastSetsFor } from "@/lib/stats";
import type { Exercise, Workout, WorkoutSet } from "@/types";
import { WorkoutScreen } from "./WorkoutScreen";

export const metadata: Metadata = { title: "Workout" };

/** "Best 30 · Goal 40" or "Best 25 kg × 11"; undefined with nothing to show. */
function bestLabel(exercise: Exercise, workouts: Workout[]) {
  const best = bestOf(exercise, workouts);
  const parts = [];
  if (best) {
    parts.push(
      best.kind === "bodyweight"
        ? `Best ${best.reps}`
        : `Best ${best.weightKg} kg × ${best.reps}`,
    );
  }
  if (exercise.goalReps !== null) parts.push(`Goal ${exercise.goalReps}`);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

// The workout itself lives on the phone, so this page can't know which
// exercises are in it. It sends history for every exercise instead.
export default async function WorkoutPage() {
  const [workouts, exercises] = await Promise.all([
    getWorkouts(),
    getExercises(),
  ]);

  const lastSets: Partial<Record<string, WorkoutSet[]>> = {};
  const bestLabels: Partial<Record<string, string>> = {};
  for (const exercise of exercises) {
    lastSets[exercise.id] = lastSetsFor(exercise.id, workouts);
    bestLabels[exercise.id] = bestLabel(exercise, workouts);
  }

  return (
    <WorkoutScreen
      exercises={exercises}
      lastSets={lastSets}
      bestLabels={bestLabels}
    />
  );
}
