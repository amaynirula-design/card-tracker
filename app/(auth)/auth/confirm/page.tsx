import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/auth";
import { readConfirmLink } from "@/lib/confirm-link";
import { AuthFrame } from "../../auth-form";
import { ConfirmForm, LinkHelp } from "./confirm-form";

export const metadata: Metadata = { title: "Confirm Your Email · Card Tracker" };

// The page the link in the confirmation email opens:
// /auth/confirm?token_hash=...&type=email
export default async function ConfirmEmailPage({ searchParams }: PageProps<"/auth/confirm">) {
  // Already signed in (the link was opened a second time): nothing left to confirm.
  if (await isSignedIn()) redirect("/cards/best");

  const link = readConfirmLink(await searchParams);

  if (!link) {
    return (
      <AuthFrame title="This link doesn’t work" subtitle="It may be incomplete, or not from Card Tracker.">
        <p className="mb-4 leading-relaxed">
          Open the newest email we sent you and use the link in it. If you&rsquo;ve already confirmed,
          just log in.
        </p>
        <LinkHelp />
      </AuthFrame>
    );
  }

  return (
    <AuthFrame title="Confirm your email" subtitle="One tap and your account is ready.">
      <ConfirmForm tokenHash={link.tokenHash} />
    </AuthFrame>
  );
}
