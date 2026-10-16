import { createClient } from "@/lib/supabase/server";
import type { DayType, Exercise, ExerciseKind, NewExercise } from "@/types";

type ExerciseRow = {
  id: string;
  user_id: string | null;
  name: string;
  muscle: DayType;
  kind: ExerciseKind;
  default_weight_kg: number | null;
  goal_reps: number | null;
};

const COLUMNS = "id, user_id, name, muscle, kind, default_weight_kg, goal_reps";

function toExercise(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    muscle: row.muscle,
    kind: row.kind,
    defaultWeightKg: row.default_weight_kg,
    goalReps: row.goal_reps,
  };
}

/** Built-in exercises plus the logged-in user's own. RLS hides everyone else's. */
export async function getExercises(): Promise<Exercise[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(COLUMNS)
    .order("name")
    .overrideTypes<ExerciseRow[], { merge: false }>();

  if (error) throw new Error(`Couldn't load exercises: ${error.message}`);

  return data.map(toExercise);
}

/** Save one of the logged-in user's own exercises and return it. */
export async function createExercise(input: NewExercise): Promise<Exercise> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("exercises")
    .insert({
      user_id: user.id,
      name: input.name,
      muscle: input.muscle,
      kind: input.kind,
      default_weight_kg: input.defaultWeightKg,
    })
    .select(COLUMNS)
    .single<ExerciseRow>();

  if (error) throw new Error(`Couldn't save exercise: ${error.message}`);

  return toExercise(data);
}
