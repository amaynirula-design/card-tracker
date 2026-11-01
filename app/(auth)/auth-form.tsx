"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/app/components/button";
import { Field, inputClasses } from "@/app/components/form";
import type { AuthFormState } from "./actions";

// The shared sign-up / log-in form: the heading on the ground, then email and
// password on a land panel, a friendly error message, and one main button.
export function AuthForm({
  mode,
  title,
  subtitle,
  action,
}: {
  mode: "signup" | "login";
  title: string;
  subtitle: string;
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <div className="flex w-full flex-1 flex-col md:max-w-md md:flex-none">
      <div className="px-5 pb-6 md:px-0">
        <h1 className="wide text-headline font-extrabold leading-[1.05] tracking-tight">{title}</h1>
        <p className="mt-2 text-fg-soft">{subtitle}</p>
      </div>

      <form
        action={formAction}
        noValidate
        className="land flex-1 space-y-4 rounded-t-[1.25rem] px-5 pb-12 pt-6 md:flex-none md:rounded-[1.25rem] md:p-8"
      >
        <Field label="Email">
          <input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            defaultValue={state.email}
            aria-invalid={Boolean(state.error)}
            className={inputClasses}
          />
        </Field>
        <Field label="Password">
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={isSignup ? "At least 8 characters" : "Required"}
            aria-invalid={Boolean(state.error)}
            className={inputClasses}
          />
        </Field>

        {state.error && (
          <p role="alert" className="text-small font-semibold leading-snug text-danger">
            {state.error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending
            ? isSignup
              ? "Creating account…"
              : "Logging in…"
            : isSignup
              ? "Create account"
              : "Log in"}
        </Button>

        <p className="text-center text-small text-fg-soft">
          {isSignup ? "Already have an account? " : "New to Card Tracker? "}
          <Link href={isSignup ? "/login" : "/signup"} className="text-link">
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </div>
  );
}
