"use client";

import Link from "next/link";
import { FiPlay } from "react-icons/fi";
import { setCounts } from "@/lib/workout";
import { useActiveWorkout } from "@/stores/activeWorkout";

// A client component inside the server-rendered Today page: the server
// can't see the phone's localStorage, so only this part reads the store.
// Before hydration `workout` is null, so the server and the phone's first
// render both show nothing, then the banner appears.
export function ResumeBanner() {
  const workout = useActiveWorkout((s) => s.workout);
  if (!workout) return null;

  const { done, total } = setCounts(workout);

  return (
    <Link
      href="/workout"
      className="mx-5 mt-1 mb-2 flex items-center gap-3 rounded-[18px] border border-accent bg-accent/10 px-4 py-3 transition-colors hover:bg-accent/15"
    >
      <span className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-accent text-bg">
        <FiPlay size={18} className="fill-current" />
      </span>
      <span className="min-w-0 flex-1">
        <b className="capitalize">{workout.dayType} day in progress</b>
        <br />
        <span className="text-[13px] text-muted">
          {done} / {total} sets done
        </span>
      </span>
      <span className="font-extrabold text-accent">Resume</span>
    </Link>
  );
}
