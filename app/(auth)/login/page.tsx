import type { Metadata } from "next";
import { logIn } from "../actions";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = { title: "Log In · Card Tracker" };

export default function LogInPage() {
  return (
    <AuthForm
      mode="login"
      title="Welcome back"
      subtitle="Log in to see your cards and rewards."
      action={logIn}
    />
  );
}
