---
name: Card Tracker
description: A calm, forest-green money tool. A black bar on top, thin headings on pale sage, answers on white panels.
colors:
  forest: "#1f6b4f"
  forest-deep: "#18563f"
  mint: "#6fcf9f"
  sage: "#eef2ef"
  deep: "#12261d"
  night: "#0b0d0c"
  ink: "#14181a"
  panel: "#ffffff"
  winner: "#1f6b4f"
  on-winner: "#ffffff"
  missed: "#f08a4b"
  missed-ink: "#a8421a"
  danger: "#b4123c"
  field-line: "#7d8a84"
  ground-fg: "#14181a"
  ground-fg-soft: "#4b5751"
  ground-line: "rgb(20 24 26 / 0.16)"
  ground-fill: "rgb(31 107 79 / 0.1)"
  ground-fill-strong: "rgb(31 107 79 / 0.18)"
  land-line: "#dce4df"
  land-fill: "#eef2ef"
  land-fill-strong: "#dfe8e2"
  night-fg: "#ffffff"
  night-fg-soft: "#b9c4be"
  card-sage: "#c5dccf"
  card-sand: "#ead9b8"
  card-lilac: "#d9c9e4"
  card-clay: "#ebc8b8"
  card-olive: "#d5dda9"
  card-rose: "#e8c4cf"
  card-closed: "#c2c7c4"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.25
  body:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  caption:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1
  code:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.06em"
    textTransform: "uppercase"
  figure:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 600
    lineHeight: 1
rounded:
  control: "4px"
  tab: "8px 8px 0 0"
  panel: "12px"
  card-art: "8px"
spacing:
  gutter-phone: "20px"
  gutter-wide: "40px"
  panel-pad-phone: "20px"
  panel-pad-wide: "32px"
  row-min: "56px"
  control: "44px"
---

# Design System: Card Tracker

## Overview

Card Tracker answers one question: which card should I use? The look is a calm fintech tool in forest green. It replaced the "System Map" airline look on Nov 13, 2026 (Issue #55).

It was built from two references the owner chose:

- **A V.ONE landing page.** Pale grey-green ground, a thin airy headline, credit cards tilted on pedestals, and a dark forest band closing the page.
- **DeepBook** (an Awwwards site of the day). A black top bar, flat solid-color blocks, a small colored label above each heading, numbered tabs, and square solid buttons. Its blue was swapped for forest green.

The style and font pairing were checked against the ui-ux-pro-max skill, which matched this product to "Minimalism & Swiss Style" and the "Geometric Modern" pairing (Outfit with Work Sans).

There is one appearance. There is no light/dark switch.

## Colors

The app has three zones. Components use zone tokens (`text-fg`, `bg-fill`, `bg-action`), so the same button works in all three.

| Zone | Class | Background | What sits on it |
|---|---|---|---|
| Ground | (default) | Sage `#eef2ef` | Titles, the category keys, the big percentage, the card art |
| Land | `.land` | White `#ffffff` | Answers, lists, forms |
| Night | `.night` | Black `#0b0d0c`, or dark forest `#12261d` for the footer | The top bar and the footer band |

### One color does the talking

- **Forest `#1f6b4f`** is every action (buttons, links, selected keys, section tabs) and the winning card. White text on it measures 6.4:1.
- **Mint `#6fcf9f`** is forest for dark backgrounds: the logo on the black bar.
- **Orange `#f08a4b`** only ever means missed rewards. As text on white it darkens to `#a8421a`.
- **Red `#b4123c`** is for errors and delete buttons only.

### Card tints

Each card gets one of six soft tints from its id: sage, sand, lilac, clay, olive, rose. Closed cards are grey. Dark ink text passes 4.5:1 on all of them. Forest and orange are left out of the set because they carry meaning.

### Named rules

- **The One Green Rule.** If something is forest green, you can press it or it's the winner. Don't use green for decoration.
- **The Orange Means Missed Rule.** Orange never appears for any other reason.
- **Never color alone.** A winner also says "Use …" in words; missed rewards always show the dollar amount.

## Typography

Two families, both self-hosted through `next/font`:

- **Outfit** for headings, codes and big figures.
- **Work Sans** for everything you read or scan.

| Role | Family | Size | Weight | Use |
|---|---|---|---|---|
| Display | Outfit | 3.5rem | 300 | Home page hero, a purchase's amount |
| Headline | Outfit | 2.25rem | 300 | Screen titles |
| Title | Outfit | 1.75rem | 300 | "Use American Express Gold", dashboard headline |
| Lead | Outfit | 1.25rem | 300 | Form section and dialog headings |
| Body | Work Sans | 1rem | 400, 600 for row titles | Rows, paragraphs |
| Small | Work Sans | 0.875rem | 400–600 | Subtitles, helper text, tabs |
| Caption | Work Sans | 0.6875rem | 600 | Phone tab bar labels |
| Code | Outfit | 0.875rem | 600, uppercase, +0.06em | Card tags (AMG), category keys (DIN) |
| Figure | Outfit | 3.5–4.5rem | 600 | The big "4%" on Best Card |

Sizes are in rem, so they grow with the reader's text size.

### Named rules

- **Thin Words, Bold Numbers.** Headings are weight 300. Numbers that answer the question (4%, $4.79) are 600 or bolder.
- **The Eyebrow.** A small forest-green label can sit above a title to name the section ("Best card"). Use it only when the title doesn't already say it.
- Dollar amounts use tabular digits (`.tabular`) so they line up in columns.

## Layout

- **The top bar** is black and runs the full width. It holds the wordmark, the five sections (from 48rem up) and a forest-green Account button.
- **On phones** the five sections move to a white tab bar fixed to the bottom, where a thumb reaches them. Add and edit screens replace both bars with their own Cancel / title / Save bar.
- **The page** is one centered column, up to 48rem wide. Best Card and the home page go up to 72rem and split into two columns from 64rem: the question on the ground, the answer on a panel beside it.
- **Panels end with their content.** A white panel stops after its last item, with 12px corners and a strip of ground below it, so you can always see where the page stops.
- **The footer** is a dark forest band at the very bottom of every page. On phones it leaves room for the tab bar.
- Side gutters are 20px on phones and 40px from 48rem.

### Named rules

- **The Answer Rises Rule.** The question sits on the ground and the answer sits on a white panel.
- **Numbered Tabs.** A section with a heading shows it as a forest tab on a 2px forest rule, numbered 01, 02, … in order down the panel. Sections without a heading get a plain hairline.

## Elevation & Depth

The interface is flat. White panels on sage are separated by color, not shadow. Only two things cast a shadow: the tilted card art (so it looks like it's resting on its pedestal) and the "are you sure?" dialog.

## Shapes

- Controls, tags and keys: 4px corners. Square enough to feel precise.
- Section tabs: 8px on the top corners only.
- Panels and dialogs: 12px.
- Stars and switches are fully round.

## Components

- **Buttons.** Primary is solid forest with white text. Secondary is an outline. Text buttons are underlined. Heights are 44px or 48px.
- **Category keys.** A grid of three-letter codes. The selected key is solid forest; the rest are a pale green fill.
- **Card tags.** A card's three-letter code on its tint. The winner's tag is solid forest with white text. The full name is always beside it.
- **Card art.** A forest credit card tilted 12° on a rounded pedestal, drawn with plain shapes in `app/components/card-art.tsx`. It shows the winning card's code and name. It's decoration and hidden from screen readers, because the answer is in words on the panel.
- **Rows.** Plain rows between hairlines, with the value in one right-aligned column. At least 56px tall.
- **Fields.** White boxes with a grey-green outline, a bold label above, and the problem named underneath in red.
- **Filters.** Pills on the ground. A filter that's narrowing the list turns solid forest.
- **Segmented control.** A pale track with the selected option in solid forest.
- **Rewards line** (dashboard). One line to scale: solid forest for what you earned, dashed orange for what you missed, with the numbers in text underneath.
- **Rewards chart** (dashboard). One forest bar per card on a shared scale, under the card's tag, name and amount.
- **Empty state.** A dashed arc with nowhere to land, a thin heading, one sentence, one button.
- **Dialog.** A white panel with the one shadow. Focus starts on the safe choice.

## Do's and Don'ts

### Do

- Keep every text and control at 4.5:1 contrast or better.
- Keep every tap target at least 44px tall.
- Show a visible focus outline on everything you can press.
- Respect the "reduce motion" setting (it turns transitions off).
- Say the answer in words wherever a color or a picture shows it.

### Don't

- Don't add a second accent color.
- Don't use heavy weights for headings.
- Don't put shadows on panels, rows or buttons.
- Don't use emoji as icons.
- Don't stretch a panel to the bottom of the window.
