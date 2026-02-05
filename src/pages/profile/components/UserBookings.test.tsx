import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserBookings from './UserBookings';
import { useAuth } from '@hooks';
import { useSnackbar, ThemeProvider } from '@context';
import { deleteBooking } from '@api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
}));

vi.mock('@context', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useSnackbar: vi.fn(),
	};
});

vi.mock('@api', () => ({
	deleteBooking: vi.fn(),
}));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<ThemeProvider>
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	</ThemeProvider>
);

describe('UserBookings', () => {
	const mockShowSnackbar = vi.fn();
	const mockUserWithBookings = {
		bookings: [
			{
				id: 1,
				bookingTime: dayjs().subtract(1, 'day').toISOString(), // Past booking
				status: 'confirmed',
				paymentId: 'pi_past',
				slots: [
					{
						startTime: dayjs().subtract(1, 'day').hour(14).toISOString(),
						endTime: dayjs()
							.subtract(1, 'day')
							.hour(14)
							.minute(55)
							.toISOString(),
						bayId: 1,
					},
				],
			},
			{
				id: 2,
				bookingTime: dayjs().add(1, 'day').toISOString(), // Future booking
				status: 'confirmed',
				paymentId: 'pi_future',
				slots: [
					{
						startTime: dayjs().add(1, 'day').hour(10).toISOString(),
						endTime: dayjs().add(1, 'day').hour(10).minute(55).toISOString(),
						bayId: 1,
					},
				],
			},
		],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ user: mockUserWithBookings });
		(useSnackbar as any).mockReturnValue({ showSnackbar: mockShowSnackbar });
	});

	it('should render bookings table when bookings exist', () => {
		render(<UserBookings />, { wrapper });

		expect(screen.getAllByText(/My Bookings/i)[0]).toBeInTheDocument();

		expect(
			screen.getAllByText((content, element) => {
				return (
					element?.tagName.toLowerCase() === 'td' &&
					content.includes(
						dayjs(mockUserWithBookings.bookings[0].bookingTime).format(
							'DD MMM YYYY',
						),
					)
				);
			}).length,
		).toBeGreaterThan(0);

		expect(
			screen.getAllByText((content, element) => {
				return (
					element?.tagName.toLowerCase() === 'td' &&
					content.includes(
						dayjs(mockUserWithBookings.bookings[1].bookingTime).format(
							'DD MMM YYYY',
						),
					)
				);
			}).length,
		).toBeGreaterThan(0);

		expect(screen.getAllByText('confirmed').length).toBe(2);
	});

	it('should return null when no user or no bookings', () => {
		(useAuth as any).mockReturnValue({ user: { bookings: [] } });
		render(<UserBookings />, { wrapper });
		expect(screen.getByText('No bookings found')).toBeInTheDocument();
	});

	// Removed toggle row expansion test as component uses dialog

	it('should call deleteBooking and show snackbar on delete success', async () => {
		(deleteBooking as any).mockResolvedValue({});
		render(<UserBookings />, { wrapper });

		const deleteBtn = screen.getAllByLabelText(/cancel booking/i)[0];
		fireEvent.click(deleteBtn);

		expect(deleteBooking).toHaveBeenCalledWith(2);
		await waitFor(() => {
			expect(mockShowSnackbar).toHaveBeenCalledWith(
				'Booking cancelled successfully',
				'success',
			);
		});
	});

	it('should show error snackbar on delete failure', async () => {
		(deleteBooking as any).mockRejectedValue(new Error('Failed'));
		render(<UserBookings />, { wrapper });

		const deleteBtn = screen.getAllByLabelText(/cancel booking/i)[0];
		fireEvent.click(deleteBtn);

		await waitFor(() => {
			expect(mockShowSnackbar).toHaveBeenCalledWith(
				'Failed to cancel booking',
				'error',
			);
		});
	});
});
