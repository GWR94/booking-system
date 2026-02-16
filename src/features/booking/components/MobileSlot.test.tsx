import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MobileSlot from './MobileSlot';
import dayjs from 'dayjs';
import createWrapper from '@utils/test-utils';
import { useAuth, useBasket } from '@hooks';

// Redundant router mocks removed success here will lead to the final task completion and walkthrough update.

vi.mock('@hooks', () => ({
	useAuth: vi.fn(() => ({
		user: null,
		isAdmin: false,
	})),
	useBasket: vi.fn(() => ({
		addToBasket: vi.fn(),
		removeFromBasket: vi.fn(),
		basket: [],
	})),
	useSession: vi.fn(() => ({
		selectedBay: 5,
		selectedSession: 1,
	})),
}));

describe('MobileSlot Component', () => {
	const mockHandleSlotClick = vi.fn();
	const mockSetAdminDialogOpen = vi.fn();

	const mockSlot = {
		id: 1,
		time: '10:00',
		startTime: dayjs().add(1, 'day').hour(10).minute(0),
		endTime: dayjs().add(1, 'day').hour(11).minute(0),
		isBooked: false,
		price: 50,
		slotIds: [1],
		bayId: 1,
		status: 'available',
		bookings: [],
		slots: [1],
	};

	const defaultProps = {
		slot: mockSlot,
		price: {
			originalPrice: 50,
			discountedPrice: 40,
			hasDiscount: true,
		},
		style: {
			borderColor: 'red',
			bgColor: 'blue',
		},
		sx: {},
		basketCount: 0,
		handleSlotClick: mockHandleSlotClick,
		handleRemoveOne: vi.fn(),
		setAdminDialogOpen: mockSetAdminDialogOpen,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders time and discounted price', () => {
		render(<MobileSlot {...defaultProps} />, { wrapper: createWrapper() });
		expect(screen.getByText('10:00am')).toBeInTheDocument();
		expect(screen.getByText('£40')).toBeInTheDocument();
		expect(screen.getByText('£50')).toBeInTheDocument(); // Original price
	});

	it('calls handleSlotClick when clicked', () => {
		render(<MobileSlot {...defaultProps} />, { wrapper: createWrapper() });
		const card = screen.getByTestId('slot-card-action-mobile');
		fireEvent.click(card);
		expect(mockHandleSlotClick).toHaveBeenCalled();
	});

	it('displays checkmark and count when in basket', () => {
		render(<MobileSlot {...defaultProps} basketCount={2} />, {
			wrapper: createWrapper(),
		});
		// CheckCircle icon is rendered
		expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
		expect(screen.getByText('2x')).toBeInTheDocument();
	});

	it('displays REMOVE ONE button when in basket', () => {
		render(<MobileSlot {...defaultProps} basketCount={1} />, {
			wrapper: createWrapper(),
		});
		expect(screen.getByText('Remove')).toBeInTheDocument();
		expect(screen.queryByText('CHECKOUT')).not.toBeInTheDocument();
	});

	it('calls handleRemoveOne when REMOVE ONE is clicked', () => {
		render(<MobileSlot {...defaultProps} basketCount={1} />, {
			wrapper: createWrapper(),
		});
		fireEvent.click(screen.getByText('Remove'));
		expect(defaultProps.handleRemoveOne).toHaveBeenCalled();
	});

	it('displays availability dot when specified', () => {
		render(<MobileSlot {...defaultProps} availability="limited" />, {
			wrapper: createWrapper(),
		});

		expect(screen.getByTestId('availability-dot')).toBeInTheDocument();
	});
});
