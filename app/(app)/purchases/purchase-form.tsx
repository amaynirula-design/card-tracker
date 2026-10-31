"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ConfirmDialog, type ConfirmState } from "@/app/components/confirm-dialog";
import { Affix, Field, FormSection, inputClasses, numberClasses } from "@/app/components/form";
import { IconSelector } from "@/app/components/icons";
import { SheetBar } from "@/app/components/sheet-bar";
import type { Card } from "@/lib/cards";
import { CATEGORIES, type Category } from "@/lib/categories";
import { suggestCategory } from "@/lib/category-suggestions";
import { todayISO } from "@/lib/format";
import { MAX_MERCHANT_LENGTH, MAX_NOTES_LENGTH } from "@/lib/purchase-validation";
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
  const errors = state.errors ?? {};

  // After a failed save, put the cursor in the first field with a problem.
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  // What was typed before a failed save, else the purchase's saved value.
  // (A dropdown left on "Choose" isn't sent at all, so missing means blank.)
  const initial = (field: string, saved: string | number | null | undefined) =>
    values ? (values[field] ?? "") : saved === undefined || saved === null ? "" : String(saved);

  // On a new purchase, the category follows the merchant until it's picked by
  // hand. An existing purchase keeps the category it was saved with.
  const pickedCategory = useRef(Boolean(purchase));
  const [suggestion, setSuggestion] = useState<Category>();

  function suggestFrom(merchant: string) {
    if (pickedCategory.current) return;
    const suggested = suggestCategory(merchant);
    const select = formRef.current?.elements.namedItem("category") as HTMLSelectElement | null;
    if (select) select.value = suggested ?? "";
    setSuggestion(suggested);
  }

  // With only one card, there's nothing to choose.
  const defaultCard = purchase?.card.id ?? (cards.length === 1 ? cards[0].id : "");

  return (
    <form ref={formRef} action={formAction} noValidate className="sheet-in mx-auto w-full max-w-xl flex-1 px-4 pb-16">
      <SheetBar
        title={purchase ? "Edit Purchase" : "New Purchase"}
        cancelHref={cancelHref}
        submitLabel={purchase ? "Done" : "Add"}
        pending={pending}
      />

      {state.error && (
        <p role="alert" className="mt-2 px-4 text-subhead text-danger">
          {state.error}
        </p>
      )}

      <div className="mt-4 space-y-8">
        <FormSection error={[errors.merchant, errors.amount, errors.purchase_date]}>
          <Field label="Merchant" invalid={Boolean(errors.merchant)}>
            <input
              name="merchant"
              defaultValue={initial("merchant", purchase?.merchant)}
              placeholder="Trader Joe’s"
              maxLength={MAX_MERCHANT_LENGTH}
              autoComplete="off"
              onChange={(event) => suggestFrom(event.target.value)}
              aria-invalid={Boolean(errors.merchant)}
              className={inputClasses}
            />
          </Field>
          <Field label="Amount" invalid={Boolean(errors.amount)}>
            <Affix before="$">
              <input
                name="amount"
                inputMode="decimal"
                defaultValue={initial("amount", purchase?.amount.toFixed(2))}
                placeholder="0.00"
                aria-invalid={Boolean(errors.amount)}
                className={numberClasses}
              />
            </Affix>
          </Field>
          <Field label="Date" invalid={Boolean(errors.purchase_date)}>
            <input
              name="purchase_date"
              type="date"
              defaultValue={initial("purchase_date", purchase?.date ?? todayISO())}
              // The server's "today" can differ from the browser's.
              suppressHydrationWarning
              aria-invalid={Boolean(errors.purchase_date)}
              className={`${inputClasses} [&::-webkit-date-and-time-value]:text-right`}
            />
          </Field>
        </FormSection>

        <div className="space-y-1.5">
          <FormSection error={[errors.category, errors.card_id]}>
            <Field label="Category" invalid={Boolean(errors.category)}>
              <Select
                name="category"
                defaultValue={initial("category", purchase?.category)}
                invalid={Boolean(errors.category)}
                onChange={() => {
                  pickedCategory.current = true;
                  setSuggestion(undefined);
                }}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Card" invalid={Boolean(errors.card_id)}>
              <Select
                name="card_id"
                defaultValue={initial("card_id", defaultCard)}
                invalid={Boolean(errors.card_id)}
              >
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                    {card.isActive ? "" : " (closed)"}
                  </option>
                ))}
              </Select>
            </Field>
          </FormSection>
          <p role="status" className="px-4 text-footnote leading-snug text-label-secondary">
            {suggestion && `${suggestion} was suggested from the merchant. Change it if it's wrong.`}
          </p>
        </div>

        <FormSection header="Notes" error={errors.notes}>
          <textarea
            name="notes"
            defaultValue={initial("notes", purchase?.notes)}
            placeholder="Optional, like “return by Nov 15”"
            rows={3}
            maxLength={MAX_NOTES_LENGTH}
            aria-invalid={Boolean(errors.notes)}
            className="block w-full resize-none bg-transparent px-4 py-3 text-body outline-none placeholder:text-label-tertiary"
          />
        </FormSection>

        {purchase && deleteAction && (
          <ConfirmDialog
            triggerLabel="Delete Purchase"
            title="Delete This Purchase?"
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
  invalid,
  onChange,
  children,
}: {
  name: string;
  defaultValue: string;
  invalid?: boolean;
  onChange?: () => void;
  children: React.ReactNode;
}) {
  return (
    <span className="relative flex min-w-0 items-center justify-end gap-1 text-label-secondary">
      <select
        // React only applies defaultValue to a dropdown when it first appears, and
        // it clears the form after each save. A new key rebuilds the dropdown with
        // what was picked, so a failed save doesn't reset it to "Choose".
        key={defaultValue}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        aria-invalid={invalid}
        className="h-11 min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-1 text-right text-body text-label outline-none [&:has(option[value='']:checked)]:text-label-tertiary"
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
