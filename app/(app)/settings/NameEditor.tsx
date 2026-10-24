"use client";

import { useActionState, useState } from "react";
import { FiEdit3, FiUser } from "react-icons/fi";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { saveName, type NameState } from "./actions";

type NameEditorProps = { name: string; email: string };

// The Account card. Shows your name and email; the pencil turns it into a
// small form. Saving closes the form, and the page re-renders with the new name.
export function NameEditor({ name, email }: NameEditorProps) {
  const [editing, setEditing] = useState(false);
  // Controlled, so a failed save doesn't wipe what you typed.
  const [draft, setDraft] = useState(name);

   const [state, formAction, pending] = useActionState(
    async (prev: NameState, formData: FormData) => {
      const result = await saveName(prev, formData);
      if (result.saved) setEditing(false);
      return result;
    },
    {},
  );

   function startEditing() {
    setDraft(name);
    setEditing(true);
  }

  if (editing) {
    return (
      <Card className="p-4">
        <form action={formAction} className="flex flex-col gap-3">
          <TextField
            label="Name"
            name="name"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={40}
            autoComplete="name"
            autoFocus
            required
          />
          {state.error && <Alert>{state.error}</Alert>}
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="flex items-center gap-3.5 p-4">
      <span className="inline-flex size-13 flex-none items-center justify-center rounded-full bg-accent text-bg">
        <FiUser size={24} strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <b className="block truncate text-[17px]">{name || "Add your name"}</b>
        <span className="block truncate text-sm text-muted">{email}</span>
      </span>
      <button
        type="button"
        onClick={startEditing}
        aria-label="Edit name"
        className="inline-flex size-11 flex-none items-center justify-center rounded-xl text-muted transition-colors hover:bg-raised hover:text-ink"
      >
        <FiEdit3 size={18} />
      </button>
    </Card>
  );
}