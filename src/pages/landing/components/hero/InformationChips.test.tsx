import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import InformationChips from './InformationChips';
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

describe('InformationChips', () => {
	it('should render all informational chips', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<InformationChips />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/4 PREMIUM BAYS/i)).toBeInTheDocument();
		expect(screen.getByText(/CENTRAL MAIDSTONE/i)).toBeInTheDocument();
		expect(screen.getByText(/TRACKMAN TECHNOLOGY/i)).toBeInTheDocument();
		expect(screen.getByText(/FLEXIBLE MEMBERSHIPS/i)).toBeInTheDocument();
		expect(screen.getByText(/24\/7 ONLINE BOOKING/i)).toBeInTheDocument();
	});

	it('should navigate to /membership when membership chip is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<InformationChips />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const chip = screen.getByText(/FLEXIBLE MEMBERSHIPS/i);
		fireEvent.click(chip);
		expect(mockNavigate).toHaveBeenCalledWith('/membership');
	});

	it('should navigate to /book when booking chip is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<InformationChips />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const chip = screen.getByText(/24\/7 ONLINE BOOKING/i);
		fireEvent.click(chip);
		expect(mockNavigate).toHaveBeenCalledWith('/book');
	});
});
