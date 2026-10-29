"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ConfirmDialog, type ConfirmState } from "@/app/components/confirm-dialog";
import { SegmentedControl } from "@/app/components/segmented-control";
import { REWARD_TYPE_LABELS, type Card, type RewardType } from "@/lib/cards";
import { CATEGORIES, FALLBACK_CATEGORY } from "@/lib/categories";
import type { CardFormState } from "./actions";

// Everything Else first: it's the one rate every card needs.
const FORM_CATEGORIES = [FALLBACK_CATEGORY, ...CATEGORIES.filter((c) => c !== FALLBACK_CATEGORY)];

// The add / edit card screen, laid out like an iOS sheet: Cancel on the left,
// the title in the middle, and the save button on the right.
export function CardForm({
  card,
  action,
  deleteAction,
  cancelHref,
}: {
  card?: Card;
  action: (state: CardFormState, formData: FormData) => Promise<CardFormState>;
  // Only on the edit screen.
  deleteAction?: (state: ConfirmState) => Promise<ConfirmState>;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values;
  const errors = state.errors ?? {};

  const [rewardType, setRewardType] = useState<RewardType>(
    (values?.reward_type as RewardType) ?? card?.rewardType ?? "cashback",
  );
  const [baseRate, setBaseRate] = useState(
    values?.[`rate:${FALLBACK_CATEGORY}`] ?? card?.rates[FALLBACK_CATEGORY]?.toString() ?? "",
  );
  const unit = rewardType === "cashback" ? "%" : "×";

  // What was typed before a failed save, else the card's saved value.
  const initial = (field: string, saved: string | number | undefined) =>
    values?.[field] ?? (saved === undefined ? "" : String(saved));

  return (
    <form action={formAction} noValidate className="sheet-in mx-auto w-full max-w-xl flex-1 px-4 pb-16">
      <div className="sticky top-14 z-30 -mx-4 grid grid-cols-[1fr_auto_1fr] items-center bg-background/80 px-4 py-3 backdrop-blur-xl">
        <Link href={cancelHref} className="justify-self-start text-[17px] text-accent hover:opacity-70">
          Cancel
        </Link>
        <h1 className="text-[17px] font-semibold">{card ? "Edit Card" : "New Card"}</h1>
        <button
          type="submit"
          disabled={pending}
          className="justify-self-end text-[17px] font-semibold text-accent hover:opacity-70 disabled:opacity-40"
        >
          {pending ? "Saving…" : card ? "Done" : "Add"}
        </button>
      </div>

      {errors.form && (
        <p role="alert" className="mt-2 px-4 text-[15px] text-danger">
          {errors.form}
        </p>
      )}

      <div className="mt-4 space-y-8">
        <Section error={errors.name ?? errors.annualFee}>
          <Field label="Name">
            <input
              name="name"
              defaultValue={initial("name", card?.name)}
              placeholder="Sapphire Preferred"
              maxLength={60}
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              className={inputClasses}
            />
          </Field>
          <Field label="Annual fee">
            <Affix before="$">
              <input
                name="annual_fee"
                inputMode="decimal"
                defaultValue={initial("annual_fee", card?.annualFee || undefined)}
                placeholder="0"
                aria-invalid={Boolean(errors.annualFee)}
                className={numberClasses}
              />
            </Affix>
          </Field>
        </Section>

        <Section
          header="Rewards"
          error={errors.pointValue}
          footer={
            rewardType === "points"
              ? "What one point is worth to you. Many travel points are worth about 1 to 2 cents."
              : undefined
          }
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2.5">
            <span className="text-[17px]">Type</span>
            <SegmentedControl
              ariaLabel="Reward type"
              value={rewardType}
              onChange={setRewardType}
              options={(["cashback", "points"] as const).map((value) => ({
                value,
                label: REWARD_TYPE_LABELS[value],
              }))}
            />
            <input type="hidden" name="reward_type" value={rewardType} />
          </div>
          {rewardType === "points" && (
            <Field label="Point value">
              <Affix after="¢ per point">
                <input
                  name="point_value_cents"
                  inputMode="decimal"
                  defaultValue={initial(
                    "point_value_cents",
                    card?.rewardType === "points" ? card.pointValueCents : undefined,
                  )}
                  placeholder="1.25"
                  aria-invalid={Boolean(errors.pointValue)}
                  className={numberClasses}
                />
              </Affix>
            </Field>
          )}
        </Section>

        <Section
          header={rewardType === "cashback" ? "Cash back by category" : "Points per dollar by category"}
          error={errors.rates}
          footer="Leave a category blank to use the Everything Else rate."
        >
          {FORM_CATEGORIES.map((category) => {
            const isBase = category === FALLBACK_CATEGORY;
            return (
              <Field key={category} label={category}>
                <Affix after={unit}>
                  <input
                    name={`rate:${category}`}
                    inputMode="decimal"
                    defaultValue={initial(`rate:${category}`, card?.rates[category])}
                    placeholder={isBase ? "Required" : baseRate || "–"}
                    onChange={isBase ? (event) => setBaseRate(event.target.value) : undefined}
                    aria-label={`${category} rate`}
                    aria-invalid={Boolean(errors.rates)}
                    className={numberClasses}
                  />
                </Affix>
              </Field>
            );
          })}
        </Section>

        {card && (
          <Section footer="Turn this off when you close the card. Its past purchases stay, but it won't be offered for new ones.">
            <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5">
              <span className="text-[17px]">Card is open</span>
              <input
                type="checkbox"
                name="is_active"
                role="switch"
                defaultChecked={values ? values.is_active === "on" : card.isActive}
                className="switch"
              />
            </label>
          </Section>
        )}

        {card && deleteAction && (
          <ConfirmDialog
            triggerLabel="Delete Card"
            title={`Delete “${card.name}”?`}
            message="This card and its rates will be removed. This can't be undone. To keep its history, turn off “Card is open” instead."
            confirmLabel="Delete"
            action={deleteAction}
          />
        )}
      </div>
    </form>
  );
}

const inputClasses =
  "h-11 w-full min-w-0 bg-transparent text-right text-[17px] tabular outline-none placeholder:text-label-tertiary";

// Number inputs next to a unit grow with what's typed, so "$" or "%" sits right
// beside the number.
const numberClasses =
  "h-11 min-w-[2ch] max-w-full bg-transparent text-right text-[17px] text-label tabular outline-none placeholder:text-label-tertiary [field-sizing:content]";

function Section({
  header,
  footer,
  error,
  children,
}: {
  header?: string;
  footer?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-1.5">
      {header && (
        <h2 className="px-4 text-[13px] uppercase tracking-wide text-label-secondary">{header}</h2>
      )}
      <div className="overflow-hidden rounded-2xl bg-surface shadow-panel [&>*+*]:border-t [&>*+*]:border-separator">
        {children}
      </div>
      {error && (
        <p role="alert" className="px-4 text-[13px] leading-snug text-danger">
          {error}
        </p>
      )}
      {footer && <p className="px-4 text-[13px] leading-snug text-label-secondary">{footer}</p>}
    </section>
  );
}

// A form row: label on the left, input on the right, like iOS Settings.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 px-4">
      <span className="shrink-0 text-[17px]">{label}</span>
      <span className="flex min-w-0 flex-1 justify-end">{children}</span>
    </label>
  );
}

// A small unit before or after the number, like "$" or "%".
function Affix({
  before,
  after,
  children,
}: {
  before?: string;
  after?: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex w-full max-w-48 items-center justify-end gap-1 text-[17px] text-label-secondary">
      {before}
      {children}
      {after && <span className="shrink-0">{after}</span>}
    </span>
  );
}
