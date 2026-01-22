import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import EmptyBasket from './EmptyBasket';
import { ThemeProvider } from '@context';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('EmptyBasket', () => {
	it('should render empty basket message', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<EmptyBasket isMobile={false} />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/Your basket is empty/i)).toBeInTheDocument();
	});

	it('should navigate to /book when button is clicked', () => {
		const mockClose = vi.fn();
		render(
			<ThemeProvider>
				<BrowserRouter>
					<EmptyBasket isMobile={false} onClose={mockClose} />
				</BrowserRouter>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Browse Available Slots/i));
		expect(mockNavigate).toHaveBeenCalledWith('/book');
		expect(mockClose).toHaveBeenCalled();
	});
});
