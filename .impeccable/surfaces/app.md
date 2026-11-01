---
version: 1
slug: "app"
primary_target: "app"
related_targets: []
---

# Card Tracker app shell and every screen

Scope: every screen in app/, visitor mode Operate. Points enthusiasts deciding which card to use, often at a register, on a phone. Signed-in home is the Best Card answer. Constraints: all behavior, validation, data isolation and tests stay; phone-first; 4.5:1 contrast, 200% text, keyboard, meaning never by color alone. Memorable moment: tapping a category and watching the routes swing to new stops on one fixed scale.

## Direction contract

THESIS: Choosing a card is reading a route map: a category is the origin and your cards are destinations, placed by what a dollar earns. It refuses the category default of a balance hero, a card carousel and soft white tiles.

OWN-WORLD: 1960s airline system map and jellybean fleet. Ultramarine #2230C8 ground; #F1F2FB land panels; #0E1240 ink; yellow #FFD21F only for the winning route and its selected origin; orange #FF6B2C only for missed rewards; each card has one fleet color. Archivo with its width axis. Three-letter codes for categories and cards. Thin dashed routes, one thick yellow route. Rates and amounts in one right-aligned column.

STORY: The visitor sees the answer first, trusts it because the math and the scale are visible, then logs purchases and sees what the wrong card cost. They pick a category, use the card, and log it.

FIRST VIEWPORT: Phone, top to bottom: mark and Account row on ground; heading "Which card for dining?"; a grid of nine category codes, selected one yellow; the route map, arcs from origin to stops along a percent axis with the winner's rate large at its apex; a land panel rising from below naming the card to use and ranking the rest; white five-tab bar pinned to the bottom. The primary action is picking a category.

FORM: System Map, the assigned card from the roll, one fixed percent scale per wallet, stops ranked by real earnings. seed:079c5b50085c1803

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
