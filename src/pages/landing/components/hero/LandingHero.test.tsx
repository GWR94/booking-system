import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LandingHero from './LandingHero';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

// Mock HeroMedia since it's used in LandingHero
vi.mock('./HeroMedia', () => ({
	default: () => <div data-testid="hero-media">Hero Media</div>,
}));

describe('LandingHero', () => {
	it('should render main title and description', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<LandingHero />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(
			screen.getAllByText(/Play\. Practice\. Perform\./i).length,
		).toBeGreaterThanOrEqual(1);

		expect(
			screen.getByText(/Maidstone's premier indoor golf/i),
		).toBeInTheDocument();
	});

	it('should render action buttons', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<LandingHero />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const bookBtn = screen.getByRole('button', { name: /Book a Session Now/i });
		const viewPlansBtn = screen.getByRole('button', { name: /View Plans/i });

		expect(bookBtn).toBeInTheDocument();
		expect(viewPlansBtn).toBeInTheDocument();
	});
});
