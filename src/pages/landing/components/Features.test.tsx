import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Features from './Features';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

describe('Landing Features', () => {
	it('should render main title and features', () => {
		render(
			<ThemeProvider>
				<Features />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Premium Features/i)).toBeInTheDocument();
		expect(screen.getByText(/Trackman 4 Technology/i)).toBeInTheDocument();
		expect(screen.getByText(/Group & Private Bookings/i)).toBeInTheDocument();
		expect(screen.getByText(/Flexible Scheduling/i)).toBeInTheDocument();
		expect(screen.getByText(/Convenient Location/i)).toBeInTheDocument();
	});

	it('should render descriptions', () => {
		render(
			<ThemeProvider>
				<Features />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/Precision tracking of every aspect of your swing/i),
		).toBeInTheDocument();
	});
});
