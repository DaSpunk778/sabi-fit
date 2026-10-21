import type { Exercise } from "@/types";

/** "Bodyweight", "25 kg dumbbell", "Weighted · 20 kg" or "Weighted". */
export function equipmentLabel(exercise: Exercise) {
  if (exercise.kind === "bodyweight") return "Bodyweight";
  if (exercise.defaultWeightKg === null) return "Weighted";
  // Built-in weighted moves with a default weight are the 25 kg dumbbell ones;
  // your own could be any equipment.
  return exercise.userId === null
    ? `${exercise.defaultWeightKg} kg dumbbell`
    : `Weighted · ${exercise.defaultWeightKg} kg`;
}
