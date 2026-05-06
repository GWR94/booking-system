# The Short Grass Features Documentation
==============================================

## Booking Feature Module
------------------------

### Purpose
The booking feature module allows users to book time slots at golf bays.

### Main Components
* `src/app/book/page.tsx`: The booking page where users can select a date, time slot, and bay.
* `src/app/api/bookings/route.ts`: API route for creating and managing bookings.

### Key Flows

1. User selects a date and time slot on the booking page.
2. User selects a golf bay from the available options.
3. The system checks if the selected bay has availability for the chosen time slot.
4. If available, the user is prompted to enter their payment details (Stripe).
5. After successful payment, the booking is created and the user receives a confirmation email.

## Checkout Feature Module
-------------------------

### Purpose
The checkout feature module handles the payment process for bookings.

### Main Components
* `src/app/checkout/page.tsx`: The checkout page where users can enter their payment details.
* `src/app/api/webhook/route.ts`: API route for handling Stripe webhooks (payment confirmation).

### Key Flows

1. User is redirected to the checkout page after selecting a booking on the booking page.
2. User enters their payment details (Stripe).
3. The system processes the payment and creates a payment intent.
4. After successful payment, the booking is confirmed and the user receives a confirmation email.

## Admin Feature Module
-----------------------

### Purpose
The admin feature module provides a dashboard for administrators to manage bookings, users, and golf bays.

### Main Components
* `src/app/admin/dashboard/page.tsx`: The admin page where administrators can view and manage bookings, users, and golf bays.
* `src/app/api/admin/*`: API routes for managing bookings, users, and golf bays (e.g., `/api/admin/bookings`, `/api/admin/users`).

### Key Flows

1. Administrator logs in to the admin page using their credentials.
2. Administrator views a list of all bookings, users, or golf bays.
3. Administrator can filter, sort, and search the list as needed.
4. Administrator can create, update, or delete bookings, users, or golf bays.

## Profile Feature Module
-------------------------

### Purpose
The profile feature module allows users to view and manage their account information.

### Main Components
* `src/app/profile/overview/page.tsx`: The profile page where users can view and edit their account information.
* `src/app/api/user/*`: API routes for managing user profiles (e.g., `/api/user/me`, `/api/user/update`).

### Key Flows

1. User logs in to the profile page using their credentials.
2. User views their account information, including name, email, and membership tier.
3. User can edit their account information as needed.
4. User can view their booking history.

## Membership Feature Module
---------------------------

### Purpose
The membership feature module allows users to purchase and manage membership tiers (PAR, BIRDIE, HOLEINONE).

### Main Components
* `src/app/membership/page.tsx`: The membership page where users can purchase or upgrade their membership tier.
* `src/app/api/user/subscription/*`: API routes for managing memberships (e.g., `/api/user/subscription/create-session`, `/api/user/subscription/portal-session`).

### Key Flows

1. User logs in to the membership page using their credentials.
2. User views a list of available membership tiers and their prices.
3. User selects a membership tier to purchase or upgrade.
4. The system processes the payment and updates the user's subscription.

## Auth Feature Module
----------------------

### Purpose
The auth feature module handles user authentication using NextAuth.

### Main Components
* `src/auth.ts` and `src/server/auth/auth.ts`: Authentication logic for handling user logins and sessions.
* `src/app/api/_utils/auth.ts`: API utility for checking admin roles.

### Key Flows

1. User attempts to login using their credentials (email, password).
2. The system checks the user's credentials against the database.
3. If valid, the system creates a new session and redirects the user to the dashboard.
4. Administrator can check if a user is an admin or not.

## Landing Feature Module
-------------------------

### Purpose
The landing feature module provides a public page for users to learn about The Short Grass.

### Main Components
* `src/app/page.tsx`: The landing page where users can view information about the system.
* `src/features/landing/Landing.tsx`: Landing page content, including direct booking entry points.

### Key Flows

1. User visits the landing page.
2. User views information about The Short Grass.
3. User can book a time slot directly from the landing page.

## About Feature Module
-----------------------

### Purpose
The about feature module provides a public page for users to learn more about The Short Grass.

### Main Components
* `src/app/about/page.tsx`: The about page route.
* `src/features/about/About.tsx`: The about page content component with company information and contact details.

### Key Flows

1. User visits the about page.
2. User views information about The Short Grass, including company history and mission statement.
3. User can view contact details for support or inquiries.

## Contact Feature Module
-------------------------

### Purpose
The contact feature module provides a public page for users to get in touch with The Short Grass.

### Main Components
* `src/features/contact/Contact.tsx`: The contact page content where users can fill out a form to send a message.

### Key Flows

1. User visits the contact page.
2. User views contact information for The Short Grass, including email address and phone number.
3. User can fill out a form to send a message or inquiry.

## Help-Center Feature Module
-----------------------------

### Purpose
The help-center feature module provides a public page for users to find answers to common questions about The Short Grass.

### Main Components
* `src/features/help-center/HelpCenter.tsx`: The help center page content where users can search for specific topics or ask a question.

### Key Flows

1. User visits the help center page.
2. User views a list of FAQs and knowledge base articles related to The Short Grass.
3. User can search for specific topics or ask a question using a form.

## Legal Feature Module
-----------------------

### Purpose
The legal feature module provides a public page for users to view terms of service, privacy policy, and other legal documents.

### Main Components
* `src/features/legal/Terms.tsx`: Terms of service content.
* `src/features/legal/PrivacyPolicy.tsx`: Privacy policy content.
* `src/features/legal/CookiesPolicy.tsx`: Cookies policy content.

### Key Flows

1. User visits the legal page.
2. User views a list of legal documents related to The Short Grass, including terms of service and privacy policy.
3. User can download or print these documents as needed.