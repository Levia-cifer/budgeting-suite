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
5. Run Prisma steps (inside `services/api`):
   - `pnpm run prisma:generate` (generate client)
   - `pnpm run prisma:migrate` (runs migration and creates `dev.db`)
   - `pnpm run prisma:seed` (seed sample user, budgets, transactions)
6. Start web app: `pnpm --filter apps/web dev` (Next.js on port 3000)
7. Start mobile (Expo): `pnpm --filter apps/mobile start`

Making the mobile app installable on your phone:
- For a quick install, use `expo build:android` (with EAS) or `eas build -p android` / `eas build -p ios` after configuring an Expo account.
- The app manifest is in `apps/mobile/app.json`. Customize `android.package` / `ios.bundleIdentifier` before building.
- Note: To use Plaid in a mobile app and have it fully native, we added `react-native-plaid-link-sdk` and configured the Expo plugin. To produce an installable app you must use EAS:

  1. Install EAS CLI: `npm install -g eas-cli` and login with `eas login` (create an Expo account if you don't have one).
  2. Configure credentials for Android/iOS (follow Expo docs).
  3. Run `pnpm --filter apps/mobile run eas:build:android` to build an APK/AAB for Android, or `pnpm --filter apps/mobile run eas:build:ios` for iOS (requires Apple account).
  4. If you're testing with an Android emulator and your API runs on localhost, use `10.0.2.2` (Android) or set `extra.apiUrl` accordingly.

- Plaid / secrets: For native Plaid in production, set `PLAID_CLIENT_ID`, `PLAID_SECRET`, and `PLAID_ENV` in the server (`services/api/.env`) and store sensitive production secrets in GitHub/EAS secrets rather than in the codebase.

License: MIT
