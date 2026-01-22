import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingSteps from './BookingSteps';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

describe('BookingSteps', () => {
	it('should render all three booking steps', () => {
		render(
			<ThemeProvider>
				<BookingSteps />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Select a Date/i)).toBeInTheDocument();
		expect(screen.getByText(/Choose a Slot/i)).toBeInTheDocument();
		expect(screen.getByText(/Confirm & Play/i)).toBeInTheDocument();
	});

	it('should render step descriptions', () => {
		render(
			<ThemeProvider>
				<BookingSteps />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/Choose from our real-time calendar/i),
		).toBeInTheDocument();
		expect(screen.getByText(/Instant confirmation/i)).toBeInTheDocument();
	});

	it('should render step numbers', () => {
		render(
			<ThemeProvider>
				<BookingSteps />
			</ThemeProvider>,
		);

		expect(screen.getByText('01')).toBeInTheDocument();
		expect(screen.getByText('02')).toBeInTheDocument();
		expect(screen.getByText('03')).toBeInTheDocument();
	});
});
