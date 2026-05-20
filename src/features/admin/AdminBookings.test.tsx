import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AdminBookings from './AdminBookings';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminBookings } from './hooks/useAdminBookings';
import { adminCheckExtendAvailability } from '@api';

const theme = createTheme();

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: any) => <div>{children}</div>,
	LoadingSpinner: () => <div>Loading...</div>,
	SectionHeader: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('./hooks/useAdminBookings', () => ({
	useAdminBookings: vi.fn(),
}));

vi.mock('@api', () => ({
	adminCheckExtendAvailability: vi.fn(() =>
		Promise.resolve({ canExtend1Hour: true, canExtend2Hours: false }),
	),
}));

const activeSlotWindow = {
	id: 'slot-1',
	startTime: '2024-06-15T10:00:00.000Z',
	endTime: '2024-06-15T14:00:00.000Z',
	bay: { name: 'Bay A' },
};

const baseHookReturn = {
	totalBookings: 4,
	page: 0,
	setPage: vi.fn(),
	rowsPerPage: 10,
	setRowsPerPage: vi.fn(),
	search: '',
	setSearch: vi.fn(),
	isLoadingBookings: false,
	updateStatus: vi.fn(),
	deleteBooking: vi.fn((_id: string, opts?: { onSuccess?: () => void }) => {
		opts?.onSuccess?.();
	}),
	extendBooking: vi.fn(
		(
			_payload: { id: string; hours: number },
			opts?: { onSuccess?: (data: { message?: string }) => void },
		) => {
			opts?.onSuccess?.({ message: 'Extended' });
		},
	),
	isExtending: false,
	extendError: null,
};

const mockBookingsData = {
	...baseHookReturn,
	bookings: [
		{
			id: '1',
			user: { name: 'John', email: 'john@example.com' },
			status: 'confirmed',
			slots: [{ startTime: '2024-01-20T10:00:00Z' }],
		},
	],
};

describe('AdminBookings', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient();
		vi.clearAllMocks();
		vi.mocked(adminCheckExtendAvailability).mockResolvedValue({
			canExtend1Hour: true,
			canExtend2Hours: false,
		});
		vi.mocked(useAdminBookings).mockReturnValue(mockBookingsData as any);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const renderAdminBookings = () => {
		return render(
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<AdminBookings />
				</ThemeProvider>
			</QueryClientProvider>,
		);
	};

	it('shows loading spinner while bookings load', () => {
		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			isLoadingBookings: true,
		} as any);
		renderAdminBookings();
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should render bookings table', () => {
		renderAdminBookings();
		expect(screen.getAllByText(/Bookings Management/i).length).toBeGreaterThan(
			0,
		);
		expect(screen.getByText('John')).toBeInTheDocument();
	});

	it('should open details dialog when row clicked', () => {
		renderAdminBookings();
		fireEvent.click(screen.getByText('John'));
		expect(screen.getByText('Booking #1')).toBeInTheDocument();
	});

	it('maps status chips via getStatusColor for several statuses', () => {
		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			bookings: [
				{
					id: '1',
					user: { name: 'A' },
					status: 'confirmed',
					slots: [{ id: 's', startTime: '2024-01-01T10:00:00Z', endTime: '2024-01-01T11:00:00Z' }],
				},
				{
					id: '2',
					user: { name: 'B' },
					status: 'CONFIRMED - LOCAL',
					slots: [{ id: 's', startTime: '2024-01-01T10:00:00Z', endTime: '2024-01-01T11:00:00Z' }],
				},
				{
					id: '3',
					user: { name: 'C' },
					status: 'pending',
					slots: [{ id: 's', startTime: '2024-01-01T10:00:00Z', endTime: '2024-01-01T11:00:00Z' }],
				},
				{
					id: '4',
					user: { name: 'D' },
					status: 'cancelled',
					slots: [{ id: 's', startTime: '2024-01-01T10:00:00Z', endTime: '2024-01-01T11:00:00Z' }],
				},
				{
					id: '5',
					user: { name: 'E' },
					status: 'unknown-status',
					slots: [{ id: 's', startTime: '2024-01-01T10:00:00Z', endTime: '2024-01-01T11:00:00Z' }],
				},
			],
			totalBookings: 5,
		} as any);
		renderAdminBookings();
		expect(screen.getByText('confirmed')).toBeInTheDocument();
		expect(screen.getByText('CONFIRMED - LOCAL')).toBeInTheDocument();
		expect(screen.getByText('pending')).toBeInTheDocument();
		expect(screen.getByText('cancelled')).toBeInTheDocument();
		expect(screen.getByText('unknown-status')).toBeInTheDocument();
	});

	it('shows extend error in admin dialog when extendError is set', async () => {
		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			extendError: { response: { data: { message: 'No availability' } } },
		} as any);
		renderAdminBookings();
		await waitFor(() => {
			expect(screen.getByText('Unable to Extend Booking')).toBeInTheDocument();
			expect(screen.getByText('No availability')).toBeInTheDocument();
		});
	});

	it('uses default extend error message when API message missing', async () => {
		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			extendError: {},
		} as any);
		renderAdminBookings();
		await waitFor(() => {
			expect(screen.getByText('Failed to extend booking')).toBeInTheDocument();
		});
	});

	it('calls updateStatus when Confirm is clicked on pending booking', () => {
		const updateStatus = vi.fn();
		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			bookings: [
				{
					id: '9',
					user: { name: 'Pat' },
					status: 'pending',
					slots: [
						{
							id: 's',
							startTime: '2024-01-01T10:00:00Z',
							endTime: '2024-01-01T11:00:00Z',
							bay: { name: 'Bay 1' },
						},
					],
				},
			],
			updateStatus,
		} as any);
		renderAdminBookings();
		fireEvent.click(screen.getByText('Pat'));
		fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
		expect(updateStatus).toHaveBeenCalledWith({
			id: '9',
			status: 'confirmed',
		});
	});

	it('opens confirm dialog and deletes booking when cancel is confirmed', async () => {
		const deleteBooking = vi.fn(
			(_id: string, opts?: { onSuccess?: () => void }) => {
				opts?.onSuccess?.();
			},
		);
		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			bookings: [
				{
					id: '7',
					user: { name: 'Sam' },
					status: 'pending',
					slots: [
						{
							id: 's',
							startTime: '2030-01-01T10:00:00Z',
							endTime: '2030-01-01T11:00:00Z',
							bay: { name: 'Bay 1' },
						},
					],
				},
			],
			deleteBooking,
		} as any);
		renderAdminBookings();
		fireEvent.click(screen.getByText('Sam'));
		fireEvent.click(screen.getByRole('button', { name: 'Cancel Booking' }));

		const confirmDialog = screen.getByRole('dialog', { name: 'Cancel Booking?' });
		fireEvent.click(
			within(confirmDialog).getByRole('button', { name: 'OK' }),
		);

		expect(deleteBooking).toHaveBeenCalledWith('7', expect.any(Object));
		await waitFor(() => {
			expect(
				screen.queryByText(
					/Are you sure you want to cancel this booking and free up the slots/i,
				),
			).not.toBeInTheDocument();
		});
	});

	it('handles extend 1 hour success and shows success dialog', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.setSystemTime(new Date('2024-06-15T11:00:00.000Z'));

		const extendBooking = vi.fn(
			(
				payload: { id: string; hours: number },
				opts?: { onSuccess?: (data: { message?: string }) => void },
			) => {
				expect(payload).toEqual({ id: '55', hours: 1 });
				opts?.onSuccess?.({});
			},
		);

		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			bookings: [
				{
					id: '55',
					user: { name: 'Alex' },
					status: 'confirmed',
					slots: [activeSlotWindow],
				},
			],
			extendBooking,
		} as any);

		vi.mocked(adminCheckExtendAvailability).mockResolvedValue({
			canExtend1Hour: true,
			canExtend2Hours: true,
		});

		renderAdminBookings();
		fireEvent.click(screen.getByText('Alex'));

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Add 1 Hour' })).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'Add 1 Hour' }));

		await waitFor(() => {
			expect(screen.getByText('Booking Extended Successfully')).toBeInTheDocument();
			expect(
				screen.getByText('Booking extended by 1 hour successfully'),
			).toBeInTheDocument();
		});

		const okButtons = screen.getAllByRole('button', { name: 'OK' });
		fireEvent.click(okButtons[okButtons.length - 1]);
	});

	it('handles extend 2 hours success with custom message', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.setSystemTime(new Date('2024-06-15T11:00:00.000Z'));

		const extendBooking = vi.fn(
			(
				payload: { id: string; hours: number },
				opts?: { onSuccess?: (data: { message?: string }) => void },
			) => {
				expect(payload).toEqual({ id: '56', hours: 2 });
				opts?.onSuccess?.({ message: 'Two more hours added' });
			},
		);

		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			bookings: [
				{
					id: '56',
					user: { name: 'Blake' },
					status: 'confirmed',
					slots: [activeSlotWindow],
				},
			],
			extendBooking,
		} as any);

		vi.mocked(adminCheckExtendAvailability).mockResolvedValue({
			canExtend1Hour: false,
			canExtend2Hours: true,
		});

		renderAdminBookings();
		fireEvent.click(screen.getByText('Blake'));

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Add 2 Hours' })).toBeInTheDocument();
		});

		fireEvent.click(screen.getByRole('button', { name: 'Add 2 Hours' }));

		await waitFor(() => {
			expect(screen.getByText('Two more hours added')).toBeInTheDocument();
		});
	});

	it('uses default success copy for extend 2 hours when API omits message', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.setSystemTime(new Date('2024-06-15T11:00:00.000Z'));

		const extendBooking = vi.fn(
			(
				payload: { id: string; hours: number },
				opts?: { onSuccess?: (data: { message?: string }) => void },
			) => {
				expect(payload).toEqual({ id: '57', hours: 2 });
				opts?.onSuccess?.({});
			},
		);

		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			bookings: [
				{
					id: '57',
					user: { name: 'Chris' },
					status: 'confirmed',
					slots: [activeSlotWindow],
				},
			],
			extendBooking,
		} as any);

		vi.mocked(adminCheckExtendAvailability).mockResolvedValue({
			canExtend1Hour: false,
			canExtend2Hours: true,
		});

		renderAdminBookings();
		fireEvent.click(screen.getByText('Chris'));
		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Add 2 Hours' })).toBeInTheDocument();
		});
		fireEvent.click(screen.getByRole('button', { name: 'Add 2 Hours' }));

		await waitFor(() => {
			expect(
				screen.getByText('Booking extended by 2 hours successfully'),
			).toBeInTheDocument();
		});
	});

	it('swallows adminCheckExtendAvailability rejection and clears extend flags', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		vi.setSystemTime(new Date('2024-06-15T11:00:00.000Z'));
		vi.mocked(adminCheckExtendAvailability).mockRejectedValueOnce(new Error('network'));

		vi.mocked(useAdminBookings).mockReturnValue({
			...mockBookingsData,
			bookings: [
				{
					id: '77',
					user: { name: 'Casey' },
					status: 'confirmed',
					slots: [activeSlotWindow],
				},
			],
		} as any);

		renderAdminBookings();
		fireEvent.click(screen.getByText('Casey'));

		await waitFor(() => {
			expect(adminCheckExtendAvailability).toHaveBeenCalledWith('77');
		});

		await waitFor(() => {
			expect(screen.queryByRole('button', { name: 'Add 1 Hour' })).not.toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Add 2 Hours' })).not.toBeInTheDocument();
		});
	});
});
