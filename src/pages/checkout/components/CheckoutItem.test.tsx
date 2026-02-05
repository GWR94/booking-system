import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CheckoutItem from './CheckoutItem';
import { useBasket, useAuth } from '@hooks';
import { ThemeProvider, createTheme } from '@mui/material';

vi.mock('@hooks', () => ({
	useBasket: vi.fn(),
	useAuth: vi.fn(() => ({
		user: null,
		isAdmin: false,
	})),
}));

const theme = createTheme();

vi.mock('@mui/icons-material', () => ({
	DeleteOutline: () => <div data-testid="DeleteOutlineIcon" />,
	CalendarMonth: () => <div data-testid="CalendarMonthIcon" />,
	AccessTime: () => <div data-testid="AccessTimeIcon" />,
	Timer: () => <div data-testid="TimerIcon" />,
	SportsGolf: () => <div data-testid="SportsGolfIcon" />,
}));

// Mock utils
vi.mock('@utils', () => ({
	calculateSlotPrice: vi.fn(() => ({
		originalPrice: 45.0,
		discountedPrice: 45.0,
		hasDiscount: false,
	})),
}));

const mockSlot = {
	id: '1',
	slotIds: ['slot1', 'slot2'],
	startTime: '2024-01-20T10:00:00Z',
	endTime: '2024-01-20T12:00:00Z',
	bayId: 1,
	price: '90.00',
};

describe('CheckoutItem', () => {
	const mockRemoveFromBasket = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useBasket as any).mockReturnValue({
			removeFromBasket: mockRemoveFromBasket,
		});
		(useAuth as any).mockReturnValue({
			user: null,
			isAdmin: false,
		});
	});

	it('should render slot details correctly', () => {
		render(
			<ThemeProvider theme={theme}>
				<CheckoutItem slot={mockSlot as any} />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Sat 20th Jan/i)).toBeInTheDocument();
		expect(screen.getByText(/10:00 - 12:00/i)).toBeInTheDocument();
		expect(
			screen.getByText(
				(content) => content.includes('Bay') && content.includes('1'),
			),
		).toBeInTheDocument();
		expect(screen.getByText(/2 hrs/i)).toBeInTheDocument();
		expect(screen.getByText(/£90.00/i)).toBeInTheDocument();
	});

	it('should call removeFromBasket when delete button is clicked', () => {
		render(
			<ThemeProvider theme={theme}>
				<CheckoutItem slot={mockSlot as any} />
			</ThemeProvider>,
		);

		const deleteBtn = screen.getByText(/Remove/i);
		fireEvent.click(deleteBtn);
		expect(mockRemoveFromBasket).toHaveBeenCalledWith(mockSlot);
	});

	it('should not show delete button if isCompleted is true', () => {
		render(
			<ThemeProvider theme={theme}>
				<CheckoutItem slot={mockSlot as any} isCompleted={true} />
			</ThemeProvider>,
		);

		expect(screen.queryByLabelText(/remove item/i)).not.toBeInTheDocument();
	});

	it('should render duration with minutes correctly', () => {
		const slotWithMinutes = {
			...mockSlot,
			endTime: '2024-01-20T11:45:00Z', // 1 hour 45 minutes
		};

		render(
			<ThemeProvider theme={theme}>
				<CheckoutItem slot={slotWithMinutes as any} />
			</ThemeProvider>,
		);

		expect(screen.getByText(/1 hr 45 mins/i)).toBeInTheDocument();
	});
});
