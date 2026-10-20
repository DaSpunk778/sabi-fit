"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiPlay, FiPlus, FiX } from "react-icons/fi";
import { BottomBar } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { addToPlan, totalSets, type PlanItem } from "@/lib/plan";
import type { DayType, Exercise } from "@/types";
import { ExercisePicker } from "./ExercisePicker";

type PlanEditorProps = {
  dayType: DayType;
  /** Every exercise available, so a row can be looked up by id. */
  exercises: Exercise[];
  initialPlan: PlanItem[];
  /** exercise id → "Best 30" / "Best × 11", worked out on the server. */
  bestLabels: Partial<Record<string, string>>;
  /** Title and "copied from" note, rendered on the server. Hidden while picking. */
  header: React.ReactNode;
};

// The picker is part of this page rather than its own route, so the plan
// you're editing survives opening it. `?add` in the URL marks it open, which
// also lets the phone's back button close it.
function openPicker() {
  window.history.pushState(null, "", "?add");
  window.scrollTo(0, 0);
}

function closePicker() {
  window.history.back();
}

function tagLabel(exercise: Exercise) {
  if (exercise.kind === "bodyweight") return "Bodyweight";
  return exercise.defaultWeightKg !== null
    ? `${exercise.defaultWeightKg} kg`
    : "Weighted";
}

export function PlanEditor({
  dayType,
  exercises,
  initialPlan,
  bestLabels,
  header,
}: PlanEditorProps) {
  const [plan, setPlan] = useState<PlanItem[]>(initialPlan);
  // Exercises you create on this visit. The server's list doesn't have them
  // until the page loads again, so they're added on here.
  const [created, setCreated] = useState<Exercise[]>([]);
  const pickerOpen = useSearchParams().has("add");

  const allExercises = useMemo(
    () => [...exercises, ...created],
    [exercises, created],
  );

  // A list is fine to search once; a Map is better when every row does it.
  const byId = useMemo(
    () => new Map(allExercises.map((exercise) => [exercise.id, exercise])),
    [allExercises],
  );
  const inPlan = useMemo(
    () => new Set(plan.map((item) => item.exerciseId)),
    [plan],
  );

  // No previous workout of this day type: go straight to picking exercises.
  // Checked against the real URL so React's double-run in dev opens it once.
  const startsEmpty = initialPlan.length === 0;
  useEffect(() => {
    const alreadyOpen = new URLSearchParams(window.location.search).has("add");
    if (startsEmpty && !alreadyOpen) openPicker();
  }, [startsEmpty]);

  function setSets(exerciseId: string, sets: number) {
    setPlan((current) =>
      current.map((item) =>
        item.exerciseId === exerciseId ? { ...item, sets } : item,
      ),
    );
  }

  function removeExercise(exerciseId: string) {
    setPlan((current) =>
      current.filter((item) => item.exerciseId !== exerciseId),
    );
  }

  function addExercises(exerciseIds: string[]) {
    setPlan((current) => addToPlan(current, exerciseIds));
    closePicker();
  }

  if (pickerOpen) {
    return (
      <ExercisePicker
        dayType={dayType}
        exercises={allExercises}
        inPlan={inPlan}
        onAdd={addExercises}
        onCreated={(exercise) => setCreated((current) => [...current, exercise])}
        onClose={closePicker}
      />
    );
  }

  return (
    <>
      {header}

      <div className="flex flex-col gap-3 px-5 pt-3 pb-32">
        <div className="flex items-baseline justify-between">
          <h2 className="label">Exercises · {plan.length}</h2>
          <span className="label">Sets</span>
        </div>

        {plan.map((item) => {
          const exercise = byId.get(item.exerciseId);
          if (!exercise) return null;

          return (
            <Card
              key={item.exerciseId}
              className="flex items-center gap-2.5 py-3.5 pr-2.5 pl-4"
            >
              <span className="min-w-0 flex-1">
                <b className="text-base">{exercise.name}</b>
                <br />
                <span className="mr-1.5 inline-flex h-5.5 items-center rounded-full bg-raised px-2 text-[11px] font-bold text-[#C9CDD1]">
                  {tagLabel(exercise)}
                </span>
                <span className="text-[13px] text-muted">
                  {bestLabels[exercise.id] ?? "No best yet"}
                </span>
              </span>

              <Stepper
                value={item.sets}
                onChange={(sets) => setSets(item.exerciseId, sets)}
                label={exercise.name}
              />

              <button
                type="button"
                onClick={() => removeExercise(item.exerciseId)}
                aria-label={`Remove ${exercise.name}`}
                className="inline-flex h-11 w-9 flex-none items-center justify-center text-dim transition-colors hover:text-ink"
              >
                <FiX size={18} />
              </button>
            </Card>
          );
        })}

        {plan.length === 0 && (
          <p className="py-1 text-muted">
            Nothing planned yet. Add your first {dayType} exercise below.
          </p>
        )}

        <button
          type="button"
          onClick={openPicker}
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-dashed border-[#3A3F45] bg-raised px-5 font-extrabold text-ink transition-colors hover:bg-line"
        >
          <FiPlus size={18} strokeWidth={2.4} />
          Add {dayType} exercise
        </button>
      </div>

      <BottomBar>
        {/* Starting hands the plan to the workout screen: next milestone. */}
        <Button className="w-full" disabled={plan.length === 0}>
          <FiPlay size={18} className="fill-current" />
          Start {dayType} day · {totalSets(plan)} sets
        </Button>
      </BottomBar>
    </>
  );
}




 