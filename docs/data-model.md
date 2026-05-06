# The Short Grass Data Model

## Overview

The source of truth is `prisma/schema.prisma`. The core booking domain is modeled around users, bays, slots, and bookings, with Stripe identifiers stored on the relevant records.

## Core Models

### `User`

Represents an authenticated or guest-linked customer/admin account.

- Identity: `id`, `name`, `email`, `phone`, `role`
- Auth provider links: `googleId`, `facebookId`, `twitterId`
- Security/recovery: `passwordHash`, `resetToken`, `resetTokenExpiry`
- Marketing and billing: `allowMarketing`, `stripeCustomerId`
- Membership state: `membershipTier`, `membershipStatus`, `currentPeriodStart`, `currentPeriodEnd`, `cancelAtPeriodEnd`
- Relations: one-to-many with `Booking`

### `Bay`

Represents a simulator bay.

- Fields: `id`, `name`, `capacity`
- Relations: one-to-many with `Slot`

### `Slot`

Represents an available (or blocked/booked) time window for a specific bay.

- Fields: `id`, `startTime`, `endTime`, `status`, `bayId`
- Relations: many-to-many with `Booking`, many-to-one with `Bay`
- Constraint: unique by `startTime`, `endTime`, and `bayId`

### `Booking`

Represents a confirmed, pending, or cancelled booking.

- Fields: `id`, `bookingTime`, `status`
- User linkage: `userId` (optional for guest checkout)
- Guest fields: `guestName`, `guestEmail`, `guestPhone`
- Payment state: `paymentId` (unique), `paymentStatus`, `refundFailedAt`
- Operations metadata: `reminderSentAt`
- Relations: many-to-many with `Slot`, many-to-one with `User` (optional)

## Enums

### `MembershipTier`

- `PAR`
- `BIRDIE`
- `HOLEINONE`

### `MembershipStatus`

- `ACTIVE`
- `CANCELLED`