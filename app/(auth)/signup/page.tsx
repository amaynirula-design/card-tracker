import type { Metadata } from "next";
import { signUp } from "../actions";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Create Account · Card Tracker" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="mt-5 text-center text-title1 font-bold tracking-tight">Create Your Account</h1>
      <p className="mb-8 mt-2 text-center text-subhead text-label-secondary">
        Your cards and purchases stay private to you.
      </p>
      <AuthForm mode="signup" action={signUp} />
    </>
  );
}
