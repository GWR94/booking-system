import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { useMediaQuery } from '@mui/material';
import Slot from './Slot';
import dayjs from 'dayjs';
import createWrapper from '@utils/test-utils';
import { useAuth, useBasket, useSession } from '@hooks';
import { useSnackbar } from '@context';

// Mock Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

// Mock Hooks
vi.mock('@hooks', () => ({
	useAuth: vi.fn(() => ({
		user: null,
		isAdmin: false,
	})),
	useBasket: vi.fn(),
	useSession: vi.fn(() => ({
		selectedBay: 5,
	})),
}));

vi.mock('@context', () => ({
	useSnackbar: vi.fn(() => ({
		showSnackbar: vi.fn(),
	})),
}));

vi.mock('@mui/material', async () => {
	const actual = await vi.importActual('@mui/material');
	return {
		...actual,
		useMediaQuery: vi.fn(),
	};
});

vi.mock('@utils', () => ({
	calculateSlotPrice: vi.fn(() => ({
		originalPrice: 50,
		discountedPrice: 40,
		hasDiscount: true,
	})),
}));

// Mock Child Components
vi.mock('./DesktopSlot', () => ({
	default: ({ children }: any) => (
		<div data-testid="desktop-slot">{children}</div>
	),
}));

vi.mock('./UserSlotControls', () => ({
	default: ({ handleSlotClick, handleRemoveOne }: any) => (
		<div data-testid="user-slot-controls">
			<button onClick={handleSlotClick}>Desktop Click</button>
			<button onClick={handleRemoveOne}>Remove One</button>
		</div>
	),
}));

vi.mock('./AdminSlotControls', () => ({
	default: ({ onAdminSlotClick, hourlySlots }: any) => (
		<div data-testid="admin-slot-controls">
			<button onClick={() => onAdminSlotClick(hourlySlots[0])}>
				Desktop Click
			</button>
		</div>
	),
}));

vi.mock('./MobileSlot', () => ({
	default: ({ handleSlotClick, handleRemoveOne, basketCount }: any) => (
		<div data-testid="mobile-slot">
			<button onClick={handleSlotClick}>Mobile Click</button>
			<button onClick={handleRemoveOne}>Remove One</button>
			<span>
				{basketCount > 0 ? `${basketCount} in basket` : 'Not In Basket'}
			</span>
		</div>
	),
}));

vi.mock('./AdminBookingDialog', () => ({
	default: ({ open }: any) =>
		open ? <div data-testid="admin-dialog" /> : null,
}));

// Helper to mock matchMedia
beforeAll(() => {
	vi.stubGlobal(
		'matchMedia',
		vi.fn((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	);
});

describe('Slot Container', () => {
	const mockAddToBasket = vi.fn();
	const mockRemoveFromBasket = vi.fn();
	const mockShowSnackbar = vi.fn();

	const mockTimeSlots = {
		'10:00': [
			{
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
			},
		],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ user: null, isAdmin: false });
		(useBasket as any).mockReturnValue({
			addToBasket: mockAddToBasket,
			removeFromBasket: mockRemoveFromBasket,
			basket: [],
		});
		(useSnackbar as any).mockReturnValue({
			showSnackbar: mockShowSnackbar,
		});
		(useSession as any).mockReturnValue({
			selectedBay: 5,
		});
		(useMediaQuery as any).mockReturnValue(false); // Default to desktop
	});

	it('renders DesktopSlot by default', () => {
		// matchMedia matches: false is default in our stub
		render(<Slot timeSlots={mockTimeSlots as any} timeRange="10:00" />, {
			wrapper: createWrapper(),
		});
		expect(screen.getByTestId('desktop-slot')).toBeInTheDocument();
		expect(screen.queryByTestId('mobile-slot')).not.toBeInTheDocument();
	});

	it('renders MobileSlot when isMobile is true', () => {
		(useMediaQuery as any).mockReturnValue(true); // Force mobile

		render(<Slot timeSlots={mockTimeSlots as any} timeRange="10:00" />, {
			wrapper: createWrapper(),
		});
		expect(screen.getByTestId('mobile-slot')).toBeInTheDocument();
		expect(screen.queryByTestId('desktop-slot')).not.toBeInTheDocument();
	});

	it('calls addToBasket when slot is available and clicked', () => {
		render(<Slot timeSlots={mockTimeSlots as any} timeRange="10:00" />, {
			wrapper: createWrapper(),
		});
		fireEvent.click(screen.getByText('Desktop Click'));
		expect(mockAddToBasket).toHaveBeenCalled();
	});

	it('calls removeFromBasket and showSnackbar when removing from basket', () => {
		// Setup basket with item
		const basketItem = { slotIds: [1], id: 1 };
		(useBasket as any).mockReturnValue({
			addToBasket: mockAddToBasket,
			removeFromBasket: mockRemoveFromBasket,
			basket: [basketItem],
		});

		// Mock removeFromBasket implementation to trigger onSuccess immediately
		mockRemoveFromBasket.mockImplementation((item, options) => {
			options.onSuccess();
		});

		render(<Slot timeSlots={mockTimeSlots as any} timeRange="10:00" />, {
			wrapper: createWrapper(),
		});

		// Click the Remove One button in our mocked child
		fireEvent.click(screen.getByText('Remove One'));

		expect(mockRemoveFromBasket).toHaveBeenCalledWith(
			basketItem,
			expect.objectContaining({
				onSuccess: expect.any(Function),
			}),
		);
		expect(mockShowSnackbar).toHaveBeenCalledWith(
			'Removed from basket',
			'info',
		);
	});

	it('opens AdminDialog when admin clicks', () => {
		(useAuth as any).mockReturnValue({
			user: { role: 'ADMIN' },
			isAdmin: true,
		});

		render(<Slot timeSlots={mockTimeSlots as any} timeRange="10:00" />, {
			wrapper: createWrapper(),
		});
		fireEvent.click(screen.getByText('Desktop Click'));

		expect(screen.getByTestId('admin-dialog')).toBeInTheDocument();
		expect(mockAddToBasket).not.toHaveBeenCalled();
	});
});
