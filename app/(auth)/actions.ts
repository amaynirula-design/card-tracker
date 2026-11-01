"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// What the sign-up and log-in forms show after a failed attempt.
export type AuthFormState = { error?: string; email?: string };

const MIN_PASSWORD_LENGTH = 8;

function readForm(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password } = readForm(formData);

  if (!email || !password) {
    return { email, error: "Enter your email and a password to create your account." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { email, error: `Your password needs at least ${MIN_PASSWORD_LENGTH} characters.` };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.code === "user_already_exists") {
      return { email, error: "An account with this email already exists. Log in instead." };
    }
    if (error.code === "email_address_invalid" || error.code === "validation_failed") {
      return { email, error: "That doesn't look like a valid email address." };
    }
    if (error.code === "weak_password") {
      return { email, error: "Choose a stronger password." };
    }
    return { email, error: "We couldn't create your account. Please try again." };
  }

  // Supabase is set to skip email confirmation, so a new account is signed in right away.
  // If that setting is ever turned back on, there's no session yet.
  if (!data.session) {
    return { email, error: "Check your email to confirm your account, then log in." };
  }

  redirect("/cards/best");
}

export async function logIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const { email, password } = readForm(formData);

  if (!email || !password) {
    return { email, error: "Enter your email and password to log in." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { email, error: "That email and password don't match. Try again." };
    }
    return { email, error: "We couldn't log you in. Please try again." };
  }

  redirect("/cards/best");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
