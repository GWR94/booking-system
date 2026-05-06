# Server Module Documentation

## Auth

Authentication is handled by NextAuth with app-level config in `src/auth.ts` and auth helpers in `src/server/auth/auth.ts`.

Key responsibilities:

- Credential and OAuth login
- Session-to-user resolution
- Role-aware guards for admin vs user routes

Primary consumers:

- `/api/admin/*`
- `/api/user/*`
- Booking and checkout endpoints that support either session users or guests

## Database Access

Prisma is the data access layer, with schema definitions in `prisma/schema.prisma`.

Key responsibilities:

- User, bay, slot, and booking persistence
- Membership metadata persistence
- Payment and lifecycle metadata updates

## Server Libraries

Shared server-side libraries live under `src/server/lib` and related utility folders.

Common integrations include:

- Stripe helpers for payment and webhook handling
- Zod validation for API contracts
- reCAPTCHA verification where required

## Domain Modules

### Admin

`src/server/modules/admin/*` handles admin workflows for bookings, users, slots, and dashboard metrics.

### Bookings

`src/server/modules/bookings/*` handles booking creation, lookup, and status lifecycle logic.

### Membership / Billing

Membership and billing behavior is implemented across API routes and server modules that manage:

- subscription checkout session creation
- customer portal session creation
- webhook-driven billing state updates