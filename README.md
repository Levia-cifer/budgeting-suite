# Budgeting Suite

Mobile-first hybrid budgeting app (web + mobile + API)

Quick start:

1. Install pnpm: https://pnpm.io/
2. Install dependencies: `pnpm install`
3. Start API: `pnpm --filter services/api dev`
4. Start web: `pnpm --filter apps/web dev`
5. Start mobile: `pnpm --filter apps/mobile start`

Notes:
- We've added a Plaid sandbox stub in `services/api` so you can test bank integration flows locally.
- Plaid live availability varies by country. For Ghana, Plaid may not have full live coverage — we'll start with sandbox and evaluate Ghana-compatible providers (or CSV import) for production.

New features added:
- Profile management API and web/mobile profile screens (create/update profile)
- Wallpaper/background selection with live preview (web)
- Playful cat animation (web) that walks and plays a short meow-like sound if you haven't saved changes for 20s

Setup & running (quick):
1. Install pnpm: https://pnpm.io/
2. From repo root: `pnpm install`
3. Copy `services/api/.env.example` to `services/api/.env` and set Plaid credentials if you have them (optional for sandbox).
4. Start backend: `pnpm --filter services/api dev` (will run on port 4000)
5. Start web app: `pnpm --filter apps/web dev` (Next.js on port 3000)
6. Start mobile (Expo): `pnpm --filter apps/mobile start`

Making the mobile app installable on your phone:
- For a quick install, use `expo build:android` (with EAS) or `eas build -p android` / `eas build -p ios` after configuring an Expo account.
- The app manifest is in `apps/mobile/app.json`. Customize `android.package` / `ios.bundleIdentifier` before building.
- Note: To use Plaid in a mobile app and have it fully native, you'll need to add `react-native-plaid-link-sdk` and perform an EAS build (it requires native modules). For the sandbox/demo, the web demo is easier to test in browser for now.

License: MIT
