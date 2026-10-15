"use client"

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiPlay, FiPlus, FiX } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Stepper } from "@/components/ui/Stepper";
import { totalSets, type PlanItem } from "@/lib/plan";
import type { DayType, Exercise } from "@/types";

type PlanEditorProps = {
   dayType: DayType;
   /** Every exercise available, so a row can be looked up by id. */
    exercises: Exercise[];
    initialPlan: PlanItem[];
     /** exercise id → "Best 30" / "Best × 11", worked out on the server. */
    bestLabels: Record<string, string>;
};

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
}: PlanEditorProps) {
    const [plan, setPlan] = useState<PlanItem[]>(initialPlan);

    // A list is fine to search once; a Map is better when every row does it.
    const byId = useMemo(
        () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
        [exercises],
    );

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

    return (
        <>
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
                        {bestLabels[exercise.id]}
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

                <Link
                href={`/plan/${dayType}/add`}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-dashed border-[#3A3F45] bg-raised px-5 font-extrabold text-ink transition-colors hover:bg-line"
                >
                <FiPlus size={18} strokeWidth={2.4} />
                Add {dayType} exercise
                </Link>
            </div>

            <div className="fixed bottom-0 left-1/2 w-full max-w-120 -translate-x-1/2 border-t border-[#1F2226] bg-bg px-5 pt-4 pb-8">
                <button
                type="button"
                disabled={plan.length === 0}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 text-[17px] font-extrabold text-bg transition-colors hover:bg-accent-hover disabled:opacity-40"
                >
                <FiPlay size={18} className="fill-current" />
                Start {dayType} day · {totalSets(plan)} sets
                </button>
        </div>
        </>
    )
}