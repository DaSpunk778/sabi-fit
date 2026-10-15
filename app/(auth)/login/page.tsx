import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthShell
      title={
        <>
          Welcome
          <br />
          back
        </>
      }
      subtitle="Log in to pick up where you stopped."
    >
      <LoginForm />
    </AuthShell>
  );
}
