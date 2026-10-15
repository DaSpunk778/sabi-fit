import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthShell
      title={
        <>
          Create
          <br />
          account
        </>
      }
      subtitle="Your workouts are saved to your account, so they're safe and on any device you log in from."
    >
      <SignupForm />
    </AuthShell>
  );
}
