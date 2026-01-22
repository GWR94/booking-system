import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Intro from './Intro';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

describe('Intro', () => {
	it('should render main title and description', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<Intro />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(
			screen.getAllByText(/The Short Grass/i).length,
		).toBeGreaterThanOrEqual(1);
		expect(
			screen.getByText(/Maidstone's premier indoor facility/i),
		).toBeInTheDocument();
	});

	it('should render action buttons with correct links', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<Intro />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const bookBtn = screen.getByRole('link', { name: /Book a Session/i });
		const contactBtn = screen.getByRole('link', { name: /Contact Us/i });

		expect(bookBtn).toHaveAttribute('href', '/book');
		expect(contactBtn).toHaveAttribute('href', '/contact');
	});
});
