import type { ReactNode } from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarContext } from '../../../context/SnackbarContext';
import {
	getAllBookings,
	adminUpdateBookingStatus,
	adminDeleteBooking,
	adminExtendBooking,
} from '@api';
import { useAdminBookings } from './useAdminBookings';

vi.mock('@api', () => ({
	getAllBookings: vi.fn(),
	adminUpdateBookingStatus: vi.fn(),
	adminDeleteBooking: vi.fn(),
	adminExtendBooking: vi.fn(),
}));

const showSnackbar = vi.fn();

function createHookWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	const theme = createTheme({
		palette: {
			accent: { main: '#0a9396', dark: '#005f73', light: '#94d2bd' },
			link: { main: '#005f73', dark: '#003d4a', light: '#0a9396' },
		},
	});
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<SnackbarContext.Provider
					value={{
						showSnackbar,
						hideSnackbar: vi.fn(),
						setBottomOffset: vi.fn(),
					}}
				>
					{children}
				</SnackbarContext.Provider>
			</ThemeProvider>
		</QueryClientProvider>
	);
	return { queryClient, wrapper };
}

describe('useAdminBookings', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getAllBookings).mockResolvedValue({
			data: [{ id: 1, status: 'pending' }],
			pagination: { total: 1 },
		} as never);
		vi.mocked(adminUpdateBookingStatus).mockResolvedValue(undefined as never);
		vi.mocked(adminDeleteBooking).mockResolvedValue(undefined as never);
		vi.mocked(adminExtendBooking).mockResolvedValue({} as never);
	});

	it('loads bookings and exposes pagination fields', async () => {
		const { wrapper } = createHookWrapper();
		const { result } = renderHook(() => useAdminBookings(), { wrapper });

		await waitFor(() => expect(result.current.bookings).toHaveLength(1));
		expect(result.current.totalBookings).toBe(1);
		expect(getAllBookings).toHaveBeenCalledWith({
			page: 1,
			limit: 10,
			search: '',
		});
	});

	it('debounces search before refetching', async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		try {
			const { wrapper } = createHookWrapper();
			const { result } = renderHook(() => useAdminBookings(), { wrapper });

			await waitFor(() => expect(result.current.bookings).toHaveLength(1));
			const callsAfterLoad = vi.mocked(getAllBookings).mock.calls.length;

			act(() => {
				result.current.setSearch('alice');
			});
			await act(async () => {
				vi.advanceTimersByTime(499);
			});
			expect(vi.mocked(getAllBookings).mock.calls.length).toBe(callsAfterLoad);

			await act(async () => {
				vi.advanceTimersByTime(1);
			});

			await waitFor(() =>
				expect(vi.mocked(getAllBookings)).toHaveBeenCalledWith({
					page: 1,
					limit: 10,
					search: 'alice',
				}),
			);
		} finally {
			vi.useRealTimers();
		}
	});

	it('updateStatus shows success snackbar on success', async () => {
		const { wrapper, queryClient } = createHookWrapper();
		const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useAdminBookings(), { wrapper });

		await waitFor(() => expect(result.current.bookings).toHaveLength(1));

		act(() => {
			result.current.updateStatus({ id: 9, status: 'confirmed' });
		});

		await waitFor(() =>
			expect(adminUpdateBookingStatus).toHaveBeenCalledWith(9, 'confirmed'),
		);
		await waitFor(() =>
			expect(showSnackbar).toHaveBeenCalledWith(
				'Booking status updated',
				'success',
			),
		);
		expect(invalidateSpy).toHaveBeenCalled();
	});

	it('deleteBooking shows success snackbar on success', async () => {
		const { wrapper, queryClient } = createHookWrapper();
		const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useAdminBookings(), { wrapper });

		await waitFor(() => expect(result.current.bookings).toHaveLength(1));

		act(() => {
			result.current.deleteBooking(42);
		});

		await waitFor(() => expect(adminDeleteBooking).toHaveBeenCalledWith(42));
		await waitFor(() =>
			expect(showSnackbar).toHaveBeenCalledWith(
				'Booking cancelled and slots freed',
				'success',
			),
		);
		expect(invalidateSpy).toHaveBeenCalled();
	});

	it('extendBooking invalidates queries on success', async () => {
		const { wrapper, queryClient } = createHookWrapper();
		const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
		const { result } = renderHook(() => useAdminBookings(), { wrapper });

		await waitFor(() => expect(result.current.bookings).toHaveLength(1));

		act(() => {
			result.current.extendBooking({ id: 3, hours: 1 });
		});

		await waitFor(() => expect(adminExtendBooking).toHaveBeenCalledWith(3, 1));
		await waitFor(() => expect(invalidateSpy).toHaveBeenCalled());
	});
});
