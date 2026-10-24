import { TZDate } from "@date-fns/tz";
import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  isSameDay,
  isSameWeek,
  startOfWeek,
  subWeeks,
} from "date-fns";
import {
  DAY_TYPES,
  type DayType,
  type Exercise,
  type Workout,
  type WorkoutSet,
} from "@/types";

// Pure functions. Every `workouts` argument is expected newest first,
// and `now` carries the user's time zone.

export type Best =
  | { kind: "bodyweight"; reps: number }
  | { kind: "weighted"; weightKg: number; reps: number };

function endedOn(workout: Workout, now: TZDate) {
  return new TZDate(Date.parse(workout.endedAt), now.timeZone);
}

/** The latest workout of each day type. */
export function lastWorkoutByDay(workouts: Workout[]) {
  const last: Partial<Record<DayType, Workout>> = {};
  for (const workout of workouts) {
    last[workout.dayType] ??= workout;
  }
  return last;
}

/** Calendar days since each day type was last trained; null = never. */
export function daysSinceByDay(workouts: Workout[], now: TZDate) {
  const last = lastWorkoutByDay(workouts);
  const days = {} as Record<DayType, number | null>;
  for (const day of DAY_TYPES) {
    const workout = last[day];
    days[day] = workout
      ? differenceInCalendarDays(now, endedOn(workout, now))
      : null;
  }
  return days;
}

/** The day type trained longest ago. Never trained counts as oldest. */
export function suggestedDay(workouts: Workout[]): DayType {
  const last = lastWorkoutByDay(workouts);
  const endedAt = (day: DayType) => {
    const workout = last[day];
    return workout ? Date.parse(workout.endedAt) : -Infinity;
  };
  return DAY_TYPES.reduce((oldest, day) =>
    endedAt(day) < endedAt(oldest) ? day : oldest,
  );
}

export type WeekDay = {
  letter: string;
  /** What was trained that day, if anything */
  dayType: DayType | null;
  isToday: boolean;
};

/** Monday to Sunday of the current week. */
export function weekStrip(workouts: Workout[], now: TZDate): WeekDay[] {
  const monday = startOfWeek(now, { weekStartsOn: 1 });
  return ["M", "T", "W", "T", "F", "S", "S"].map((letter, i) => {
    const date = addDays(monday, i);
    const workout = workouts.find((w) => isSameDay(endedOn(w, now), date));
    return {
      letter,
      dayType: workout?.dayType ?? null,
      isToday: isSameDay(date, now),
    };
  });
}

export function sessionsThisWeek(workouts: Workout[], now: TZDate) {
  return workouts.filter((w) =>
    isSameWeek(endedOn(w, now), now, { weekStartsOn: 1 }),
  ).length;
}

/** Sessions a week needs to count towards the streak ("Streak: 2 to go"). */
export const STREAK_SESSIONS_PER_WEEK = 3;

/**
 * Weeks in a row (Monday to Sunday) with at least 3 sessions. This week
 * joins the streak once it reaches 3; until then the streak counts up to last
 * week, so it isn't lost on a Monday morning before you've trained.
 */
export function weeklyStreak(workouts: Workout[], now: TZDate): number {
  const weekKey = (date: Date) =>
    startOfWeek(date, { weekStartsOn: 1 }).getTime();

  const sessionsByWeek = new Map<number, number>();
  for (const workout of workouts) {
    const key = weekKey(endedOn(workout, now));
    sessionsByWeek.set(key, (sessionsByWeek.get(key) ?? 0) + 1);
  }
  const sessionsIn = (week: Date) => sessionsByWeek.get(weekKey(week)) ?? 0;

  let week: Date = now;
  if (sessionsIn(week) < STREAK_SESSIONS_PER_WEEK) week = subWeeks(week, 1);

  let streak = 0;
  while (sessionsIn(week) >= STREAK_SESSIONS_PER_WEEK) {
    streak++;
    week = subWeeks(week, 1);
  }
  return streak;
}

/** Days left in this month after today: 0 on the last day. */
export function daysLeftInMonth(now: TZDate): number {
  return differenceInCalendarDays(endOfMonth(now), now);
}

/** How far into the month we are: decides the streak pill's colour. */
export type MonthStage = "early" | "mid" | "late";

export function monthStage(now: TZDate): MonthStage {
  const day = now.getDate(); // day of the month, in the user's time zone
  if (day <= 14) return "early"; // weeks 1–2: grey
  if (day <= 21) return "mid"; // week 3: blue
  return "late"; // week 4 to the end: red
}


/**
 * Bodyweight: most reps in one set.
 * Weighted: heaviest weight, then most reps at that weight.
 */
export function bestOf(exercise: Exercise, workouts: Workout[]): Best | null {
  let best: Best | null = null;

  for (const workout of workouts) {
    for (const entry of workout.exercises) {
      if (entry.exerciseId !== exercise.id) continue;

      for (const set of entry.sets) {
        if (!set.done || set.reps === null) continue;

        if (exercise.kind === "bodyweight") {
          if (!best || set.reps > best.reps) {
            best = { kind: "bodyweight", reps: set.reps };
          }
        } else if (set.weightKg !== null) {
          const isBetter =
            !best ||
            best.kind !== "weighted" ||
            set.weightKg > best.weightKg ||
            (set.weightKg === best.weightKg && set.reps > best.reps);
          if (isBetter) {
            best = { kind: "weighted", weightKg: set.weightKg, reps: set.reps };
          }
        }
      }
    }
  }

  return best;
}

/** Bests for the exercises trained in the most sessions. */
export function topBests(
  workouts: Workout[],
  exercises: Exercise[],
  limit: number,
) {
  const sessions = new Map<string, number>();
  for (const workout of workouts) {
    for (const entry of workout.exercises) {
      sessions.set(entry.exerciseId, (sessions.get(entry.exerciseId) ?? 0) + 1);
    }
  }

  const byId = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const top: { exercise: Exercise; best: Best }[] = [];

  // The sort is stable, so ties stay in most-recently-trained order.
  for (const [id] of [...sessions].sort((a, b) => b[1] - a[1])) {
    if (top.length === limit) break;
    const exercise = byId.get(id);
    const best = exercise && bestOf(exercise, workouts);
    if (exercise && best) top.push({ exercise, best });
  }

  return top;
}

/**
 * The sets you did for this exercise the last time you trained it.
 * `workouts` is newest first, so the first match is the latest.
 */
export function lastSetsFor(
  exerciseId: string,
  workouts: Workout[],
): WorkoutSet[] {
  for (const workout of workouts) {
    const entry = workout.exercises.find((e) => e.exerciseId === exerciseId);
    if (entry) return entry.sets;
  }
  return [];
}