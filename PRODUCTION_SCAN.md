# Production scan – comments & redundancy

Summary of what was checked and what was changed for a production push.

---

## Changes made

| Location | Issue | Fix |
|---------|--------|-----|
| `src/auth.config.ts` | `updateData: any` | Typed as `Prisma.UserUpdateInput` |
| `src/app/api/bookings/payment-intent/route.ts` | Redundant comment "Ensure this function expects..." | Removed |
| `src/app/api/contact/route.ts` | Generic comment "Email transporter (using existing env vars)" | Removed |
| `src/utils/email.ts` | `templateContext: any` | Typed as `Record<string, unknown>` |
| `src/server/modules/membership/membership.service.ts` | Comment "Cast if enum mismatch" + loose cast | Replaced with `as 'ACTIVE' \| 'CANCELLED'`, comment removed |

---

## Left as-is (acceptable for production)

- **`as any` in production code** (e.g. `payment-intent`, `user/me`, `bookings/payment/[paymentId]`) – Few remaining casts where types don’t line up (e.g. Prisma vs. internal types). Safe to tighten later with proper types.
- **`console.log` / `console.warn` / `console.error`** – Present in:
  - `src/utils/logger.ts` – intentional logging API
  - `src/app/api/cron/cleanup-bookings/route.ts` – cron audit log
  - `src/app/api/webhook/route.ts` – unhandled event warning
  - `src/server/lib/recaptcha.ts` – config warning
  - `src/features/checkout/components/CompleteBooking.tsx` – error handling
  - `src/server/modules/membership/membership.service.ts` – sync success log  
  All are reasonable for production (cron logs, errors, warnings). Optionally route them through `logger` for consistency.
- **`src/app/dev/*` and `src/app/api/dev/*`** – Dev-only email preview. Ensure they’re disabled or protected in production (e.g. not linked in prod build or guarded by env).
- **Test files** – Many `as any` and long comments in `*.test.ts` / `*.test.tsx` are normal for mocks and test setup; no change needed for production.

---

## Comments that are fine to keep

- **Security / non-obvious behaviour**: e.g. "Return success even if user not found for security", "Verify cron secret", "Mass assignment protection", "Credentials users must have a name".
- **JSDoc / module-level**: e.g. in `proxy.ts`, `pricing.ts`, `api-schemas.ts`, `slots.service.ts` – they document contracts and behaviour.
- **`src/server/db/client.ts`** – "Lazy-initialized so build can load auth route without DATABASE_URL" is useful for future readers.

---

## Optional follow-ups

1. **Cron / membership logging** – Use `logger` (or your logging abstraction) instead of raw `console.*` for consistency and log levels.
2. **Remaining `as any`** – In `user/me/route.ts`, `payment-intent/route.ts`, `bookings/payment/[paymentId]/route.ts`, add proper types for Prisma/Stripe/TimeSlot where possible.
3. **Dev routes** – Confirm `app/dev` and `api/dev` are not exposed or are gated (e.g. `NODE_ENV` or feature flag) in production.
