"use client";

import { useEffect } from "react";
import { useActiveWorkout } from "@/stores/activeWorkout";
import { useRestTimer } from "@/stores/restTimer";

// Loads the workout in progress and the rest timer from localStorage once
// React has taken over the server's HTML. Until then every page renders as
// "no workout, not resting", the same as the server did, so the two always
// match. Afterwards anything showing them updates..
export function ActiveWorkoutHydration() {
  useEffect(() => {
    void useActiveWorkout.persist.rehydrate();
    void useRestTimer.persist.rehydrate();
  }, []);

  return null;
}

