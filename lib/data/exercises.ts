import { createClient } from "@/lib/supabase/server";
import type { DayType, Exercise, ExerciseKind } from "@/types";

type ExerciseRow = {
  id: string;
  user_id: string | null;
  name: string;
  muscle: DayType;
  kind: ExerciseKind;
  default_weight_kg: number | null;
  goal_reps: number | null;
};

/** Built-in exercises plus the logged-in user's own. RLS hides everyone else's. */
export async function getExercises(): Promise<Exercise[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select("id, user_id, name, muscle, kind, default_weight_kg, goal_reps")
    .order("name")
    .overrideTypes<ExerciseRow[], { merge: false }>();

  if (error) throw new Error(`Couldn't load exercises: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    muscle: row.muscle,
    kind: row.kind,
    defaultWeightKg: row.default_weight_kg,
    goalReps: row.goal_reps,
  }));
}
