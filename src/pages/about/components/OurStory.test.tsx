import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OurStory from './OurStory';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

describe('OurStory', () => {
	it('should render brand pillars and founder info', () => {
		render(
			<ThemeProvider>
				<OurStory />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Play\./i)).toBeInTheDocument();
		expect(screen.getByText(/Practice\./i)).toBeInTheDocument();
		expect(screen.getByText(/Perform\./i)).toBeInTheDocument();
		expect(screen.getByText(/Founded in 2018/i)).toBeInTheDocument();
		expect(screen.getByText(/Michael Wright/i)).toBeInTheDocument();
	});

	it('should render established badge', () => {
		render(
			<ThemeProvider>
				<OurStory />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Established/i)).toBeInTheDocument();
		expect(
			screen.getByText(/2018 • High Street, Maidstone/i),
		).toBeInTheDocument();
	});
});
