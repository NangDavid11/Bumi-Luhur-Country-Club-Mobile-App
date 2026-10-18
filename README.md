# Bumi Luhur Country Club — Member App (PWA)

Mobile member app built from the `Mobile_App_HTML.pdf` design.
Stack: Vite 5 + React 18 + React Router 6 + vite-plugin-pwa (Workbox).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve dist/ on http://localhost:4173 (service worker active)
```

Node 18+ is required.

## Deploy to Vercel

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel: **Add New → Project**, import the repository.
3. Framework preset: **Vite** (detected automatically). Build command `npm run build`, output `dist`.
4. Deploy.

Or with the CLI: `npx vercel` then `npx vercel --prod`.

`vercel.json` already includes the SPA rewrite (deep links such as `/booking` work on refresh),
`no-cache` for `sw.js`, and long-term caching for hashed assets.

## Installing on a phone

- **Android / Chrome**: open the site → menu → *Install app* (or the *Install App* button in Profile).
- **iOS / Safari**: Share → *Add to Home Screen*.

The app works offline after the first visit (app shell, images and fonts are pre-cached).

## Structure

```
src/
  App.jsx               routes + bottom navigation (shown on the five tab screens)
  components/           Header, BottomNav, MediaCard, MemberCard (+ QR pass), Controls
                        (chips, segmented tabs, search), Booking (date strip, slot grid),
                        TrafficCard, Sheet, Toast, QrCode, Icon
  pages/                Home, Facilities, Class, Booking, Club (+ Coaching/Events/Offers),
                        Schedule, GuestPass, Reward, Profile, Misc (Notifications, Live Traffic, 404)
  data/catalog.js       mock data: facilities, classes, coaches, events, offers, rewards, traffic
  store/AppStore.jsx    app state (bookings, guest passes, points, notifications) saved in localStorage
  utils/                dates and slot availability
  assets/icons/         SVG icons extracted from the design
public/img/             design imagery (WebP)
```

## Mock data / backend

There is no backend yet. All state lives in `localStorage` (`bumi-luhur:v1`).
*Profile → Sign Out* resets the demo data. To connect an API, replace the reducer actions in
`src/store/AppStore.jsx` (`book`, `cancelBooking`, `addGuestPass`, `redeem`, …) with API calls.

## Notes

- Fonts: the design uses Gilroy (commercial); **Figtree** is used as the closest open-licence match.
  Page titles use **Amarante**. Both are bundled via `@fontsource` (no external requests).
- Some secondary facility photos (screens not in the design) load from `images.unsplash.com`
  and are cached by the service worker.
- Dates, greeting ("Good Morning/Afternoon/…"), live traffic hour and available slots follow the device clock.
