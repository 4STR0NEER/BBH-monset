---
name: Business Breakfast Hub
description: Peltre enamelware for Cebu's business breakfast table
colors:
  enamel: "#fbfcfd"
  enamel-shadow: "#eef2f7"
  enamel-line: "#dde4ee"
  cobalt: "#1f3fa3"
  cobalt-deep: "#142b78"
  cobalt-soft: "#c9d4f0"
  ink: "#10192e"
  ink-soft: "#3a4763"
  chip-steel: "#15171c"
  kettle: "#c6361d"
  kettle-deep: "#a42a14"
  celadon: "#5f8f7f"
  kape: "#4a2c1d"
  pandesal: "#c98b4f"
typography:
  heading-1:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  heading-2:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  heading-3:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: "-0.025em"
  heading-4:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title-2:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.56
  body-3:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  caption-5:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  numerals:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.56
rounded:
  field: "12px"
  plate: "16px"
  card: "28px"
  sign: "32px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.kettle}"
    textColor: "{colors.enamel}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.kettle-deep}"
  button-plain:
    backgroundColor: "{colors.enamel}"
    textColor: "{colors.cobalt-deep}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-plain-hover:
    backgroundColor: "{colors.enamel-shadow}"
  input:
    backgroundColor: "{colors.enamel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "48px"
    padding: "0 12px"
  chip-filter-active:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.enamel}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  enamel-plate:
    backgroundColor: "{colors.enamel}"
    rounded: "{rounded.plate}"
    padding: "16px"
  cobalt-sign:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.enamel}"
    rounded: "{rounded.sign}"
    padding: "40px"
---

# Design System: Business Breakfast Hub

## Overview

**Creative North Star: "The Breakfast Table, Fired in Enamel"**

The site is built from peltre, the white enamel mugs and plates with a cobalt rim that sit on every Filipino breakfast table. Every big surface is a piece of that enamelware: cool white glaze, a cobalt rim drawn as a real border, a highlight along the top edge, soft weight underneath, a little speckle fired into the glaze, and the odd chip where bare steel shows. One tomato red, the colour of the enamel kettle, is kept for the single action that matters on each screen.

The table is the interface. The landing hero is a round cobalt table seen from above, with one plate per seat. Signing up fills in a place card that turns over into an enamel member card. On the board, seat counts change by rolling like a counter drum.

**Key Characteristics:**
- Cool white enamel ground (#fbfcfd), never cream.
- Cobalt rims (3px borders) on every major surface, with a cobalt enamel inversion for the important sign.
- Kettle red only on the primary action and on "you" markers (your seat, your initials).
- One typeface, Geist, with Geist Mono only for times, counts and member numbers.
- Speckle and chips are a repeating unit, not one-off decoration.

## Colors

### Primary
- **Cobalt rim** (#1f3fa3): every rim, focus ring and active state, and the table itself. **Cobalt deep** (#142b78) is the outer rim of cobalt surfaces and the colour of strong links. **Cobalt soft** (#c9d4f0) is for hairline dividers and secondary text on cobalt.

### Secondary
- **Kettle red** (#c6361d, pressed #a42a14): the primary button, open seats, your seat, and inline errors.

### Tertiary
- **Celadon** (#5f8f7f): the "Offer" tag on the board only.
- **Pan de sal** (#c98b4f) and **kape** (#4a2c1d): food on the table illustration only. Never used as UI colour.

### Neutral
- **Enamel** (#fbfcfd) is the ground and the plates. **Enamel shadow** (#eef2f7) is glaze in shadow: hover fills, the place card fold, date blocks. **Enamel line** (#dde4ee) is used for inner plate rings.
- **Ink** (#10192e) is body text, a near black tinted cobalt. **Ink soft** (#3a4763) is secondary text and placeholders (at 75%).
- **Chip steel** (#15171c) appears only where enamel has chipped.

### Named Rules
**The One Kettle Rule.** A screen has one kettle red action. Everything else is cobalt or plain enamel.

**The Cool Glaze Rule.** The ground is cool white enamel. Cream, parchment or warm paper grounds break the world.

## Typography

**Body and display font:** Geist Variable (one family, weights 400 to 600).
**Numerals font:** Geist Mono Variable, for times, counts, dates in data and member numbers.

### Hierarchy
- **Heading 1 to 6** (600, 60/48/36/30/24/20px, tracking from -0.035em to 0): page and section headings, balanced wrapping.
- **Title 2 to 4** (500, 18/16/14px): card titles, list item titles, nav items.
- **Body 3 and 6** (400, 16 and 14px, pretty wrapping): running text, capped near 65ch.
- **Button lg, md and sm** (600, 18/16/14px): button labels only.
- **Caption 3 and 5** (600 or 400, 12px): metadata, tags and fine print.

### Named Rules
**The Named Style Rule.** Text uses a named style class (`heading-3`, `body-6`, `caption-3`). Don't set a loose size and weight.

**The Plain Copy Rule.** No hyphens inside sentences and no italics. Use sentence case for headings and buttons.

## Layout

Content sits in a 72rem column with 16px gutters on phones. Sections are separated by 96px. Inside a section, groups are tight (8 to 16px) and the separation between them is generous (48px). There is more space above a heading than below it. Lists are ruled with 2px cobalt soft hairlines instead of being boxed into cards. Two-column sections pair a sticky heading or form with a ruled list on desktop, and stack on phones. The breakfast agenda sizes each block by its real duration.

## Elevation & Depth

Depth comes from the glaze. An enamel surface carries a white inner highlight along its top edge, a faint cobalt inner shade at the bottom, and one soft offset drop shadow (`0 14px 28px -16px`). Cobalt surfaces add a white inner rim line. There are no zero-offset glows and no hard offset block shadows.

### Shadow Vocabulary
- **Glaze** (`inset 0 2px 0 #fff, inset 0 -8px 16px -10px rgb(20 43 120 / .18), 0 14px 28px -16px rgb(16 25 46 / .4)`): every `enamel` surface.
- **Kettle lift** (`0 8px 18px -10px rgb(164 42 20 / .7)`): the primary button.

## Shapes

Shapes are enamelware shapes: round plates, pill-shaped buttons and nav, and rounded rectangles for trays and signs (12px fields, 16px plates, 28px cards, 32px signs). Rims are a full 3px border all the way around, never on one side only. Chips are small irregular steel marks that sit on the right-hand rim of large enamel surfaces, at varied heights.

## Components

### Buttons
- **Primary (kettle):** kettle red enamel pill with a darker rim and an inner highlight. It darkens on hover and scales to 0.97 when pressed.
- **Plain:** an enamel pill with a cobalt rim and cobalt deep text, filling with glaze shadow on hover.
- **Hold button:** a kettle-rimmed pill that fills left to right while held, drains back if released early, and turns solid when done. It's used for giving up a seat. It works with Enter and Space and announces the result.

### Chips
- **Filter and section pills:** a cobalt soft rim. When active (`aria-pressed` or `aria-current`) they fill solid cobalt with enamel text, and only the background animates.
- **Sample tag:** a small cobalt-soft-rimmed pill marking dummy content.

### Cards / Containers
- **Enamel plate:** enamel glaze, cobalt rim, 16 to 28px radius.
- **Cobalt sign:** cobalt enamel with a white inner rim line and speckle. Used for the board's next breakfast and the board teaser.

### Inputs / Fields
A 48px enamel field with a 2px cobalt soft rim. The rim strengthens to cobalt on hover and focus, and to kettle red when invalid. The error text sits below in kettle deep. Selects use a custom cobalt caret. The caret colour is kettle red.

### Navigation
A floating enamel pill that sits off the top edge, with a translucent glaze and a blur behind it. On phones it opens a full-height glaze panel whose links rise in one after another.

### Signature: the table, the place card, the counter
- **Table:** an SVG top-down round cobalt table with a plate and mug per seat. Open seats show a red dashed rim that breathes. Your seat shows red initials.
- **Place card:** the front is a folded card that fills in as you type, with a maker's stamp at the foot. The back is the cobalt member card. It flips 180° on the y axis over 700ms with a strong ease-in-out.
- **Counter:** each digit is a 0 to 9 strip that rolls to its new value.

## Do's and Don'ts

### Do:
- **Do** draw every major surface as enamelware: glaze, a full cobalt rim, the top highlight, and a soft offset shadow.
- **Do** keep kettle red for the single primary action and for "you" markers.
- **Do** set times, counts and member numbers in Geist Mono with tabular numerals.
- **Do** label every piece of dummy content as Sample.
- **Do** give every interactive element hover, pressed (scale 0.97), visible focus, disabled and error states.

### Don't:
- **Don't** use cream, parchment or warm paper grounds.
- **Don't** use gradients on backgrounds or text.
- **Don't** put kickers or eyebrow labels above headings, including uppercase brand lines above names.
- **Don't** put a border on only one side of a card, or use hard offset block shadows.
- **Don't** add a second typeface or use italics.
- **Don't** invent real BBH facts such as fees, venues, how often they meet or member counts.
