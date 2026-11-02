# Business Breakfast Hub

Website for Business Breakfast Hub (BBH), a community of Cebu business owners who meet over breakfast. Built pro bono by Monset.

- `/` is the landing page. The breakfast table hero shows who sits where; open seats link to sign up.
- `/join` is "Reserve a seat". You fill in a place card, pick a chair, and the card flips into your member card. `/join?mode=signin` is sign in ("Take your seat").
- `/board` is for members only: the next breakfast, seats open, news, schedule, member features, and asks and offers.
- `/privacy` and `/terms` are drafts for BBH to review.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # self-check for the auth and board logic in src/lib/api.js
npm run build
```

## Where things live

| What | Where |
| --- | --- |
| All sample content (members, schedule, news, posts) | `src/data/sample.js` |
| Accounts, seats and posts (the only file that knows about storage) | `src/lib/api.js` |
| Design tokens (enamel, cobalt, kettle red) and text styles | `src/index.css`, documented in `DESIGN.md` |
| The table, place card, rolling number, hold button | `src/components/` |

## Before launch

1. **Real content.** Replace everything in `src/data/sample.js` with BBH's real schedule, venue, members (with their permission) and news. The UI labels all of it "Sample" until then.
2. **Real accounts.** Accounts currently live in each visitor's browser (localStorage), so they don't sync between devices and anyone can read them in devtools. Move `src/lib/api.js` to Supabase (Auth and a `seats` / `posts` table). The function names can stay the same, so no page has to change.
3. **Legal.** Have BBH's lawyer review `/privacy` and `/terms`, and name a data protection officer and contact, as the Data Privacy Act asks.
4. **Domain.** After deploying, change `og:image` in `index.html` to the absolute URL (`https://<domain>/og.png`) so Facebook previews show the image.

## Deploy

Import the repo into Vercel. It's detected as Vite, and `vercel.json` rewrites every route to `index.html`.

## Credits

`src/components/AnimatedNumber.jsx` is adapted from VengeanceUI (MIT). `src/components/HoldButton.jsx` is adapted from Kokonut UI (MIT, @dorianbaffier).
