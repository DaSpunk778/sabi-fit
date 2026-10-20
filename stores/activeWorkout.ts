import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ActiveWorkout,
  DayType,
  WorkoutExercise,
  WorkoutSet,
} from "@/types";

type ActiveWorkoutStore = {
  workout: ActiveWorkout | null;
  /** False until localStorage has been read back. See the note below. */
  hydrated: boolean;

  markHydrated: () => void;
  start: (dayType: DayType, exercises: WorkoutExercise[]) => void;
  discard: () => void;

  setReps: (exerciseId: string, setIndex: number, reps: number | null) => void;
  setWeight: (
    exerciseId: string,
    setIndex: number,
    weightKg: number | null,
  ) => void;
  toggleDone: (exerciseId: string, setIndex: number) => void;
  addSet: (exerciseId: string) => void;
  addExercises: (entries: WorkoutExercise[]) => void;
  removeExercise: (exerciseId: string) => void;
};

const EMPTY_SET: WorkoutSet = { reps: null, weightKg: null, done: false };

/**
 * Rebuild the workout with one set changed. Everything untouched keeps its
 * old reference, so React only re-renders the row that actually moved.
 */
function withSet(
  workout: ActiveWorkout,
  exerciseId: string,
  setIndex: number,
  change: (set: WorkoutSet) => WorkoutSet,
): ActiveWorkout {
  return {
    ...workout,
    exercises: workout.exercises.map((entry) =>
      entry.exerciseId !== exerciseId
        ? entry
        : {
            ...entry,
            sets: entry.sets.map((set, i) =>
              i === setIndex ? change(set) : set,
            ),
          },
    ),
  };
}

export const useActiveWorkout = create<ActiveWorkoutStore>()(
  persist(
    (set) => ({
      workout: null,
      hydrated: false,

      markHydrated: () => set({ hydrated: true }),

      start: (dayType, exercises) =>
        set({
          workout: {
            dayType,
            startedAt: new Date().toISOString(),
            exercises,
          },
        }),

      discard: () => set({ workout: null }),

      setReps: (exerciseId, setIndex, reps) =>
        set((state) =>
          !state.workout
            ? state
            : {
                workout: withSet(state.workout, exerciseId, setIndex, (s) => ({
                  ...s,
                  reps,
                })),
              },
        ),

      setWeight: (exerciseId, setIndex, weightKg) =>
        set((state) =>
          !state.workout
            ? state
            : {
                workout: withSet(state.workout, exerciseId, setIndex, (s) => ({
                  ...s,
                  weightKg,
                })),
              },
        ),

      toggleDone: (exerciseId, setIndex) =>
        set((state) =>
          !state.workout
            ? state
            : {
                workout: withSet(state.workout, exerciseId, setIndex, (s) => ({
                  ...s,
                  done: !s.done,
                })),
              },
        ),

      // A new set starts at the weight you were already lifting.
      addSet: (exerciseId) =>
        set((state) => {
          if (!state.workout) return state;
          return {
            workout: {
              ...state.workout,
              exercises: state.workout.exercises.map((entry) =>
                entry.exerciseId !== exerciseId
                  ? entry
                  : {
                      ...entry,
                      sets: [
                        ...entry.sets,
                        {
                          ...EMPTY_SET,
                          weightKg: entry.sets.at(-1)?.weightKg ?? null,
                        },
                      ],
                    },
              ),
            },
          };
        }),

      addExercises: (entries) =>
        set((state) => {
          if (!state.workout) return state;
          const present = new Set(
            state.workout.exercises.map((entry) => entry.exerciseId),
          );
          const added = entries.filter(
            (entry) => !present.has(entry.exerciseId),
          );
          return {
            workout: {
              ...state.workout,
              exercises: [...state.workout.exercises, ...added],
            },
          };
        }),

      removeExercise: (exerciseId) =>
        set((state) =>
          !state.workout
            ? state
            : {
                workout: {
                  ...state.workout,
                  exercises: state.workout.exercises.filter(
                    (entry) => entry.exerciseId !== exerciseId,
                  ),
                },
              },
        ),
    }),
     {
      name: "sabi-fit.active-workout",
      // `hydrated` describes this page load, not your workout — never save it.
      partialize: (state) => ({ workout: state.workout }),
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
);
