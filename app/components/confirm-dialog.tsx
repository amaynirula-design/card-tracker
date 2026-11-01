"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

export type ConfirmState = { error?: string };

// An "are you sure?" dialog: a red button opens it, and the action only runs if
// you confirm. It's drawn on top of the page (in a portal) so it can hold its own
// form even when the button sits inside another form.
export function ConfirmDialog({
  triggerLabel,
  title,
  message,
  confirmLabel,
  action,
}: {
  triggerLabel: string;
  title: string;
  message: string;
  confirmLabel: string;
  action: (state: ConfirmState, formData: FormData) => Promise<ConfirmState>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-12 w-full rounded-md border border-danger text-body font-bold text-danger transition-colors hover:bg-danger hover:text-white"
      >
        {triggerLabel}
      </button>
      {open &&
        createPortal(
          <Alert
            title={title}
            message={message}
            confirmLabel={confirmLabel}
            action={action}
            onClose={() => setOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}

// Centered on wide screens; at the bottom of the screen on phones, where the
// buttons are within reach of a thumb.
export function Alert({
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel,
  pendingLabel = "Deleting…",
  action,
  onClose,
}: {
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel: string;
  pendingLabel?: string;
  action: (state: ConfirmState, formData: FormData) => Promise<ConfirmState>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState(action, {});

  // showModal() dims the page, traps focus inside, and closes on Escape.
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="confirm-title"
      className="land dialog-in m-auto w-[22rem] max-w-[calc(100%-1rem)] rounded-[1.25rem] p-5 shadow-[0_12px_32px_rgb(14_18_64/0.35)] backdrop:bg-ink/60 max-md:mb-[calc(env(safe-area-inset-bottom)+0.5rem)] max-md:w-[calc(100%-1rem)] max-md:max-w-md"
    >
      <form action={formAction}>
        <h2 id="confirm-title" className="wide text-lead font-extrabold leading-tight tracking-tight">
          {title}
        </h2>
        <p className="mt-2 leading-snug text-fg-soft">{message}</p>
        {state.error && (
          <p role="alert" className="mt-2 text-small font-semibold leading-snug text-danger">
            {state.error}
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" size="lg" autoFocus onClick={() => ref.current?.close()}>
            {cancelLabel}
          </Button>
          <button
            type="submit"
            disabled={pending}
            className="h-12 rounded-md bg-danger font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
