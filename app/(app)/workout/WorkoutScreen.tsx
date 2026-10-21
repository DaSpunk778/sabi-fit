"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { FiChevronDown } from "react-icons/fi";
import {
  ExercisePicker,
  closePicker,
  openPicker,
} from "@/components/exercise/ExercisePicker";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DEFAULT_SETS } from "@/lib/plan";
import {
  currentSet,
  finishedExercises,
  formatElapsed,
  setCounts,
  workoutFromPlan,
} from "@/lib/workout";
import { useActiveWorkout } from "@/stores/activeWorkout";
import type { Exercise, WorkoutSet } from "@/types";
import { finishWorkout } from "./actions";
import { ExerciseLog } from "./ExerciseLog";

type WorkoutScreenProps = {
  exercises: Exercise[];
  /** exercise id → your sets for it last time. */
  lastSets: Partial<Record<string, WorkoutSet[]>>;
  /** exercise id → "Best 30 · Goal 40". */
  bestLabels: Partial<Record<string, string>>;
};

// Only this tiny component re-renders every second, not the whole screen.
function ElapsedTime({ startedAt }: { startedAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <>{formatElapsed(now - Date.parse(startedAt))}</>;
}

export function WorkoutScreen({
  exercises,
  lastSets,
  bestLabels,
}: WorkoutScreenProps) {
  const workout = useActiveWorkout((s) => s.workout);
  const hydrated = useActiveWorkout((s) => s.hydrated);
  const addExercises = useActiveWorkout((s) => s.addExercises);
  const discard = useActiveWorkout((s) => s.discard);

  const router = useRouter();
  const pickerOpen = useSearchParams().has("add");
  const [created, setCreated] = useState<Exercise[]>([]);
  // Cards you opened or closed by hand; the rest follow `openByDefault`.
  const [toggled, setToggled] = useState<Partial<Record<string, boolean>>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const [leaving, setLeaving] = useState(false);

  const allExercises = useMemo(
    () => [...exercises, ...created],
    [exercises, created],
  );
  const byId = useMemo(
    () => new Map(allExercises.map((exercise) => [exercise.id, exercise])),
    [allExercises],
  );
  const inWorkout = useMemo(
    () => new Set(workout?.exercises.map((entry) => entry.exerciseId)),
    [workout],
  );

  // Hooks above, early returns below: React needs the same hooks every render.
  // Until localStorage is read we don't know yet, so show nothing rather than
  // flashing "no workout".
  if (!hydrated || leaving) return <main className="flex-1" />;

  if (!workout) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 px-6 py-9">
        <div>
          <h1 className="display text-[44px] leading-none">No workout running</h1>
          <p className="mt-2.5 text-muted">
            Pick a day on Today and tap Start.
          </p>
        </div>
        <ButtonLink href="/app">Go to Today</ButtonLink>
      </main>
    );
  }

  if (pickerOpen) {
    return (
      <ExercisePicker
        dayType={workout.dayType}
        exercises={allExercises}
        inPlan={inWorkout}
        onAdd={(ids) => {
          const plan = ids.map((exerciseId) => ({ exerciseId, sets: DEFAULT_SETS }));
          addExercises(workoutFromPlan(plan, allExercises));
          closePicker();
        }}
        onCreated={(exercise) => setCreated((c) => [...c, exercise])}
        onClose={closePicker}
      />
    );
  }

  const { done, total } = setCounts(workout);
  const current = currentSet(workout);

  function finish() {
    if (!workout) return;
    const finished = finishedExercises(workout);

    if (finished.length === 0) {
      if (window.confirm("Discard this workout? You haven't ticked any sets.")) {
        setLeaving(true);
        discard();
        router.replace("/app");
      }
      return;
    }

    setError(null);
    startSaving(async () => {
      const result = await finishWorkout({ ...workout, exercises: finished });
      if (!result.ok) {
        // The workout stays on the phone, so nothing is lost: just try again.
        setError(result.error);
        return;
      }
      // Clear the phone's copy only once the database has it.
      setLeaving(true);
      discard();
      router.replace("/app");
    });
  }

  return (
    <main className="flex-1 pb-9">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#1F2226] bg-bg px-4 pt-4 pb-3">
        <Link
          href="/app"
          aria-label="Back to Today"
          className="inline-flex size-11 flex-none items-center justify-center rounded-xl border border-line-strong bg-surface text-ink hover:bg-raised"
        >
          <FiChevronDown size={20} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="display text-[26px] leading-none">
            {workout.dayType} day
          </h1>
          <p className="text-[13px] font-bold text-muted">
            <ElapsedTime startedAt={workout.startedAt} /> · {done} / {total} sets
          </p>
        </div>
        <Button
          onClick={finish}
          disabled={saving}
          className="min-h-11 px-4.5 text-base"
        >
          {saving ? "Saving…" : "Finish"}
        </Button>
      </header>

      <div className="flex flex-col gap-3 px-3 pt-3.5">
        {error && (
          <Alert>
            {error} Your workout is safe on this phone. Tap Finish to try again.
          </Alert>
        )}

        {workout.exercises.map((entry) => {
          const exercise = byId.get(entry.exerciseId);
          if (!exercise) return null;

          const isCurrent = current?.exerciseId === entry.exerciseId;
          const openByDefault = isCurrent || entry.sets.some((set) => set.done);
          const open = toggled[entry.exerciseId] ?? openByDefault;

          return (
            <ExerciseLog
              key={entry.exerciseId}
              exercise={exercise}
              entry={entry}
              lastSets={lastSets[entry.exerciseId] ?? []}
              bestLabel={bestLabels[entry.exerciseId]}
              currentIndex={isCurrent ? current.setIndex : null}
              open={open}
              onToggle={() =>
                setToggled((t) => ({ ...t, [entry.exerciseId]: !open }))
              }
            />
          );
        })}

        <Button variant="secondary" onClick={openPicker} className="w-full">
          + Add exercise
        </Button>
      </div>
    </main>
  );
}
