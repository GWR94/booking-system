# Golf Simulator Website Frontend (WIP)

A modern, responsive website for a golf simulator business built with React and Material-UI. The UI / general layout and content is currently a work in progress as the main focus has been on creating the backend, which can be access [here](http://www.github.com/GWR94/booking-system-backend).

## Overview

This frontend application provides an interactive and engaging user experience for golf enthusiasts looking to book simulator sessions, view facility information, and manage their bookings. The website features real-time availability, detailed simulator specifications, and an intuitive booking system.

## Features

- Interactive booking system with payment and soon to be refunds (Stripe is currently in test-mode for development)
- User account management and booking history
- Responsive design for all device sizes
- Integration with popular golf analysis software
- Event booking for corporate events and parties
- Animated UI components with Framer Motion

## Tech Stack

- **React 18**: Frontend framework
- **TypeScript**: Type safety and better developer experience
- **Material-UI (MUI) v6**: Component library and styling system
- **Stripe**: Payment processing integration
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API requests
- **Day.js**: Modern date utility library
- **Framer Motion**: Animation library
- **Joi**: Schema validation
- **Jest & React Testing Library**: Testing framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/booking-system.git
cd booking-system
```

Install dependencies:

```bash
npm install
# or
yarn install
```
Create a `.env` file in the root directory:

```
VITE_BACKEND_URL=your_api_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

Start the development server:
```bash
npm start
# or
yarn start
```
The application will be available at `http://localhost:3000`

### Available Scripts

`npm start`: Start development server
`npm run build`: Build production bundle
`npm test`: Run Jest tests
`npm run eject`: Eject from Create React App

### Environment Variables

#### Required environment variables:

```
VITE_API_URL: Backend API URL
VITE_STRIPE_PUBLIC_KEY: Stripe public key
```

### Future Plans

- UI and general content overhaul
- Create all missing webpages and remove dead links etc

