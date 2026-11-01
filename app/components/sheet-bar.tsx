"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Alert } from "./confirm-dialog";

// The bar at the top of add and edit screens: Cancel on the left, the title in
// the middle, and the save button on the right, so saving stays in reach on a
// long form. Cancel asks first if anything in the form changed.
export function SheetBar({
  title,
  cancelHref,
  submitLabel,
  pending,
  changed = false,
}: {
  title: string;
  cancelHref: string;
  // Leave out for a screen with nothing to save.
  submitLabel?: string;
  pending?: boolean;
  // For changes that aren't typed into a field, like a segmented control.
  changed?: boolean;
}) {
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(false);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const form = barRef.current?.closest("form");
    if (!form) return;
    const onChange = () => setTyped(true);
    form.addEventListener("input", onChange);
    form.addEventListener("change", onChange);
    return () => {
      form.removeEventListener("input", onChange);
      form.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="sticky top-0 z-30 grid min-h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 bg-ground px-5 py-1.5 md:px-10"
    >
      <Link
        href={cancelHref}
        onClick={(event) => {
          if (typed || changed) {
            event.preventDefault();
            setAsking(true);
          }
        }}
        className="flex min-h-11 items-center justify-self-start text-small font-semibold underline decoration-1 underline-offset-4"
      >
        Cancel
      </Link>
      <h1 className="wide text-center text-body font-extrabold">{title}</h1>
      {submitLabel && (
        <button
          type="submit"
          disabled={pending}
          className="h-10 min-w-16 justify-self-end rounded-md bg-action px-4 text-small font-bold text-on-action transition-colors hover:bg-action-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      )}
      {asking &&
        createPortal(
          <Alert
            title="Discard changes?"
            message="What you've entered here won't be saved."
            cancelLabel="Keep editing"
            confirmLabel="Discard"
            pendingLabel="Discard"
            action={async () => {
              router.push(cancelHref);
              return {};
            }}
            onClose={() => setAsking(false)}
          />,
          document.body,
        )}
    </div>
  );
}
