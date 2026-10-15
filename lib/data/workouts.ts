import { createClient } from "@/lib/supabase/server";
import type { DayType, Workout, WorkoutExercise } from "@/types";

type WorkoutRow = {
  id: string;
  day_type: DayType;
  started_at: string;
  ended_at: string;
  exercises: WorkoutExercise[];
};

/** All of the logged-in user's workouts, newest first. RLS scopes this to them. */
export async function getWorkouts(): Promise<Workout[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workouts")
    .select("id, day_type, started_at, ended_at, exercises")
    .order("ended_at", { ascending: false })
    .overrideTypes<WorkoutRow[], { merge: false }>();

  if (error) throw new Error(`Couldn't load workouts: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    dayType: row.day_type,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    exercises: row.exercises,
  }));
}
