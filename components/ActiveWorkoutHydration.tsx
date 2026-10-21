"use client";

import { useEffect } from "react";
import { useActiveWorkout } from "@/stores/activeWorkout";

// Loads the workout in progress from localStorage once React has taken over
// the server's HTML. Until then every page renders as "no workout", the same
// as the server did, so the two always match. Afterwards `hydrated` turns true
// and anything showing the workout (Resume banner, workout screen) updates.
export function ActiveWorkoutHydration() {
  useEffect(() => {
    void useActiveWorkout.persist.rehydrate();
  }, []);

  return null;
}
