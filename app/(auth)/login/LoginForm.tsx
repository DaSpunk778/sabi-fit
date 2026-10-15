"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { logIn, type AuthState } from "../actions";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(logIn, initialState);
  // Controlled, so a failed submit doesn't wipe what was typed.
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="mt-7 flex flex-1 flex-col">
      <div className="flex flex-col gap-4">
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
        />
        {/* Same form, so the action gets the typed email; skips the password check */}
        <button
          type="submit"
          name="intent"
          value="reset"
          formNoValidate
          disabled={pending}
          className="self-end py-1.5 text-sm font-extrabold text-accent hover:text-accent-hover disabled:opacity-60"
        >
          Forgot password?
        </button>
        {state.error && <Alert>{state.error}</Alert>}
        {state.notice && <Alert tone="success">{state.notice}</Alert>}
      </div>

      <div className="min-h-6 flex-1" />

      <Button type="submit" disabled={pending}>
        {pending ? "One moment…" : "Log in"}
      </Button>
      <p className="mt-4.5 text-center text-muted">
        New here?{" "}
        <Link
          href="/signup"
          className="font-extrabold text-accent hover:text-accent-hover"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
