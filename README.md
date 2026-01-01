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

License: MIT
