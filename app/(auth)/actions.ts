"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  notice?: string;
};

const NOT_CONFIGURED =
  "This app isn't connected to Supabase yet. Add your keys to .env.local and restart the server.";

const CONNECTION_ERROR =
  "Something went wrong. Check your connection and try again.";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = field(formData, "name").trim();
  const email = field(formData, "email").trim();
  const password = field(formData, "password");

  if (!name) return { error: "Tell us what to call you." };
  if (!email) return { error: "Enter your email." };
  if (password.length < 8) {
    return { error: "Your password needs at least 8 characters." };
  }
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  const supabase = await createClient();
  // The profiles row is created by a database trigger from `data.name`
  // (see supabase/migrations).
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    switch (error.code) {
      case "user_already_exists":
      case "email_exists":
        return { error: "That email already has an account. Log in instead." };
      case "weak_password":
        return { error: "Pick a stronger password." };
      case "email_address_invalid":
      case "validation_failed":
        return { error: "That email doesn't look right." };
      default:
        return { error: CONNECTION_ERROR };
    }
  }

  // No session means the Supabase project still requires email confirmation.
  if (!data.session) {
    return { notice: "Check your email to confirm your account, then log in." };
  }

  redirect("/app");
}

export async function logIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = field(formData, "email").trim();
  const password = field(formData, "password");

  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  // "Forgot password?" submits the same form with intent=reset.
  if (formData.get("intent") === "reset") return requestPasswordReset(email);

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    switch (error.code) {
      case "invalid_credentials":
        return { error: "Email or password is wrong. Try again." };
      case "email_not_confirmed":
        return { error: "Confirm your email first. Check your inbox." };
      default:
        return { error: CONNECTION_ERROR };
    }
  }

  redirect("/app");
}

async function requestPasswordReset(email: string): Promise<AuthState> {
  if (!email) {
    return { error: "Enter your email first, then tap Forgot password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { error: CONNECTION_ERROR };

  return { notice: "If that email has an account, a reset link is on its way." };
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/welcome");
}
