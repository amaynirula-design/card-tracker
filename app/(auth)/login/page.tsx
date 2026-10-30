import type { Metadata } from "next";
import { logIn } from "../actions";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Log In · Card Tracker" };

export default function LogInPage() {
  return (
    <>
      <h1 className="mt-5 text-center text-title1 font-bold tracking-tight">Welcome Back</h1>
      <p className="mb-8 mt-2 text-center text-subhead text-label-secondary">
        Log in to see your cards and rewards.
      </p>
      <AuthForm mode="login" action={logIn} />
    </>
  );
}
