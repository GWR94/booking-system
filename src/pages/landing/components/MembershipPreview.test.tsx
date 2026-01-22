import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MembershipPreview from './MembershipPreview';
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
}));

describe('MembershipPreview', () => {
	it('should render title and description', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/Flexible Membership Plans/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Join The Short Grass community/i),
		).toBeInTheDocument();
	});

	it('should render all three membership tiers', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText('Par')).toBeInTheDocument();
		expect(screen.getByText('Birdie')).toBeInTheDocument();
		expect(screen.getByText('Hole-In-One')).toBeInTheDocument();
	});

	it('should render prices for tiers', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/£199.99/i)).toBeInTheDocument();
		expect(screen.getByText(/£299.99/i)).toBeInTheDocument();
		expect(screen.getByText(/£399.99/i)).toBeInTheDocument();
	});

	it('should navigate to /membership when button is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const viewDetailsBtns = screen.getAllByText(/View Details/i);
		fireEvent.click(viewDetailsBtns[0]);
		expect(mockNavigate).toHaveBeenCalledWith('/membership');
	});
});
