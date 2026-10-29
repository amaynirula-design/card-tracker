# Design review: Card Tracker

*Apple-design skill review, Oct 29, 2026, of the app after features 1–7 (localhost:3000, Next.js + Tailwind). Review only: the fixes go in one redesign PR after features 8–10.*

**What applies:** this is a web app, so Apple's design principles and foundations apply fully (accessibility, color, typography, layout, writing). iOS component conventions (tab bars, sheets, alerts, search) apply as design principles, translated to web. Contrast numbers are computed from the real color tokens in `app/globals.css`, not estimated from screenshots.

### Summary

**Rating: Critical issues**, all of them small, cheap fixes. The structure is strong and genuinely iOS-native: grouped lists, a large-title hierarchy, a tab bar that becomes a sidebar, sheets with Cancel/Done, and a native "are you sure?" alert. The critical items are contrast in **light mode** (secondary text is 3.3:1, needs 4.5:1), **color-only meaning** on the card detail page, and **white text on teal buttons in dark mode** (3.2:1).

**Thesis:** "Use the right card, and see what your cards really earn." The design delivers it as a quiet, well-made utility, but nothing on screen is yet *the* moment people would remember. Missed rewards (feature 9) is the natural candidate.

---

### Critical

**C1. Secondary text fails contrast in light mode.**
- **What:** `--label-secondary` = rgb(60 60 67 / 0.6) is **3.44:1** on white and **3.29:1** on the #F2F2F7 background, used at 13–17 px for dates, subtitles, card/category lines, section headers, footers, and "on $150.00 of spending". The search placeholder on its gray field is **3.24:1**. Dark mode passes (5.94:1).
- **Why:** `accessibility.md › Vision`: "Strive to meet color contrast minimum standards… Up to 17 pts: 4.5:1." (This is Apple's own secondaryLabel value, which Apple relies on Increase Contrast to fix. A web page doesn't get that system boost, so it has to pass on its own.)
- **Fix:** light `--label-secondary` → **rgb(60 60 67 / 0.75)**, giving 5.15:1 on white, 4.82:1 on background, and 4.75:1 on the search field. Leave dark as is.

**C2. "Gray rates come from Everything Else" is color-only, and too faint.**
- **What:** on a card's detail page, fallback rates use `--label-tertiary`: **1.74:1** in light mode and **2.48:1** in dark. The only thing separating "own rate" from "fallback" is that gray.
- **Why:** `color.md › Inclusive color`: "Avoid relying solely on color to differentiate between objects… or communicate essential information." Contrast as in C1.
- **Fix:** show fallback rates in `--label-secondary` with a word, e.g. "1× · base", and drop the color-only legend from the footer. Bonus rates stay bold.

**C3. White on teal filled buttons in dark mode is 3.19:1.**
- **What:** "Create account", "Add a card", and "Add a purchase" are 17 px semibold white on #00A19C. Semibold isn't bold, so the 4.5:1 rule applies. Light mode is fine (5.06:1).
- **Why:** `accessibility.md › Vision` (table above).
- **Fix:** add a token `--accent-fill`: **#007C77 in both modes**, which gives white text 5.06:1. Keep #00A19C for teal text and icons on dark surfaces, where it reads 5.33:1.

---

### Improvements

**I1. High: text can't grow with the reader's text-size setting.**
- **What:** every size is fixed pixels (`text-[17px]` ×35, `[15px]` ×18, `[13px]` ×10, …), so a browser or phone text-size setting has no effect. Only pinch-zoom works.
- **Why:** `accessibility.md › Vision`: "give people the option to enlarge text by at least 200 percent"; `layout.md › Adaptability`: "Be prepared for text-size changes."
- **Fix:** convert type to `rem` (17 px = 1.0625rem). On iOS Safari, set `html { font: -apple-system-body }` so 1rem follows Dynamic Type. Then check that rows wrap instead of clipping at 200%.

**I2. High: the top bar feels like a website on a phone.**
- **What:** every signed-in screen starts with a 56 px branded bar (logo + "Card Tracker" + 3-way theme switch + account icon), then the page's own large title. iOS apps don't repeat the app name above content.
- **Why:** `branding.md`, via the skill's craft lens: "branding defers to content"; `designing-for-ios.md › Best practices`: "limiting the number of onscreen controls."
- **Fix:** on signed-in phone screens, drop the bar. Put a round account button at the trailing end of the large-title row, like the App Store and Music. Keep the bar on the signed-out welcome, login, and sign-up pages.

**I3. Medium: the Light/Dark switch is an app-level appearance setting.**
- **What:** a System / Light / Dark control sits in the header on every screen.
- **Why:** `dark-mode.md › Best practices`: "Avoid offering an app-specific appearance setting… they may think your app is broken because it doesn't respond to their systemwide appearance choice."
- **Trade-off:** you asked for the option, so keep it, but move it from the header into **Account › Appearance** (default System). It stays available without cluttering every screen. This pairs with I2.

**I4. Medium: teal means two things.**
- **What:** teal marks everything you can tap (buttons, links, the active tab, filled stars), *and* it highlights data (bonus rates, "$3.00 earned", "Rewards earned").
- **Why:** `color.md › Best practices`: "Avoid using the same color to mean different things."
- **Fix:** pick one meaning. Recommended: **teal = tappable**; money and rates you earn are shown in label color, semibold. (The alternative, teal = money, would need a neutral tint for controls, which feels less like iOS.)

**I5. Medium: the light-mode tinted pills are 4.28:1.**
- **What:** the "+ Add" pill and the active filter pills use #007C77 on accent-soft at 15 px.
- **Fix:** light `--accent` → **#00716C**: 5.87:1 on white, 5.26:1 on background, 4.92:1 on the tint, and still recognizably the prototype's teal. In dark mode, the alert's "Cancel" (#00A19C on #2C2C2E) is **4.37:1**; use **#00B0AA** for teal text on raised surfaces (5.17:1).

**I6. Medium: tap targets below 44 pt.**
- **What:** the account button is 32 px, row stars are 40 px, filter pills are 32 px tall, and the theme switch segments are 28 px. The Cancel / Add / Done text buttons in sheets have about 24 px of height.
- **Why:** `accessibility.md › Mobility`: "Default control size 44x44 pt, minimum 28x28 pt."
- **Fix:** extend hit areas to 44 px without changing the look (padding or a `::before` hit box): `size-11` stars, `min-h-11` on the sheet bar buttons, and a 44 px account button.

**I7. Medium: delete confirmations should be an action sheet on iPhone.**
- **What:** deleting uses a centered alert.
- **Why:** `alerts.md › Mobile (iOS, iPadOS)`: "Use an action sheet — not an alert — to offer choices related to an intentional action."
- **Fix:** on phone widths, present the same dialog anchored to the bottom, with the red "Delete Purchase" on top and "Cancel" below, like Mail and Photos. Keep the centered alert on wide screens. The Cancel-focused default stays.

**I8. Medium: add/edit screens don't behave like sheets.**
- **What:** they slide up like sheets, but the tab bar stays live underneath. Tapping a tab mid-edit silently drops what you typed.
- **Why:** `tab-bars.md › Best practices`: the tab bar is hidden only "when a modal view covers the tab bar"; `sheets.md › Mobile`: "If people have unsaved changes… let them confirm."
- **Fix:** hide the tab bar on `/new` and `/edit` routes, and confirm "Discard changes?" on Cancel when the form is dirty.

**I9. Medium: dropdowns lose their keyboard focus ring.**
- **What:** the purchase form's Category/Card selects use `outline-none` with no replacement, so keyboard users can't see where they are.
- **Why:** `accessibility.md › Speech`: "Let people use the keyboard alone to navigate."
- **Fix:** `focus-visible:ring-2 ring-accent` on the select's row. Check the same for the auth and search inputs.

**I10. Medium: capitalization is mixed.**
- **What:** title case in "Delete Card", "New Purchase", and "This Month", but sentence case in "Create account", "Add a card", "Log out", and "Go home".
- **Why:** `writing.md › Best practices`: "Adopt capitalization rules… then apply them consistently."
- **Fix:** Apple uses title case for buttons and titles: **Create Account, Add a Card, Add a Purchase, Log Out, Log In, Go Home**.

**I11. Low: active tab icons should fill.**
- **What:** the selected tab only changes color.
- **Why:** `tab-bars.md › Best practices` (SF Symbols guidance); the skill's Lens 2: "filled symbols preferred."
- **Fix:** filled variants of the receipt, star, chart, and card icons for the active tab. This also stops relying on color alone to show the current tab.

**I12. Low: tab labels are 10 px.**
- **Why:** `accessibility.md › Vision`: iOS minimum 11 pt.
- **Fix:** 11 px.

**I13. Low: translucent bars ignore Reduce Transparency.**
- **What:** the header and tab bar blur (correctly placed on the functional layer, per `liquid-glass.md`), but nothing answers `prefers-reduced-transparency`.
- **Fix:** an `@media (prefers-reduced-transparency: reduce)` rule that makes the bars solid `--background`.

**I14. Low: the filter pill row is cut off.**
- **What:** on a 375 px phone, the third pill ("Newest first") is cut off with no hint the row scrolls.
- **Fix:** a short fade on the trailing edge, or move Sort into a trailing "↑↓" button in the large-title row.

---

### Craft notes

- **Medium: point of view.** Today the app reads as a faithful iOS Settings/Wallet clone, with nothing yet unmistakably *Card Tracker*. A quiet utility is a fine answer, but this product has a natural signature: **the gap between what you earned and what you could have earned**. Make Missed rewards (feature 9) the one bold moment: a single large figure on the dashboard ("You left $4.20 on the table this month"), with everything around it quiet.
- **Medium: remove one accessory.** Every row on the Cards tab has the same teal card icon, which carries no information. Replace it with something true to each card, like a small card-shaped swatch showing the reward type (¢ for cash back, ✦ for points), or drop it.
- **Low: the dashboard hero.** A big number over a small label is a common template, but here it's earned: it follows the Health app, and the number is the answer people came for. Keep it, and give the chart a one-line takeaway (`charts.md › Descriptive content`: "Summarize the main message"), e.g. "Test Cash Back earned the most."

---

### What works (keep these)

- **Navigation:** a 3–4 word tab bar that becomes a sidebar on wide screens (`layout.md › Size classes`), the tab bar kept visible across sections, and "‹ Purchases" back links.
- **Sheets:** Cancel on the leading side, the title centered, Add/Done on the trailing side (`sheets.md › Best practices`: "Provide an alternative to the Done button").
- **Alerts:** a specific title ("Delete "Test card"?"), a "Cancel" that's focused by default, and an explanation of the consequence (`alerts.md › Buttons`).
- **Search:** inline above the list it filters, searching as you type, filters in the address bar (`search-fields.md`: "start search immediately", "Place search as an inline field…").
- **Errors and empty states:** errors appear next to the field, say how to fix the problem, and never blame. Every empty screen offers a next step (`writing.md › Best practices`).
- **Category colors** are always paired with the category name, never alone.
- **Chart:** bars start at zero, there are no gridlines, values are labeled, and there's a screen-reader summary (`charts.md › Axes`, `› Make every chart accessible`).
- **Reduce Motion** is respected app-wide, and blur is limited to the floating bars.

### Platform notes

- **Phone:** I2, I6, I7, and I8 do the most to make it feel like an iPhone app in the demo.
- **Desktop:** the sidebar is good. Add visible focus everywhere (I9), and hover states already exist.
- **Suggested order for the redesign PR:** C1–C3 (tokens only, about 10 lines of CSS), then I1, I9, and I6 (accessibility), then I2, I3, I7, I8, and I10 (conventions), then I4, I11, the craft notes, and the rest.
