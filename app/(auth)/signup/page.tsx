import type { Metadata } from "next";
import { signUp } from "../actions";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Create account · Card Tracker" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="mt-5 text-center text-[28px] font-bold tracking-tight">Create your account</h1>
      <p className="mb-8 mt-2 text-center text-[15px] text-label-secondary">
        Your cards and purchases stay private to you.
      </p>
      <AuthForm mode="signup" action={signUp} />
    </>
  );
}
