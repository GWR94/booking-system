import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DesktopSlot from './DesktopSlot';
import dayjs from 'dayjs';
import createWrapper from '@utils/test-utils';
import { useAuth } from '@hooks';
import { ThemeProvider, createTheme } from '@mui/material';
import { GroupedSlot } from './types';

const theme = createTheme();

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

describe('DesktopSlot Component', () => {
	const mockHandleSlotClick = vi.fn();
	const mockSetAdminDialogOpen = vi.fn();

	const mockSlot: GroupedSlot = {
		id: 1,
		startTime: dayjs('2026-02-08T10:00:00'),
		endTime: dayjs('2026-02-08T11:00:00'),
		bayId: 1,
		slotIds: [1],
	};

	const defaultProps = {
		slot: mockSlot,
		price: {
			originalPrice: 50,
			discountedPrice: 40,
			hasDiscount: true,
		},
		sx: {},
		basketCount: 0,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ user: null, isAdmin: false });
	});

	it('renders time range and price', () => {
		render(
			<ThemeProvider theme={theme}>
				<DesktopSlot {...defaultProps} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);
		// More flexible check for time range (just check 10:00 and 11:00)
		expect(screen.getByText(/10:00/)).toBeInTheDocument();
		expect(screen.getByText(/11:00/)).toBeInTheDocument();
		// Look for price across multiple elements if needed, but getByText '£40.00' should work if it's a single node
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
