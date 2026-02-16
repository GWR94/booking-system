import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmptyBasket from './EmptyBasket';
import { ThemeProvider } from '@context';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

describe('EmptyBasket', () => {
	it('should render empty basket message', () => {
		render(
			<ThemeProvider>
				<EmptyBasket isMobile={false} />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Your basket is empty/i)).toBeInTheDocument();
	});

	it('should navigate to /book when button is clicked', () => {
		const mockClose = vi.fn();
		render(
			<ThemeProvider>
				<EmptyBasket isMobile={false} onClose={mockClose} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Browse Available Slots/i));
		expect(mockPush).toHaveBeenCalledWith('/book');
		expect(mockClose).toHaveBeenCalled();
	});
});
