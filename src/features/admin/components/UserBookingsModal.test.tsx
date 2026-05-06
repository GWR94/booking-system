import { render, screen, fireEvent } from '@test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import UserBookingsModal from './UserBookingsModal';

// Mock UserBookingDetailsDialog
vi.mock('@features/profile/components/UserBookingDetailsDialog', () => ({
	default: () => <div data-testid="UserBookingDetailsDialog" />,
}));

// Mock API
vi.mock('@api', () => ({
	adminDeleteBooking: vi.fn(() => Promise.resolve()),
}));

const mockUserWithBookings = {
	id: 'user123',
	name: 'John Doe',
	bookings: [
		{
			id: '1',
			bookingTime: '2024-01-20T10:00:00Z',
			status: 'confirmed',
			slots: [
				{
					startTime: '2024-01-20T10:00:00Z',
					endTime: '2024-01-20T11:00:00Z',
					bayId: 1,
				},
			],
		},
	],
};

describe('UserBookingsModal', () => {
	const defaultProps = {
		user: mockUserWithBookings,
		open: true,
		onClose: vi.fn(),
	};

	it('should render user bookings correctly', () => {
		render(<UserBookingsModal {...defaultProps} />);

		expect(screen.getByText("John Doe's Bookings")).toBeInTheDocument();
		expect(screen.getByText('Bay 1')).toBeInTheDocument();
		expect(screen.getByText('confirmed')).toBeInTheDocument();
	});

	it('should show "No bookings found" if user has no bookings', () => {
		render(
			<UserBookingsModal
				{...defaultProps}
				user={{ ...mockUserWithBookings, bookings: [] }}
			/>,
		);

		expect(
			screen.getByText(/No bookings found for this user/i),
		).toBeInTheDocument();
	});

	it('should call onClose when Close icon button is clicked', () => {
		render(<UserBookingsModal {...defaultProps} />);

		// Use a more specific selector if needed, or find the button by its label
		const closeBtn = screen.getByRole('button', { name: /close/i });
		fireEvent.click(closeBtn);
		expect(defaultProps.onClose).toHaveBeenCalled();
	});
});
