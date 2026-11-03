---
name: Business Breakfast Hub
description: Espresso black, warm gold and cream. Elegant and casual, like the café at 6 AM with the lights on.
colors:
  night: "#0d0c0a"
  coal: "#15130f"
  coal-2: "#1e1b16"
  coal-3: "#2a261f"
  cream: "#f4efe4"
  mute: "#a39c8e"
  faint: "#6f695e"
  gold: "#e6bf5e"
  gold-deep: "#c9a043"
  gold-soft: "#e6bf5e1f"
  ink: "#15120c"
  rust: "#ef8a72"
  sage: "#9cc49a"
typography:
  display-1: { fontFamily: "Barlow Condensed", fontSize: "clamp(3.25rem, 9vw, 7.5rem)", fontWeight: 700, lineHeight: 0.88, textTransform: uppercase }
  display-2: { fontFamily: "Barlow Condensed", fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", fontWeight: 700, lineHeight: 0.92, textTransform: uppercase }
  display-3: { fontFamily: "Barlow Condensed", fontSize: "2.25rem", fontWeight: 700, lineHeight: 1, textTransform: uppercase }
  serif-1: { fontFamily: "Cormorant Garamond", fontSize: "clamp(2.25rem, 4vw, 3rem)", fontWeight: 500, lineHeight: 1.05 }
  serif-2: { fontFamily: "Cormorant Garamond", fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.15 }
  serif-3: { fontFamily: "Cormorant Garamond", fontSize: "1.375rem", fontWeight: 600, lineHeight: 1.2 }
  body: { fontFamily: "Geist Variable", sizes: "18 / 16 / 14px", fontWeight: 400 }
  title: { fontFamily: "Geist Variable", sizes: "18 / 16 / 14px", fontWeight: 500 }
  label: { fontFamily: "Geist Variable", fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em", textTransform: uppercase }
  numerals: { fontFamily: "Geist Mono Variable" }
rounded:
  focus: "6px"
  field: "12px"
  card: "24px"
  band: "32px"
  pill: "9999px"
---

# Design System: Business Breakfast Hub

## North star: "Lights on at 6 AM"

Taken from BBH's own app and venue posts: a black room, warm gold, and big condensed caps that say the day ("FRIDAY"). The site adds one thing for elegance: a serif for names, the names of hubs and of people, echoing the venue wordmarks. Gold stays an accent: the primary button, the weekday, the next hub, one closing band.

## Colour
- **Night** is the page. **Coal → coal 3** are surfaces, hover and pressed/tracks.
- **Cream** is primary type (17:1), **mute** secondary (7.4:1), **faint** only for decoration and fine print.
- **Gold** is the accent and the one primary button per screen (ink text on it). **Gold deep** is its hover; **gold soft** a wash for the selected hub and today.
- **Rust** is errors, **sage** is "coming".
- One radial lamp glow at the top of hero pages, and a 5% film grain over everything. No other gradients.

## Type
- **Display (Barlow Condensed 700, caps):** headlines and weekdays. The second half of a headline goes gold.
- **Serif (Cormorant Garamond):** hub names, member names, greetings. Never for running text.
- **Geist:** everything else. **Geist Mono** for times, counts and member numbers.
- **Label:** 12px tracked caps in gold for section labels inside forms and panels.
- Plain copy: sentence case, no italics.

## Shape and depth
Pills for buttons and chips, 12px fields, 24px cards, 32px bands. Surfaces are coal with a 7% cream hairline, a 4% inner top highlight and a long black shadow. The card has a second gold hairline inset like a letterpress border.

## Components
- **Buttons:** gold pill (one per screen), hairline line pill for the rest, 44px min height, scale 0.97 on press.
- **Hub card:** weekday in gold display, time in mono, hub name in serif, venue with a pin, "Join …" with a sliding arrow. "Next up" carries a pulsing gold dot.
- **Week strip:** Monday to Friday, each hub on its day, today washed gold; stacks to rows on phones.
- **Deal voucher:** big gold value, a dashed tear line with notches, the member business and expiry.
- **Digital card:** 1.66:1, front identity / back QR on a cream plate (dark on light scans best). Flips on a 700ms ease-in-out; tilts toward a mouse on a spring; reduced motion swaps the flip for a crossfade and drops the tilt.
- **Fields:** night fill, cream hairline, gold on focus, rust when invalid, error text below.
- **Admin:** stat strip with rolling numbers, tabs with a sliding gold underline, hairline lists, 4px gold bars for proportions.

## Motion
Ease out `cubic-bezier(0.23, 1, 0.32, 1)` for entrances, ease in out `cubic-bezier(0.77, 0, 0.175, 1)` for the card flip. Hero lines rise with a slight blur, staggered 90ms; lists stagger 50ms. Hover is gated to fine pointers. Everything respects reduced motion.

## Don't
- Don't put gold on large text blocks or scatter it as tints.
- Don't use the serif for paragraphs, or the condensed face below 2rem.
- Don't invent BBH facts: members, deals and attendance are labelled Sample until real.
