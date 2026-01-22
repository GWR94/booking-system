import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingPreview from './BookingPreview';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

vi.mock('@shared', () => ({
	BookingSteps: () => <div data-testid="mock-booking-steps" />,
}));

describe('BookingPreview', () => {
	it('should render title and description', () => {
		render(
			<ThemeProvider>
				<BookingPreview />
			</ThemeProvider>,
		);

		expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Book your next session in three simple steps/i),
		).toBeInTheDocument();
	});

	it('should render BookingSteps component', () => {
		render(
			<ThemeProvider>
				<BookingPreview />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('mock-booking-steps')).toBeInTheDocument();
	});
});
