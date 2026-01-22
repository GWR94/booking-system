import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BasketItem from './BasketItem';
import { useBasket, useAuth } from '@hooks';
import { ThemeProvider } from '@context';
import dayjs from 'dayjs';

vi.mock('@hooks', () => ({
	useBasket: vi.fn(),
	useAuth: vi.fn(),
}));

describe('BasketItem', () => {
	const mockItem = {
		id: '1',
		bayId: 1,
		startTime: dayjs().add(1, 'day').hour(10).minute(0).toISOString(),
		endTime: dayjs().add(1, 'day').hour(11).minute(0).toISOString(),
		slotIds: ['1'], // 1 slot
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useBasket as any).mockReturnValue({
			removeFromBasket: vi.fn(),
		});
		(useAuth as any).mockReturnValue({
			user: null,
			isAdmin: false,
		});
	});

	it('should render item details correctly', () => {
		render(
			<ThemeProvider>
				<BasketItem item={mockItem as any} isMobile={false} />
			</ThemeProvider>,
		);

		expect(screen.getByText('1')).toBeInTheDocument(); // Bay ID
		expect(screen.getByText(/10:00 AM - 11:00 AM/i)).toBeInTheDocument();
		expect(screen.getByText(/£45.00/i)).toBeInTheDocument();
	});

	it('should call removeFromBasket when delete button is clicked', () => {
		const mockRemove = vi.fn();
		(useBasket as any).mockReturnValue({ removeFromBasket: mockRemove });

		render(
			<ThemeProvider>
				<BasketItem item={mockItem as any} isMobile={false} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button'));
		expect(mockRemove).toHaveBeenCalledWith(mockItem);
	});
});
