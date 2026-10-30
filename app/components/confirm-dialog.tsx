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
        className="h-12 w-full rounded-2xl bg-surface text-body text-danger shadow-panel transition-opacity hover:opacity-80 active:opacity-60"
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

// A centered alert on wide screens. On phones the same dialog is an action sheet
// at the bottom of the screen, with Cancel on its own below, like Mail and Photos.
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
      className="alert-in m-auto w-[270px] bg-transparent p-0 text-center text-label backdrop:bg-black/40 max-md:mb-[calc(env(safe-area-inset-bottom)+0.5rem)] max-md:w-[calc(100%-1rem)] max-md:max-w-md"
    >
      <form
        action={formAction}
        className="flex flex-col text-body md:grid md:grid-cols-2 md:overflow-hidden md:rounded-[14px] md:shadow-2xl"
      >
        <div className="rounded-t-[14px] bg-surface-raised px-4 pb-4 pt-5 md:col-span-2 md:rounded-none">
          <h2 id="confirm-title" className="font-semibold max-md:text-footnote max-md:text-label-secondary">
            {title}
          </h2>
          <p className="mt-1 text-footnote leading-snug max-md:text-label-secondary">{message}</p>
          {state.error && (
            <p role="alert" className="mt-2 text-footnote leading-snug text-danger">
              {state.error}
            </p>
          )}
        </div>
        <button
          type="button"
          autoFocus
          onClick={() => ref.current?.close()}
          className="h-11 border-t border-separator bg-surface-raised text-accent-raised hover:bg-fill max-md:order-last max-md:mt-2 max-md:h-14 max-md:rounded-[14px] max-md:border-t-0 max-md:font-semibold"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="h-11 border-t border-separator bg-surface-raised font-semibold text-danger hover:bg-fill disabled:opacity-50 max-md:h-14 max-md:rounded-b-[14px] max-md:font-normal md:border-l"
        >
          {pending ? pendingLabel : confirmLabel}
        </button>
      </form>
    </dialog>
  );
}
