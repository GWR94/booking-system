import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AboutHero from './AboutHero';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

describe('AboutHero', () => {
	it('renders headline and about copy', () => {
		render(
			<ThemeProvider>
				<AboutHero />
			</ThemeProvider>,
		);

		expect(document.getElementById('about')).toBeTruthy();
		expect(screen.getByText('ABOUT US')).toBeInTheDocument();
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading).toHaveTextContent(/More Than Just a/);
		expect(heading).toHaveTextContent(/Simulator/);
		expect(
			screen.getByText(/We've reimagined the indoor golf experience/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Whether you're looking to dial in your numbers/i),
		).toBeInTheDocument();
	});

	it('renders hero imagery with alt text', () => {
		render(
			<ThemeProvider>
				<AboutHero />
			</ThemeProvider>,
		);

		expect(
			screen.getByRole('img', { name: /Golf Simulator Bay/i }),
		).toBeInTheDocument();
		expect(screen.getByRole('img', { name: /Bar Area/i })).toBeInTheDocument();
	});
});
