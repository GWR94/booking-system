import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import HeroContent from './HeroContent';
import { ThemeProvider } from '@context';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
	Logo: ({ logoOnly }: { logoOnly: boolean }) => (
		<div data-testid="mock-logo">{logoOnly ? 'LogoOnly' : 'FullLogo'}</div>
	),
}));

describe('HeroContent', () => {
	it('should render main title and description', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<HeroContent />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/The Short Grass/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Indoor Golf Simulator Experience/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Practice, play, and improve/i),
		).toBeInTheDocument();
	});

	it('should navigate to /book when "Book a Session Now" is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<HeroContent />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const bookBtn = screen.getByText(/Book a Session Now/i);
		fireEvent.click(bookBtn);
		expect(mockNavigate).toHaveBeenCalledWith('/book');
	});

	it('should navigate to /membership when "View Plans" is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<HeroContent />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const plansBtn = screen.getByText(/View Plans/i);
		fireEvent.click(plansBtn);
		expect(mockNavigate).toHaveBeenCalledWith('/membership');
	});
});
