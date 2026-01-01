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

License: MIT
