import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminBookings from './AdminBookings';
import { ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminBookings } from './hooks/useAdminBookings';

const theme = createTheme();

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: any) => <div>{children}</div>,
	LoadingSpinner: () => <div>Loading...</div>,
	SectionHeader: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('@hooks', () => ({
	useAdminBookings: vi.fn(),
}));

vi.mock('@api', () => ({
	adminCheckExtendAvailability: vi.fn(() =>
		Promise.resolve({ canExtend1Hour: true, canExtend2Hours: false }),
	),
}));

const mockBookingsData = {
	bookings: [
		{
			id: '1',
			user: { name: 'John' },
			status: 'confirmed',
			slots: [{ startTime: '2024-01-20T10:00:00Z' }],
		},
	],
	totalBookings: 1,
	page: 0,
	setPage: vi.fn(),
	rowsPerPage: 10,
	setRowsPerPage: vi.fn(),
	search: '',
	setSearch: vi.fn(),
	isLoadingBookings: false,
	updateStatus: vi.fn(),
	deleteBooking: vi.fn(),
	extendBooking: vi.fn(),
	isExtending: false,
	extendError: null,
};

describe('AdminBookings', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient();
		vi.clearAllMocks();
		vi.mocked(useAdminBookings).mockReturnValue(mockBookingsData as any);
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

	it('should render bookings table', async () => {
		renderAdminBookings();
		expect(screen.getAllByText(/Bookings Management/i).length).toBeGreaterThan(
			0,
		);
		expect(screen.getByText('John')).toBeInTheDocument();
	});

	it('should open details dialog when row clicked', async () => {
		renderAdminBookings();
		fireEvent.click(screen.getByText('John'));
		expect(screen.getByText('Booking #1')).toBeInTheDocument();
	});
});
