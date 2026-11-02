---
name: Business Breakfast Hub
description: Yellow ochre and black, casual and grown up, for Cebu's business breakfast table
colors:
  ochre: "#d39b2a"
  ochre-deep: "#a9761a"
  ochre-ink: "#6b480b"
  ochre-soft: "#f1dfb4"
  ink: "#15130f"
  ink-soft: "#514c43"
  coal: "#1d1b17"
  coal-2: "#2b2823"
  paper: "#f5f4ef"
  paper-2: "#eae8e0"
  raised: "#fbfaf7"
  line: "#d9d6cb"
  rust: "#a8321f"
typography:
  heading-1:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
  heading-2:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  heading-3:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.11
    letterSpacing: "-0.03em"
  heading-4:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  heading-5:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "-0.02em"
  heading-6:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  title-2:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.56
  title-4:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  body-3:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-6:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
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
  mark:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
rounded:
  focus: "6px"
  mark: "10px"
  field: "12px"
  card: "16px"
  band: "32px"
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
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.coal-2}"
  button-ochre:
    backgroundColor: "{colors.ochre}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-plain:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "48px"
    padding: "0 12px"
  pill-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  surface:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.card}"
    padding: "16px"
  panel-dark:
    backgroundColor: "{colors.coal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.band}"
    padding: "40px"
---

# Design System: Business Breakfast Hub

## Overview

**Creative North Star: "Ochre Morning, Black Coffee"**

BBH's own colours lead: a deep yellow ochre and black. Ochre carries the big moments (the hero and the closing invitation), black carries the type, the buttons and the dark panels, and a quiet off-white ground sits between them so the page can breathe. The feel is sophisticated and casual, like a good café before opening: unfussy, warm and grown up. It's never cartoony.

The table is still the idea, but it's real. The hero is a top-down photograph of a set breakfast table, with live seat markers placed on the place settings. On `/join` the seat picker is a fine line floor plan of the table. The place card turns over into a black member card.

**Key Characteristics:**
- Big flat fields of yellow ochre with black type on them.
- Black pill buttons for the primary action. On black panels the action becomes an ochre pill.
- Hairline rules and soft, long shadows. No thick borders, no outlines drawn as decoration.
- Geist at weight 500 for headings, Geist Mono for times and counts, and a condensed sans only inside the BBH square mark.
- Real photography, plus fine line drawing where a photo can't work.

## Colors

### Primary
- **Ochre** (#d39b2a): the brand field. Used for the hero, the closing band, open seats, "you" markers and the logo square's line. **Ochre deep** (#a9761a) is the hover on ochre buttons and ochre strokes on paper. **Ochre ink** (#6b480b) is ochre used as text on paper. **Ochre soft** (#f1dfb4) is the Offer tag background.

### Secondary
- **Ink** (#15130f): all type, the primary button, active pills. **Coal** (#1d1b17) and **coal 2** (#2b2823) are the black panels and their hover.

### Neutral
- **Paper** (#f5f4ef) is the page ground. **Paper 2** (#eae8e0) is for hover fills and date blocks. **Raised** (#fbfaf7) is for cards on paper. **Line** (#d9d6cb) is for hairlines. **Ink soft** (#514c43) is secondary text.
- **Rust** (#a8321f) is for errors only.

### Named Rules
**The Brand Field Rule.** Ochre appears as a field (a whole band or section) or as a small signal (open seat, you, the mark). It is never a mid-sized tint scattered around.

**The One Black Button Rule.** Each screen has one primary action, a black pill. On a black panel it inverts to an ochre pill.

## Typography

**Interface font:** Geist Variable. **Numerals:** Geist Mono Variable (times, counts, dates in data, member numbers). **Mark:** Barlow Condensed 600, only inside the BBH square.

### Hierarchy
- **Heading 1 to 5** (500, 60/48/36/30/24px, tracking from -0.04em to -0.02em): page and section headings, balanced wrapping. The second line of a hero heading drops to 60% ink.
- **Heading 6** (600, 20px): small section heads in long text.
- **Title 2 to 4** (500, 18/16/14px): list item titles, nav, labels.
- **Body 3 and 6** (400, 16 and 14px): running text, kept near 65ch.
- **Button lg, md and sm** (500): button labels.
- **Caption 3 and 5** (600 or 400, 12px): tags, metadata, fine print.

### Named Rules
**The Named Style Rule.** Text uses a named style class. Don't set a loose size and weight.

**The Plain Copy Rule.** No hyphens inside sentences, no italics, sentence case.

## Layout

Content sits in a 72rem column with 16px gutters on phones. Sections are separated by 96px, with tight groups inside them. Lists are separated by hairlines, not boxed. The breakfast agenda is a timeline of 2px black rules whose widths match each block's real duration. The ochre hero runs full bleed. The closing band and the dark panels sit inside the column with 32px corners.

## Elevation & Depth

Depth is quiet: cards on paper get a 1px line plus a long soft shadow (`0 18px 40px -24px`). Dark panels get a deeper version. The hero photo carries the strongest shadow, so it reads as an object on the ochre field.

### Shadow Vocabulary
- **Raised** (`0 1px 2px rgb(21 19 15 / .04), 0 18px 40px -24px rgb(21 19 15 / .28)`): cards and tooltips.
- **Panel** (`0 24px 48px -28px rgb(21 19 15 / .6)`): black panels.
- **Photo** (`0 30px 60px -30px rgb(21 19 15 / .45)`): the hero photo.

## Shapes

Pills for buttons, nav, tags and seat markers. 12px corners for fields and tooltips, 16px for cards and the photo, 28 to 32px for bands and panels. The logo is a 10px rounded square drawn in a 2px ochre line.

## Components

### Buttons
- **Primary:** a black pill with paper text. It lifts to coal 2 on hover and scales to 0.97 when pressed.
- **Ochre:** an ochre pill with black text, used only on black panels.
- **Plain:** a 1.5px ink outline pill.
- **Hold button:** an outline pill in the surrounding text colour that fills while held and turns ochre when done. It's for giving up a seat, and it works with Enter and Space.

### Chips
- **Filter and section pills:** a hairline outline. When active they fill solid ink with paper text, with no colour transition, because these change constantly as you scroll.
- **Sample tag:** a hairline pill in the current text colour.

### Cards / Containers
- **Surface:** raised paper, a 1px line, a long soft shadow.
- **Panel dark:** coal with paper text. Used for the board sign, the member card back, the board teaser and the footer.

### Inputs / Fields
A 48px paper field with a 1px line. It turns ink on focus and rust when invalid, with the error text below. The caret is ochre deep, and selects use a custom caret.

### Navigation
A floating paper pill nav carrying the BBH square mark and the full name. On phones it opens a full-height panel.

### Signature: photo table, floor plan, member card
- **Photo table:** a real top-down table photo. Each place setting has a marker: a black initials disc for taken seats, an ochre initials disc for you, and a breathing ochre ring with an "Open" pill for open seats. The photo credit sits under the photo.
- **Floor plan:** a fine line drawing of the table and chairs for picking a seat. Ochre is used only for open seats and for you.
- **Member card:** the place card (raised paper, a dashed fold, an ochre rule, the maker's mark) turns 180° into a coal card with the BBH mark and an ochre seat tag.

## Do's and Don'ts

### Do:
- **Do** let ochre fill whole fields, with black type on them.
- **Do** use real photography of tables, food and people, and credit stand-in photos.
- **Do** use hairlines and space for structure.
- **Do** label every piece of dummy content as Sample.
- **Do** give every interactive element hover, pressed (0.97), visible focus, disabled and error states.

### Don't:
- **Don't** draw cartoon or pop-art illustrations, or use flat icon food.
- **Don't** use gradients on backgrounds or text.
- **Don't** use thick borders, coloured side borders, or hard offset shadows.
- **Don't** use the condensed face outside the BBH mark, or use italics.
- **Don't** put kickers or eyebrow labels above headings.
- **Don't** invent real BBH facts such as fees, venues, how often they meet or member counts.
