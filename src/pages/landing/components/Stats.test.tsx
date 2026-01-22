import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Stats from './Stats';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

vi.mock('@assets/svg/AbstractBackground', () => ({
	default: () => <div data-testid="mock-background" />,
}));

describe('Stats', () => {
	it('should render all numeric stats', () => {
		render(
			<ThemeProvider>
				<Stats />
			</ThemeProvider>,
		);

		expect(screen.getByText('4')).toBeInTheDocument();
		expect(screen.getByText('100+')).toBeInTheDocument();
		expect(screen.getByText('5,000+')).toBeInTheDocument();
		expect(screen.getByText('24+')).toBeInTheDocument();
	});

	it('should render stat labels', () => {
		render(
			<ThemeProvider>
				<Stats />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Simulator Bays/i)).toBeInTheDocument();
		expect(screen.getByText(/Virtual Courses/i)).toBeInTheDocument();
		expect(screen.getByText(/Happy Customers/i)).toBeInTheDocument();
		expect(screen.getByText(/Tournaments Hosted/i)).toBeInTheDocument();
	});
});
