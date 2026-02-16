# TheShortGrass

**Live Demo:** [https://golf.jamesgower.dev](https://golf.jamesgower.dev)

A modern, responsive booking experience for a golf simulator business. This is a **fullstack Next.js application**: API routes, database (PostgreSQL + Prisma), and authentication (NextAuth) run in the same repo. No separate backend server.

> [!IMPORTANT]
> **Portfolio Project**: This application was developed for a **real-world business initiative** (which is no longer active). It demonstrates a fully operational system where bookings are processed and stored in the database; payments are in Stripe test mode.

> [!NOTE]
> **Stripe Test Mode**: Use card `4242 4242 4242 4242` (any future expiry, any CVC) to complete the booking flow. Use `4000 0000 0000 3220` to simulate a failed payment.

## Features

- **Booking system**: Slot availability, Stripe payments, guest and authenticated checkout.
- **Membership**: Tiered subscriptions with Stripe Checkout.
- **Auth**: NextAuth with email/password and OAuth (Google, Facebook, X).
- **Admin**: Manage bookings, slots, users; admin-only API routes.
- **GDPR**: Data export and account deletion.
- **Responsive UI**: MUI, Framer Motion, dark/light theme.

## Tech Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Prisma** + **PostgreSQL**
- **NextAuth** (session-based auth)
- **Stripe** (payments and subscriptions)
- **MUI**, **Framer Motion**, **TanStack Query**, **Axios**
- **Vitest**, **React Testing Library**, **Playwright** (e2e)

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted)
- npm

### Installation

1. **Clone and install:**
   ```bash
   git clone https://github.com/your-username/booking-system.git
   cd booking-system
   npm install --legacy-peer-deps
   ```

2. **Environment variables**  
   Copy `.env.example` to `.env` and set at least the required values:

   | Variable                             | Required     | Description                                                                                                                   |
   | ------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
   | `DATABASE_URL`                       | Yes          | PostgreSQL connection string                                                                                                  |
   | `AUTH_SECRET`                        | Yes          | NextAuth secret (e.g. `openssl rand -base64 32`)                                                                              |
   | `STRIPE_SECRET_KEY`                  | Yes          | Stripe secret key (test or live)                                                                                              |
   | `STRIPE_WEBHOOK_SECRET`              | For webhooks | Stripe webhook signing secret                                                                                                 |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes          | Stripe publishable key                                                                                                        |
   | `NEXT_PUBLIC_APP_URL`                | Yes          | App base URL (e.g. `http://localhost:3000`); used server-side for emails/redirects and client-side for Stripe return URL etc. |

   See `.env.example` for all optional vars (SMTP, OAuth, cron, etc.).

3. **Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```
   App: [http://localhost:3000](http://localhost:3000).

### Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start Next.js dev server |
| `npm run build`    | Production build         |
| `npm run start`    | Start production server  |
| `npm run lint`     | ESLint                   |
| `npm test`         | Vitest (unit tests)      |
| `npm run test:ci`  | Vitest run once (CI)     |
| `npm run test:e2e` | Playwright e2e           |

### Testing

```bash
npm test
npm run test:coverage
```

---

## Architecture

Single **Next.js** app:

- **Frontend**: App Router pages and React components.
- **API**: Route handlers under `src/app/api/` (bookings, auth, webhooks, admin, cron).
- **Server**: Prisma, NextAuth, Stripe; shared modules under `src/server/`.
- **Env**: Typed validation in `src/server/env.ts` (Zod); use `serverEnv` in server code for type-safe config.

Deploy as one app (e.g. **Vercel**, **Railway**, **Render**): set env vars, run `prisma migrate` (or `db push`), then `next build` and `next start`. Configure Stripe webhook URL to `https://your-domain/api/webhook`.

---

## Project Structure

```
booking-system/
├── src/
│   ├── app/              # Next.js App Router (pages, layouts, API routes)
│   │   ├── api/           # API routes (bookings, webhook, admin, user, contact, cron)
│   │   └── ...
│   ├── server/           # Server-only (auth, db, env, modules, lib)
│   ├── features/         # Feature UI (booking, checkout, auth, admin)
│   ├── components/       # Shared UI
│   ├── api/              # Client API helpers (axios, auth, booking, etc.)
│   ├── config/           # App config (membership, company)
│   ├── validation/       # Joi API schemas
│   └── ...
├── prisma/
│   └── schema.prisma
├── .env.example
└── .github/workflows/ci.yml
```

---

## Deployment

Deploy the **single Next.js app** to a Node-friendly platform:

1. Set all required (and desired optional) environment variables.
2. Use a PostgreSQL database (e.g. Neon, Supabase, Render).
3. Run migrations: `npx prisma migrate deploy` (or `db push` for prototyping).
4. Build: `npm run build`; start: `npm run start`.
5. Point Stripe webhooks to `https://your-domain/api/webhook` and set `STRIPE_WEBHOOK_SECRET`.

CI runs on push/PR to `main`: lint, unit tests, Prisma generate, and build (see `.github/workflows/ci.yml`).

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit and push, then open a Pull Request.

## License

This project is proprietary and not open for public licensing.
