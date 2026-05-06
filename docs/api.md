# The Short Grass API Documentation
## Table of Contents
1. [Admin API](#admin-api)
2. [User API](#user-api)
3. [Bookings and Slots API](#bookings-and-slots-api)
4. [Webhook API](#webhook-api)

## Admin API <a id="admin-api"></a>
### GET /api/admin/bookings
#### Purpose
Retrieve a list of all bookings.

#### Auth Requirements
Admin role required.

#### Request
* No request body required.

#### Response
```json
{
  "bookings": [
    {
      "id": integer,
      "user_id": integer,
      "slot_id": integer,
      "start_time": string,
      "end_time": string
    }
  ]
}
```

### GET /api/admin/slots
#### Purpose
Retrieve a list of all slots.

#### Auth Requirements
Admin role required.

#### Request
* No request body required.

#### Response
```json
{
  "slots": [
    {
      "id": integer,
      "bay_id": integer,
      "capacity": integer
    }
  ]
}
```

### GET /api/admin/users
#### Purpose
Retrieve a list of all users.

#### Auth Requirements
Admin role required.

#### Request
* No request body required.

#### Response
```json
{
  "users": [
    {
      "id": integer,
      "name": string,
      "email": string
    }
  ]
}
```

### GET /api/admin/dashboard-stats
#### Purpose
Retrieve dashboard statistics.

#### Auth Requirements
Admin role required.

#### Request
* No request body required.

#### Response
```json
{
  "stats": {
    "total_bookings": integer,
    "total_revenue": decimal
  }
}
```

## User API <a id="user-api"></a>
### GET /api/user/profile
#### Purpose
Retrieve the current user's profile.

#### Auth Requirements
Authenticated user required.

#### Request
* No request body required.

#### Response
```json
{
  "user": {
    "id": integer,
    "name": string,
    "email": string
  }
}
```

### POST /api/user/subscription/create-session
#### Purpose
Create a Stripe subscription checkout session for the current user.

#### Auth Requirements
Authenticated user required.

#### Request
* Request body contains the selected membership tier.

#### Response
```json
{
  "url": string
}
```

### POST /api/user/subscription/portal-session
#### Purpose
Create a Stripe customer portal session for the current user.

#### Auth Requirements
Authenticated user required.

#### Request
* No request body required.

#### Response
```json
{
  "url": string
}
```

### GET /api/user/me
#### Purpose
Retrieve the current user's information.

#### Auth Requirements
Authenticated user required.

#### Request
* No request body required.

#### Response
```json
{
  "user": {
    "id": integer,
    "name": string,
    "email": string
  }
}
```

## Bookings and Slots API <a id="bookings-and-slots-api"></a>
### GET /api/bookings
#### Purpose
Retrieve a list of all bookings.

#### Auth Requirements
No authentication required.

#### Request
* No request body required.

#### Response
```json
{
  "bookings": [
    {
      "id": integer,
      "user_id": integer,
      "slot_id": integer,
      "start_time": string,
      "end_time": string
    }
  ]
}
```

### GET /api/slots
#### Purpose
Retrieve a list of all slots.

#### Auth Requirements
No authentication required.

#### Request
* No request body required.

#### Response
```json
{
  "slots": [
    {
      "id": integer,
      "bay_id": integer,
      "capacity": integer
    }
  ]
}
```

## Webhook API <a id="webhook-api"></a>
### POST /api/webhook
#### Purpose
Handle Stripe webhooks.

#### Auth Requirements
No authentication required.

#### Request
* `stripe-signature` header required.
* `type` query parameter required (e.g. `checkout.session.completed`).

#### Response
```json
{
  "status": string
}
```

Note: Treat this as a high-level API reference; confirm request/response details against route handlers and tests before making breaking changes.