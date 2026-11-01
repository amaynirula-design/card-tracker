"use client";

import { useActionState, useState } from "react";
import { ConfirmDialog, type ConfirmState } from "@/app/components/confirm-dialog";
import { CategoryTag } from "@/app/components/code-tag";
import { Affix, Field, FormSection, inputClasses, numberClasses } from "@/app/components/form";
import { Land } from "@/app/components/screen";
import { SegmentedControl } from "@/app/components/segmented-control";
import { SheetBar } from "@/app/components/sheet-bar";
import { REWARD_TYPE_LABELS, type Card, type RewardType } from "@/lib/cards";
import { CATEGORIES, FALLBACK_CATEGORY } from "@/lib/categories";
import type { CardFormState } from "./actions";

// Everything Else first: it's the one rate every card needs.
const FORM_CATEGORIES = [FALLBACK_CATEGORY, ...CATEGORIES.filter((c) => c !== FALLBACK_CATEGORY)];

// The add / edit card screen.
export function CardForm({
  card,
  defaults,
  note,
  action,
  deleteAction,
  cancelHref,
}: {
  // The saved card, on the edit screen.
  card?: Card;
  // Starting values for a new card, e.g. from a preset (feature 10).
  defaults?: Omit<Card, "id" | "isActive">;
  // Shown under the form, e.g. what a preset's fixed rates leave out.
  note?: string;
  action: (state: CardFormState, formData: FormData) => Promise<CardFormState>;
  // Only on the edit screen.
  deleteAction?: (state: ConfirmState) => Promise<ConfirmState>;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const values = state.values;
  const errors = state.errors ?? {};
  // Where unedited fields start from: the saved card, or the preset.
  const start = card ?? defaults;

  const [rewardType, setRewardType] = useState<RewardType>(
    (values?.reward_type as RewardType) ?? start?.rewardType ?? "cashback",
  );
  const [baseRate, setBaseRate] = useState(
    values?.[`rate:${FALLBACK_CATEGORY}`] ?? start?.rates[FALLBACK_CATEGORY]?.toString() ?? "",
  );
  const unit = rewardType === "cashback" ? "%" : "×";

  // What was typed before a failed save, else the card's saved value.
  const initial = (field: string, saved: string | number | undefined) =>
    values?.[field] ?? (saved === undefined ? "" : String(saved));

  return (
    <form action={formAction} noValidate className="flex flex-1 flex-col">
      <SheetBar
        title={card ? "Edit card" : "New card"}
        cancelHref={cancelHref}
        submitLabel={card ? "Done" : "Add"}
        pending={pending}
        changed={rewardType !== (start?.rewardType ?? "cashback")}
      />
      <div className="pt-2" />

      <Land>
        {errors.form && (
          <p role="alert" className="mb-4 text-small font-semibold text-danger">
            {errors.form}
          </p>
        )}

        <div className="space-y-9">
          <FormSection error={errors.name ?? errors.annualFee}>
            <Field label="Name" invalid={Boolean(errors.name)}>
              <input
                name="name"
                defaultValue={initial("name", start?.name)}
                placeholder="Sapphire Preferred"
                maxLength={60}
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                className={inputClasses}
              />
            </Field>
            <Field label="Annual fee" invalid={Boolean(errors.annualFee)}>
              <Affix before="$">
                <input
                  name="annual_fee"
                  inputMode="decimal"
                  defaultValue={initial("annual_fee", start?.annualFee || undefined)}
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
            <div>
              <SegmentedControl
                ariaLabel="Reward type"
                stretch
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
              <Field label="Point value" invalid={Boolean(errors.pointValue)}>
                <Affix after="¢ per point">
                  <input
                    name="point_value_cents"
                    inputMode="decimal"
                    defaultValue={initial(
                      "point_value_cents",
                      start?.rewardType === "points" ? start.pointValueCents : undefined,
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
            <div className="border-t border-line">
              {FORM_CATEGORIES.map((category) => {
                const isBase = category === FALLBACK_CATEGORY;
                return (
                  <label key={category} className="flex items-center gap-3 border-b border-line py-2">
                    <CategoryTag category={category} />
                    <span className="min-w-0 flex-1 font-semibold leading-snug">{category}</span>
                    <Affix after={unit} className="w-28 shrink-0">
                      <input
                        name={`rate:${category}`}
                        inputMode="decimal"
                        defaultValue={initial(`rate:${category}`, start?.rates[category])}
                        placeholder={isBase ? "Required" : baseRate || "–"}
                        onChange={isBase ? (event) => setBaseRate(event.target.value) : undefined}
                        aria-label={`${category} rate`}
                        aria-invalid={Boolean(errors.rates)}
                        className={numberClasses}
                      />
                    </Affix>
                  </label>
                );
              })}
            </div>
          </FormSection>

          {card && (
            <FormSection footer="Turn this off when you close the card. Its past purchases stay, but it won't be offered for new ones.">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="font-semibold">Card is open</span>
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

          {note && <p className="text-small leading-snug text-fg-soft">{note}</p>}

          {card && deleteAction && (
            <div className="pt-8">
              <ConfirmDialog
                triggerLabel="Delete card"
                title={`Delete “${card.name}”?`}
                message="This card and its rates will be removed. This can't be undone. To keep its history, turn off “Card is open” instead."
                confirmLabel="Delete"
                action={deleteAction}
              />
            </div>
          )}
        </div>
      </Land>
    </form>
  );
}
