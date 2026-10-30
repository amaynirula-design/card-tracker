# Prompts: redesign (Apple design review)

## Prompt 1 (me)

> git clone https://github.com/dickwu/apple-design-skill.git ~/.claude/skills/apple-design. add this skill and redesign this website based on this skill later just saveSave it to memory for now

(The review came first, in `docs/design-review.md`. The redesign waited until the features were done.)

## Prompt 2 (me)

> Merged, go on

## My decisions

Claude Code asked me four things before building, because they change what PLAN.md section 6 says. I picked the recommended option each time:

- **Teal:** change it so everything passes contrast (light #00716C, dark filled buttons #007C77, dark teal text on raised panels #00B0AA).
- **Top bar:** remove it on phones, and move the System / Light / Dark switch to Account.
- **What teal means:** tappable things only. Money and rates use the regular text color.
- **Signature:** make Missed Rewards the one bold moment on the dashboard.

## Prompt 3 (me)

> Logged in

## What Claude Code did

- **The 3 critical fixes:** darker secondary text in light mode, "· base" written next to fallback rates instead of a gray color, and a filled-button teal that white text can pass on.
- **Accessibility:** text sizes are now rem, named after Apple's text styles (`text-body`, `text-footnote`, ...), so they grow with the reader's setting. Tap targets reach 44px, dropdown rows get a focus ring, tab labels are 11px, and the frosted bars go solid with Reduce Transparency on.
- **Feeling like an iPhone app:**
  - Signed-in phone screens start with the page title, with a round account button beside it.
  - Add and edit screens hide the tab bar.
  - Cancel asks "Discard Changes?" if anything changed.
  - Delete is an action sheet on phones and a centered alert on wide screens.
  - Selected tab icons fill in, and buttons and titles use title case.
- **Dashboard:** one large sentence at the top ("You left $1.75 on the table this month.") with the best fix under it, then quieter tiles, then the chart with a one-line takeaway.
- **Removed:** the identical teal icon on every card row, which carried no information.
- **Added:** `SheetBar` replaces three copies of the same bar, and `LargeTitle` holds the title and account button.

## How it was tested

With my account logged in on my local copy, using one temporary card and two temporary purchases that Claude Code deleted afterwards. My real card wasn't changed.

- **Phone size, light and dark:** dashboard, purchases, card detail, and Account.
- **Headline math:** $100 on Dining at 2%, against Sapphire Preferred's 3.75%, showed $1.75 missed.
- **Discard Changes?:** appeared after typing, and Keep Editing kept the form.
- **Delete:** an action sheet at phone size and a centered alert at desktop size, and both deleted the purchase.
- **Theme:** Dark stayed on across pages, and it was set back to System.
- **Tap targets and tab labels:** measured stars and filter dropdowns at 44px, and tab labels at 11px.
- **Contrast:** computed from the real colors, and all of them pass 4.5:1.

## What went wrong / caught along the way

- **The 200% text test found real problems.** The page title ran into the buttons, purchase rows got cramped, and the dashboard tiles pushed the page wider than the phone. Claude Code fixed all three so they wrap. Tab labels are still tight at 200%.
- **That fix caused a problem of its own.** After opening the PR, Claude Code realized the new wrapping could also wrap long values, like my email on Account, at normal size. It had only rechecked at 200%. It loosened the rule and confirmed those rows stay on one line.
- **A wider check found one more overflow.** The Best Card dropdown pushed the page wide at 200%, so Claude Code fixed it. It then checked Best Card, Cards, Add a Card, New Card, New Purchase, Account, and Starred at 200%: none are wider than the phone. Purchases and Dashboard had passed earlier.
- **Skipped on purpose:** the review's iOS Dynamic Type hook. It changes the size of the whole page on iPhones, and Claude Code couldn't test that without a real iPhone.
- **One exception to "teal means tappable":** the chart's bars stay teal, as the one color for data.
- **Not tested:** a real iPhone, the keyboard focus ring on dropdown rows, and Reduce Transparency.
