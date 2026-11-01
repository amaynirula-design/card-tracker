---
name: Card Tracker
description: A 1960s airline system map for your wallet. Pick a category and read which card wins.
colors:
  ultramarine: "#2230c8"
  ultramarine-deep: "#1a269f"
  pale-land: "#f1f2fb"
  ink: "#0e1240"
  panel: "#ffffff"
  winner: "#ffd21f"
  missed: "#ff6b2c"
  missed-ink: "#a83a08"
  danger: "#b4123c"
  field-line: "#6b70a0"
  ground-fg: "#ffffff"
  ground-fg-soft: "#d4d8ff"
  ground-line: "rgb(255 255 255 / 0.28)"
  ground-fill: "rgb(255 255 255 / 0.14)"
  ground-fill-strong: "rgb(255 255 255 / 0.24)"
  ground-action-hover: "#e3e6f7"
  land-fg-soft: "#3a3f6b"
  land-line: "#c9cdea"
  land-fill: "#e3e6f7"
  land-fill-strong: "#d3d7f0"
  fleet-teal: "#25d6c8"
  fleet-pink: "#ff8fc4"
  fleet-lime: "#a8e05f"
  fleet-lilac: "#c9a8ff"
  fleet-sky: "#6fc8ff"
  fleet-mist: "#d9deff"
  fleet-closed: "#a6a9c4"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.375
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.375
  code:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 115"
  code-key:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 115"
  caption:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1
    fontVariation: "'wdth' 88"
rounded:
  thumb: "4px"
  tag: "5px"
  control: "6px"
  key: "7px"
  panel: "20px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  gutter: "20px"
  section: "36px"
  gutter-wide: "40px"
components:
  button-primary-ground:
    backgroundColor: "{colors.ground-fg}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-primary-ground-hover:
    backgroundColor: "{colors.ground-action-hover}"
  button-primary-land:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.ground-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-primary-land-hover:
    backgroundColor: "{colors.ultramarine-deep}"
  button-secondary-land:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-secondary-land-hover:
    backgroundColor: "{colors.land-fill}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.ground-fg}"
    rounded: "{rounded.control}"
    height: "48px"
  category-key:
    backgroundColor: "{colors.ground-fill}"
    textColor: "{colors.ground-fg}"
    typography: "{typography.code-key}"
    rounded: "{rounded.key}"
    height: "44px"
  category-key-hover:
    backgroundColor: "{colors.ground-fill-strong}"
  category-key-selected:
    backgroundColor: "{colors.winner}"
    textColor: "{colors.ink}"
    typography: "{typography.code-key}"
    rounded: "{rounded.key}"
    height: "44px"
  card-tag:
    backgroundColor: "{colors.fleet-lime}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.tag}"
    padding: "0 6px"
    height: "28px"
  card-tag-winner:
    backgroundColor: "{colors.winner}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.tag}"
    padding: "0 6px"
    height: "28px"
  category-tag:
    backgroundColor: "{colors.land-fill}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.tag}"
    padding: "0 6px"
    height: "28px"
  missed-amount-tag:
    backgroundColor: "{colors.missed}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "0 6px"
  land-panel:
    backgroundColor: "{colors.pale-land}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "48px"
  segmented-option-selected-ground:
    backgroundColor: "{colors.ground-fg}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.thumb}"
    padding: "0 12px"
    height: "36px"
  tab-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.land-fg-soft}"
    typography: "{typography.caption}"
  tab-bar-active:
    textColor: "{colors.ultramarine}"
---

# Design System: Card Tracker

## Overview

**Creative North Star: "The System Map"**

Choosing a card is reading a route map. A category is the origin, your cards are destinations, and how far along the line a card sits is what a dollar earns there. The world is a 1960s airline system map and its jellybean fleet: a saturated ultramarine ground, pale land rising from below, one thick yellow route, thin dashed routes in fleet colors, and three-letter codes in place of logos.

The system has two zones and they do different jobs. The ground carries the question, the map, and the headline numbers; land carries the answer, the lists, and the forms. Every screen is built this way, from Best Card to the add-purchase form. Density is that of a timetable: plain rows between thin rules, one right-aligned column of figures, no cards inside cards.

The world refuses its category's default: a balance hero, a card carousel, and soft white tiles. It must not look like a bank, and there is a single appearance, with no dark mode and no theme switch.

**Key Characteristics:**
- Two zones, ground and land, set by one class that overrides the color variables
- One fixed percent scale per wallet, so routes move and the ruler stays put
- Two colors with exactly one meaning each: yellow wins, orange was missed
- Three-letter codes as the only identity a card or category has
- One family, Archivo, spoken at three widths
- Phone-first, flat, and answer-first

## Colors

A loud blue field, a quiet pale panel, and a small set of colors that each mean something specific.

### Primary
- **Ultramarine Ground** (#2230c8): The default page, the browser bar, the desktop rail, and the sticky sheet bar. On land it becomes the action color, for primary buttons, links, active stars, chart bars, and focus outlines.
- **Deep Ultramarine** (#1a269f): Hover state of land's primary action.

### Secondary
- **Pale Land** (#f1f2fb): The panels that rise from the ground and hold answers, lists, forms, and dialogs. Land is never white, which keeps inputs and the tab bar distinct from it.
- **Timetable Ink** (#0e1240): Text on land, inputs, every colored tag, and the selected category key. It is the only text color allowed on a fleet, yellow, or orange fill.

### Tertiary
- **Winning Yellow** (#ffd21f): The winning route, its stop, its rate, its code, its tag, and the selected origin key.
- **Missed Orange** (#ff6b2c): Missed rewards, as a fill or a line. The dashed end of the rewards route, its final stop, the amount tag on the ground, and the dot on a purchase's detail row.
- **Missed Ink** (#a83a08): The same meaning darkened to read as text on land, at 5.7:1.
- **Fleet** (teal #25d6c8, pink #ff8fc4, lime #a8e05f, lilac #c9a8ff, sky #6fc8ff, mist #d9deff): Each card's livery, assigned from its id so there is nothing to set up and a card keeps its color. Used for its dashed route, its stop, and its tag. All six carry ink text at 8.4:1 or better and stand off the ground at 3:1 or better.
- **Closed Grey** (#a6a9c4): The livery of a closed card.

### Neutral
- **Ground Text** (#ffffff) and **Ground Soft** (#d4d8ff): Primary and secondary text on ultramarine, at 9:1 and 6.5:1.
- **Ground Line** (white at 28%), **Ground Fill** (white at 14%), and **Ground Fill Strong** (white at 24%): The axis, unselected keys, and their hover, always translucent so the blue stays in them.
- **Land Soft** (#3a3f6b): Secondary text on land and on the white tab bar, at 8.9:1 or better.
- **Land Rule** (#c9cdea): The thin rules between rows.
- **Land Fill** (#e3e6f7) and **Land Fill Strong** (#d3d7f0): Row hover, category tags, segmented tracks.
- **Field Line** (#6b70a0): Borders of inputs and the switch.
- **Panel White** (#ffffff): Input backgrounds, the switch track, the phone tab bar, and the active item in the wide rail.
- **Danger Red** (#b4123c): Delete actions, invalid fields, and error messages. It lives on land only, where it reads at 6:1; it does not clear contrast on ultramarine.

### Named Rules

**The One Yellow Rule.** Yellow means the winning route and its selected origin, and nothing else. In practice that is the winner's route, stop, rate, code, and tag, plus the selected category key. The logo qualifies because it is a drawn winning route. The map's origin dot and code stay white. Never use yellow for a highlight, a badge, a star, or a primary button.

**The One Orange Rule.** Orange means missed rewards, and nothing else. It is never an alert, a warning, or a call to action; those are Danger Red's job or nobody's.

**The Orange Legibility Rule.** Orange never appears as bare text, because the raw value reads at 2.6:1 on land and 3.2:1 on the ground. On land, orange text is Missed Ink. On the ground, an orange amount sits in an orange tag with ink text.

**The Livery Rule.** Yellow and orange are not in the fleet. Fleet colors identify a card and carry no value judgment, so no fleet color may suggest better or worse.

**The Words Too Rule.** Color never carries meaning alone. Every map has a ranked text list beside it, the winner is also thicker and solid, and missed amounts are always written out.

## Typography

**Display Font:** Archivo (with system-ui, sans-serif)
**Body Font:** Archivo
**Label/Mono Font:** Archivo, at its width axis

**Character:** One grotesque stretched wide and heavy for headings and codes, like the lettering on an airline tail, and left at normal width to read plainly in rows. The width axis does the work a second typeface would.

### Hierarchy
- **Display** (800, wide, 3rem, 1): The purchase amount on its detail screen. Used nowhere else.
- **Headline** (800, wide, 2rem, 1.05): Every screen title, on the ground.
- **Title** (800, wide, 1.75rem, 1.1 to 1.15): The answer on land ("Use American Express Gold") and the missed-rewards sentence on the dashboard.
- **Lead** (800, wide, 1.25rem): Form section headers, dialog titles, empty-state titles, and dashboard stat values, the last at normal width.
- **Body** (400, 1rem, 1.5): Default reading text. Row titles use weight 600.
- **Small** (400, 0.875rem, 1.375): Row subtitles, footers, and notes.
- **Label** (700, 0.875rem, 1.375): Field labels, list headers, and buttons, in sentence case.
- **Code** (800, extra wide, 0.875rem, 0.06em, uppercase): Tags and the wordmark. Category keys step up to 0.9375rem.
- **Caption** (600, narrow, 0.6875rem): Phone tab labels only, narrowed so five fit.

All sizes are rem so text scales to 200%. Tracking on headings is -0.025em.

### Named Rules

**The Width Rule.** Width carries voice: wide for headings, extra wide for codes, narrow only where space is tight. Do not add a second family.

**The Sentence Case Rule.** The only uppercase in the system is a code. Labels and headers stay in sentence case, and no eyebrow sits above a heading.

**The Timetable Rule.** Rates and amounts use tabular figures and sit in one right-aligned column, so they line up down the whole screen.

## Layout

On phones the page is a single stack: a 56px top row with the wordmark and Account on the ground, the title block, then a land panel running to the bottom of the page with its last 112px kept clear of the tab bar. Side gutters are 20px.

From 48rem the top row and tab bar become one 224px ultramarine rail on the left. Gutters grow to 40px, the title block caps at 48rem, and land caps at 44rem. From 64rem Best Card splits into two columns: the map on the ground, and a full-height land column of up to 28rem against the right edge. The category keys hold one row of nine from 80rem.

Spacing is a 4px base. Rows get a 56px minimum height with 10px vertical padding and 12px gaps; major blocks are separated by 36px. Every tap target is at least 44px. At large text sizes titles and trailing values wrap rather than truncate.

Add and edit screens replace the phone navigation with a sticky sheet bar, so saving stays within reach of a long form.

### Named Rules

**The Answer Rises Rule.** The question sits on the ground and the answer sits on land. A new screen's title, lead, and map go on ultramarine; its lists and forms go on a land panel.

**The Fixed Scale Rule.** The map's percent axis is set once per wallet and does not change between categories. Motion means a card moved, never that the ruler did.

## Elevation & Depth

Flat. Depth comes from the two zones: land reads as a sheet lying over the ground, with no shadow, no blur, and no gradient. Row separation is a thin rule, not a surface.

### Shadow Vocabulary
- **Dialog lift** (`box-shadow: 0 12px 32px rgb(14 18 64 / 0.35)`): The one shadow in the system, on confirmation dialogs, over an ink scrim at 60%.

### Named Rules

**The One Shadow Rule.** Only a dialog leaves the map. Anything in the page stays flat and uses zones and rules for hierarchy.

## Shapes

Small, firm radii on anything you press, and one large radius for land. Tags are 5px, controls 6px, category keys 7px, and a segmented control's inner thumb 4px. Land panels and dialogs take 20px; land rounds only its top corners when it meets the bottom of the page. Stars and switches are fully round.

The recurring geometry is the route: a parabolic arc from a stop to a stop with round caps. It is the logo (one solid arc), the map, the empty state (a dashed arc to a hollow stop), and, flattened into a line, the rewards route on the dashboard. Icons are 24px-grid line drawings at a 2px stroke with round caps, and fill in when their tab is active.

## Components

Components read their colors from the zone they sit in, so the same button works on both.

### Buttons
- **Shape:** Firm corners (6px). 44px tall at 0.875rem, or 48px tall at 1rem for a screen's main action.
- **Primary:** The zone's action color: white with ink text on the ground, ultramarine with white text on land.
- **Hover / Focus:** A 150ms color shift to the zone's hover value. Focus is a 2px outline offset by 2px in the zone's focus color. Disabled drops to 50%.
- **Secondary:** A 1px outline in the current text color, filling with the zone's fill on hover.
- **Text:** Underlined at 1px, thickening to 2px on hover.
- **Danger:** Solid red with white text for confirming a delete; on the Account screen, a red outline that fills on hover.

### Chips
- **Category key:** A 44px code on ground fill, in a nine-key grid. Selected is yellow with ink text. It is the screen's primary action, and it changes the map in place with no trip to the server.
- **Code tags:** 28px tall and at least 56px wide, centered code in ink on the card's fleet color. The winner's tag is yellow. Category tags use the zone's fill. The full name is always beside a tag, so tags are hidden from screen readers.

### Cards / Containers
- **Land panel:** The one container. 20px top corners, 20px padding on phones and 32px from 48rem.
- **Rows:** Plain rows between thin rules on land, in the order tag, title and subtitle, trailing value, chevron if it links. Never wrap a row in its own tile.

### Inputs / Fields
- **Style:** White fill, ink text, a 1px field-line border, 6px corners, 48px tall, with a bold label above the box. They stay white in both zones, including search on the ground.
- **Focus:** The standard 2px offset outline.
- **Error:** Border and label turn red, and the message is written under its section.
- **Switch:** 46 by 28px, with a thumb that slides on the shared ease-out.

### Navigation
- **Phone:** A white five-tab bar pinned to the bottom, with a 1px rule above it. Tabs are a 24px icon over a caption; the active tab is ultramarine with a filled icon. Best Card comes first.
- **Wide:** The left rail on the ground. Items are 0.875rem at normal width; the active item is a white pill with ultramarine text, and Account sits at the bottom.

### Segmented Control
A filled track with 4px padding and 36px options. The selected option takes the zone's action color.

### Dialog
A land panel with the one shadow, rising 12px over 200ms. Centered on wide screens and at the bottom of the screen on phones, so the buttons sit under a thumb. Focus starts on the safe choice.

### Route Map
The signature. An SVG on the ground, drawn on a 390 by 250 grid, with routes flying from a white origin stop on the left along a percent axis. The winner is a 6px solid yellow arc with a 9px-radius stop, its rate written at 38 units in wide extrabold at the apex. Every other route is a 2.5px dashed arc (3 on, 7 off, round caps) in fleet color, with a 6px-radius stop, drawn beneath the winner. Codes sit below the axis on two rows so close stops do not collide. On a new category, routes swing to their new stops over 420ms on an exponential ease-out, tweened by hand because Safari cannot animate path shapes in CSS. Reduce Motion makes this instant. Each route keeps its identity through the move.

### Rewards Route
The dashboard's headline. One route to scale, on the ground: solid white for what was earned, dashed orange for what was missed, with an orange final stop only when something was missed. The amounts are written underneath.

### Rewards Chart
One Recharts bar per row. Each card gets a row with its tag, name, and amount, and its own 8px bar directly underneath, so a long name can wrap and the row just grows. All bars share one scale from zero set by the top earner, in the zone's action color with 2px corners, and do not animate.

### Empty State
A dashed route with nowhere to go yet, a lead title, one line of text, and the next step as a button.

## Do's and Don'ts

### Do:
- **Do** set a zone with the land class, and read colors from the zone's variables (text, soft text, line, fill, action, focus) so a component works on both ground and land.
- **Do** put the question on the ground and the answer on land.
- **Do** take every card code from `cardCodes` in `lib/card-codes.ts`, so presets keep fixed codes and every code is unique in a wallet.
- **Do** give every card one fleet color through `cardColor` in `lib/card-colors.ts`, and use ink text on it.
- **Do** write every value in text beside any map, route, or chart.
- **Do** use Missed Ink for orange text on land, and an orange tag with ink text on the ground.
- **Do** keep rates and amounts tabular and right-aligned in one column.
- **Do** keep routes on one fixed scale, with one thick solid winner and thin dashed others.
- **Do** honor Reduce Motion in anything hand-animated, as the route tween does.

### Don't:
- **Don't** use yellow for anything except the winning route and its selected origin.
- **Don't** use orange for anything except missed rewards.
- **Don't** use raw Missed Orange as text in either zone.
- **Don't** add yellow or orange to the fleet.
- **Don't** build a balance hero, a card carousel, or soft white tiles.
- **Don't** make it look like a bank, and don't use issuer logos.
- **Don't** add a dark mode or a theme switch. There is one appearance.
- **Don't** add a second typeface. Use Archivo's width axis.
- **Don't** add page shadows, decorative gradients, or blur. The dialog holds the only shadow.
- **Don't** set uppercase on anything but a code, or put an eyebrow above a heading.
- **Don't** let the percent axis rescale between categories.
- **Don't** put Danger Red on the ground.
