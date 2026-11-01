import type { Metadata } from "next";
import { signUp } from "../actions";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Create Account · Card Tracker" };

export default function SignUpPage() {
  return (
    <AuthForm
      mode="signup"
      title="Create your account"
      subtitle="Your cards and purchases stay private to you."
      action={signUp}
    />
  );
}
