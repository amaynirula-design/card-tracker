"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ConfirmDialog, type ConfirmState } from "@/app/components/confirm-dialog";
import { Affix, Field, FormSection, inputClasses, numberClasses } from "@/app/components/form";
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
        <FormSection error={errors.name ?? errors.annualFee}>
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
        </FormSection>

        <FormSection
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
        </FormSection>

        <FormSection
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
        </FormSection>

        {card && (
          <FormSection footer="Turn this off when you close the card. Its past purchases stay, but it won't be offered for new ones.">
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
          </FormSection>
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
