PROJECT_CONTEXT = """
## Project: Golf Bay Booking System

Next.js 16 application for booking golf bay time slots.

**Tech stack:** Next.js (App Router), React 19, TypeScript, Prisma (PostgreSQL), Stripe, NextAuth v5, MUI, Vitest.

**Domain:** Users book time slots at golf bays. Bays have capacity; slots have start/end times. Bookings link users to slots and use Stripe for payment. Users can have membership tiers (PAR, BIRDIE, HOLEINONE) via Stripe subscriptions.

**Folder structure:**
- src/app/ - Next.js App Router. Pages use page.tsx (not index.ts). Routes: /, /book, /checkout, /admin/*, /profile/*, /about.
- src/app/api/ - API routes in route.ts (admin/, user/, bookings/, slots/, webhook)
- src/features/ - Feature modules (booking, checkout, admin, membership)
- src/server/ - Server modules, auth, env validation
- src/api/ - Client-side API helpers
- src/__test__/mocks/ - Shared test mocks (e.g. next-server.ts)

**Auth:** getServerSession (NextAuth). src/app/api/_utils/auth.ts for admin checks. Roles: user vs admin. Social logins: Google, Facebook, Twitter.

**API layout:**
- /api/admin/* - Admin only (bookings, slots, users, dashboard-stats)
- /api/user/* - Authenticated users (profile, subscription, me)
- /api/bookings, /api/slots - Public or mixed
- /api/webhook - Stripe webhooks

**Stripe:** Payment intents for one-off bookings. Webhooks for payment confirmation. Subscriptions for membership tiers. Customer portal for subscription management.

**Testing:** Vitest, describe/it blocks. Mocks in src/__test__/mocks/. API tests as *.test.ts alongside routes.

**Other:** Zod validation in src/server/env.ts. SMTP for email. Analytics (react-ga4).
"""
