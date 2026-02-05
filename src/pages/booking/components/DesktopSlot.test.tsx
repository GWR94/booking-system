import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DesktopSlot from './DesktopSlot';
import dayjs from 'dayjs';
import createWrapper from '@utils/test-utils';
import { useAuth } from '@hooks';

// Mock Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

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
	})),
}));

describe('DesktopSlot Component', () => {
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
		slotInBasket: undefined,
		basketCount: 0,
		handleSlotClick: mockHandleSlotClick,
		handleRemoveOne: vi.fn(),
		setAdminDialogOpen: mockSetAdminDialogOpen,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ user: null, isAdmin: false });
	});

	it('renders time range and price', () => {
		render(<DesktopSlot {...defaultProps} />, { wrapper: createWrapper() });
		expect(screen.getByText(/10:00am - 11:00am/i)).toBeInTheDocument();
		expect(screen.getByText('£40.00')).toBeInTheDocument();
	});

	it('renders children correctly', () => {
		render(
			<DesktopSlot {...defaultProps}>
				<button>Child Button</button>
			</DesktopSlot>,
			{ wrapper: createWrapper() },
		);
		expect(
			screen.getByRole('button', { name: /Child Button/i }),
		).toBeInTheDocument();
	});

	it('renders availability dot when provided', () => {
		render(<DesktopSlot {...defaultProps} availability="limited" />, {
			wrapper: createWrapper(),
		});
		expect(screen.getByTestId('availability-dot')).toBeInTheDocument();
	});
});
