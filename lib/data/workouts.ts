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

/**
 * Write a finished workout and return its new id. Throws on failure so the
 * caller can keep the workout on the phone and offer Try again.
 */
export async function saveWorkout(input: {
  dayType: DayType;
  startedAt: string;
  exercises: WorkoutExercise[];
}): Promise<string>{
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      day_type: Input.dayType,
      started_at: input.startedAt,
      ended_at: new Date().toISOString(),
      exercises: input.exercises,
    })
    .select("id")
    .single<{ id: string }>();

  if (error) throw new Error(`Couldn't save workout: ${error.message}`);

  return data.id;
}