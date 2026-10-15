"use client";

import { useMemo, useState } from "react";
import { FiCheck, FiSearch, FiX } from "react-icons/fi";
import { BottomBar } from "@/components/ui/BottomBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { IconButton } from "@/components/ui/IconLink";
import { DAY_TYPES, type DayType, type Exercise } from "@/types";

type ExercisePickerProps = {
  dayType: DayType;
  exercises: Exercise[];
  /** Already in the plan: shown ticked, and can't be picked twice. */
  inPlan: ReadonlySet<string>;
  onAdd: (exerciseIds: string[]) => void;
  onClose: () => void;
};

function equipmentLabel(exercise: Exercise) {
  if (exercise.kind === "bodyweight") return "Bodyweight";
  return exercise.defaultWeightKg !== null
    ? `${exercise.defaultWeightKg} kg dumbbell`
    : "Weighted";
}

export function ExercisePicker({
  dayType,
  exercises,
  inPlan,
  onAdd,
  onClose,
}: ExercisePickerProps) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<DayType>(dayType);
  // An array rather than a Set so exercises are added in the order you tick them.
  const [selected, setSelected] = useState<string[]>([]);

  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    const matches = exercises.filter(
      (exercise) =>
        exercise.muscle === muscle &&
        exercise.name.toLowerCase().includes(search),
    );
    // Planned ones first, the same way the design lists them.
    return [
      ...matches.filter((exercise) => inPlan.has(exercise.id)),
      ...matches.filter((exercise) => !inPlan.has(exercise.id)),
    ];
  }, [exercises, muscle, query, inPlan]);

  function toggle(exerciseId: string) {
    setSelected((current) =>
      current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId],
    );
  }

  const count = selected.length;

  return (
    <div className="flex-1 pb-32">
      <header className="flex items-center gap-3 px-5 pt-4 pb-2">
        <IconButton onClick={onClose} aria-label="Close">
          <FiX size={20} />
        </IconButton>
        <h1 className="display text-[32px] leading-none">Add exercises</h1>
      </header>

      <div className="flex flex-col gap-3 px-5 pt-2">
        <label className="flex h-12 items-center gap-2.5 rounded-[14px] border border-line-strong bg-surface px-3.5 focus-within:border-accent">
          <FiSearch size={18} className="flex-none text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search exercises"
            placeholder="Search exercises"
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:text-faint"
          />
        </label>

        {/* Scrolls sideways on narrow phones; -mx/px lets chips reach the screen edge */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          {DAY_TYPES.map((day) => (
            <Chip
              key={day}
              selected={day === muscle}
              onClick={() => setMuscle(day)}
              className="capitalize"
            >
              {day}
            </Chip>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="py-2 text-muted">
            {query.trim()
              ? `No ${muscle} exercises match "${query.trim()}".`
              : `No ${muscle} exercises yet.`}
          </p>
        ) : (
          <Card className="overflow-hidden">
            <ul className="divide-y divide-line">
              {visible.map((exercise) => {
                const planned = inPlan.has(exercise.id);
                const checked = planned || selected.includes(exercise.id);
                return (
                  <li key={exercise.id}>
                    <label
                      className={`flex min-h-15.5 items-center gap-3 px-4 py-3 ${
                        planned ? "" : "cursor-pointer hover:bg-raised"
                      }`}
                    >
                      {/* Real checkbox for keyboards and screen readers; the box next to it is the look */}
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={checked}
                        disabled={planned}
                        onChange={() => toggle(exercise.id)}
                      />
                      <span
                        aria-hidden="true"
                        className={`flex size-6.5 flex-none items-center justify-center rounded-lg border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface ${
                          checked
                            ? "border-accent bg-accent text-bg"
                            : "border-[#3A3F45]"
                        }`}
                      >
                        {checked && <FiCheck size={16} strokeWidth={3.5} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <b>{exercise.name}</b>
                        <br />
                        <span className="text-[13px] text-muted">
                          {equipmentLabel(exercise)}
                        </span>
                      </span>
                      {planned && (
                        <span className="text-[11px] font-extrabold tracking-[.06em] text-muted">
                          IN PLAN
                        </span>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </div>

      <BottomBar>
        <Button
          className="w-full"
          disabled={count === 0}
          onClick={() => onAdd(selected)}
        >
          {count === 0
            ? "Add exercises"
            : `Add ${count} ${count === 1 ? "exercise" : "exercises"}`}
        </Button>
      </BottomBar>
    </div>
  );
}
