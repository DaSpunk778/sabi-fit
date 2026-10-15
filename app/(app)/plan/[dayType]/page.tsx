import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiChevronLeft, FiRotateCcw } from "react-icons/fi";
import { IconLink } from "@/components/ui/IconLink";
import { getExercises } from "@/lib/data/exercises";
import { getWorkouts } from "@/lib/data/workouts";
import { planFromWorkout } from "@/lib/plan";
import { bestOf, lastWorkoutByDay } from "@/lib/stats";
import { getTimeZone } from "@/lib/timezone";
import { isDayType, type Exercise, type Workout } from "@/types";
import { PlanEditor } from "./PlanEditor";

export const metadata: Metadata = { title: "Plan" };

function bestLabel(exercise: Exercise, workouts: Workout[]) {
  const best = bestOf(exercise, workouts);
  if (!best) return "No best yet";
  // The weight already shows in the tag, so weighted bests only need the reps.
  return best.kind === "bodyweight"
    ? `Best ${best.reps}`
    : `Best × ${best.reps}`;
}

export default async function PlanDayPage({
  params,
}: PageProps<"/plan/[dayType]">) {
  const { dayType } = await params;
  if (!isDayType(dayType)) notFound();

  const [workouts, exercises, timeZone] = await Promise.all([
    getWorkouts(),
    getExercises(),
    getTimeZone(),
  ]);

  const now = TZDate.tz(timeZone ?? "UTC");
  const last = lastWorkoutByDay(workouts)[dayType];

  const bestLabels: Record<string, string> = {};
  for (const exercise of exercises) {
    bestLabels[exercise.id] = bestLabel(exercise, workouts);
  }

  // Skip exercises that no longer exist (e.g. a custom one you deleted).
  const known = new Set(exercises.map((exercise) => exercise.id));
  const initialPlan = planFromWorkout(last).filter((item) =>
    known.has(item.exerciseId),
  );

  const header = (
    <>
      <header className="flex items-center gap-3 px-5 pt-4 pb-2">
        <IconLink href="/app" aria-label="Back to today">
          <FiChevronLeft size={20} />
        </IconLink>
        <div className="flex-1">
          <h1 className="display text-4xl leading-none">{dayType} day</h1>
          <p className="text-[13px] font-bold text-muted">
            {format(now, "EEE d MMM")}
          </p>
        </div>
      </header>

      {last && (
        <div className="mx-5 mt-2 flex items-start gap-2.5 rounded-[14px] border border-accent/25 bg-accent/8 px-3.5 py-3 text-sm">
          <FiRotateCcw size={18} className="mt-0.5 flex-none text-accent" />
          <span>
            Copied from your last {dayType} day{" "}
            <b>
              (
              {format(
                new TZDate(Date.parse(last.endedAt), now.timeZone),
                "EEE d MMM",
              )}
              )
            </b>
            . Change anything you want.
          </span>
        </div>
      )}
    </>
  );

  return (
    <main className="flex-1">
      <PlanEditor
        dayType={dayType}
        exercises={exercises}
        initialPlan={initialPlan}
        bestLabels={bestLabels}
        header={header}
      />
    </main>
  );
}
