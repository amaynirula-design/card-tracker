"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ConfirmState = { error?: string };

// An "are you sure?" alert in the style of iOS: a red button opens it, and the
// action only runs if you confirm. The alert is drawn on top of the page (in a
// portal) so it can hold its own form even when the button sits inside another form.
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
        className="h-12 w-full rounded-2xl bg-surface text-[17px] text-danger shadow-panel transition-opacity hover:opacity-80 active:opacity-60"
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

function Alert({
  title,
  message,
  confirmLabel,
  action,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel: string;
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
      className="alert-in m-auto w-[270px] overflow-hidden rounded-[14px] bg-surface-raised p-0 text-center text-label shadow-2xl backdrop:bg-black/40"
    >
      <form action={formAction}>
        <div className="px-4 pb-4 pt-5">
          <h2 id="confirm-title" className="text-[17px] font-semibold">
            {title}
          </h2>
          <p className="mt-1 text-[13px] leading-snug">{message}</p>
          {state.error && (
            <p role="alert" className="mt-2 text-[13px] leading-snug text-danger">
              {state.error}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 border-t border-separator text-[17px]">
          <button
            type="button"
            autoFocus
            onClick={() => ref.current?.close()}
            className="h-11 text-accent hover:bg-fill"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="h-11 border-l border-separator font-semibold text-danger hover:bg-fill disabled:opacity-50"
          >
            {pending ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
