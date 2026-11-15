"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/app/components/button";
import { Field, inputClasses } from "@/app/components/form";
import type { AuthFormState } from "./actions";

const panelClasses = "land mb-10 rounded-xl px-5 pb-8 pt-6 md:p-8";

// The shared sign-up / log-in form: the heading on the ground, then email and
// password on a land panel, a friendly error message, and one main button.
// After a sign-up that needs its email confirmed, it becomes "check your inbox".
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

  if (state.sent && state.email) {
    return <CheckInbox state={state} email={state.email} formAction={formAction} pending={pending} />;
  }

  return (
    <AuthFrame title={title} subtitle={subtitle}>
      <form action={formAction} noValidate className="space-y-4">
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

        <Messages state={state} />

        <Button type="submit" size="lg" disabled={pending} className="w-full">
          {pending
            ? isSignup
              ? "Creating account…"
              : "Logging in…"
            : isSignup
              ? "Create account"
              : "Log in"}
        </Button>

        {/* Logging in was refused because the email isn't confirmed yet. */}
        {state.unconfirmed && <ResendButton pending={pending} />}
      </form>

      <p className="mt-4 text-center text-small text-fg-soft">
        {isSignup ? "Already have an account? " : "New to Card Tracker? "}
        <Link href={isSignup ? "/login" : "/signup"} className="text-link">
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </AuthFrame>
  );
}

// The heading on the ground and one land panel under it.
export function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-1 flex-col md:max-w-md md:flex-none">
      <div className="px-5 pb-6 md:px-0">
        <h1 className="display text-headline leading-[1.05]">{title}</h1>
        <p className="mt-2 text-fg-soft">{subtitle}</p>
      </div>
      <div className={panelClasses}>{children}</div>
    </div>
  );
}

// Shown after signing up: the account exists but can't be used until the link
// in the email is opened.
function CheckInbox({
  state,
  email,
  formAction,
  pending,
}: {
  state: AuthFormState;
  email: string;
  formAction: (formData: FormData) => void;
  pending: boolean;
}) {
  return (
    <AuthFrame title="Check your inbox" subtitle="One more step to finish creating your account.">
      <p className="leading-relaxed">
        We sent a link to <strong className="break-all font-bold">{email}</strong>. Open it to confirm
        your email and start using Card Tracker.
      </p>
      <p className="mt-2 text-small leading-relaxed text-fg-soft">
        It can take a minute to arrive. If you don&rsquo;t see it, look in your spam folder.
      </p>

      <form action={formAction} className="mt-6 space-y-3">
        <input type="hidden" name="email" value={email} />
        <ResendButton pending={pending} />
        <Messages state={state} />
      </form>

      <p className="mt-5 text-center text-small text-fg-soft">
        Wrong address? {/* A full page load, so the form starts empty again. */}
        <a href="/signup" className="text-link">
          Start again
        </a>
        {" · "}
        <Link href="/login" className="text-link">
          Log in
        </Link>
      </p>
    </AuthFrame>
  );
}

// Sends the confirmation email again. It submits the form it sits in, and its
// name and value tell the server which button was pressed.
function ResendButton({ pending }: { pending: boolean }) {
  return (
    <Button
      type="submit"
      name="intent"
      value="resend"
      variant="secondary"
      size="lg"
      disabled={pending}
      className="w-full"
    >
      Send the email again
    </Button>
  );
}

// What went wrong, or a short "done" note.
function Messages({ state }: { state: AuthFormState }) {
  if (state.error) {
    return (
      <p role="alert" className="text-small font-semibold leading-snug text-danger">
        {state.error}
      </p>
    );
  }
  if (state.notice) {
    return (
      <p role="status" className="text-small font-semibold leading-snug">
        {state.notice}
      </p>
    );
  }
  return null;
}
