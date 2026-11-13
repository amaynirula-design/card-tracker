"use server";

import { redirect } from "next/navigation";
import { readConfirmLink } from "@/lib/confirm-link";
import { createClient } from "@/lib/supabase/server";

// What the sign-up and log-in forms show after an attempt.
export type AuthFormState = {
  error?: string;
  email?: string;
  // A confirmation email is on its way: show "check your inbox" instead of the form.
  sent?: boolean;
  // Logging in was refused because the email isn't confirmed yet: offer a new email.
  unconfirmed?: boolean;
  // A short "done" note, like "We sent a new email."
  notice?: string;
};

const MIN_PASSWORD_LENGTH = 8;
const EXPIRED_LINK =
  "This link has expired or was already used. If you've confirmed before, log in. Otherwise get a new link.";

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

  // With Supabase's "Confirm email" setting on, there's no session yet: the
  // account only becomes usable once the link in the email is opened. With the
  // setting off, the new account is signed in right away.
  if (!data.session) {
    return { email, sent: true };
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
    if (error.code === "email_not_confirmed") {
      return {
        email,
        unconfirmed: true,
        error: "Confirm your email first. Open the link we sent you, or get a new one below.",
      };
    }
    return { email, error: "We couldn't log you in. Please try again." };
  }

  redirect("/cards/best");
}

// Sends the confirmation email again, from the "check your inbox" screen or the
// log-in form. The answer is the same whether or not the address has an account,
// so this can't be used to find out who has signed up.
export async function resendConfirmation(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email so we know where to send the link." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });

  if (error?.code === "over_email_send_rate_limit" || error?.status === 429) {
    return { email, sent: true, error: "We just sent one. Wait a minute, then try again." };
  }
  if (error) {
    return { email, sent: true, error: "We couldn't send the email. Please try again." };
  }
  return { email, sent: true, notice: "We sent a new email. Use the newest link." };
}

// Runs when the button on the confirmation page is pressed. The link's token is
// checked by Supabase; if it's good, the account is confirmed and signed in.
export async function confirmEmail(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const link = readConfirmLink({
    token_hash: String(formData.get("token_hash") ?? ""),
    type: "email",
  });
  if (!link) return { error: EXPIRED_LINK };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type: "email", token_hash: link.tokenHash });
  if (error) return { error: EXPIRED_LINK };

  redirect("/cards/best");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
