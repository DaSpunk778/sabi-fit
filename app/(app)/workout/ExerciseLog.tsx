"use client";

import { useId } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { unlockAudio } from "@/lib/beep";
import { equipmentLabel } from "@/lib/exerciseLabels";
import { currentSet, formatSet } from "@/lib/workout";
import { useActiveWorkout } from "@/stores/activeWorkout";
import { useRestTimer } from "@/stores/restTimer";
import type { Exercise, WorkoutExercise, WorkoutSet } from "@/types";

// Called right after a set is ticked. Zustand updates are synchronous, so
// getState() already includes that tick: the next unticked set in the
// workout is what you're resting for.
function restBeforeNextSet() {
  const workout = useActiveWorkout.getState().workout;
  const next = workout ? currentSet(workout) : null;
  if (next) {
    unlockAudio(); // this runs from a tap, so the beep is allowed later
    useRestTimer.getState().startRest(next);
  } else {
    useRestTimer.getState().skip(); // every set done: nothing to rest for
  }
}

type ExerciseLogProps = {
  exercise: Exercise;
  entry: WorkoutExercise;
  /** Your sets for this exercise last time you trained it ([] if never). */
  lastSets: WorkoutSet[];
  /** "Best 30 · Goal 40", worked out on the server; undefined if none yet. */
  bestLabel: string | undefined;
  /** Index of the set you're on, if it's in this exercise. */
  currentIndex: number | null;
  open: boolean;
  onToggle: () => void;
};

export function ExerciseLog({
  exercise,
  entry,
  lastSets,
  bestLabel,
  currentIndex,
  open,
  onToggle,
}: ExerciseLogProps) {
  // Picking just the functions means this card doesn't re-render when
  // another exercise's set changes. Functions in a Zustand store never change.
  const setReps = useActiveWorkout((s) => s.setReps);
  const setWeight = useActiveWorkout((s) => s.setWeight);
  const toggleDone = useActiveWorkout((s) => s.toggleDone);
  const addSet = useActiveWorkout((s) => s.addSet);

  const idBase = useId();
  const weighted = exercise.kind === "weighted";
  const id = entry.exerciseId;
  const doneCount = entry.sets.filter((set) => set.done).length;

  // The grey suggestion in an empty box: what you did on this set last time,
  // or else your previous set today.
  function suggestedReps(i: number) {
    return lastSets[i]?.reps ?? entry.sets[i - 1]?.reps ?? null;
  }
  function suggestedWeight(i: number) {
    return lastSets[i]?.weightKg ?? entry.sets[i - 1]?.weightKg ?? null;
  }

  function tick(i: number) {
    const set = entry.sets[i];
    if (set.done) {
      toggleDone(id, i); // untick to fix a typo
      return;
    }

    // Nothing typed: take the suggestion. No suggestion either: go type one.
    const reps = set.reps ?? suggestedReps(i);
    const weightKg = weighted ? (set.weightKg ?? suggestedWeight(i)) : null;
    if (weighted && weightKg === null) {
      document.getElementById(`${idBase}-kg-${i}`)?.focus();
      return;
    }
    if (reps === null) {
      document.getElementById(`${idBase}-reps-${i}`)?.focus();
      return;
    }

    if (set.reps === null) setReps(id, i, reps);
    if (weighted && set.weightKg === null) setWeight(id, i, weightKg);
    toggleDone(id, i);
    restBeforeNextSet();
  }

  if (!open) {
    return (
      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={false}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left"
        >
          <span>
            <span className="display block text-[22px] leading-tight">
              {exercise.name}
            </span>
            <span className="text-[13px] text-muted">
              {doneCount} / {entry.sets.length} sets
              {doneCount === 0 && " · tap to open"}
            </span>
          </span>
          <FiChevronDown size={20} className="flex-none text-muted" />
        </button>
      </Card>
    );
  }

  // Same columns for the header and every row, so they line up.
  const columns = weighted
    ? "grid-cols-[36px_minmax(0,1fr)_68px_68px_44px] gap-2"
    : "grid-cols-[36px_minmax(0,1fr)_100px_44px] gap-2.5";

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded
        className="flex w-full items-start justify-between gap-3 px-4 pt-4 pb-1.5 text-left"
      >
        <span className="min-w-0">
          <span className="display block text-2xl leading-tight">
            {exercise.name}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-5.5 items-center rounded-full bg-raised px-2 text-[11px] font-bold text-[#C9CDD1]">
              {equipmentLabel(exercise)}
            </span>
            {bestLabel && (
              <span className="text-[13px] font-bold text-muted">
                {bestLabel}
              </span>
            )}
          </span>
        </span>
        <FiChevronDown size={20} className="mt-1 flex-none rotate-180 text-muted" />
      </button>

      <div
        className={`grid ${columns} min-h-7 items-center px-3.5 text-[11px] font-bold tracking-[.08em] text-dim uppercase`}
      >
        <span className="text-center">Set</span>
        <span>Last time</span>
        {weighted && <span className="text-center">kg</span>}
        <span className="text-center">Reps</span>
        <span className="text-center">Done</span>
      </div>

      {entry.sets.map((set, i) => {
        const isCurrent = i === currentIndex;
        return (
          <div
            key={i}
            className={`grid ${columns} min-h-14 items-center px-3.5 py-1.5 ${
              set.done ? "bg-accent/7" : ""
            } ${isCurrent ? "shadow-[inset_3px_0_0_var(--color-accent)]" : ""}`}
          >
            <span className="text-center text-sm font-extrabold">{i + 1}</span>
            <span className="truncate text-sm text-muted">
              {formatSet(lastSets[i], exercise.kind)}
            </span>

            {set.done ? (
              <>
                {weighted && (
                  <span className="text-center text-[17px] font-extrabold">
                    {set.weightKg}
                  </span>
                )}
                <span className="text-center text-[17px] font-extrabold">
                  {set.reps}
                </span>
              </>
            ) : (
              <>
                {weighted && (
                  <NumberInput
                    id={`${idBase}-kg-${i}`}
                    aria-label={`Set ${i + 1} weight in kg`}
                    decimal
                    max={1000}
                    value={set.weightKg}
                    placeholder={suggestedWeight(i)?.toString()}
                    onValueChange={(kg) => setWeight(id, i, kg)}
                  />
                )}
                <NumberInput
                  id={`${idBase}-reps-${i}`}
                  aria-label={`Set ${i + 1} reps`}
                  value={set.reps}
                  placeholder={suggestedReps(i)?.toString()}
                  onValueChange={(reps) => setReps(id, i, reps)}
                />
              </>
            )}

            <button
              type="button"
              onClick={() => tick(i)}
              aria-label={set.done ? `Set ${i + 1} done` : `Mark set ${i + 1} done`}
              aria-pressed={set.done}
              className={`inline-flex size-11 items-center justify-center rounded-xl border-[1.5px] transition-colors ${
                set.done
                  ? "border-accent bg-accent text-bg"
                  : "border-[#3A3F45] text-dim hover:text-ink"
              }`}
            >
              <FiCheck size={20} strokeWidth={3} />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => addSet(id)}
        className="mx-4 mt-2 mb-4 flex min-h-11 w-[calc(100%-2rem)] items-center justify-center rounded-2xl border border-line-strong bg-raised text-sm font-extrabold transition-colors hover:bg-line"
      >
        + Add set
      </button>
    </Card>
  );
}
