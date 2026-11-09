# Share pictures (`public/og/hafiz-{ar,en,tr}.jpg`)

> **Out of date since the 2026-11-09 redesign:** the pictures and `share-card.js` were made from the previous hero
> (the dashboard mock). The hero is now the mushaf page on the green stage (`components/lp/hero.tsx`); point
> `share-card.js` at `.stage` before making new pictures, and give them new file names (WhatsApp caches).

The picture WhatsApp, Telegram, X, LinkedIn and Facebook show under a link to the site (`og:image`, 1200 × 630).
It is the hero itself — the logo, the eyebrow, the headline, the dashboard and the message card — laid out on one
card in each language, so it changes whenever the hero changes. Make them again after such a change:

1. `npm run build` and `npx next start -p 3077`.
2. Open `http://localhost:3077/ar` (then `/en`, `/tr`) in Chrome at 1440 × 900, wait ~3 s for the hero's animations.
3. Paste `share-card.js` into the DevTools console: the page becomes the 1200 × 630 card (`#og-card`).
4. DevTools → the `#og-card` element → "Capture node screenshot" (device toolbar at DPR 1), save as `hafiz-<lang>.png`.
5. Convert (keeps each file far under WhatsApp's ~300 KB limit; they were 67–79 KB):

   ```bash
   node -e "require('sharp')('hafiz-ar.png').jpeg({quality:88,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile('public/og/hafiz-ar.jpg')"
   ```

Link previews are cached by every app (WhatsApp for days): after changing a picture, give it a new file name
(e.g. `hafiz-ar-2.jpg`, and update `shareImagePath` in `lib/seo.ts`) so people see the new one at once.
