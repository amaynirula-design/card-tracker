"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/app/components/button";
import { confirmEmail } from "../../actions";

// The button on the confirmation page. Confirming happens when it's pressed,
// not when the page opens: some email apps open every link to scan it, and that
// would use the link up before the person ever saw it.
export function ConfirmForm({ tokenHash }: { tokenHash: string }) {
  const [state, formAction, pending] = useActionState(confirmEmail, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token_hash" value={tokenHash} />
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Confirming…" : "Confirm my email"}
      </Button>
      {state.error && (
        <>
          <p role="alert" className="text-small font-semibold leading-snug text-danger">
            {state.error}
          </p>
          <LinkHelp />
        </>
      )}
    </form>
  );
}

// Where to go when a link can't be used.
export function LinkHelp() {
  return (
    <p className="text-center text-small text-fg-soft">
      <Link href="/login" className="text-link">
        Log in
      </Link>
      {" · "}
      <Link href="/signup" className="text-link">
        Create an account
      </Link>
    </p>
  );
}
