# Prompts: feature 4, validation

## Prompt 1 (me)

> Merged, go on

## What Claude Code did

- Opened Issue #11 with the feature 4 user story and created `feature/validation` from main.
- Wrote the checks as one plain function, `validatePurchase` in `lib/purchase-validation.ts`, with no database code, so it's easy to read and test. It runs on the server every time a purchase is added or edited, so it can't be skipped by changing the page in the browser.
- The messages, one per field:
  - Merchant blank: "Enter where you made this purchase, like “Trader Joe’s”."
  - Amount blank: "Enter how much you spent."
  - Amount not a number: "Enter the amount as a number, like 42.50."
  - Amount of zero or less: "The amount needs to be more than $0."
  - Date blank: "Pick the date of the purchase." (and "Pick a real date." for something like Feb 30)
  - Category blank: "Choose a category."
  - Card blank: "Choose the card you used."
  - Two limits so nothing absurd gets saved: merchant under 80 characters, notes under 500.
- In the form, each field with a problem gets a **red label**, and its message appears right under its group. The cursor jumps to the first field with a problem. Everything already typed stays filled in.
- The database rules from feature 3 (no blank merchant, amount more than $0, only your own cards) stay as a backstop.

## What went wrong / caught along the way

Testing in the browser caught two problems before this PR, both now fixed:

1. **A failed save reset the Category dropdown to "Choose".** If you picked Dining, typed an amount of 0, and saved, the amount error showed correctly, but Category went back to blank and you'd have to pick it again. The cause: React only uses a dropdown's starting value when the dropdown first appears, and it clears the form after each save attempt. The fix rebuilds the dropdown with what you picked after each attempt. Re-tested: Dining and Travel both stayed selected.
2. **A blank card could look filled in after an error.** With "Choose" left on the Card dropdown, the form sends nothing for it at all. After the error, the form fell back to its default, your only card, so it showed "Test card" next to "Choose the card you used." A real user can't hit this (with one card it's preselected, and "Choose" can't be picked), but the form now shows exactly what was submitted.

## How it was tested

On my account, at phone size, with a temporary test card that was deleted afterwards:

- Saving a completely empty purchase showed all five messages, marked all five fields, and put the cursor in Merchant. This also worked before the page's JavaScript had loaded, which shows the checks run on the server.
- Amounts of 0, "abc", and -5 each showed the right message and kept the merchant, category, card, and date.
- Clearing the merchant while editing an existing purchase showed the merchant message.
- A correct purchase still saved, and was then deleted, along with the test card.
