import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { FiSliders } from "react-icons/fi";
import { Logo } from "@/components/brand/Logo";
import { Wordmark } from "@/components/brand/Wordmark";
import { Card } from "@/components/ui/Card";
import { IconLink } from "@/components/ui/IconLink";
import { StreakPill } from "@/components/ui/StreakPill";
import { TabBar } from "@/components/ui/TabBar";
import { getExercises } from "@/lib/data/exercises";
import { getAccount } from "@/lib/data/profiles";
import { getWorkouts } from "@/lib/data/workouts";
import {
  daysSinceByDay,
  sessionsThisWeek,
  suggestedDay,
  topBests,
  daysLeftInMonth,
  monthStage,
  weekStrip,
  type Best,
} from "@/lib/stats";
import { getTimeZone } from "@/lib/timezone";
import { DAY_TYPES, type Exercise } from "@/types";
import { ResumeBanner } from "./ResumeBanner";

export const metadata: Metadata = { title: "Today" };

function lastTrainedLabel(days: number | null) {
  if (days === null) return "Not trained yet";
  if (days <= 0) return "Last: today";
  if (days === 1) return "Last: yesterday";
  return `Last: ${days} days ago`;
}

function bestCaption(exercise: Exercise, best: Best) {
  if (best.kind === "bodyweight") return "Max reps in one set";
  // Built-in dumbbell exercises are the ones seeded with a default weight.
  return exercise.defaultWeightKg !== null
    ? `${best.weightKg} kg dumbbell`
    : `${best.weightKg} kg`;
}

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function TodayPage() {
  const [workouts, exercises, timeZone, account] = await Promise.all([
    getWorkouts(),
    getExercises(),
    getTimeZone(),
    getAccount(),
  ]);

  const now = TZDate.tz(timeZone ?? "UTC");
  const week = weekStrip(workouts, now);
  const sessions = sessionsThisWeek(workouts, now);
  const daysSince = daysSinceByDay(workouts, now);
  const suggested = suggestedDay(workouts);
  const bests = topBests(workouts, exercises, 2);
  const daysLeft = daysLeftInMonth(now);
  const stage = monthStage(now);
  const firstName = account?.name.trim().split(/\s+/)[0] ?? "";

  return (
    <main className="flex-1 pb-25">
      {/* Stays pinned while the page scrolls underneath it */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-bg/70 px-5 pt-4 pb-3 backdrop-blur-xl">
        <span className="inline-flex items-center gap-2">
          <Logo size={30} />
          <Wordmark className="text-2xl" />
        </span>
        <IconLink href="/settings" aria-label="Settings">
          <FiSliders size={20} />
        </IconLink>
      </div>

      <ResumeBanner />

      <header className="px-5 pb-3">
        <div className="mt-2 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="display inline-flex size-11 flex-none items-center justify-center rounded-full border-[1.5px] border-accent bg-surface text-xl text-accent"
          >
            {firstName.charAt(0) || "?"}
          </span>
          <p className="leading-[1.3]">
            <span className="label">{format(now, "EEE d MMM")}</span>
            <br />
            <span className="text-[17px] font-semibold text-[#C9CDD1]">
              {greeting(now.getHours())}
              {firstName && (
                <>
                  , <b className="font-extrabold text-ink">{firstName}</b>
                </>
              )}
            </span>
          </p>
        </div>
        <h1 className="display mt-3.5 text-[40px] leading-none">
          What are we
          <br />
          training today?
        </h1>
      </header>

      <div className="flex flex-col gap-4 px-5 pt-2">
        <Card className="px-3 py-3.5">
          <div className="flex items-center justify-between gap-2 px-1 pb-2.5">
            <h2 className="label">
              This week ·{" "}
              <span className="text-accent">
                {sessions} {sessions === 1 ? "session" : "sessions"}
              </span>
            </h2>
              <StreakPill daysLeft={daysLeft} stage={stage} />
          </div>
          <ol className="flex justify-between">
            {week.map((day, i) => {
              const tone = day.dayType
                ? "border-accent bg-accent text-bg"
                : day.isToday
                  ? "border-2 border-accent text-accent"
                  : "border-line bg-surface text-dim";
              return (
                <li key={i} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl border text-[13px] font-extrabold ${tone}`}
                  >
                    {day.letter}
                  </span>
                  <span
                    className={`h-3 text-[10px] leading-3 font-bold tracking-[.04em] uppercase ${
                      day.isToday && !day.dayType ? "text-accent" : "text-muted"
                    }`}
                  >
                    {day.dayType ?? (day.isToday ? "Today" : "")}
                  </span>
                </li>
              );
            })}
          </ol>
        </Card>

        <section>
          <h2 className="label mb-2.5">Pick your day</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {DAY_TYPES.map((day) => {
              const isSuggested = day === suggested;
              return (
                <Link
                  key={day}
                  href={`/plan/${day}`}
                  className={`flex min-h-26 flex-col justify-between rounded-[18px] border p-3.5 transition-colors ${
                    isSuggested
                      ? "border-accent bg-accent text-bg hover:bg-accent-hover"
                      : "border-line bg-surface text-ink hover:bg-raised"
                  }`}
                >
                  <span className="text-[11px] font-extrabold tracking-[.08em] text-[#3A4710] uppercase">
                    {isSuggested ? "Suggested" : ""}
                  </span>
                  <span>
                    <span className="display block text-2xl leading-none">
                      {day}
                    </span>
                    <span
                      className={`text-[13px] font-bold ${
                        isSuggested ? "text-[#2B350B]" : "text-muted"
                      }`}
                    >
                      {lastTrainedLabel(daysSince[day])}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <Card>
          <div className="flex items-baseline justify-between px-4 pt-3.5 pb-0.5">
            <h2 className="label">Your bests</h2>
            <Link
              href="/progress"
              className="text-[13px] font-bold text-accent hover:text-accent-hover"
            >
              All progress
            </Link>
          </div>
          {bests.length === 0 ? (
            <p className="px-4 pt-2 pb-4 text-[13px] text-muted">
              Finish your first workout and your bests will show up here.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {bests.map(({ exercise, best }) => (
                <li key={exercise.id}>
                  <Link
                    href={`/progress/${exercise.id}`}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="flex-1">
                      <b>{exercise.name}</b>
                      <br />
                      <span className="text-[13px] text-muted">
                        {bestCaption(exercise, best)}
                      </span>
                    </span>
                    <span className="display text-[26px]">
                      {best.kind === "weighted" && "× "}
                      {best.reps}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <TabBar active="today" />
    </main>
  );
}
