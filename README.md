# TheShortGrass [Frontend]

**Live Demo:** [https://golf.jamesgower.dev](https://golf.jamesgower.dev)

A modern, responsive, and premium booking experience for a golf simulator business. This project serves as the customer-facing frontend, offering simulator bookings, membership management, and event inquiries.

> [!IMPORTANT]
> **Portfolio Project**: This application was developed for a **real-world business initiative** (which is no longer active). It demonstrates a fully operational system where bookings are legitimately processed, stored, and managed in the live database, though all payments are simulated.

> [!NOTE]
> **Stripe Test Mode**: The application is fully functional. You can complete the entire booking and payment flow using the test card number `4242 4242 4242 4242` (with any future expiry date and any CVC). Any "purchases" created will not be processed, but you will be able to complete the entire flow. You can also use the test card number `4000 0000 0000 3220` (with any future expiry date and any CVC) to simulate a failed payment.

The backend repository can be found [here](http://www.github.com/GWR94/booking-system-backend).

## Features

- **Dynamic Booking System**: Real-time slot availability, custom duration selection, and integrated Stripe payments.
- **Membership Modules**: Tiered membership subscriptions with recurring billing.
- **User Authentication**: Secure login/signup via Google, Facebook, X (Twitter), or email (powered by Passport.js on the backend).
- **GDPR Compliance**: Built with privacy in mind. Users have full control over their data, including the ability to request data exports and permanently delete their accounts.
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop.
- **Interactive UI**: Smooth animations and transitions using Framer Motion.
- **Admin Dashboard**: (In development) Tools for managing bookings and slots.

## Tech Stack & Design Choices

We chose a modern, performance-oriented stack to ensure scalability, type safety, and a premium user experience.

### Core Frameworks
- **[React 18](https://react.dev/)**: Utilizes the latest concurrent features for a responsive UI.
- **[TypeScript](https://www.typescriptlang.org/)**: strict type safety to reduce runtime errors and improve developer velocity.
- **[Vite](https://vitejs.dev/)**: Chosen over Create React App (CRA) for its lightning-fast HMR (Hot Module Replacement) and optimized production builds.

### State & Data Fetching
- **[TanStack Query (React Query) v5](https://tanstack.com/query/latest)**: Handles server state (fetching, caching, synchronizing). This eliminates the need for complex global state management (Redux) for API data and ensures the UI always displays fresh data.
- **[Axios](https://axios-http.com/)**: For consistent and interceptable HTTP requests to the backend API.

### Styling & Animation
- **[Material-UI (MUI) v6](https://mui.com/)**: Provides a robust, accessible component library. We customized the theme to create a specific "premium" aesthetic (Dark mode defaults, custom typography).
- **[Framer Motion](https://www.framer.com/motion/)**: Used for complex layout transitions and scroll animations that give the site a "high-end" feel unlike standard static pages.

### Routing & Validation
- **[React Router v6](https://reactrouter.com/en/main)**: Standard declarative routing.
- **[Joi](https://joi.dev/)**: Schema description language for data validation (used for form inputs to ensure data integrity before sending to the API).

### Testing
- **[Vitest](https://vitest.dev/)**: A blazing fast unit test framework powered by Vite. replacing Jest for better performance and ESM support.
- **[React Testing Library](https://testing-library.com/)**: For testing components in a way that resembles how users interact with them.

### Services & Integrations
- **Stripe**: Initialized via `@stripe/react-stripe-js` for secure, PCI-compliant payment processing.
- **React Google Recaptcha**: Protects public forms from spam.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/booking-system.git
   cd booking-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (copied from `.env.example` if available):
   ```env
   VITE_BACKEND_API=http://localhost:4000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   VITE_CAPTCHA_SITE_KEY=your_captcha_key
   VITE_GOOGLE_ANALYTICS_ID=your_ga_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```
This runs the TypeScript compiler (`tsc`) and then Vite's build command to generate optimized static assets.

### Testing

Run the test suite with Vitest:
```bash
npm test
```
To run coverage:
```bash
npm run test:coverage
```

## System Architecture Overview

This frontend functions as a Single Page Application (SPA). It communicates with a **Node.js/Express** backend (PostgreSQL + Prisma) via a REST API. Authentication is session/token-based, with cross-domain cookie support configured for seamless social logins.

## Project Structure

```bash
booking-system/
├── src/
│   ├── api/          # Axios setup and API service functions
│   ├── assets/       # Images, icons, and static assets
│   ├── components/   # Reusable UI components (Atomic design principles)
│   ├── context/      # React Contexts (Auth, Theme, etc.)
│   ├── hooks/        # Custom React hooks (useAuth, useBooking, etc.)
│   ├── pages/        # Route components (Home, Booking, Login, etc.)
│   ├── router/       # React Router configuration
│   ├── utils/        # Helper functions and formatters
│   ├── validation/   # Joi schemas for form validation
│   └── App.tsx       # Main application entry point
└── public/           # Static assets served from root
```

## Deployment

The application follows a decoupled deployment strategy:

- **Frontend**: Deployed on **[Netlify](https://www.netlify.com/)**.
  - Connected to the GitHub repository.
  - Automatically builds and deploys on push to `main`.
  - Handles client-side routing and serves static assets.
- **Backend**: Deployed on **[Render](https://render.com/)**.
  - Node.js/Express server.
  - Managed PostgreSQL database.
  - Handles API requests, authentication, and payment processing.

## Contributing

1.  **Fork the repository**.
2.  **Create a feature branch**: `git checkout -b feature/amazing-feature`.
3.  **Commit your changes**: `git commit -m 'Add some amazing feature'`.
4.  **Push to the branch**: `git push origin feature/amazing-feature`.
5.  **Open a Pull Request**.

## License

This project is proprietary and currently not open for public licensing.
