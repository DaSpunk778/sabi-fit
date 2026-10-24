"use client";

import { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconLink";
import { useAnimationNow } from "@/hooks/useAnimation";
import { formatRest, remainingMs, restProgress } from "@/lib/timer";
import { formatSet } from "@/lib/workout";
import { useRestTimer } from "@/stores/restTimer";
import type { DayType, Exercise, ExerciseKind, WorkoutSet } from "@/types";
import { ElapsedTime } from "./ElapsedTime";

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // full length of the ring, about 754

type RestScreenProps = {
  dayType: DayType;
  /** When the workout started, for the running time in the header. */
  startedAt: string;
  byId: Map<string, Exercise>;
  /** exercise id → your sets for it last time. */
  lastSets: Partial<Record<string, WorkoutSet[]>>;
  onClose: () => void;
};

/** One more rep than last time: "23", or "25 × 12" for weighted. */
function tryFor(last: WorkoutSet, kind: ExerciseKind) {
  return formatSet({ ...last, reps: (last.reps ?? 0) + 1 }, kind);
}

// The big countdown (design 08), opened from the rest bar. The ring drains
// as the rest runs out; when it's over you're taken back to your workout.
export function RestScreen({
  dayType,
  startedAt,
  byId,
  lastSets,
  onClose,
}: RestScreenProps) {
  const endsAt = useRestTimer((s) => s.endsAt);
  const totalMs = useRestTimer((s) => s.totalMs);
  const upNext = useRestTimer((s) => s.upNext);
  const addTime = useRestTimer((s) => s.addTime);
  const skip = useRestTimer((s) => s.skip);
  const now = useAnimationNow(endsAt !== null);

  const left = endsAt === null ? 0 : remainingMs(endsAt, now);
  const over = endsAt !== null && left === 0;
  // How much of the ring is still lime: 1 when the rest starts, 0 at the end.
  const share = endsAt === null ? 0 : 1 - restProgress(endsAt, totalMs, now);
  const finalSeconds = left > 0 && left <= 3000;

  const exercise = upNext ? byId.get(upNext.exerciseId) : undefined;
  const last = upNext ? lastSets[upNext.exerciseId]?.[upNext.setIndex] : undefined;

  // Rest over: show "Go" for a moment, then back to the workout.
  useEffect(() => {
    if (!over) return;
    const timer = setTimeout(() => {
      skip();
      onClose();
    }, 1200);
    return () => clearTimeout(timer);
  }, [over, skip, onClose]);

  function skipRest() {
    skip();
    onClose();
  }

  return (
    <main className="flex min-h-dvh flex-col p-5">
      <header className="flex items-center justify-between">
        <IconButton onClick={onClose} aria-label="Back to workout">
          <FiChevronDown size={20} />
        </IconButton>
        <span className="label">
          {dayType} day · <ElapsedTime startedAt={startedAt} />
        </span>
        <span className="w-11" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-7">
        <div className="relative size-70">
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            aria-hidden="true"
            className="-rotate-90"
          >
            <circle
              cx="140"
              cy="140"
              r={RADIUS}
              fill="none"
              stroke="var(--color-raised)"
              strokeWidth="16"
            />
            <circle
              cx="140"
              cy="140"
              r={RADIUS}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${share * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            />
          </svg>
          <div
            role="timer"
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="label text-accent">{over ? "Go" : "Rest"}</span>
            <span
              className={`display text-8xl leading-none ${
                finalSeconds ? "motion-safe:animate-pulse" : ""
              }`}
            >
              {formatRest(left)}
            </span>
            <span className="text-sm font-bold text-muted">
              of {formatRest(totalMs)}
            </span>
          </div>
        </div>

        {exercise && upNext && (
          <div className="w-full rounded-[18px] border border-line bg-surface p-4 text-center">
            <p className="label">Up next</p>
            <p className="display mt-1 text-[28px] leading-tight">
              {exercise.name} · Set {upNext.setIndex + 1}
            </p>
            <p className="font-bold text-muted">
              {last && last.reps !== null
                ? `Last time ${formatSet(last, exercise.kind)} · try for ${tryFor(last, exercise.kind)}`
                : "First time on this set. Set the bar."}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-3">
        <Button
          variant="secondary"
          onClick={() => addTime(15)}
          disabled={endsAt === null}
        >
          +15s
        </Button>
        <Button onClick={skipRest}>{over ? "Next set" : "Skip rest"}</Button>
      </div>
    </main>
  );
}
