# Business Breakfast Hub

Website for Business Breakfast Hub (BBH), a community of Cebu business owners who meet over breakfast. Built pro bono by Monset.

- `/` is the landing page: the week at a glance with the next hub live, every hub, member deals, and the digital card.
- `/join` makes your card and puts you in a hub. `/join?hub=la-carne` preselects one; `/join?mode=signin` signs in.
- `/card` is the inner landing after sign in: your digital business card (QR, share, save contact, edit) and "I'm coming this week" for your hub.
- `/c/BBH-0005` is the public card someone opens after scanning a QR.
- `/admin` is for organisers: attendance per hub, the member list (search, filter, CSV export) and members by field of business. Demo login is shown on the page.
- `/privacy` and `/terms` are drafts for BBH to review.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # self-check for accounts, admin role and hub scheduling in src/lib/api.js
npm run build
```

## Where things live

| What | Where |
| --- | --- |
| Hubs (real, from BBH's app), sample members and deals | `src/data/sample.js` |
| Accounts, admin role, attendance, hub schedule (the only file that knows about storage) | `src/lib/api.js` |
| Design tokens (night, gold, cream) and text styles | `src/index.css`, documented in `DESIGN.md` |
| Digital card (QR, vCard), nav, rolling number | `src/components/` |

## Before launch

1. **Real content.** Confirm the hub list (Bakery Soesterberg shows Wednesdays in the app but a Friday post) and replace sample members and deals in `src/data/sample.js`. The UI labels all of it "Sample" until then.
2. **Real accounts.** Accounts currently live in each visitor's browser (localStorage), so they don't sync between devices and anyone can read them in devtools. The admin role and demo admin password are client side too, so anyone can reach `/admin` today. Move `src/lib/api.js` to Supabase (Auth, a `members` table with RLS, admin role in `app_metadata`, a public view for cards). The function names can stay the same, so no page has to change.
3. **Legal.** Have BBH's lawyer review `/privacy` and `/terms`, and name a data protection officer and contact, as the Data Privacy Act asks.
4. **Domain.** After deploying, change `og:image` in `index.html` to the absolute URL (`https://<domain>/og.png`) so Facebook previews show the image.

## Deploy

Import the repo into Vercel. It's detected as Vite, and `vercel.json` rewrites every route to `index.html`.

## Credits

`src/components/AnimatedNumber.jsx` is adapted from VengeanceUI (MIT). QR codes by `uqr` (MIT).
