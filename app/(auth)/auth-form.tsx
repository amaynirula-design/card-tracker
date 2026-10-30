"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/app/components/button";
import type { AuthFormState } from "./actions";

// The shared sign-up / log-in form: email and password in one iOS-style
// grouped panel, a friendly error message, and one main button.
export function AuthForm({
  mode,
  action,
}: {
  mode: "signup" | "login";
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <form action={formAction} noValidate className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-surface shadow-panel">
        <label className="flex items-center gap-3 px-4">
          <span className="w-[86px] shrink-0 text-body">Email</span>
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
            className="h-12 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-label-tertiary"
          />
        </label>
        <div className="ml-4 border-t border-separator" />
        <label className="flex items-center gap-3 px-4">
          <span className="w-[86px] shrink-0 text-body">Password</span>
          <input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={isSignup ? "At least 8 characters" : "Required"}
            aria-invalid={Boolean(state.error)}
            className="h-12 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-label-tertiary"
          />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="px-4 text-subhead leading-snug text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending
          ? isSignup
            ? "Creating Account…"
            : "Logging In…"
          : isSignup
            ? "Create Account"
            : "Log In"}
      </Button>

      <p className="text-center text-subhead text-label-secondary">
        {isSignup ? "Already have an account? " : "New to Card Tracker? "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-accent">
          {isSignup ? "Log In" : "Create an Account"}
        </Link>
      </p>
    </form>
  );
}
