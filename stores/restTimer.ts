import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_REST_SECONDS, restEndsAt } from "@/lib/timer";


/** The set you're resting before: the timer shows it as "Up next". */
export type UpNext = {
    exerciseId: string;
    setIndex: number;
};

type RestTimerStore = {
    endsAt: number | null;
    /** Length of this rest in ms, for the ring. +15s makes it longer. */
    totalMs: number;
    upNext: UpNext | null;

    startRest: (upNext: UpNext | null, seconds?: number) => void;
    addTime: (seconds: number) => void;
    skip: () => void;
};

export const useRestTimer = create<RestTimerStore>()(
    persist(
        (set) => ({
            endsAt: null,
            totalMs: 0,
            upNext: null,

            startRest: (upNext, seconds = DEFAULT_REST_SECONDS) =>
                set({
                    endsAt: restEndsAt(Date.now(), seconds),
                    totalMs: seconds * 1000,
                    upNext,
                }),

                //counts from now if the rest has already ran out, otherwise from the
                // current end, so +15s always gives you 15 more seconds.

                addTime: (seconds) =>
                    set((state) =>
                    state.endsAt === null
                        ? state
                        : {
                            endsAt: Math.max(state.endsAt, Date.now()) + seconds * 1000,
                            totalMs: state.totalMs + seconds * 1000,
                        },
            ),

            skip: () => set({ endsAt: null, totalMs: 0, upNext: null}),
        }),
        {
            name: "sabi-fit.rest-timer",
            // Same reason as the workout store: read localStorage only after
            // React has hydrated the page.
            skipHydration: true,
        },
    )
);