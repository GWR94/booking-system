# Scripts

## One-shot setup

- **Production** (after migrations; set `ADMIN_EMAIL` and `ADMIN_PASSWORD`):  
  `npm run setup:production`  
  Runs: create bays → populate slots (365 days) → create admin user.

- **Dev** (fresh local DB):  
  `npm run setup:dev`  
  Runs: create bays → populate slots (365 days) → seed test users (test@example.com, admin@example.com).

## Step-by-step DB setup

If you prefer to run steps individually:

1. **Bays** (required for slots):  
   `npm run db:create-bays` or `npx tsx scripts/create-bay.ts`

2. **Slots** (365 days, excludes Sundays):  
   `npm run db:populate-slots` or `npx tsx scripts/populate-slots.ts`

3. **Admin user** (production/staging; needs `ADMIN_EMAIL` and `ADMIN_PASSWORD` in env):  
   `npm run db:initialise-admin` or `npx tsx scripts/initialise-admin.ts`

## Seeding (dev / CI)

- `npm run seed` — test users only in non-production; in production skips test users.
- `npm run seed -- --demo` — test users (if not production) + demo bays/slots for 7 days.
- `npm run seed:test-users` — only e2e test users.
- `npm run seed:demo` — only demo bays + slots (7 days by default; pass a number for more days).
