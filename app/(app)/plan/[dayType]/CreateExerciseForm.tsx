"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { TextField } from "@/components/ui/TextField";
import { DAY_TYPES, type DayType, type Exercise, type ExerciseKind } from "@/types";
import { createCustomExercise } from "./actions";

type CreateExerciseFormProps = {
  /** Whatever was in the search box, so a search with no results becomes the name. */
  initialName: string;
  initialMuscle: DayType;
  /** Every exercise you can already see, to catch duplicate names. */
  exercises: Exercise[];
  onCreated: (exercise: Exercise) => void;
  onCancel: () => void;
};

const KINDS: { value: ExerciseKind; label: string }[] = [
  { value: "weighted", label: "Weighted" },
  { value: "bodyweight", label: "Bodyweight" },
];

export function CreateExerciseForm({
  initialName,
  initialMuscle,
  exercises,
  onCreated,
  onCancel,
}: CreateExerciseFormProps) {
  const [name, setName] = useState(initialName);
  const [muscle, setMuscle] = useState<DayType>(initialMuscle);
  const [kind, setKind] = useState<ExerciseKind>("weighted");
  // Kept as the text typed; turned into a number only when saving.
  const [weight, setWeight] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = name.trim();
    const taken = exercises.find(
      (exercise) => exercise.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (taken) {
      setError(`"${taken.name}" is already in your exercises.`);
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createCustomExercise({
        name: trimmed,
        muscle,
        kind,
        defaultWeightKg:
          kind === "weighted" && weight.trim() ? Number(weight) : null,
      });
      if (result.ok) onCreated(result.exercise);
      else setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 pt-2">
      <h2 className="label text-ink">New exercise</h2>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Incline Push-ups"
        maxLength={60}
        autoFocus
        required
      />

      <fieldset>
        <legend className="label mb-2">Muscle</legend>
        <div className="flex flex-wrap gap-2">
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
      </fieldset>

      <fieldset>
        <legend className="label mb-2">Type</legend>
        <div className="flex gap-2">
          {KINDS.map((option) => (
            <Chip
              key={option.value}
              selected={option.value === kind}
              onClick={() => setKind(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      {kind === "weighted" && (
        <TextField
          label="Usual weight (kg)"
          type="number"
          inputMode="decimal"
          min={0.5}
          max={500}
          step={0.5}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Optional, e.g. 25"
        />
      )}

      {error && <Alert>{error}</Alert>}

      <div className="grid grid-cols-2 gap-2.5">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Create"}
        </Button>
      </div>
    </form>
  );
}
