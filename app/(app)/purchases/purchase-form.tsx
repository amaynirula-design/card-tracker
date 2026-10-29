"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ConfirmDialog, type ConfirmState } from "@/app/components/confirm-dialog";
import { Affix, Field, FormSection, inputClasses, numberClasses } from "@/app/components/form";
import { IconSelector } from "@/app/components/icons";
import type { Card } from "@/lib/cards";
import { CATEGORIES } from "@/lib/categories";
import { todayISO } from "@/lib/format";
import type { Purchase } from "@/lib/purchases";
import type { PurchaseFormState } from "./actions";

// The add / edit purchase screen, laid out like an iOS sheet (same as cards).
export function PurchaseForm({
  purchase,
  cards,
  action,
  deleteAction,
  cancelHref,
}: {
  purchase?: Purchase;
  // The cards to choose from.
  cards: Card[];
  action: (state: PurchaseFormState, formData: FormData) => Promise<PurchaseFormState>;
  // Only on the edit screen.
  deleteAction?: (state: ConfirmState) => Promise<ConfirmState>;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values;

  // What was typed before a failed save, else the purchase's saved value.
  const initial = (field: string, saved: string | number | null | undefined) =>
    values?.[field] ?? (saved === undefined || saved === null ? "" : String(saved));

  // With only one card, there's nothing to choose.
  const defaultCard = purchase?.card.id ?? (cards.length === 1 ? cards[0].id : "");

  return (
    <form action={formAction} noValidate className="sheet-in mx-auto w-full max-w-xl flex-1 px-4 pb-16">
      <div className="sticky top-14 z-30 -mx-4 grid grid-cols-[1fr_auto_1fr] items-center bg-background/80 px-4 py-3 backdrop-blur-xl">
        <Link href={cancelHref} className="justify-self-start text-[17px] text-accent hover:opacity-70">
          Cancel
        </Link>
        <h1 className="text-[17px] font-semibold">{purchase ? "Edit Purchase" : "New Purchase"}</h1>
        <button
          type="submit"
          disabled={pending}
          className="justify-self-end text-[17px] font-semibold text-accent hover:opacity-70 disabled:opacity-40"
        >
          {pending ? "Saving…" : purchase ? "Done" : "Add"}
        </button>
      </div>

      {state.error && (
        <p role="alert" className="mt-2 px-4 text-[15px] text-danger">
          {state.error}
        </p>
      )}

      <div className="mt-4 space-y-8">
        <FormSection>
          <Field label="Merchant">
            <input
              name="merchant"
              defaultValue={initial("merchant", purchase?.merchant)}
              placeholder="Trader Joe’s"
              maxLength={80}
              autoComplete="off"
              className={inputClasses}
            />
          </Field>
          <Field label="Amount">
            <Affix before="$">
              <input
                name="amount"
                inputMode="decimal"
                defaultValue={initial("amount", purchase?.amount.toFixed(2))}
                placeholder="0.00"
                className={numberClasses}
              />
            </Affix>
          </Field>
          <Field label="Date">
            <input
              name="purchase_date"
              type="date"
              defaultValue={initial("purchase_date", purchase?.date ?? todayISO())}
              // The server's "today" can differ from the browser's.
              suppressHydrationWarning
              className={`${inputClasses} [&::-webkit-date-and-time-value]:text-right`}
            />
          </Field>
        </FormSection>

        <FormSection>
          <Field label="Category">
            <Select name="category" defaultValue={initial("category", purchase?.category)}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Card">
            <Select name="card_id" defaultValue={initial("card_id", defaultCard)}>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                  {card.isActive ? "" : " (closed)"}
                </option>
              ))}
            </Select>
          </Field>
        </FormSection>

        <FormSection header="Notes">
          <textarea
            name="notes"
            defaultValue={initial("notes", purchase?.notes)}
            placeholder="Optional, like “return by Nov 15”"
            rows={3}
            maxLength={500}
            className="block w-full resize-none bg-transparent px-4 py-3 text-[17px] outline-none placeholder:text-label-tertiary"
          />
        </FormSection>

        {purchase && deleteAction && (
          <ConfirmDialog
            triggerLabel="Delete Purchase"
            title="Delete this purchase?"
            message={`${purchase.merchant} will be removed from your purchases. This can't be undone.`}
            confirmLabel="Delete"
            action={deleteAction}
          />
        )}
      </div>
    </form>
  );
}

// A native dropdown styled like an iOS picker row: the value on the right with
// small up/down arrows. "Choose" shows until something is picked.
function Select({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <span className="relative flex min-w-0 items-center justify-end gap-1 text-label-secondary">
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-1 text-right text-[17px] text-label outline-none [&:has(option[value='']:checked)]:text-label-tertiary"
      >
        <option value="" disabled>
          Choose
        </option>
        {children}
      </select>
      <IconSelector className="size-4 shrink-0" />
    </span>
  );
}
