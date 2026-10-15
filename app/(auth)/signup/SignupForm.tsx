"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { signUp, type AuthState } from "../actions";

const initialState: AuthState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  // Controlled, so a failed submit doesn't wipe what was typed.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="mt-7 flex flex-1 flex-col">
      <div className="flex flex-col gap-4">
        <TextField
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="What should we call you?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
        {state.error && <Alert>{state.error}</Alert>}
        {state.notice && <Alert tone="success">{state.notice}</Alert>}
      </div>

      <div className="min-h-6 flex-1" />

      <Button type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="mt-4.5 text-center text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-extrabold text-accent hover:text-accent-hover"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
