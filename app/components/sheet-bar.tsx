"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Alert } from "./confirm-dialog";

// The bar at the top of add and edit screens, like an iOS sheet: Cancel on the
// left, the title in the middle, and the save button on the right. Cancel asks
// first if anything in the form changed.
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
      className="frosted sticky top-0 z-30 -mx-4 grid grid-cols-[1fr_auto_1fr] items-center bg-background/80 px-4 py-1 backdrop-blur-xl md:top-14"
    >
      <Link
        href={cancelHref}
        onClick={(event) => {
          if (typed || changed) {
            event.preventDefault();
            setAsking(true);
          }
        }}
        className="flex min-h-11 items-center justify-self-start text-body text-accent hover:opacity-70"
      >
        Cancel
      </Link>
      <h1 className="text-body font-semibold">{title}</h1>
      {submitLabel && (
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 justify-self-end text-body font-semibold text-accent hover:opacity-70 disabled:opacity-40"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      )}
      {asking &&
        createPortal(
          <Alert
            title="Discard Changes?"
            message="What you've entered here won't be saved."
            cancelLabel="Keep Editing"
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
