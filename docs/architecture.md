# The Short Grass Architecture Overview
==============================================

## High-Level App Structure
---------------------------

The Short Grass is built using Next.js 16 as the frontend framework, React 19 as the UI library, TypeScript as the programming language, Prisma (PostgreSQL) for database management, and Stripe for payment processing.

### Frontend Structure

*   `src/app/`: Next.js App Router
*   `src/features/`: Feature modules (booking, checkout, admin, membership)
*   `src/server/`: Server modules (auth, env validation)

### Backend Structure

*   `src/app/api/`: App Router API route handlers grouped by domain (admin, user, bookings, slots, webhook)
*   `src/api/`: Client-side API helpers
*   `src/__test__/mocks/`: Shared test mocks (e.g. next-server.ts)

## Request Flow
-----------------

The request flow for The Short Grass is as follows:

1.  User interacts with the frontend application.
2.  The frontend sends a request to the backend API routes.
3.  The backend API routes interact with the database using Prisma.
4.  The database returns data to the backend API routes.
5.  The backend API routes return data to the frontend.

## Key Integrations
-------------------

The Short Grass integrates with the following services:

*   **Stripe**: Payment processing and subscription management
*   **NextAuth**: Social logins, role-based access control, and authentication logic

## Feature/API/Server Connections
---------------------------------

The connections between features, API routes, and server modules are as follows:

*   Features in `src/features/` call API route handlers in `src/app/api/**/route.ts`.
*   Server modules (src/server/) connect to authentication logic (`src/auth.ts` and `src/server/auth/auth.ts`)
*   Test mocks (src/__test__/mocks/) connect to Next.js pages (src/app/page.tsx)

## Data Model
--------------

The data model for The Short Grass is defined in `prisma/schema.prisma`. Core models include User, Bay, Slot, and Booking, plus membership fields on `User`.

### Models

*   **User**: Represents a user who can book time slots at golf bays.
*   **Booking**: Represents a booking made by a user for a time slot at a golf bay.
*   **Slot**: Represents a time slot available at a golf bay.
*   **Membership state**: Stored on `User` (tier, status, and billing period fields).

## Enums
---------

The Short Grass uses the following enums:

*   **Role**: Represents the role of a user, either "user" or "admin".
*   **Tier**: Represents the membership tier of a subscription, one of "PAR", "BIRDIE", or "HOLEINONE".

## API Routes
--------------

The Short Grass has the following API routes:

### Admin API

*   `/api/admin/bookings`: Retrieve a list of all bookings.
*   `/api/admin/slots`: Retrieve a list of all slots.
*   `/api/admin/users`: Retrieve a list of all users.
*   `/api/admin/dashboard-stats`: Retrieve dashboard statistics.

### User API

*   `/api/user/profile`: Retrieve the current user's profile.
*   `/api/user/subscription/create-session`: Create a Stripe subscription checkout session.
*   `/api/user/subscription/portal-session`: Create a Stripe customer portal session.
*   `/api/user/me`: Retrieve the current user's information.

### Bookings and Slots API

*   `/api/bookings`: Retrieve a list of all bookings.
*   `/api/slots`: Retrieve a list of all slots.

### Webhook API

*   `/api/webhook`: Handle Stripe webhooks for payment confirmation and subscription updates.